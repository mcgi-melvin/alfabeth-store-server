const db = require('../core/db')
const {query} = require("../core/db");
const {verifyAuth} = require("../middleware/user");
const Product = require("../model/Product");
const ProductPrice = require("../model/ProductPrice");
const {last_names} = require("../install/seed/seedHelpers");

let response = {
    status: "error",
    message: "Something went wrong!"
}

module.exports = [
    {
        method: 'get',
        path: '/products',
        callback: async (req, res) => {
            const model = new Product()

            res.json( await model.getAll() )
        },
        middlewares: [verifyAuth]
    },
    {
        method: "post",
        path: "/product",
        callback: (req, res) => {

        },
        middlewares: []
    },
    {
        method: "put",
        path: "/product/:id/details",
        callback: async (req, res) => {
            const model = new Product()
            model.loadModel({...req.body, ...{ID: req.params.id}} )
            const result = await model.update()
            if( result && !result.affectedRows ) return res.status(400).json({ message: "Product details not change" })
            return res.json({ message: "Product details saved", products: await model.getAll() })
        },
        middlewares: []
    },
    {
        method: "post",
        path: "/product/:id/price",
        callback: async (req, res) => {
            const
                product_id = req.params.id,
                modelProduct = new Product()
            for( let key of Object.keys(req.body) ) {
                if( !req.body[key] ) continue
                const model = new ProductPrice()
                const latestPrice = await model.get({ product_id: product_id, type: key })
                if( latestPrice && latestPrice.value.toString() === req.body[key].toString() ) continue
                model.loadModel({ product_id: product_id, type: key, value: req.body[key] })
                await model.save()
            }
            res.json({ message: "Price Updated", products: await modelProduct.getAll() })
        },
        middlewares: [verifyAuth]
    },
    {
        method: "get",
        path: "/product/:id",
        callback: (req, res) => {

        },
        middlewares: []
    },
]