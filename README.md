
**To use this bot, you must install node.js: https://nodejs.org/**
# What is CMD Bot
### Cmd bot is a simple, yet powerful Discord bot for running command line tools from the comfort of a discord chat room. It comes with error logging, and a configuration file where you can set bot owners + bot token. The default prefix for the bot is /

## When first running the `node cmdbot.js` script, a config.yaml file will be generated. Edit it with your correct information.
#### Example:  
```yaml
owners:
- '588521648349642753' # Your UserID (I Used Mine As An Example Here)
bot_token: 'OpqUsdjSghhsygHFHkfuyzvN.XZbT1w.AJncHKDUnvusDHFik0Q-Zk-8hGz' # Your Bots Token
```

**When first using the executable, a template config file is generated, which you must modify**  
*Current commands in this release*  
**/exec** *\<cmd> <..args>*: Executes command through command line, then returns output through discord  
**/eval** *\<js code>*: Allows you to evaluate JavaScript code from the comfort of discord! No text editor needed  
**/logs**: Displays log the bot has stored. A new one is generated daily, but all logs are saved in the /logs directory (this is generated in the same directory of the bots executable on your PC  
**/help**: Shows basic command usage  

**Using commands through the Discord bot is still dangerous!  Be cautious with who you add to the bots owners inside the config.yaml file**
