import React from 'react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const handleSummarize = () => {
    // TODO: Implement summarize functionality
    console.log('Summarize button pressed');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', fontFamily: '"Source Serif Pro", serif', marginLeft: '140px' }}>
      {/* Welcome Header */}
      <div className="py-16 px-8" style={{ backgroundColor: '#F9D5D7' }}>
        <h1 className="text-5xl font-bold" style={{ color: '#000000' }}>Welcome, Josephine!</h1>
      </div>

      {/* Content Section */}
      <div className="px-8 py-8">
      </div>

      {/* Content Section */}
      <div className="px-8 py-8">
        <p className="text-xl mb-8" style={{ color: '#000000' }}>Heres your weekly summary.</p>

        {/* Anxiety Chart */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#000000' }}>Anxiety</h2>
          <div 
            className="rounded-2xl p-24 flex items-center justify-center border"
            style={{ 
              backgroundColor: '#FEF8FF',
              borderColor: '#F9D5D7',
              minHeight: '320px'
            }}
          >
            <p className="text-lg" style={{ color: '#000000' }}>Not enough data</p>
          </div>
        </div>

        {/* Summarize Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleSummarize}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#A0C4E8', color: '#000000' }}
          >
            <span>✨</span>
            <span>Summarize</span>
          </button>
        </div>
      </div>

      {/* Side Navigation */}
      <Navbar currentPage="dashboard" />
    </div>
  );
}
