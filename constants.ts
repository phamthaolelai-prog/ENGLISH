
import type { Data } from './types';

export const DATA: Data = {
  units: {
    1: {
      name: "UNIT 1 • MY FRIENDS",
      vocab: ["America","Australia","Britain","Viet Nam","Japan","Thailand","Malaysia","Singapore"],
      topicChips:["countries","friends","where from?"],
      qs: [
        "Where are you from?",
        "Where is he from?",
        "Where is she from?"
      ],
      builderType: "country"
    },
    2: {
      name: "UNIT 2 • TIME AND DAILY ROUTINES",
      vocab: ["o’clock","thirty","forty-five","time","get up","have breakfast","go to school","go to bed","do homework","wash face","clean the teeth"],
      topicChips:["time","daily routines"],
      qs: ["What time do you get up?"],
      builderType: "routine"
    },
    3: {
      name: "UNIT 3 • MY WEEK",
      vocab: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","today","study at school","do housework","listen to music","stay at home"],
      topicChips:["days","activities"],
      qs: ["What day is it today?","What do you do on Monday?"],
      builderType: "week"
    },
    4: {
      name: "UNIT 4 • MY BIRTHDAY PARTY",
      vocab: ["chips","grapes","jam","juice"],
      topicChips:["food","drinks","party"],
      qs: ["What do you want to eat?","What do you want to drink?"],
      builderType: "party"
    },
    5: {
      name: "UNIT 5 • THINGS WE CAN DO",
      vocab: ["ride a bike","ride a horse","play the piano","play the guitar","roller skate"],
      topicChips:["can/can’t","skills"],
      qs: ["Can you ride a bike?","Can he ride a bike?"],
      builderType: "ability"
    }
  },
  days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
  countries:["America","Australia","Britain","Viet Nam","Japan","Thailand","Malaysia","Singapore"],
  routines:["get up","have breakfast","go to school","go to bed","do homework","wash face","clean the teeth"],
  partyEat:["chips","grapes","jam"],
  partyDrink:["juice"],
  abilities:["ride a bike","ride a horse","play the piano","play the guitar","roller skate"]
};
