# todos/ideas

send configuration prompts via dm
add a notification role/command
permisssions
add a wccc moderator role (in case of emergency)
add a timer/reminder (setTimeout) during topic suggestion time
Doublecheck/correct message content
Notion API
find errors/bugs

# structure

## assets

### settings.js
maximum amount of suggested topics; suggestion and voting duration;
*imports* customIds
*exports default*

### customIds.js
*exports default* identifier for interaction components (buttons, select menu etc.)

### elements.js
*imports* customIds, settings, texts
*exports* functions to create interaction components
*@todo* restructure components default/prompt ?

### texts.js
*exports* alls used message contents, titles, descriptions, labels etc.

### utils.js

## commands

### config.js
handles '/wccc config' slashcommand to configurate settings of the voting.

### guide.js
shows a message embed with wccc guidelines

### past.js
sends a link to the past topics on notion

### topics.js
starts the topic suggestion time.
collect incoming messages until a configurated amount of time has expired or a maximum amount of suggestions has been reached. notify sableraph/wccc moderators via dm/ephemeral message (?) on end.
*@todo*

### vote.js
*@todo*

### stop.js
*@todo*