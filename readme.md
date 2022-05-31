# Readme

Adjust `.env`

Use `npm run deploy` to register slash commands via discord api and make them accessible for the user.

Use `npm run dev` for development.

<br>

# Commands:

Commands are registered/loaded by reading the files in the commands-folder. Simply remove unnecessery/unwanted commands from the folder or add your own.

Commands consist of a property 'data' and a method 'execute'
* 'data' contains necessary information like 'name' and 'description' and additional properties to define options, subcommands etc.
* 'execute' is called from the clients event emitter via `onInteractionCreate` in 'bot.js'
<br>

## WCCC

### Settings

### Message content

### Permissions

### Notifications


# Notion

https://www.youtube.com/watch?v=zVfVLBjQuSA&ab_channel=WebDevSimplified

# Todo

use rollup/webpack
