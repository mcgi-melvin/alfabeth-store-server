const {query} = require("./db");

class Model {
    _table = ""
    _primary_key = ""

    loadModel = ( data = {} ) => {
        for ( let item of Object.entries(data) ) {
            this[item[0]] = item[1]
        }
    }

    getData() {
        const
            newAttributes = {},
            properties = Object.entries(Object.getOwnPropertyDescriptors(this))
            .filter(([, desc]) => desc.hasOwnProperty('value') && typeof desc.value !== 'function')

        for ( let property of properties ) {
            if( property[0].charAt(0) === "_" ) continue
            if( !property[1].value ) continue
            newAttributes[property[0]] = property[1].value
        }

        return newAttributes
    }

    async get( where = {} ) {
        const result = await query(`SELECT * FROM ${this._table} WHERE ${Object.keys(where).map(key => `${key}=?`).join(" AND ")} ORDER BY date_created DESC LIMIT 1 `, Object.values(where))
        if( result ) return result[0]
        return false
    }

    async getAll() {
        return await query(`SELECT * FROM ${this._table}`)
    }

    async save() {
        return await query(`INSERT INTO ${this._table} (${Object.keys(this.getData()).join(", ")}) VALUES (${Object.keys(this.getData()).map(item => `:${item}`).toString()})`, this.getData())
    }

    async update() {
        return await query(`UPDATE ${this._table} SET ${Object.keys(this.getData()).filter(item => item !== this._primary_key).map(item => `${item}=:${item}`).toString()} WHERE ${this._primary_key}=:${this._primary_key}`, this.getData())
    }
}

module.exports = Model