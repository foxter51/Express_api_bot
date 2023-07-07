const mongoose = require('mongoose').default

mongoose.connect('mongodb://0.0.0.0:27017/test-db')
    .then(() => {
        console.log('DB connected!')
    })
    .catch((error) => {
        console.error('DB connection error:', error)
    })

module.exports = mongoose