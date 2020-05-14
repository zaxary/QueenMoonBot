// Load requirements
const Discord = require("discord.js");
const fs = require('fs');
const count = require('./count.json');
const config = require("./config.json");

//CSV parser
const csv = require('csv-parser');
//CSV data (filled later on)
var allCSVdata = [];
var classes = [];
var gpaData = [];

var brownoutOut = [];
var quotesOut = [];

const client = new Discord.Client({
    partials: ['MESSAGE']
});


//initialize global map of courses
var courseCache = {
  ex001: ["Example Name", "0 hours", "4.0", "Example Description"],
  bus101: ["Professional Responsibility and Business", "3 hours", "3.85", "Introduces business students to professional responsibility. Develops the concept of professional responsibility within a personal and interpersonal context. Continues by expanding the concept to encompass the firm and explore the global corporate context. Introduces business majors and career paths and provides an understanding of ethical decision-making. Encourages the development of a professional identity and skills, preparing students to represent the College and the University with integrity and confidence in their careers. Prerequisite: First Semester Freshman, Intercollegiate and Off-Campus Transfer Students."]
};


//function to read CSV data
function getCSVdata(){
  //get classes data from CSV file
  var classes = []
  fs.createReadStream('2020-fa.csv')
     .pipe(csv())
     .on('data', (row) => {
       classes.push(row);
       //console.log(row);
     })
     .on('end', () => {
       console.log('CSV processed.')
     })
  //get gpa data from CSV file
  var gpaData = []
  fs.createReadStream('uiuc-gpa-dataset.csv')
     .pipe(csv())
     .on('data', (row) => {
       gpaData.push(row);
       //console.log(row);
     })
     .on('end', () => {
       console.log('CSV processed.')
     })
  //return data as an array of arrays
  var data = []
  data.push(classes);
  data.push(gpaData);
  return data;
}




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

    console.log("images cached");

    //set CSV data variables
    console.log("Reading CSV data...")
    allCSVdata = getCSVdata();
    classes = allCSVdata[0];
    gpaData = allCSVdata[1];
    console.log("ALL CSV DATA IS NOW SAVED!");
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
    } else if (command.match(/\billinois\b/) != null) {
      message.channel.send({
        files: ['https://media.discordapp.net/attachments/654785556215103488/692035239366885416/tempFileForShare_20200302-175024.png?width=546&height=679']
      });
      return;
    } else if (command.match(/\bquote\b/) != null) {
      if (!(message.channel.id === '669726484772159488' || message.channel.id === '654784430409252904')) {
        let rand = Math.floor(Math.random() * quotesOut.length);
        console.log(quotesOut[rand]);
        message.channel.send({
          files: [quotesOut[rand].attachments.first().url]
        });
        return;
      } else {
        message.channel.send("That command cannot be used in this channel!");
      }
    } else if (command.match(/\bbrownout\b/) != null) {
      if (message.channel.id === '697639057592811650') {
        let rand = Math.floor(Math.random() * brownoutOut.length);
        message.channel.send({
               files: [brownoutOut[rand].attachments.first().url]
        });
        return;
      } else {
        message.channel.send("That command can only be used in <#697639057592811650>");
      }
    } else if (command.match(/\bhelp\b/) != null) {
      message.channel.send("Commands:\n```* `queen no anime` to get the no anime picture\n* `queen hackathon` to get the done with hackathons picture\n* `queen gc` to get the Facebook group screenshot\n* `queen quote` to get a random image from #quotes\n* `queen head` to get the Mater screenshot\n* `queen usercount` to see how many users are currently in the server\n* `queen contribute` to get a like to the GitHub repo\n* `queen 8ball [message]` to get an 8ball reply (only works in #spam)\n* `queen thirst` to get water messages\n* `queen brownout` to get a random attachment from #brownoutposting (only works in #brownoutposting)\n`queen lofi` to get a good lofi playlist```");
    } else if (command.match(/\b8ball\b/) != null) {
      if (message.channel.id === '654838387160907777') {
        var rand = Math.floor(Math.random() * responses.length);
        message.channel.send("Question: " + message.content.substring(12) + "\nAnswer: " + responses[rand]);
      } else {
        message.channel.send("That command can only be used in <#654838387160907777>");
      }
    } else if (command.match(/\bclass\b/) != null) {
      //ex: queen class cs-125

      //check for course in dictionary/map
      var words = message.content.replace('queen class ', '').split("-");
      var classCode = words[0].toLowerCase()+words[1];
      if (classCode in courseCache){
        //notify on console
        console.log("Course in cache. Fetching...");
        message.channel.send(words[0].toUpperCase()+"-"+words[1]+": "+courseCache[classCode][0]+" -- "+courseCache[classCode][1]+" -- Offered in Fall 2020 -- Recent Avg. GPA: "+courseCache[classCode][2]);
        message.channel.send("Description: "+courseCache[classCode][3]);
        console.log("Course fetched.");
      }
      else{
        try{
          //notify on console
          console.log("Course not in cache. Fetching...");
          //splits into subject code & number
          var words = message.content.split("-");
          var userMessage = words[0].replace('queen class ', '');
          subject = userMessage.toUpperCase();
          classNum = words[1];
          //get class info
          var className = "N/A";
          var credits = 0;
          var classDescription = "";
          for (var i = 0; i < classes.length; i++){
            //console.log(classes[i]);
            //console.log(classes[i].Subject);
            if (classes[i].Subject == subject && classes[i].Number == classNum){
              //set name of class
              className = classes[i].Name;
              //set credit hour amount
              credits = classes[i].Credit;
              //set description
              classDescription = classes[i].Description;
            }
          }
          //recent avg. GPA (only counts 2019 classes)
          var gpa = 0;
          //select relevant classes for calculation
          var relevantClassesForGPA = [];
          for (var i = 0; i < gpaData.length; i++){
            if (gpaData[i].Subject == subject && gpaData[i].Number == classNum && gpaData[i].Year == 2019){
              relevantClassesForGPA.push(gpaData[i]);
            }
          }
          //calculate gpa
          var totalGPA = 0;
          var sumGPAs = 0;
          for (var i = 0; i < relevantClassesForGPA.length; i++){
            c = relevantClassesForGPA[i];
            var gpasum = parseFloat(c.Aplus)+parseFloat(c.Aa)+parseFloat(c.Aminus)+parseFloat(c.Bplus)+parseFloat(c.Bb)+parseFloat(c.Bminus)+parseFloat(c.Cplus)+parseFloat(c.Cc)+parseFloat(c.Cminus)+parseFloat(c.Dplus)+parseFloat(c.Dd)+parseFloat(c.Dminus);
            var gpatotal = ((parseFloat(c.Aplus) + parseFloat(c.Aa))*4)+(parseFloat(c.Aminus)*3.67)+(parseFloat(c.Bplus)*3.33)+(parseFloat(c.Bb)*3)+(parseFloat(c.Bminus)*2.67)+(parseFloat(c.Cplus)*2.33)+(parseFloat(c.Cc)*2)+(parseFloat(c.Cminus)*1.67)+(parseFloat(c.Dplus)*1.33)+(parseFloat(c.Dd*1))+(parseFloat(c.Dminus)*0.67);
            totalGPA += gpatotal;
            sumGPAs += gpasum;
          }
          gpa = totalGPA / sumGPAs;
          //send response (only if class name isn't 'N/A', as this would indicate that it couldn't be found in the CSV)
          if (className != "N/A"){
            message.channel.send(userMessage+"-"+classNum+": "+className+" -- "+credits+" -- Offered in Fall 2020 -- Recent Avg. GPA: "+Number(gpa.toFixed(2)));
            message.channel.send("Description: "+classDescription);
            //message.channel.send("Dev Data: "+totalGPA+", Total GPA & "+sumGPAs+" GPA's...");
            console.log("Course fetched.");
            
            //SAVE TO MAP:
            var courseData = [className, credits, Number(gpa.toFixed(2)).toString(), classDescription];
            courseCache[classCode] = courseData;
            //notify console
            console.log("Course has been cached.");
          }
          else{
            message.channel.send("Unfortunately, I wasn't able to find: "+userMessage+"-"+classNum+". This may mean that this course is not available in Fall 2020.");
          }
        }
        catch(error){
          message.channel.send("Sorry, that isn't the proper format for a class. Please use SUBJECT-NUMBER (ex. CS-125).")
        }
      }
    } else if (command.match(/\bthirst\b/) != null) {
      var rand = Math.floor(Math.random() * reminders.length);
      message.channel.send(reminders[rand]);
    } else if (command.match(/\lofi\b/) != null) {
        message.channel.send("https://open.spotify.com/playlist/1DcvziAZBZk1Ji1c65ePtk?si=Qtvu64zsQQurDtQa60tPBg");
    }
   } 
}
);

client.login(config.token);
