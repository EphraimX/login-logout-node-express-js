const express = require('express')
const path = require('path')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
require('dotenv').config() 


const app = express()
const conn_uri = process.env.MONGO_URI

try{
    // MongoDB Connection
    const conn = mongoose.connect(conn_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    if (conn) console.log('Connection Successful')

} catch(err){
    console.log(err)
}


if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())


app.post('/api/register', async (req, res) => {
    
    var { username, password } = req.body
    password = await bcrypt.hash(password, 10)
    
    try {
        const response = await User.create({
            username,
            password
        })
        console.log(`User created successfully. Details: ${response}`)
    } catch (error) {
        console.log(error)
        return res.json({'status': 'error'})
    }
    res.json({'status': 'ok'})
})

app.listen(3000, () => {
    console.log('Server up at 3000')
})