const testFolder = './api';
const fs = require('fs');
let routes = []
fs.readdirSync(testFolder).forEach(file => {
    if( file === 'index.js') return false
    routes = routes.concat( require(`../api/${file}`) )
});

module.exports = routes
