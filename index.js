// Load requirements
const Discord = require("discord.js");
const fs = require('fs');
const count = require('./count.json');
const config = require("./config.json");

const client = new Discord.Client();

// Run on start
client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`queen help`);
});

// Runs on join new server
client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`queen help`);
});

// Runs on leave server
client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`queen help`);
});

// Runs when a new message is sent on a server
client.on("message", async message => {
  // Counting game stuff
  if(message.channel.id === '698313651186040923') {
      message.channel.messages.fetch({ limit: 2 }).then(messages => {

        const lastMessage = messages.array();
        if(lastMessage[0].author.bot || lastMessage[1].author.bot) {
          message.delete(lastMessage[1]);
          return;
        }

        if(Number(lastMessage[0].content).toString() !== lastMessage[0].content || Number(lastMessage[0].content) - 1 != Number(lastMessage[1].content)) {
          // Add Can't Count role and delete last message if number isn't next in counting game
          const tMember = lastMessage[0].member.guild.roles.cache.find(role => role.name === "Can't Count");
          lastMessage[0].member.roles.add(tMember).catch(console.error);
          message.delete(lastMessage[0]);
          return;
        }
      }).catch(err => {
        console.error(err);
        return;
      })

      return;
  }

  // Don't respond to bots
  if(message.author.bot)
    return;


  const command = message.content.toLowerCase();
  let override = false;

  if (command.startsWith("queen"))
    override = true;

  if(command.match(/\busercount\b/) != null) {
    const userAmnt = client.guilds.cache.get('654783232969277450').memberCount;
    message.channel.send("There are currently " + userAmnt + " people in this server");
    console.log(client.guilds.cache.get('654783232969277450').memberCount);
    return;
  }

  if(override) {
    if(command.match(/\bhackathon\b/) != null) {
      message.channel.send("https://cdn.discordapp.com/attachments/654784388197908500/675113678856781834/Screenshot_20200102-213727_Discord.png");
      return;
    }
  }
});

client.login(config.token);
