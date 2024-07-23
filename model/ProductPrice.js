const Model = require("../core/model");
const {query} = require("../core/db");

class ProductPrice extends Model {
    _table = "product_prices"
    _primary_key = "ID"

    async getAll() {
        return await query(`SELECT * FROM ${this._table} ORDER BY date_created DESC`)
    }
}

module.exports = ProductPrice