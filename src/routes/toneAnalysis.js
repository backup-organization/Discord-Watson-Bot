import ToneAnalyzerV3 from 'watson-developer-cloud/tone-analyzer/v3';
import dotenv from 'dotenv';
dotenv.load();

const toneAnalyzer = new ToneAnalyzerV3({
  username:process.env.ANALYZER_USERNAME,
  password:process.env.ANALYZER_PASSWORD,
  url:process.env.ANALYZER_URL,
  version:process.env.WATSON_DATE
});

export function checkTone(req){
  return new Promise((resolve, reject) => {
    toneAnalyzer.tone({
      tone_input:{text:req},
      content_type:'application/json'
    },
    (error, toneAnalysis) => {
      if (error) {
        reject(error);
      }else {
        const resp = toneAnalysis.document_tone.tones;
        resolve(resp);  
      }
    });
  });
  // const utterances=[];
  // toneAnalyzer.toneChat({
  //   utterances:utterances,
  //   content_type:'application/json'
  // },
  // (error, utteranceAnalysis) => {
  //   if (error) {
  //     console.log(error);
  //   }else {
  //     for (var i = 0; i < utterances.length; i++) {
  //       const resp2 = utteranceAnalysis.utterances_tone[i];
  //       console.log(resp2);
  //     }}
  // });
}
