import ConversationV1 from 'watson-developer-cloud/conversation/v1';

const assistant = new ConversationV1({
  username:'',
  password:'',
  url:'',
  version:'2018-08-03'
});

export function message(msg, res, context){
  assistant.message({
    input:{text:msg},
    workspace_id:'',
    context:context
  },(err, response) => {
    if (err) {
      res.send(err);
    }else {
      res.send(response);
    }
  });
}
