let bcrypt = require('bcrypt');

module.exports.cryptPassword = (password) => bcrypt.genSalt(10).then((salt => bcrypt.hash(password, salt))).then(hash => hash)

module.exports.comparePassword = (password, hashPassword) => bcrypt.compare(password, hashPassword).then(resp => resp)

/**
 * Replace xlsx array to array with column name as key for each item in xlsx
 * [] to [{}]
 *
 * @param arr
 * @param skipFirstData
 * @returns {*[]}
 */
module.exports.resolveFileArray = ( arr, skipFirstData = true ) => {
    const output = [],
        header = arr[0].data[0]

    for (let i = 0; i < arr[0].data.length; i++) {
        const
            items = arr[0].data[i],
            a = {}

        if( !items.length ) continue
        if( skipFirstData && i === 0 ) continue

        items.forEach((item, index) => {
            a[header[index]] = item
        })

        output.push(a)
    }

    return output
}