const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
 

const app = express()

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())


app.post('/api/register', async (req, res) => {
    console.log(req.body)
    res.json({'status': 'ok'})
})

app.listen(3000, () => {
    console.log('Server up at 3000')
})