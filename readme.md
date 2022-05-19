# readme

Adjust `.env`

Use `npm run deploy` to register slash commands via discord api and make them accessible to the user.

Use `npm run dev` for development.

<br>

`scr/bot.js` - entry point

`src/command.js` - *exports* command collection

<br>

Commands are made of a property 'data' and a method 'execute'
* 'data' contains necessary information like 'name' and 'description' and additional properties to define options, subcommands etc.
* 'execute' is called from the clients event emitter via `onInteractionCreate`

<br>

# todos / ideas

* update wccc readme

### commands:
* info
	- additonal user data 'roles', 'moderatable'
	- server info 'rules' channel
* faq
	- message content
* wccc/vote
	- l:32, l:80 controller
	- voting ended in a draw
	- notion

### permissions
### webhooks
### debugging
* add code comments
* typos

### structure / files
* functions/ folder?
* presences.js
  - so far only used by /wccc command
	- move to commands/wccc/assets ?
* commands/wccc/assets/utils.js => general utils ?

### rollup
