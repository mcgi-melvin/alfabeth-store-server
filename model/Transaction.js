const Model = require("../core/model"),
    {query} = require("../core/db"),
    TransactionItem = require("./TransactionItem")

class Transaction extends Model {
    _table = "transactions"
    __transactionItems = new TransactionItem()

    async save() {
        await query(`INSERT INTO ${this._table} (${Object.keys(this.getData()).toString()}) VALUES (${Object.keys(this.getData()).map(item => `:${item}`).toString()})`, this.getData())
        const res = await query(`SELECT * FROM ${this._table} WHERE ${Object.keys(this.getData()).map(item => `${item}=:${item}`).join(" AND ")} ORDER BY date_created DESC LIMIT 1`, this.getData())
        if( res ) return res[0]
        return false
    }

    /**
     * Get Transaction including its Items
     * @returns {Promise<void>}
     */
    async get( where = {} ) {
        const result = await query(`SELECT * FROM ${this._table} WHERE ${Object.keys(where).map(key => `${key}=?`).join(" AND ")} ORDER BY date_created DESC LIMIT 1 `, Object.values(where))
        if( !Object.keys(result).length ) return false
        const transaction = result[0]
        transaction.items = await query(`SELECT * FROM ${this.__transactionItems._table} WHERE transaction_id=?`, [transaction.ID])
        return transaction
    }
}

module.exports = Transaction