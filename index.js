const express = require('express')
const db = require('./data/connect')
const cors = require('cors');
const userRouter = require('./router/user')
const productRouter = require('./router/product')
const orderRouter = require('./router/order')
const cartRouter = require('./router/cart')
const jwt = require('jsonwebtoken');

db.connect()
const app = express()

console.log(jwt.sign({ foo: 'bar' }, 'maSuperCle'))

app.use(cors());
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/cart', cartRouter)


app.listen(3000)