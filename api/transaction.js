const Transaction = require("../model/Transaction")
const TransactionItem = require("../model/TransactionItem")
const {verifyAuth} = require("../middleware/user")
const Product = require("../model/Product")

module.exports = [
    {
        method: "post",
        path: "/transaction",
        callback: async (req, res, next) => {
            const model = new Transaction()

            if( !Object.keys(global.user).length ) return res.status(401).json({ message: "You are not authorized for this action." })

            model.loadModel({ amount_paid: req.body.amount_paid, user_id: global.user.ID })

            const resultTransaction = await model.save()

            if( !resultTransaction ) return res.status(400).json({ message: "Transaction Failed!" })

            resultTransaction.items = []

            for( let item of req.body.products ) {
                const modelItem = new TransactionItem()
                let args = { ...item, ...{ transaction_id: resultTransaction.ID } }
                resultTransaction.items.push(item)
                modelItem.loadModel(args)
                await modelItem.save()
            }

            res.json({ message: "Transaction successful", transaction: resultTransaction })
        },
        middlewares: [verifyAuth]
    },
    {
        method: "get",
        path: "/transactions",
        callback: async (req, res) => {
            const model = new Transaction()

            const transactions = await model.getAll()

            for ( let transaction of transactions ) {
                transaction.items = await model.__transactionItems.get({transaction_id: transaction.ID}, false)
            }


            res.json( transactions )
        },
        middlewares: [verifyAuth]
    },
    {
        method: "get",
        path: "/transaction/:id",
        callback: async (req, res, next) => {
            const model = new Transaction()

            if( !req.params.hasOwnProperty('id') ) return res.status(400).json({ message: "Something went wrong" })

            const transaction = await model.get({ ID: req.params.id })

            if( !transaction ) return res.status(400).json({ message: "Transaction cannot be found" })

            res.json(transaction)
        },
        middlewares: []
    }
]