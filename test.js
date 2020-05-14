// Load requirements
const Discord = require("discord.js");
const fs = require('fs');
const count = require('./count.json');
const config = require("./config.json");

const client = new Discord.Client({
  partials: ['MESSAGE']
});

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


// let announcements_channel_id = "654785609335832586";
// let committed_id = "683065503300059179";
// let admitted_id = "683067243566858250";
// let prospective_id = "654786754657910815";
// let traitor_id = "696956653844561931";
// let bot_channel_id = "654783232969277453";


// client.on("messageReactionAdd",(reaction,user)=>{
//   console.log("START REACT");

//   if(!user) return;
//   if(user.bot)return;
//   if(!reaction.message.channel.guild) return;
//   if(!reaction.message.channel.id === announcements_channel_id) return;
//   member = reaction.message.guild.member(user)
//   console.log(member.id);
//   if (!member.roles.cache.some(r => r.name === "Prospective Student")  && !member.roles.cache.some(r => r.name === "Admitted Student")){

//     return;
//   }

//   let committed_role = member.guild.roles.cache.find(r => r.id === committed_id);
//   let admitted_role = member.guild.roles.cache.find(r => r.id === admitted_id);
//   let prospective_role = member.guild.roles.cache.find(r => r.id === prospective_id);
//   let traitor_role = member.guild.roles.cache.find(r => r.id === traitor_id);

//   console.log("USER CREDENTIALS PASS");
//   if(reaction.emoji.name == 'blockI') {
//     console.log("blocki react");
//     member.roles.add(committed_role);

//     member.roles.remove(admitted_role).then(console.log).catch(console.error);
//     member.roles.remove(prospective_role).then(console.log).catch(console.error);

//     // if (!member.roles.cache.some(r => r.id === "654828722050039808") &&
//     //     !member.roles.cache.some(r => r.id === "654828844133384222") &&
//     //     !member.roles.cache.some(r => r.id === "654828941072400393") &&
//     //     !member.roles.cache.some(r => r.id === "655176104251883561")) {
//     //   member.user.send("Don't forget to request your roles in #set_roles_here!\n**ex: Admitted, Grainger, OOS, ElecEng @ESC**").catch(console.error);
//     //   return;
//     // }
//   }
//   if(reaction.emoji.name == 'traitor'){
//     console.log("traitor react");

//     member.roles.add(traitor_role);
//     member.roles.remove(admitted_role).then(console.log).catch(console.error);
//     member.roles.remove(prospective_role).then(console.log).catch(console.error);
//   }
// });

async function getMessagesWithImages(channel, limit = 500) {
  const sum_messages = [];
  let last_id;

  while (true) {
    const options = {
      limit: 100
    };
    if (last_id) {
      options.before = last_id;
    }

    const messages = await channel.messages.fetch(options);
    sum_messages.push(...messages.array());
    last_id = messages.last().id;

    if (messages.size != 100 || sum_messages >= limit) {
      break;
    }
  }


  const output = [];
  for (let i = 0; i < sum_messages.length; i++) {
    if (sum_messages[i].attachments.size > 0)
      output.push(sum_messages[i]);
  }

  return output;
}

