const
    {verifyAuth} = require("../middleware/user"),
    xlsx = require('node-xlsx').default,
    ProductCategory = require("../model/ProductCategory"),
    ProductBrand = require("../model/ProductBrand"),
    {query} = require("../core/db"),
    {readFileSync} = require("fs"),
    Product = require("../model/Product"),
    ProductPrice = require("../model/ProductPrice"),
    ProductOption = require("../model/ProductOption").toString(),
    { resolveFileArray } = require("../core/helper")

const resolveProductArray = ( products ) => {
    const
        newProducts = resolveFileArray( products ),
        out = []

    for (let i = 0; i < newProducts.length; i++) {
        const
            product = newProducts[i],
            a = {basic: {}, amount: {}, options: {}}

        for ( let attr of Object.entries(product) ) {
            if( ['name', 'barcode'].includes(attr[0]) ) {
                a.basic[attr[0]] = attr[1]
            } else if( ['categories', 'brand'].includes(attr[0]) ) {
                a[attr[0]] = {}
                a[attr[0]]['name'] = attr[1]
            } else if( ['price', 'price_per_pack'].includes(attr[0]) ) {
                a.amount[attr[0]] = attr[1]
            }
            else {
                a.options[attr[0]] = attr[1]
            }
        }
        out.push(a)

    }

    return newProducts
}

module.exports = [
    {
        method: "post",
        path: "/install/db",
        callback: async (req, res, next) => {
            const sql = readFileSync(`${process.cwd()}/install/tables.sql`).toString()
                .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
                .replace(/\s+/g, ' ') // excess white space

            /**
             * TODO: make query working. Install all tables in the DB
             */
            // const result = await query(sql)

            res.send( sql )
        },
        middlewares: []
    },
    {
        method: "post",
        path: "/install/products",
        callback: async (req, res, next) => {
            const
                productsFromFile = xlsx.parse(`${process.cwd()}/install/products.xlsx`),
                products = resolveProductArray( productsFromFile )

            for (let i = 0; i < products.length; i++) {
                const
                    product = products[i],
                    model = new Product()

                model.loadModel( product )
                let prod = await model.save()

                if( !prod ) continue
                prod = prod[0]

                for ( let price_type of ['price', 'price_per_pack'] ) {
                    let args = { product_id: prod.ID }
                    if( product[price_type] ) {
                        args.type = price_type
                        args.value = product[price_type]
                        model.__productPrices.loadModel( args )
                        await model.__productPrices.save()
                    }
                }
            }

            res.json( products )
        },
        middlewares: [verifyAuth]
    },
    {
        method: "post",
        path: "/install/product_categories",
        callback: async (req, res, next) => {
            const
                categoriesFromFile = xlsx.parse(`${process.cwd()}/install/categories.xlsx`),
                categories = resolveFileArray( categoriesFromFile )

            for (let i = 0; i < categories.length; i++) {
                const
                    model = new ProductCategory(),
                    category = categories[i]

                model.loadModel( category )
                await model.save()
            }

            res.json(categories)
        },
        middlewares: [verifyAuth]
    }
]