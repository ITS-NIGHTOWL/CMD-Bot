const Discord = require('discord.js')
const client = new Discord.Client({
    disableEveryone: true
})
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const hastebin = require('hastebin.js');
const haste = new hastebin();
const YAML = require('yaml')
const pathCheck = (file) => {
    return process.cwd() + file
}
const __date = new Date(Date.now())
const date = `${__date.getFullYear()}-${__date.getMonth() + 1}-${__date.getDate()}`
const logger = (message) => {
    fs.appendFileSync(pathCheck(`/logs/${date}.log`), message + '\r\n')
}
if (!fs.existsSync(pathCheck('/config.yaml'))) {
    fs.writeFileSync(pathCheck('/config.yaml'), "owners:\n  - 'YOUR_USERID'\n  - 'YOUR PARTNERS USERID (if you have one)'\nbot_token: 'LOGIN TOKEN FOR YOUR BOT'")
    console.error(chalk.green('We noticed you were missing a config.yaml file, so we\'ve generated a template one for you! Please modify it with the correct options, then run the executable again'))
}
const config = YAML.parse(fs.readFileSync(pathCheck('/config.yaml'), 'utf8'))
const {
    exec
} = require('child_process');
const owners = config.owners
let ownerNames = []

client.on('ready', async () => {
    fs.ensureFileSync(pathCheck(`/logs/${date}.log`), err => {
        if (err) console.log(err)
    })
    logger(`________________________________\nBot started at: (${new Date(Date.now())})`)
    console.log(chalk.blue('Bot developed by ' + chalk.red('itsretr0n (https://github.com/itsretr0n)') + ' with help from contribuors on the bots Github repo (https://github.com/itsretr0n/CMD-Bot). For assistance, add me on discord: ITS_N1GH7OWL#6550'))
    console.log(chalk.green(`Cmd Bot Has Successfully Started`))
    try {
        await owners.forEach((user) => {
            ownerNames.push(client.users.get(user).tag)
        })
        console.log(chalk.yellow(`Owners Are: ${ownerNames.join(', ')}`))
    } catch (e) {
        console.error(chalk.red('An invalid owner ID was provided in the config.yaml file!'))
        process.exit()
    }
})

client.on('error', (err) => {
    return logger(err)
})

client.on('message', async msg => {
    if (!msg.content.startsWith('/')) return
    const isOwner = owners.includes(msg.author.id)
    const args = msg.content.slice(Object.keys('-').length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    if (!isOwner) {
        logger(`- User: ${msg.author.tag} (${msg.author.id})\n    x Attempted To Use: /${command}\n    x With Arguements: ${args.join(' ')}`)
        return msg.react('❌')
    }
    msg.react('✅')
    if (command == 'logs') {} else if (!args[0]) logger(`- User: ${msg.author.tag} (${msg.author.id})\n    !! Used: /${command}\n    !! But Didn't Specify Any Arguements`)
    else logger(`- User: ${msg.author.tag} (${msg.author.id})\n    + Used: /${command}\n    + With Arguements: ${args.join(' ')}`)
    if (command === 'exec') {
        if (!args[0]) return msg.channel.send('No command given!')
        exec(args.join(' '), (error, stdout, stderr) => {
            function response(val) {
                return new Discord.RichEmbed()
                    .setTitle('Terminal')
                    .addField('Input:', `\`\`\`${args.join(' ')}\`\`\``)
                    .addField('Output:', String(val))
                    .setColor('RANDOM')
                    .setFooter(`Bot managed by: ${ownerNames.join(', ')} | Developed by: ITS_N1GH7OWL#6550 + Contributors on: https://github.com/itsretr0n/CMD-Bot`)
            }
            if (stdout.length <= 1024) {
                msg.channel.send(response(`\`\`\`autohotkey\n${stdout}\`\`\``))
            } else {
                haste.post(stdout).then(link => {
                    msg.channel.send(response(`View here: ${link}`))
                });
            }
        })
    }
    if (command == 'eval') {
        function response(val) {
            return new Discord.RichEmbed()
                .setTitle('Javascript')
                .addField('Code:', `\`\`\`js\n${args.join(' ')}\`\`\``)
                .addField('Returned:', String(val))
                .setColor('RANDOM')
                .setFooter(`Bot managed by: ${ownerNames.join(', ')} | Developed by: ITS_N1GH7OWL#6550 + Contributors on: https://github.com/itsretr0n/CMD-Bot`)
            }
        try {
            var result = eval(args.join(' '))
            if (result) {
                return msg.channel.send(response(`\`\`\`${result}\`\`\``))
            } else {
                return msg.channel.send(response(`\`\`\`Nothing was returned!\`\`\``))
            }
        } catch (e) {
            haste.post(e.stack).then(link => {
                msg.channel.send(response(`\`\`\`Error type: ${e.name}\nError message: ${e.message}\`\`\`\nThe bot has fowarded the full error information to your DM's.`)).then(() => {
                    msg.author.send(`Full error here -> ${link}`)
                })
            })
        }
    }
    if (command == 'logs') {
        logger(`- User: ${msg.author.tag} (${msg.author.id})\n    + Used: /${command}\n    + To View This File`)
        haste.post(fs.readFileSync(pathCheck(`/logs/${date}.log`))).then(link => {
            msg.author.send(`>>> Logs can be viewed here: ${link}`)
        })
    }
    if (command == 'help') {
        msg.channel.send(`>>> **__Commands__**\n**/exec** *<command>* *<..args>*: Executes a command through the command line\n**/eval** *<js code>*: Evaluates any javascript code entered and returns a value/response. The Discord.js library is integrated with the command. __Do not wrap code in codeblock!__\n**/logs**: DM's the bots logs. New logs are generated on a daily basis`)
    }
})
if (config.bot_token) {
    client.login(config.bot_token).catch(e => {
        console.error(chalk.red(`Token login error: ${e.message}`))
    })
} else {
    console.log(chalk.red('Bot token is missing from YAML file!'))
    process.exit()
}