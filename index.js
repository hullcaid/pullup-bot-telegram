require('dotenv').config()
const Telegraf = require('telegraf') // import telegram lib
const mongoose = require('mongoose')
const User = require('./models/user')

const bot = new Telegraf(process.env.BOT_TOKEN) // get the token from envirenment variable

const mongoUrl = process.env.MONGO_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

bot.start( async (ctx) => {
	
	const user = await User.find({ username: ctx.from.username })
	console.log(user)
	if(user.length != 0) {
		return ctx.reply(`${user[0].username}, olet jo rekisteröitynyt`)
	}
	else {
		const newUser = new User({
			'username': ctx.from.username,
			'pullups': 0
		})
 
		await newUser.save()
		return ctx.reply(`Welcome, ${ctx.from.username}`)
	}
}) 

bot.command('pull', async (ctx) => {
	const user = await User.find({ username: ctx.from.username })
	if(user.length != 0) {
		const amount = Number(ctx.message.text.slice(6))
		const body = {
			username: user[0].username,
			pullups: user[0].pullups + (amount !== 0 ? amount : 1)
		}
		await User.findByIdAndUpdate(user[0]._id, body)
		return ctx.reply(`${ctx.from.username} veti ${amount !== 0 ? amount : 1} leukaa`)
	} else {
		return ctx.reply('Rekisteröidy ensin')
	}
}) 

bot.command('stats', async (ctx) => {
	
	const user = await User.find({ username: ctx.from.username })

	if(user.length != 0) {
		return ctx.reply(`${user[0].username} on vetänyt ${user[0].pullups} leukaa`)
	} else {
		return ctx.reply('Rekisteröidy ensins')
	}
})

bot.launch() // start