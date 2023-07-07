const express = require('express')
const router = require(__dirname + '/router')
const app = express()
const { Telegraf, Scenes, session} = require('telegraf')
const User = require(__dirname + '/model')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Scenes.Stage()

const addUserScene = new Scenes.BaseScene('addUserScene')
const enterAgeScene = new Scenes.BaseScene('enterAgeScene')
const enterEmailScene = new Scenes.BaseScene('enterEmailScene')

bot.start((ctx) => ctx.reply('Welcome'))

addUserScene.enter((ctx) => {
    ctx.reply('Please enter your name:')
})

addUserScene.on('text', async (ctx) => {
    ctx.session.user = {}
    ctx.session.user.name = ctx.message.text
    await ctx.scene.enter('enterAgeScene')
})

enterAgeScene.enter((ctx) => {
    ctx.reply('Please enter your age:')
})

enterAgeScene.on('text', async (ctx) => {
    ctx.session.user.age = parseInt(ctx.message.text)
    await ctx.scene.enter('enterEmailScene')
})

enterEmailScene.enter((ctx) => {
    ctx.reply('Please enter your email:')
})

enterEmailScene.on('text', async (ctx) => {
    ctx.session.user.email = ctx.message.text
    const { name, age, email } = ctx.session.user

    const user = new User({ name, age, email })
    await user.save()

    ctx.reply('New user was added')

    await ctx.scene.leave()
})

stage.register(addUserScene, enterAgeScene, enterEmailScene)
bot.use(session())
bot.use(stage.middleware())

bot.command('add', (ctx) => {
    ctx.scene.enter('addUserScene')
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

app.use(router)
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

module.exports = app