// Runs when a new message is sent on a server
client.on("message", async message => {

  var responses = ['It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good',
    'Very doubtful'
  ];

  // reminders for thirst command

  var reminders = ['A friendly reminder to stay hydrated.',
    'Quench your thirst.',
    'Did you drink enough water today?',
    'BEGONE',
    'stfu',
    'u thirsty hoe',
    'It is important to drink 8 glasses of water a day.',
    "goddammit i'm running out of creative ways to insult you people"
  ];
  
  //rng generator

  Random randIndex = new Random();

  // Counting game stuff
  if (message.channel.id === '698313651186040923') {
    message.channel.messages.fetch({
      limit: 2
    }).then(messages => {

      // Delete bot messages
      const lastMessage = messages.array();
      if (lastMessage[0].author.bot || lastMessage[1].author.bot) {
        message.delete(lastMessage[1]);
        return;
      }

      // If past 2 messages sent by same user, delete newest
      if (lastMessage[0].member.id == lastMessage[1].member.id) {
        message.delete(lastMessage[1]);
        return;
      }

      // If next number not old number + 1
      if (Number(lastMessage[0].content).toString() !== lastMessage[0].content || Number(lastMessage[0].content) - 1 != Number(lastMessage[1].content)) {
        // Add Can't Count role and delete last message if number isn't next in counting game and > 1500 ms between the two messages
        if (Math.abs(lastMessage[0].createdTimestamp - lastMessage[1].createdTimestamp) > 1500) {
          // Because Gloria is special
          if (lastMessage[0].member.id !== '242067290479132675') {
            const tMember = lastMessage[0].member.guild.roles.cache.find(role => role.name === "Can't Count");
            lastMessage[0].member.roles.add(tMember).catch(console.error);
          }
        }

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
  if (message.author.bot)
    return;

  const command = message.content.toLowerCase();

  let override = false;

  // Make sure message starts with 'queen'
  if (command.startsWith("queen"))
    override = true;

  if (override) {
    if (command.match(/\busercount\b/) != null) {
      const userAmnt = client.guilds.cache.get('654783232969277450').memberCount;
      message.channel.send("There are currently " + userAmnt + " people in this server");
      console.log(client.guilds.cache.get('654783232969277450').memberCount);
      return;
    } else if (command.match(/\bhackathon\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/654784388197908500/675113678856781834/Screenshot_20200102-213727_Discord.png']
      });
      return;
    } else if (command.match(/\bgc\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/669726484772159488/701247357001400370/unknown.png']
      });
      return;
    } else if (command.match(/\bhead\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/669726484772159488/708103493918916709/unknown.png']
      });
      return;
    } else if (command.match(/\bno anime\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/697639057592811650/708536846531035226/image0.jpg']
      });
      return;
    } else if (command.match(/\bcontribute\b/) != null) {
      message.channel.send("https://github.com/s-hfarooq/QueenMoonBot");
      return;
    } else if (command.match(/\bmatt\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/654784481340686346/709596915485900890/IMG_9784.jpg']
      });
      return;
    } else if (command.match(/\bquote\b/) != null) {
      if (!(message.channel.id === '669726484772159488' || message.channel.id === '654784430409252904')) {

        getMessagesWithImages(client.channels.cache.get("697329980044083220")).then(output => {
          message.channel.send({
            files: [output[randIndex.nextInt(0,output.length)].attachments.first().url]
          });
        });
      } else {
        message.channel.send("That command cannot be used in this channel!");
      }
    } else if (command.match(/\bbrownout\b/) != null) {
      if (message.channel.id === '697639057592811650') {
        getMessagesWithImages(client.channels.cache.get("697639057592811650")).then(output => {
          let rand = Math.floor(Math.random() * output.length);
          message.channel.send({
            files: [output[rand].attachments.first().url]
          });
        });
      } else {
        message.channel.send("That command can only be used in <#697639057592811650>");
      }
    } else if (command.match(/\bhelp\b/) != null) {
      message.channel.send(File.ReadAllText("commands.txt"));
    } else if (command.match(/\b8ball\b/) != null) {
      if (message.channel.id === '654838387160907777') {
        //part of message to be removed
        String commandString = "queen 8ball ";
        message.channel.send("Question: " + message.content.substring(commandString.length) + "\nAnswer: " + responses[randIndex.nextInt(0,responses.length)]);
      } else {
        message.channel.send("That command can only be used in <#654838387160907777>");
      }
    } else if (command.match(/\bthirst\b/) != null) {
      message.channel.send(reminders[randIndex.nextInt(0,reminders.length)]);
    }
  }
});

client.login(config.token);
