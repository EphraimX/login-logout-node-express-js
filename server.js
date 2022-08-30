const express = require('express')
const path = require('path')
const morgan = require('morgan')
const router = express.Router()

app = express()

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/', express.static(path.join(__dirname, 'static')))

app.listen(3000, () => {
    console.log('Server up at 3000')
})