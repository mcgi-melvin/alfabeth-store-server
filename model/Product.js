const ProductModel = require("../core/productModel")
const ProductPrice = require("./ProductPrice");

class Product extends ProductModel {
    _table = "products"
    _primary_key = "ID"

    loadModel( data = {} ) {
        for ( let item of Object.entries(data) ) {
            if( this.attr.includes(item[0]) )
                this[item[0]] = item[1]
        }
    }

    async save() {
        return await super.save()
    }
}

module.exports = Product