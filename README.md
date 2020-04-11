# QueenMoonBot

A counting mod bot for the UIUC 2024 Discord server

## Add it to your server (counting game stuff won't work though since the channel id is hard coded):
  https://discordapp.com/oauth2/authorize?&client_id=684867671552294994&scope=bot&permissions=8

## Commands
* Makes sure the #counting_game channel is in check. If a user sends two messages in a row, it deletes the newest one. If a user sends a number that isn't the previous number + 1, it deletes the message and assigns the `Can't Count` role (assuming the newest message was sent > 1500ms after the previous one).
* `queen no anime` to get the no anime picture
* `queen hackathon` to get the done with hackathons picture

## To run the bot yourself
make a file named `config.json` in the root directory of the repo. Head over to the [Discord Developer Portal](https://discordapp.com/developers/applications/me) and get a token for a new bot. Place that token in `config.json` in the following format:

```
{
  "token": "YOUR_TOKEN_HERE"
}
```

## Contribute
Make some contributions, it's open source.
