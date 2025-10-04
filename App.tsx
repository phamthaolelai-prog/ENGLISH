
import React, { useState, useMemo } from 'react';
import type { AppTab } from './types';
import { DATA } from './constants';
import { useSpeech } from './hooks/useSpeech';
import { VocabularyPanel } from './components/VocabularyPanel';
import { SentenceBuilderPanel } from './components/SentenceBuilderPanel';

const AppHeader: React.FC<{
  voices: SpeechSynthesisVoice[],
  selectedVoice: string,
  onVoiceChange: (v: string) => void,
  rate: number,
  onRateChange: (r: number) => void,
  unitId: number,
  onUnitChange: (id: number) => void,
  activeTab: AppTab,
  onTabChange: (tab: AppTab) => void
}> = ({voices, selectedVoice, onVoiceChange, rate, onRateChange, unitId, onUnitChange, activeTab, onTabChange}) => {
  const voiceGroups = useMemo(() => {
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const gb = enVoices.filter(v => v.lang.startsWith('en-GB'));
    const us = enVoices.filter(v => v.lang.startsWith('en-US'));
    const au = enVoices.filter(v => v.lang.startsWith('en-AU'));
    const other = enVoices.filter(v => !v.lang.startsWith('en-GB') && !v.lang.startsWith('en-US') && !v.lang.startsWith('en-AU'));
    return { gb, us, au, other };
  }, [voices]);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-violet-500 to-green-400 shadow-lg flex-shrink-0"></div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">English Lab – Grade 4</h1>
          <div className="text-xs text-slate-500">Units 1–5 • Vocabulary & Sentence Builder</div>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-3">
        {/* Unit Selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 py-2 px-3 rounded-xl">
          <label htmlFor="unitSel" className="text-sm font-medium text-slate-600">Unit:</label>
          <select id="unitSel" value={unitId} onChange={e => onUnitChange(parseInt(e.target.value))} className="bg-transparent text-sm text-slate-800 focus:outline-none">
            {Object.keys(DATA.units).map(id => <option key={id} value={id}>{id}. {DATA.units[parseInt(id)].name}</option>)}
          </select>
        </div>
        
        {/* Mode Tabs */}
        <div className="flex gap-1.5 bg-white border border-slate-200 p-1.5 rounded-xl">
          <button onClick={() => onTabChange('vocab')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'vocab' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Vocabulary</button>
          <button onClick={() => onTabChange('sentence')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'sentence' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Sentences</button>
        </div>
        
        {/* Voice Controls */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 py-2 px-3 rounded-xl">
            <label htmlFor="voiceSel" className="text-sm font-medium text-slate-600">Voice:</label>
            <select id="voiceSel" value={selectedVoice} onChange={e => onVoiceChange(e.target.value)} className="bg-transparent text-sm text-slate-800 focus:outline-none max-w-[120px]">
                {voiceGroups.us.length > 0 && <optgroup label="American">{voiceGroups.us.map(v => <option key={v.name} value={v.name}>{v.name.replace('Google US English', 'US')}</option>)}</optgroup>}
                {voiceGroups.gb.length > 0 && <optgroup label="British">{voiceGroups.gb.map(v => <option key={v.name} value={v.name}>{v.name.replace('Google UK English', 'UK')}</option>)}</optgroup>}
                {voiceGroups.au.length > 0 && <optgroup label="Australian">{voiceGroups.au.map(v => <option key={v.name} value={v.name}>{v.name.replace('Google Australian English', 'AU')}</option>)}</optgroup>}
                {voiceGroups.other.length > 0 && <optgroup label="Other">{voiceGroups.other.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}</optgroup>}
            </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 py-2 px-3 rounded-xl">
            <label htmlFor="rate" className="text-sm font-medium text-slate-600">Rate:</label>
            <input id="rate" type="number" min="0.7" max="1.4" step="0.1" value={rate} onChange={e => onRateChange(parseFloat(e.target.value))} className="w-14 bg-transparent text-sm text-slate-800 focus:outline-none"/>
        </div>
      </div>
    </header>
  );
};


function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('vocab');
  const [currentUnitId, setCurrentUnitId] = useState<number>(1);
  const { voices } = useSpeech();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1.0);

  // Set a default preferred voice when voices load
  React.useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      const preferredVoices = [
        'Google US English', 'Microsoft Zira - English (United States)', // US
        'Google UK English Female', 'Microsoft Hazel - English (United Kingdom)', // UK
        'Google UK English Male',
      ];
      const found = preferredVoices.find(name => voices.some(v => v.name === name));
      setSelectedVoice(found || voices.filter(v=>v.lang.startsWith('en'))[0]?.name || '');
    }
  }, [voices, selectedVoice]);

  const currentUnit = DATA.units[currentUnitId];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-3xl my-4 sm:my-6 shadow-2xl shadow-slate-200">
      <AppHeader 
        voices={voices}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
        rate={rate}
        onRateChange={setRate}
        unitId={currentUnitId}
        onUnitChange={setCurrentUnitId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="mt-4">
        {activeTab === 'vocab' ? 
            <VocabularyPanel unit={currentUnit} voiceName={selectedVoice} rate={rate} /> : 
            <SentenceBuilderPanel unit={currentUnit} voiceName={selectedVoice} rate={rate} />
        }
      </main>
      <footer className="text-center text-xs text-slate-400 mt-4">
        Tip: Use <strong>Google Chrome</strong> for the best microphone experience.
      </footer>
    </div>
  );
}

export default App;
