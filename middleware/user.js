const UserSession = require("../model/UserSession");
const verifyAuth = async (req, res, next) => {
    if( !req.header("Authorization") ) return res.status(401).send("Not authorized")

    const token = req.header("Authorization").substring("Bearer ".length)

    if( !token ) return res.status(403).json({message: "No token provided"})

    const userSession = new UserSession()

    const result = await userSession.getUser( token )

    if( !result.length ) return res.status(403).json({message: "Session Expired"})

    /**
     * Set Global User
     * It can be use in other file
     */
    if( result )
        global.user = result[0]

    next()
}

module.exports = { verifyAuth }