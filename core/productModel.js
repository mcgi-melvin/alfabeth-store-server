const Model = require("./model"),
    {query} = require("./db"),
    ProductOption = require("../model/ProductOption"),
    ProductCategory = require("../model/ProductCategory"),
    ProductBrand = require("../model/ProductBrand"),
    ProductPrice = require("../model/ProductPrice")

class ProductModel extends Model {
    _table= "products"
    __productOptions = new ProductOption()
    __productCategories = new ProductCategory()
    __productBrands = new ProductBrand()
    __productPrices = new ProductPrice()

    async save () {
        await query(`INSERT INTO ${this._table} (barcode, name, user_id) VALUES (?, ?, ?)`, [this.barcode, this.name, global.user.ID])
        return await query(`SELECT * FROM ${this._table} WHERE barcode=? AND user_id=?`, [this.barcode, global.user.ID])
    }

    async getAll() {
        const
            products = await query(`SELECT * FROM ${this._table} ORDER BY name ASC`),
            prices = await this.__productPrices.getAll()

        /**
         * TODO: Iterate products and include price, brand, categories and options in each of the product object
         */

        products.forEach(product => {
            product.price = prices.find(item => item.product_id === product.ID && item.type === "price")
            product.price_per_pack = prices.find(item => item.product_id === product.ID && item.type === "price_per_pack")
        })

        return products
    }
}

module.exports = ProductModel