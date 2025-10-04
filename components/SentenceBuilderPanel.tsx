
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DATA } from '../constants';
import { score10, conjVerb, routineToText, timeToWords } from '../utils/helpers';
import type { Unit, ToastState } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { IconButton, ScoreBar, Toast, Chip } from './common';

interface SentenceBuilderPanelProps {
  unit: Unit;
  voiceName: string;
  rate: number;
}

const SpeakerIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 9v6h4l5 4V5L9 9H5z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <path d="M16.5 8.5a4 4 0 010 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
);

const MicIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string}> = ({label, children, ...props}) => (
    <div>
        <label className="text-sm font-medium text-slate-600 block mb-1.5">{label}</label>
        <select className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" {...props}>
            {children}
        </select>
    </div>
)

const CountryBuilder: React.FC<{onSentenceChange: (s:string, q:string) => void}> = ({onSentenceChange}) => {
    const [subj, setSubj] = useState('I');
    const [country, setCountry] = useState(DATA.countries[0]);

    useEffect(() => {
        const be = {'I':"I'm", 'He':"He's", 'She':"She's", 'We':"We're", 'They':"They're"}[subj] || "They're";
        const sentence = `${be} from ${country}.`;
        const question = (subj === 'I') ? "Where are you from?" : `Where is ${subj.toLowerCase()} from?`;
        onSentenceChange(sentence, question);
    }, [subj, country, onSentenceChange]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Subject" value={subj} onChange={e => setSubj(e.target.value)}>
                <option>I</option><option>He</option><option>She</option><option>We</option><option>They</option>
            </Select>
            <Select label="Country" value={country} onChange={e => setCountry(e.target.value)}>
                {DATA.countries.map(c=><option key={c}>{c}</option>)}
            </Select>
        </div>
    );
};

