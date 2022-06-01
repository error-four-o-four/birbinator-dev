# Readme

Adjust `.env` and `./config.js`

Use `npm run deploy` to register slash commands via discord api and make them accessible for the user.

Use `npm run dev` for development.

Use `npm run notion` to configure and test the notion API.

<br>

# Commands:

Commands are registered/loaded by reading the files in the commands-folder. Simply remove unnecessery/unwanted commands from the folder or add your own.

Commands consist of a property 'data' and a method 'execute'
* 'data' contains necessary information like 'name' and 'description' and additional properties to define options, subcommands etc.
* 'execute' is called from the clients event emitter via `onInteractionCreate` in 'bot.js'

<br>

# WCCC

### guide.js
shows a message embed with wccc guidelines

### past.js
sends a link to the past topics on notion

### time.js
Shows the time left to suggest a topic, to vote or until the stream starts

### settings.js (*moderator only*)
handles '/wccc settings' slashcommand to configurate settings of the voting.

### topics.js (*moderator only*)
starts the topic suggestion time.<br>
collect incoming messages until a configurated amount of time has expired or a maximum amount of suggestions has been reached. notify sableraph/wccc moderators via ephemeral message on end.

### vote.js (*moderator only*)
starts the voting time.<br>
send collected topics via dm to command user and await emoji reactions from the user. prompt user when all topics have an individual emoji and send voting message in channel.

### stop.js (*moderator only*)
Stops the topic or voting time manually

<br>

## Configuration and Settings

[This](https://anidiots.guide/getting-started/getting-started-long-version/) is a good tutorial to create the bot imo. All the required data like the 'bot token', 'discord ids' and the 'notion' data is contained in `./config.js`.<br>
Depending on how flexible you want to be, you can add different default values for the 'Topic Suggestion' and 'Voting Time' in `./commands/wccc/controllers/settings`

<br>

## Message content

All messages that are sent to the users are in `./commands/wccc/assets/messages.js`.

<br>

## Permissions

Basic permissions handling is set in `./commands/wccc.js`.

It requires an explicit 'wccc moderator role' to call the 'settings', 'topics', 'vote' and 'stop' commands (the Id needs to be set in './config.js). These commands can only be called in the voting channel.

The commands 'guide' and 'past' can be called by everyone but only in the chat channel.

The command 'time'can be called in the voting and chat channel.

<br>

# Notion

The values of the topics table are set via the ids of each row. To get these ids use `npm run notion` to log them in the console and copy them to './config.js' as explained [here](https://youtu.be/zVfVLBjQuSA?t=581)

There's another (commented) code snippet in `./commands/wccc/controllers/notionGetIds.js` to test the Notion API.

<br>

# Todo

~~send configuration prompts via dm~~<br>
~~add a notification role/command~~<br>
~~permissions~~<br>
~~add a wccc moderator role (in case of emergency)~~<br>
add a timer/reminder (setTimeout) during topic suggestion time<br>
~~add /time stream, wccc command~~<br>
Doublecheck/correct message content - [Discord Formatters](https://discord.js.org/#/docs/discord.js/main/class/Formatters?scrollTo=s-roleMention)<br>
~~Notion API (partially - update token, ids, etc.)~~ <br>
find errors/bugs<br>
use rollup/webpack
