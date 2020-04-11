# QueenMoonBot

A counting mod bot for the UIUC 2024 Discord server

## Add it to your server:
  https://discordapp.com/oauth2/authorize?&client_id=684867671552294994&scope=bot&permissions=8


# NOTE - these commands don't work anymore

## Commands
By default, the `wtf`, `gg`, `wtf gg`, `b o g`, and `when` commands only have a 33% chance of appearing. This can be overridden by adding `killa` to the beginning of your message. Other commands, such as `killa help`, `killa usercount`, `killa no anime`, `killa hackathon`, and `getKillaCounter` appear every time a message with one of those commands is sent.

#### Other commands

* `getKillaCounter` to get the current counter across all servers
* add `killa` to the start of your message to override the 33% chance of the bot responding
* `killa no anime` to get the no anime picture
* `killa hackathon` to get the done with hackathons picture
* `killa usercount` to see how many users are currently in the server
* `killa say ...` to have the bot say something

## To run the bot yourself
make a file named `config.json` in the root directory of the repo. Head over to the [Discord Developer Portal](https://discordapp.com/developers/applications/me) and get a token for a new bot. Place that token in `config.json` in the following format:

```
{
  "token": "YOUR_TOKEN_HERE"
}
```

