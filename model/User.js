const Model = require("../core/model");
const {query} = require("../core/db");
const UserSession = require("./UserSession");

class User extends Model {
    _table = "users"
    _sessionClass = new UserSession()

    ID = ""
    email = ""
    username = ""
    password = ""
    first_name = ""
    last_name = ""
    role = ""

    async generateToken() {
        this._sessionClass.loadModel({ user_id: this.ID })
        await this._sessionClass.save()
        this['session'] = await this._sessionClass.get({user_id: this.ID})
    }
}

module.exports = User