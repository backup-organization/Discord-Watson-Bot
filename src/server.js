import express from 'express';
import Discord from 'discord.js';
import bodyParser from 'body-parser';
import { message } from './routes/conversation';
import { checkTone } from './routes/toneAnalysis';
import {naturalAnalysis} from './routes/naturalLanguage';
import { personality } from './routes/personality';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
//bot token
const port = 80;
const token = process.env.BOT_TOKEN;
const app = express();
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

const client = new Discord.Client();
var conversationState = {context:{}};

client.on('ready', () => {
  console.log('bot running');
});

function undefCheck(msg, prop, embed){
  if (prop != undefined) {
    if (prop.length > 1) {
      for (var i = 0; i < prop.length; i++) {
        if (embed.description != undefined) {
          embed.setDescription(embed.description +' \n'+ prop[i].label);
        }else {
          embed.setDescription(' \n'+ prop[i].label);
        }
      }}
    else if (prop != '' && prop != undefined){
      msg.reply(prop);
    }}
}

function sendMessage(msg, channel){
  if(msg.author.id !== client.user.id){
    channel.startTyping();
    const stream = fs.createWriteStream('src/log/log.txt', {flags:'a'});
    stream.write('{user: '+ msg.author.username +
                 ',\ntext: '+ msg.content+
                 ',\ntimestamp: '+ new Date().toLocaleString()+'},\n');
    stream.end();
    axios.post('/orchestrator', {
      text: msg.content,
      context: conversationState.context,
      conversation_id:conversationState.context.conversation_id
    })
      .then(res => {
        const embed = new Discord.RichEmbed();
        const generic =res.data.output.generic;
        for (var i = 0; i < generic.length; i++) {
          const stuff = generic[i].options;
          const img = generic[i].source;
          const replyMsg = res.data.output.text;
          conversationState = res.data.context;
          if (generic[i].title) {
            embed.setTitle(generic[i].title);
          }
          undefCheck(msg, stuff, embed);
          undefCheck(msg, replyMsg);
          embed.setColor('#ff0000');
          if (embed.description != null) {
            channel.send(embed);
          }
          if (img != undefined) {
            msg.reply(img);
          }}
      })
      .catch(err => channel.send(err));
    channel.stopTyping();
  }
}
async function clear(msg, channel){
  const nMsg = await msg.channel.fetchMessages({limit:100});
  channel.bulkDelete(nMsg);
  msg.delete();
}
async function analyze(){
  await fs.readFile('src/log/log.txt', 'utf8', (err, data) => {
    naturalAnalysis(data);
    personality(data);
    checkTone(data);
  });
}


client.on('message', msg => {
  const channel = msg.channel;
  //your name here-----------------------------------------v
  if (msg.content == 'clear' && msg.author.username === process.env.ADMIN_USER) {
    clear(msg, channel);
  }else if (msg.content == 'analyze' && msg.author.username === process.env.ADMIN_USER) {
    analyze();
  }
  else {
    if (msg.mentions._content.includes(process.env.BOT_ID)) {
      sendMessage(msg, channel);
    }
  }
});
client.login(token);

app.post('/orchestrator', (req, res) => {
  return message(req.body.text, res, conversationState);
});

app.get('/', (req, res) => {
  res.send('Api teste');
});

app.listen(port, () => {
  console.log('listening on port ', port);
});
