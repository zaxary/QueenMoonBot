# QueenMoonBot

A bot for the UIUC 2024 Discord server

## Add it to your server
  - NOTE: some things won't work due to hard coded channel id's

  https://discordapp.com/oauth2/authorize?&client_id=684867671552294994&scope=bot&permissions=8

## Commands
* Makes sure the #counting_game channel is in check. If a user sends two messages in a row, it deletes the newest one. If a user sends a number that isn't the previous number + 1, it deletes the message and assigns the `Can't Count` role (assuming the newest message was sent > 1500ms after the previous one).
* `queen no anime` to get the no anime picture
* `queen hackathon` to get the done with hackathons picture
* `queen gc` to get the Facebook group screenshot
* `queen quote` to get a random image from #quotes
* `queen brownout` to get a cringe meme from #brownoutposting (only works in #brownoutposting)
* `queen head` to get the Mater screenshot
* `queen usercount` to see how many users are currently in the server
* `queen contribute` to get a like to the GitHub repo
* `queen 8ball [message]` to get an 8ball reply (only works in #spam)
* `queen thirst` to remind your friends to H Y D R A T E
* `queen lofi` to get a nice lofi playlist



## To run the bot yourself
make a file named `config.json` in the root directory of the repo. Head over to the [Discord Developer Portal](https://discordapp.com/developers/applications/me) and get a token for a new bot. Place that token in `config.json` in the following format:

```
{
  "token": "YOUR_TOKEN_HERE"
}
```

then run the bot by running `node index.js` in a terminal. To run even after closing the terminal window (ie. on an AWS EC2 instance) use the command `forever start index.js`.

## Contribute
Make some contributions, it's open source.
