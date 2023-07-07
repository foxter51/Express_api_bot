const db = require(__dirname + '/db')

const { Schema } = db

const userSchema = new Schema({
    name: String,
    age: Number,
    email: String
})

const User = db.model('User', userSchema)

module.exports = User