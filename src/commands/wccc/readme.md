# todos/ideas

~~send configuration prompts via dm~~<br>
~~add a notification role/command~~<br>
permissions<br>
add a wccc moderator role (in case of emergency)<br>
add a timer/reminder (setTimeout) during topic suggestion time<br>
Doublecheck/correct message content - [Discord Formatters](https://discord.js.org/#/docs/discord.js/main/class/Formatters?scrollTo=s-roleMention)<br>
Notion API<br>
find errors/bugs<br>

# structure

## assets

### controller.js
*imports* customIds<br>
*exports default*

keeps track of:
- settings menu selection
- settings values (maximum amount of suggested topics; suggestion and voting duration;)
- wccc state (topic/voting time)
- collectors
- topics

### elements.js
*imports* customIds, settings, messages<br>
*exports* interaction embdes and components

### identifiers.js
*exports default* identifier for interaction components (buttons, select menu etc.)

### messages.js
*exports* all message contents, titles, descriptions, labels etc.


## commands

### config.js
handles '/wccc config' slashcommand to configurate settings of the voting.

### guide.js
shows a message embed with wccc guidelines

### past.js
sends a link to the past topics on notion

### topics.js
starts the topic suggestion time.<br>
collect incoming messages until a configurated amount of time has expired or a maximum amount of suggestions has been reached. notify sableraph/wccc moderators via ephemeral message on end.

### vote.js
starts the voting time.<br>
send collected topics via dm to command user and await emoji reactions from the user. prompt user when all topics have an individual emoji and send voting message in channel.

### stop.js
Stops the topic or voting time manually