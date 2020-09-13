const Telegraf = require('telegraf')

// Require dotenv-package to read .env files
const dotenv = require('dotenv')
dotenv.config()

// Create new Telegraf-instance with the given bot token from .env
const bot = new Telegraf(process.env.BOT_TOKEN)

// Temp array to store data
var objectArray = []

bot.on('text', (ctx) => {
    // Console logging for all messages
    console.log(`${new Date} - ${ctx.update.message.from.first_name}: ${ctx.message.text}`)

    if(ctx.message.text.match(/^\+([0-9]|[1-9][0-9])$/)){
        saveValue({ctx})
    }
})

function saveValue (props) {
    const idFromMessage = props.ctx.update.message.from.id
    const username = props.ctx.update.message.from.first_name
    const amountFromMessage = parseInt(props.ctx.update.message.text.replace(/^\+/, ''))

    const entry = {
        id: idFromMessage,
        amount: amountFromMessage
    }

    // Push added values to temp array
    objectArray.push(entry)

    // Filter for only checking the total from current user
    const userEntries = objectArray.filter( entry => entry.id == idFromMessage)

    // Calculate totals
    let total = 0
    userEntries.forEach(entry => total += entry.amount)

    // Respond
    props.ctx.reply(`${username} veti juuri ${amountFromMessage} leukaa! Yhteensä vedetty ${total} leukaa`)
}

// Launch bot
bot.launch()