import NaturalLanguage from 'watson-developer-cloud/natural-language-understanding/v1';
import dotenv from 'dotenv';
dotenv.load();

const naturalLanguage = new NaturalLanguage({
  username:process.env.LANGUAGE_USERNAME,
  password:process.env.LANGUAGE_PASSWORD,
  version:process.env.WATSON_DATE,
  url:'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

export function naturalAnalysis(params){
  naturalLanguage.analyze({
    text:params,
    features: {
      entities: {
        emotion: true,
        sentiment: true,
      },
      keywords: {
        emotion: true,
        sentiment: true,
      }}}, (err, response) => {
    if (err) {
      console.log(err);
    }else {
      console.log(JSON.stringify(response, null, 2));
    }
  });
}
