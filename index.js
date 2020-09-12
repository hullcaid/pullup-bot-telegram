require('dotenv').config()
const Telegraf = require('telegraf') // import telegram lib

const bot = new Telegraf(process.env.BOT_TOKEN) // get the token from envirenment variable
const users = []

const findUserIndex = (username) => {
	return users.findIndex(i => i.username === username)
}

bot.start((ctx) => {
	user = users.find(e => e.username === ctx.from.username)
	if(user) {
		return ctx.reply(`${user.username}, you have already registered`)
	}
	else {
		const newUser = {
			'username': ctx.from.username,
			'pullups': 0
		}
		users.push(newUser)
		return ctx.reply(`Welcome, ${ctx.from.username}`)
	}
}) 

bot.command('pull', (ctx) => {
	const userIndex = findUserIndex(ctx.from.username)
	if(userIndex !== -1) {
		const amount = Number(ctx.message.text.slice(6))
		if(amount !== 0) {
			users[userIndex].pullups = users[userIndex].pullups + amount
		} else {
			users[userIndex].pullups = users[userIndex].pullups + 1
		}
		
		return ctx.reply(`${ctx.from.first_name} veti ${amount !== 0 ? amount : 1} leukaa`)
	}
	else {
		return ctx.reply('Rekisteröidy ensin')
	}
}) 

bot.command('stats', (ctx) => {
	const userIndex = findUserIndex(ctx.from.username)
	if (userIndex !== -1) {
		ctx.reply(`${ctx.from.first_name}, olet vetänyt ${users[userIndex].pullups} leukaa`)
	}
})

bot.launch() // start