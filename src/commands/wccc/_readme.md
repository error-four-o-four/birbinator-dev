# todos/ideas

~~send configuration prompts via dm~~<br>
~~add a notification role/command~~<br>
~~permissions~~<br>
~~add a wccc moderator role (in case of emergency)~~<br>
add a timer/reminder (setTimeout) during topic suggestion time<br>
~~add /time stream, wccc command~~<br>
Doublecheck/correct message content - [Discord Formatters](https://discord.js.org/#/docs/discord.js/main/class/Formatters?scrollTo=s-roleMention)<br>
Notion API (partially - update token, ids, etc.) <br>
find errors/bugs<br>

# structure

## controllers

### settings.js
*imports*<br>
customIds, labels, components

*exports default*

*keeps track of*<br>
settings menu selection<br>
settings values (maximum amount of suggested topics; suggestion and voting duration;)<br>

### voting.js
*imports*<br>
customIds, messages, settings controller (to get values)

*exports default*

*functions*<br>
wccc state (topic/voting time)<br>
collectors<br>
topics<br>

## assets

### identifiers.js
*exports*<br>
identifier for interaction components (buttons, select menu etc.)<br>
labels<br>

### components.js
*imports*<br>
customIds, labels

*exports*<br>
components, getPromptComponents

### messages.js
*exports*<br>
embeds, all message contents, titles, descriptions etc.

## commands

### guide.js
shows a message embed with wccc guidelines

### past.js
sends a link to the past topics on notion

### time.js
Shows the time left to suggest a topic, to vote or until the stream starts

### settings.js
*moderator only*<br>
handles '/wccc settings' slashcommand to configurate settings of the voting.

### topics.js
*moderator only*<br>
starts the topic suggestion time.<br>
collect incoming messages until a configurated amount of time has expired or a maximum amount of suggestions has been reached. notify sableraph/wccc moderators via ephemeral message on end.

### vote.js
*moderator only*<br>
starts the voting time.<br>
send collected topics via dm to command user and await emoji reactions from the user. prompt user when all topics have an individual emoji and send voting message in channel.

### stop.js
*moderator only*<br>
Stops the topic or voting time manually