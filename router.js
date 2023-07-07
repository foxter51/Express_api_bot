const express = require('express')
const router = express.Router()
const User = require(__dirname + '/model')
const axios = require('axios')

router.get('/users', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/users')
        const users = response.data

        await User.insertMany(users)

        res.json(users)
    } catch (error) {
        console.error('Error users get request:', error)
    }
})

router.post('/addUser', async (req, res) => {
    try {
        const { name, age, email } = req.body

        const user = new User({ name, age, email })

        await user.save()

        res.json(user)
    } catch (error) {
        console.error('Error add user post request:', error)
    }
})

module.exports = router