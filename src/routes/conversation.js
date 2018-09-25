import ConversationV1 from 'watson-developer-cloud/conversation/v1';
import dotenv from 'dotenv';
import * as toneDetection from './toneAnalysis';
dotenv.load();

//watson credentials
const assistant = new ConversationV1({
  username:process.env.WATSON_USERNAME,
  password:process.env.WATSON_PASSWORD,
  url:process.env.WATSON_ENDPOINT,
  version:process.env.WATSON_DATE
});

export async function message(msg, res, context){
  toneDetection.checkTone(msg).then(tone =>{
    context.context.tone = tone;
    assistant.message({
      input:{text:msg},
      workspace_id:process.env.WATSON_WORKSPACE_ID,
      context:context
    },(err, response) => {
      if (err) {
        res.send(err);
      }else {
        console.log(response);
        res.send(response);
      }
    });
  });
}
