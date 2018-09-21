import PersonalityInsightsV3 from 'watson-developer-cloud/personality-insights/v3';
import dotenv from 'dotenv';
dotenv.load();

const personalityInsights = new PersonalityInsightsV3({
  username:process.env.PERSONALITY_USERNAME,
  password:process.env.PERSONALITY_PASSWORD,
  url:process.env.PERSONALITY_URL,
  version:process.env.WATSON_DATE
});

export function personality(req){
  const profileParams ={
    content:req,
    content_type:'application/json',
    consumption_preferences:true,
    raw_scores:true
  };
  personalityInsights.profile(profileParams, (error, profile) => {
    if (error) {
      console.log(error);
    }else {
      console.log(profile);
    }
  });
}
