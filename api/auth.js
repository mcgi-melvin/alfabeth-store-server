const User = require("../model/User");
const {cryptPassword, comparePassword} = require("../core/helper");
const UserSession = require("../model/UserSession");

module.exports = [
    {
        method: "get",
        path: "/auth/login",
        callback: async (req, res) => {
            const model =  new User()
            const data = await model.get({ username: req.query.username })
            if( !data )
                return res.status(400).json({severity: 'error', message: "Invalid login credentials"})

            const passAccepted = await comparePassword(req.query.password, data.password)

            if( !passAccepted )
                return res.status(401).json({severity: 'error', message: "Invalid password"})

            const user = new User()
            user.loadModel(data)
            await user.generateToken()
            return res.json({ severity: 'success', message: "Login successful", user: user.getData() })
        },
        middlewares: []
    },
    {
        method: "post",
        path: "/auth/register",
        callback: async (req, res) => {
            const user =  new User()

            if( req.body.password !== req.body.password )
                return res.status(400).json({severity: 'error', message: "Password doesn't match"})

            delete req.body.password_confirm

            req.body.password = await cryptPassword( req.body.password )
            user.loadModel(req.body)

            try {
                const result = await user.save()
                return res.status(200).json({ result: result, severity: 'success', message: "Account successfully created" })
            } catch (e) {
                return res.status(400).json(e)
            }
        },
        middlewares: []
    },
    {
        method: "get",
        path: "/auth/verify",
        callback: async (req, res, next) => {
            const
                token = req.header("Authorization").substring("Bearer ".length),
                model = new UserSession()

            const response = await model.getUser( token )

            if( !response ) res.status(401).json({ severity: 'error', message: "You are not authorized for this action" })

            res.json(response)
        },
        middlewares: []
    }
]