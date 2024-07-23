require('dotenv').config()

const
    express = require('express'),
    app = express(),
    cors = require('cors'),
    body_parser = require('body-parser'),
    routes= require('./api')

global.user = {}

app.use( body_parser.urlencoded({ extended: true }) )
app.use( body_parser.json() )
app.use( cors() )

routes.forEach(route => {
    if( !route ) return false
    app[route.method](route.path, ...route.middlewares, route.callback)
})

app.listen( process.env.APP_PORT, () => {
    console.log( `Alfabeth server is running on port ${process.env.APP_PORT}` )
} )