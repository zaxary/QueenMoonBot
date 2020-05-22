// Load requirements
const Discord = require("discord.js");
const fs = require('fs');
const count = require('./count.json');
const config = require("./config.json");

var brownoutOut = [];
var quotesOut = [];
var lastQuoteUpdate;
var lastBrownoutUpdate;
var updateInteval = (1000 * 60 * 60 * 24);

const client = new Discord.Client({
    partials: ['MESSAGE']
});

// Run on start
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`queen help`);
    getMessagesWithImages(client.channels.cache.get("697639057592811650")).then(output => {
      brownoutOut = output;
    });

    getMessagesWithImages(client.channels.cache.get("697329980044083220")).then(output => {
      quotesOut = output;
    });

    lastQuoteUpdate = Date.now();
    lastBrownoutUpdate = Date.now();

    console.log("images cached");
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

// Get all messages with media attached in a given channel
async function getMessagesWithImages(channel, limit = 500) {
    const sum_messages = [];
    let last_id;

  while (true) {
    const options = {
      limit: 100
    };

    if (last_id)
      options.before = last_id;

    const messages = await channel.messages.fetch(options);
    sum_messages.push(...messages.array());
    last_id = messages.last().id;

    if (messages.size != 100 || sum_messages >= limit)
      break;
  }

  const output = [];
  for (let i = 0; i < sum_messages.length; i++) {
    // Only keep messages with attachments and messages not sent by bots
    if (sum_messages[i].attachments.size > 0 && !sum_messages[i].author.bot)
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
      //console.log(client.guilds.cache.get('654783232969277450').memberCount);
    } else if (command.match(/\bbuffnooble\b/) != null) {
      message.channel.send("buff nooble buff nooble");
    } else if (command.match(/\bhackathon\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/654784388197908500/675113678856781834/Screenshot_20200102-213727_Discord.png']
      });
    } else if (command.match(/\bgc\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/669726484772159488/701247357001400370/unknown.png']
      });
    } else if (command.match(/\bhead\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/669726484772159488/708103493918916709/unknown.png']
      });
      return;
    } else if (command.match(/\brat\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/697639057592811650/713237658020872192/image0.jpg']
      });
      return;
    } else if (command.match(/\bno anime\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/697639057592811650/708536846531035226/image0.jpg']
      });
    } else if (command.match(/\bcontribute\b/) != null) {
      message.channel.send("https://github.com/s-hfarooq/QueenMoonBot");
    } else if (command.match(/\bcorn\b/) != null) {
      message.channel.send({
        files: ["https://cdn.discordapp.com/attachments/697639057592811650/712531761774461008/Corn_is_the_best_crop__wheat_is_worst.mp4"]
      });
    } else if (command.match(/\bwaitwhen\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/710425704524677211/711129644992036884/tim.png']
      });
    } else if (command.match(/\bmatt\b/) != null) {
      message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/669726484772159488/712182903966007296/IMG_9784.jpg']
      });
    } else if (command.match(/\billinois\b/) != null) {
      message.channel.send({
        files: ['https://media.discordapp.net/attachments/654785556215103488/692035239366885416/tempFileForShare_20200302-175024.png?width=546&height=679']
      });
    } else if (command.match(/\bcatgirl\b/) != null) {
      message.channel.send({
        files: ['https://img1.ak.crunchyroll.com/i/spire1/1b0597832b4aa93293041240680d6b471416589032_full.jpg']
      });
    } else if (command.match(/\bgwagwa\b/) != null) {
      message.channel.send("GWAGWA", {
        files: ['https://cdn.discordapp.com/attachments/669726484772159488/713289328985505792/gwa_gwa-QPYcuA0b6gA.mp4']
      });
    } else if (command.match(/\bquote\b/) != null) {
      if (!(message.channel.id === '669726484772159488' || message.channel.id === '654784430409252904')) {
        // Update
        if(Math.abs(lastQuoteUpdate - Date.now()) > updateInteval) {
          getMessagesWithImages(client.channels.cache.get("697329980044083220")).then(output => {
            quotesOut = output;
          });

          lastQuoteUpdate = Date.now();
          console.log("Quotes Updated");
        }

        let rand = Math.floor(Math.random() * quotesOut.length);
        message.channel.send({
          files: [quotesOut[rand].attachments.first().url]
        });
      } else {
        message.channel.send("That command cannot be used in this channel!");
      }
    } else if (command.match(/\bbrownout\b/) != null) {
      if (message.channel.id === '697639057592811650') {
        if(Math.abs(lastBrownoutUpdate - Date.now()) > updateInteval) {
          getMessagesWithImages(client.channels.cache.get("697639057592811650")).then(output => {
            brownoutOut = output;
          });

          lastBrownoutUpdate = Date.now();
          console.log("Brownout Update");
        }

        let rand = Math.floor(Math.random() * brownoutOut.length);
        message.channel.send({
            files: [brownoutOut[rand].attachments.first().url]
        });
      } else {
        message.channel.send("That command can only be used in <#697639057592811650>");
      }
    } else if (command.match(/\bsoup\b/) != null) {
        message.channel.send({
            files: ['https://i.kym-cdn.com/entries/icons/original/000/026/699/soup.jpg']
        });
    } else if (command.match(/\bhelp\b/) != null) {
        message.channel.send("Commands:\n```* `queen ping` to get your ping\n* `queen no anime` to get the no anime picture\n* `queen hackathon` to get the done with hackathons picture\n* `queen gc` to get the Facebook group screenshot\n* `queen quote` to get a random image from #quotes\n* `queen head` to get the Mater screenshot\n* `queen usercount` to see how many users are currently in the server\n* `queen contribute` to get a like to the GitHub repo\n* `queen 8ball [message]` to get an 8ball reply (only works in #spam)\n* `queen thirst` to get water messages\n* `queen gwagwa` to get the gwagwa video\n* `queen brownout` to get a random attachment from #brownoutposting (only works in #brownoutposting)\n* `queen lofi` to get a good lofi playlist\n* `queen buffnooble` for buff nooble\n* `queen waitwhen` to get the when did I ask screenshot\n* `queen illinois` to get a map of Illinois\n* `queen soup` to get soup\n* `queen corn` to get a corn video`\n* `queen catgirl` to see a catgirl```");
    } else if (command.match(/\b8ball\b/) != null) {
      if (message.channel.id === '654838387160907777') {
        var rand = Math.floor(Math.random() * responses.length);
        message.channel.send("Question: " + message.content.substring(12) + "\nAnswer: " + responses[rand]);
      } else {
        message.channel.send("That command can only be used in <#654838387160907777>");
      }
    } else if (command.match(/\bclass\b/) != null) {
      message.channel.send("That command has been disabled. Use class bot instead.");
    } else if (command.match(/\bthirst\b/) != null) {
      var rand = Math.floor(Math.random() * reminders.length);
      message.channel.send(reminders[rand]);
    } else if (command.match(/\blofi\b/) != null) {
      message.channel.send("https://open.spotify.com/playlist/1DcvziAZBZk1Ji1c65ePtk?si=Qtvu64zsQQurDtQa60tPBg");
    } else if (command.match(/\bping\b/) != null) {
        const channel = message.channel;
        var ping = Date.now() - message.createdTimestamp;

        if (ping < 30) {
            channel.send("Mad respect <@" + message.author.id + ">" + ' your ping is crazy good at '+ ping + ' ms');
        } else if (ping < 80) {
            channel.send("Not bad <@" + message.author.id + ">" + ' your ping is average at '+ ping + ' ms');
        } else {
            channel.send("My grandma has better internet <@" + message.author.id + ">" + ' you def need better wifi your ping is '+ ping + ' ms');
        }
    } else {
      message.channel.send("That command doesn't exist. Run `queen help` to see the available commands");
    }

    return;
   }
});

client.login(config.token);
