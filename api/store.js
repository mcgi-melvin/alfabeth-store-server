const {verifyAuth} = require("../middleware/user")
const ProductCategory = require("../model/ProductCategory")
const Product = require("../model/Product")

module.exports = [
    {
        method: "get",
        path: "/store/get/data",
        callback: async ( req, res ) => {
            const modelProducts = new Product()

            const
                products = await modelProducts.getAll(),
                categories = await modelProducts.__productCategories.getAll()

            res.json({
                categories: categories,
                products: products
            })
        },
        middlewares: [verifyAuth]
    }
]