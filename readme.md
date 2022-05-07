# readme

Use `npm run deploy` to register slash commands via discord api and make them accessible to the user.

Use `npm run dev` for development.

<br>

`bot.js` - entry point

`command.js` - *exports* command collection

<br>

Commands are made of a property 'data' and a method 'execute'
* 'data' contains necessary information like 'name' and 'description' and additional properties to define options, subcommands etc.
* 'execute' is called from the clients event emitter via `onInteractionCreate`

<br>

# todos / ideas

### commands:
* add code comments
* info
	- additonal user data 'roles', 'moderatable'
	- server info 'rules' channel

### permissions
### webhooks
### rollup
### debugging

### structure / files
* functions/ folder?
* presences.js
  - so far only used by /wccc command
	- move to commands/wccc/assets ?
