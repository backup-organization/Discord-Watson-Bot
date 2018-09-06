import express from 'express';
import Discord from 'discord.js';
import bodyParser from 'body-parser';
import { message } from './routes/conversation';
import axios from 'axios';
//INSTALL AXIOS;
const port = 80;
const token = '';
const app = express();
app.use(bodyParser());
const client = new Discord.Client();
var conversationState = {context:{}};
var channel = {};

client.on('ready', () => {
  console.log('bot running');
});

function sendMessage(msg, channel){
  if(msg.author.id !== client.user.id){
    channel.startTyping();
    axios.post('/orchestrator', {
      text: msg.content,
      context: conversationState.context,
      conversation_id:conversationState.context.conversation_id
    })
      .then(res => {
        const stuff = res.data.output.generic[0].options;
        const img = res.data.output.generic[0].source;
        const replyMsg = res.data.output.text;
        conversationState = res.data.context;
        if (stuff != undefined) {
          for (var i = 0; i < stuff.length; i++) {
            msg.reply(stuff[i].label);
          }
        }
        if (img != undefined) {
          msg.reply(img);
        }
        if (replyMsg != undefined) {
          msg.reply(replyMsg);
        }
      })
      .catch(err => channel.send(err));
    channel.stopTyping();
  }
}

client.on('message', msg => {
  channel = msg.channel;
  sendMessage(msg, channel);
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
