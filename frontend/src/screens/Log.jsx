import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const SymptomRow = ({ icon, label, value, onChange, showInput = false }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: '#FEF8FF' }}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-base font-medium" style={{ color: '#000000' }}>{label}</span>
      </div>
      {showInput ? (
        <input
          type="text"
          placeholder="Describe your mood"
          className="px-4 py-2 rounded-lg border text-sm"
          style={{ borderColor: '#F9D5D7', backgroundColor: '#FFFFFF', color: '#000000', width: '180px' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => onChange(level)}
              className="w-8 h-8 rounded-full transition-all"
              style={{
                backgroundColor: value >= level ? '#F9A1A1' : '#FEF8FF',
                border: `2px solid ${value >= level ? '#F9A1A1' : '#F9D5D7'}`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Log() {
  const [symptoms, setSymptoms] = useState({
    stress: 0,
    mood: '',
    energy: 0,
    sleep: 0,
    anxiety: 0,
    bloating: 0,
    dryness: 0,
    hotFlashes: 0,
  });
  const [notes, setNotes] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const updateSymptom = (key, value) => {
    setSymptoms({ ...symptoms, [key]: value });
  };

  const handleSave = () => {
    console.log('Saving log:', { symptoms, notes, customSymptom });
    // TODO: Implement save functionality
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', fontFamily: '"Source Serif Pro", serif', marginLeft: '140px' }}>
      {/* Header */}
      <div className="py-6 px-6" style={{ backgroundColor: '#F9D5D7' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>Log</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: '#F9D5D7' }}>
          <button className="text-xl">&larr;</button>
          <h2 className="text-lg font-semibold" style={{ color: '#000000' }}>Today</h2>
          <button className="text-xl">✎️</button>
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2" style={{ color: '#000000' }}>Notes</h3>
          <textarea
            placeholder="Anything else you'd like to note about today?"
            className="w-full px-4 py-3 rounded-lg border text-sm resize-none"
            style={{ 
              borderColor: '#F9D5D7', 
              backgroundColor: '#FEF8FF',
              color: '#000000',
              minHeight: '80px'
            }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Symptoms */}
        <div className="space-y-1">
          <SymptomRow 
            icon="🤯" 
            label="Stress" 
            value={symptoms.stress}
            onChange={(val) => updateSymptom('stress', val)}
          />
          <SymptomRow 
            icon="😊" 
            label="Mood" 
            value={symptoms.mood}
            onChange={(val) => updateSymptom('mood', val)}
            showInput
          />
          <SymptomRow 
            icon="☀️" 
            label="Energy Level" 
            value={symptoms.energy}
            onChange={(val) => updateSymptom('energy', val)}
          />
          <SymptomRow 
            icon="😴" 
            label="Sleep Quality" 
            value={symptoms.sleep}
            onChange={(val) => updateSymptom('sleep', val)}
          />
          <SymptomRow 
            icon="😰" 
            label="Anxiety" 
            value={symptoms.anxiety}
            onChange={(val) => updateSymptom('anxiety', val)}
          />
          <SymptomRow 
            icon="🎈" 
            label="Bloating" 
            value={symptoms.bloating}
            onChange={(val) => updateSymptom('bloating', val)}
          />
          <SymptomRow 
            icon="💧" 
            label="Dryness" 
            value={symptoms.dryness}
            onChange={(val) => updateSymptom('dryness', val)}
          />
          <SymptomRow 
            icon="🔥" 
            label="Hot Flashes" 
            value={symptoms.hotFlashes}
            onChange={(val) => updateSymptom('hotFlashes', val)}
          />
        </div>

        {/* Add Custom Symptom */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: '#F9D5D7' }}>
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="text-sm font-medium"
              style={{ color: '#4178E1' }}
            >
              + Add a custom symptom
            </button>
          ) : (
            <div>
              <input
                type="text"
                placeholder="e.g. Brain Fog, Dry Skin"
                className="w-full px-4 py-3 rounded-lg border text-sm mb-3"
                style={{ 
                  borderColor: '#F9D5D7', 
                  backgroundColor: '#FEF8FF',
                  color: '#000000'
                }}
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 mb-8">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl font-semibold text-base transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#F9D5D7', color: '#000000' }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Side Navigation */}
      <Navbar currentPage="log" />
    </div>
  );
}
