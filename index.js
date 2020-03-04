// Load requirements
const Discord = require("discord.js");
const fs = require('fs');
const count = require('./count.json');
const config = require("./config.json");


const client = new Discord.Client();


// Run on start
client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// Runs on join new server (?)
client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// Runs on leave server (?)
client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


// Runs when a new message is sent on a server
client.on("message", async message => {

  // Don't respond to bots
  if(message.author.bot) return;


  const command = message.content.toLowerCase();

  // All the cases
  if(command.includes("getwtfcounter")) {
    // Get counter
    message.channel.send("gg wtf count: ".concat(count[0]["messageCount"], "\ngg count: ", count[1]["messageCount"].toString(), "\nwtf count: ", count[2]["messageCount"].toString()));
  } else if(command.includes("gg") && command.includes("wtf")) {
    message.channel.send("gg wtf");

    // Saves new count to json file
    if (!count[0]) count[0] = { messageCount: 1 };
    else count[0].messageCount++;
    try {
      fs.writeFileSync('./count.json', JSON.stringify(count));
    } catch(err) {
      console.error(err);
    }
  } else if(command.includes("gg")) {
    message.channel.send("gg");

    // Saves new count to json file
    if (!count[1]) count[1] = { messageCount: 1 };
    else count[1].messageCount++;
    try {
      fs.writeFileSync('./count.json', JSON.stringify(count));
    } catch(err) {
      console.error(err);
    }
  } else if(command.includes("wtf")) {
    message.channel.send("wtf");

    // Saves new count to json file
    if (!count[2]) count[2] = { messageCount: 1 };
    else count[2].messageCount++;
    try {
      fs.writeFileSync('./count.json', JSON.stringify(count));
    } catch(err) {
      console.error(err);
    }
  }
});

client.login(config.token);
