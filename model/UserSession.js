const Model = require("../core/model")
const {query} = require("../core/db");

class UserSession extends Model {
    _table = "user_sessions"

    async getUser( token ) {
        return await query(`SELECT * FROM ${this._table} LEFT JOIN users ON ${this._table}.user_id = users.ID WHERE token=? AND expires < ${Date.now()} LIMIT 1`, [token])
    }
}

module.exports = UserSession