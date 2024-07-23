const Model = require("../core/model");

class ProductOption extends Model {
    _table = "product_options"

    attr = ['ID', 'barcode', 'name', 'user_id']

    loadModel( data = {} ) {
        for ( let item of Object.entries(data) ) {
            if( this.attr.includes(item[0]) )
                this[item[0]] = item[1]
        }
    }
}

module.exports = ProductOption