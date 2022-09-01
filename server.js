const express = require('express')
const path = require('path')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config() 

const JWT_SECRET = process.env.JWT_SECRET

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


app.post('/api/forgot-password', async (req, res)=> {
    const { token } = req.body
})


app.post('/api/login', async (req, res) => {
    var { username, password } = req.body
    const user = await User.find({ username }).lean()


    if (!user || user === []){
        res.json({ status: 'error', error: 'Invalid username/password' });
    }

    console.log(password, user[0].password)

    try{

        if (await bcrypt.compare(password, user[0].password)){
            // the username, password combination is successful
            
            
            const token = jwt.sign({
                id: user._id,
                username: user[0].username
            }, JWT_SECRET)
    
            return res.json({ status: 'ok', data: token})
        }
        else {
            return res.json({ status : 'error', error : 'Invalid username/password'})
        }
        

    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: error });
    }

})


app.post('/api/register', async (req, res) => {
    
    var { username, password } = req.body


    // Validating data
    if (!username || typeof username !== 'string'){
        return res.json({'status': 'error', error: 'Invalid Username'})
    }

    if (!password || typeof password !== 'string'){
        return res.json({'status': 'error', error: 'Invalid Password'})
    }

    if (password.length < 8){
        return res.json({
            'status': 'error', 
            error: 'Password less than 8 characters'
        })
    }

    // Encrypting passwords
    password = await bcrypt.hash(password, 10)
    

    // Creating Users
    try {
        const response = await User.create({
            username,
            password
        })
        console.log(`User created successfully. Details: ${response}`)
    } catch (error) {
        if(error.code === 11000){
            // duplicate key error
            return res.json({'status': error, error: 'The username already exists'})
        } 
        throw error
    }

    // Sending response back to client
    res.json({'status': 'ok'})
})

app.listen(3000, () => {
    console.log('Server up at 3000')
})