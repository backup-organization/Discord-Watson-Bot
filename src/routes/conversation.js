import ConversationV1 from 'watson-developer-cloud/conversation/v1';
import { checkTone } from './toneAnalysis';
import {naturalAnalysis} from './naturalLanguage';
import dotenv from 'dotenv';
dotenv.load();

//watson credentials
const assistant = new ConversationV1({
  username:process.env.WATSON_USERNAME,
  password:process.env.WATSON_PASSWORD,
  url:process.env.WATSON_ENDPOINT,
  version:process.env.WATSON_DATE
});

export function message(msg, res, context){
  assistant.message({
    input:{text:msg},
    workspace_id:process.env.WATSON_WORKSPACE_ID,
    context:context
  },(err, response) => {
    if (err) {
      res.send(err);
    }else {
      checkTone(msg, res);
      naturalAnalysis(msg);
      res.send(response);
    }
  });
}