const RoutineBuilder: React.FC<{onSentenceChange: (s:string, q:string) => void}> = ({onSentenceChange}) => {
    const [subj, setSubj] = useState('I');
    const [verb, setVerb] = useState(DATA.routines[0]);
    const [hour, setHour] = useState('7');
    const [min, setMin] = useState('0');
    const [ampm, setAmPm] = useState('AM');

    useEffect(() => {
        const verbText = routineToText(verb, subj);
        const timeText = timeToWords(hour, min, ampm);
        const sentence = `${subj} ${verbText} at ${timeText}.`;
        onSentenceChange(sentence, "What time do you get up?");
    }, [subj, verb, hour, min, ampm, onSentenceChange]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select label="Subject" value={subj} onChange={e => setSubj(e.target.value)}><option>I</option><option>He</option><option>She</option><option>We</option><option>They</option></Select>
            <Select label="Activity" value={verb} onChange={e => setVerb(e.target.value)}>{DATA.routines.map(v=><option key={v}>{v}</option>)}</Select>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Time</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={hour} onChange={e=>setHour(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">{[...Array(12)].map((_,i)=><option key={i+1}>{i+1}</option>)}</select>
                <select value={min} onChange={e=>setMin(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"><option>0</option><option>30</option><option>45</option></select>
                <select value={ampm} onChange={e=>setAmPm(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"><option>AM</option><option>PM</option></select>
              </div>
            </div>
        </div>
    )
}

// Add other builders similarly...
const WeekBuilder: React.FC<{onSentenceChange: (s:string, q:string) => void}> = ({onSentenceChange}) => {
    const [subj, setSubj] = useState('I');
    const [day, setDay] = useState(DATA.days[0]);
    const [activity, setActivity] = useState('study at school');
    
    useEffect(() => {
        const mainVerb = activity.split(' ')[0];
        const restOfActivity = activity.substring(mainVerb.length).trim();
        const conjugated = conjVerb(mainVerb, subj);
        const sentence = `On ${day}, ${subj} ${conjugated} ${restOfActivity}.`;
        onSentenceChange(sentence, `What do you do on ${day}?`);
    }, [subj, day, activity, onSentenceChange]);

    return (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select label="Subject" value={subj} onChange={e => setSubj(e.target.value)}><option>I</option><option>He</option><option>She</option><option>We</option><option>They</option></Select>
            <Select label="Day" value={day} onChange={e => setDay(e.target.value)}>{DATA.days.map(d => <option key={d}>{d}</option>)}</Select>
            <Select label="Activity" value={activity} onChange={e => setActivity(e.target.value)}>
                <option>study at school</option><option>do housework</option><option>listen to music</option><option>stay at home</option>
            </Select>
        </div>
    )
};

const PartyBuilder: React.FC<{onSentenceChange: (s:string, q:string) => void}> = ({onSentenceChange}) => {
    const [type, setType] = useState<'eat'|'drink'>('eat');
    const [item, setItem] = useState(DATA.partyEat[0]);
    
    useEffect(() => {
        const currentList = type === 'eat' ? DATA.partyEat : DATA.partyDrink;
        if (!currentList.includes(item)) {
            setItem(currentList[0]);
        }
    }, [type, item]);

    useEffect(() => {
        const sentence = `I want some ${item}.`;
        const question = type === 'eat' ? 'What do you want to eat?' : 'What do you want to drink?';
        onSentenceChange(sentence, question);
    }, [item, type, onSentenceChange]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Type" value={type} onChange={e => setType(e.target.value as 'eat'|'drink')}><option value="eat">eat</option><option value="drink">drink</option></Select>
            <Select label="Item" value={item} onChange={e => setItem(e.target.value)}>
                {(type === 'eat' ? DATA.partyEat : DATA.partyDrink).map(i => <option key={i}>{i}</option>)}
            </Select>
        </div>
    );
};

const AbilityBuilder: React.FC<{onSentenceChange: (s:string, q:string) => void}> = ({onSentenceChange}) => {
    const [subj, setSubj] = useState('I');
    const [ans, setAns] = useState('Yes');
    const [ability1, setAbility1] = useState(DATA.abilities[0]);
    const [ability2, setAbility2] = useState('');

    useEffect(() => {
        const pron = subj === 'I' ? 'I' : subj.toLowerCase();
        let sentence = '';
        if (ans === 'Yes') {
            sentence = `Yes, ${pron} can.`;
        } else {
            sentence = `No, ${pron} can’t` + (ability2 ? `, but ${pron} can ${ability2}.` : '.');
        }
        const question = `Can ${subj === 'I' ? 'you' : pron} ${ability1}?`;
        onSentenceChange(sentence, question);
    }, [subj, ans, ability1, ability2, onSentenceChange]);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Subject" value={subj} onChange={e => setSubj(e.target.value)}><option>I</option><option>He</option><option>She</option></Select>
                <Select label="Answer" value={ans} onChange={e => setAns(e.target.value)}><option>Yes</option><option>No</option></Select>
                <Select label="Action" value={ability1} onChange={e => setAbility1(e.target.value)}>{DATA.abilities.map(a => <option key={a}>{a}</option>)}</Select>
            </div>
            <Select label="If 'No', add another ability (optional)" value={ability2} onChange={e => setAbility2(e.target.value)} disabled={ans==='Yes'}>
                <option value="">(none)</option>
                {DATA.abilities.filter(a => a !== ability1).map(a => <option key={a}>{a}</option>)}
            </Select>
        </div>
    );
};


export const SentenceBuilderPanel: React.FC<SentenceBuilderPanelProps> = ({ unit, voiceName, rate }) => {
  const [builtSentence, setBuiltSentence] = useState('—');
  const [questionHint, setQuestionHint] = useState('—');
  const [heardSentence, setHeardSentence] = useState('—');
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'ok', visible: false });
  const { isListening, speak, startListening, stopListening, playApplause, playBeepError } = useSpeech();

  useEffect(() => {
    setHeardSentence('—');
    setScore(0);
    setToast(t => ({...t, visible: false}));
  }, [unit]);
  
  const handleSentenceChange = useCallback((sentence: string, question: string) => {
    setBuiltSentence(sentence);
    setQuestionHint(question);
  }, []);
  
  const BuilderComponent = useMemo(() => {
    switch(unit.builderType) {
        case 'country': return CountryBuilder;
        case 'routine': return RoutineBuilder;
        case 'week': return WeekBuilder;
        case 'party': return PartyBuilder;
        case 'ability': return AbilityBuilder;
        default: return () => <div>Builder not found</div>;
    }
  }, [unit.builderType]);

  const showToast = useCallback((message: string, type: ToastState['type']) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(t => ({...t, visible: false})), 3500);
  }, []);

  const handleScore = useCallback((s: number) => {
    setScore(s);
    if (s >= 9) {
      playApplause();
      speak('Excellent!');
      showToast('👏 Excellent! The sentence is perfect.', 'ok');
    } else if (s >= 7) {
      showToast('👍 Good job! Pay attention to intonation.', 'ok');
    } else if (s >= 5) {
      playBeepError();
      showToast('🟠 You can do better. Pronounce each word clearly.', 'warn');
    } else {
      playBeepError();
      showToast('❌ Not quite right. Listen to the sample and try again.', 'bad');
    }
  }, [playApplause, playBeepError, showToast, speak]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setHeardSentence('(listening...)');
      startListening(
        'en-US',
        (transcript) => {
          setHeardSentence(transcript);
          const newScore = score10(builtSentence, transcript);
          handleScore(newScore);
        },
        () => {
          setHeardSentence('—');
          showToast('Could not hear you. Please try again.', 'bad');
        }
      );
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4">
      <div>
        <BuilderComponent onSentenceChange={handleSentenceChange} />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-2">
        <div className="flex-grow">
          <div className="text-sm text-slate-500 mb-1">Your sentence:</div>
          <div className="bg-blue-50 border border-blue-200 text-slate-800 rounded-xl p-3 min-h-[52px] font-bold text-xl" aria-live="polite">
            {builtSentence}
          </div>
          <div className="text-xs text-slate-400 mt-1">Practice question: <span className="text-slate-500 italic">{questionHint}</span></div>
        </div>
        <div className="flex gap-2.5 self-start sm:self-end">
          <IconButton aria-label="Listen to sentence" onClick={() => speak(builtSentence, voiceName, rate)}>
            <SpeakerIcon />
          </IconButton>
          <IconButton aria-label="Record your sentence" onClick={handleMicClick} isPressed={isListening}>
            <MicIcon />
          </IconButton>
        </div>
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500 mb-1">You said:</div>
            <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-3 text-slate-700 min-h-[44px]" aria-live="polite">{heardSentence}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm text-slate-500">Pronunciation Score</div>
              <div className="font-bold text-slate-800">{score}/10</div>
            </div>
            <ScoreBar score={score} />
          </div>
      </div>
      <Toast toast={toast} />
    </section>
  );
};
