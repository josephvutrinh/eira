import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ currentPage = 'dashboard' }) {
  const navigate = useNavigate();

  const NavItem = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 py-4 px-6 transition-all rounded-xl"
      style={{
        backgroundColor: isActive ? '#FEF8FF' : 'transparent'
      }}
    >
      <span className="text-3xl">{icon}</span>
      <span 
        className="text-sm font-medium"
        style={{ 
          color: isActive ? '#4178E1' : '#A0C4E8',
        }}
      >
        {label}
      </span>
    </button>
  );

  return (
    <nav 
      className="fixed left-0 top-0 bottom-0 py-8 px-4 border-r flex flex-col"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: '#F9D5D7',
        width: '140px'
      }}
    >
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold" style={{ color: '#4178E1' }}>eira</h1>
      </div>
      
      <div className="flex flex-col gap-2">
        <NavItem 
          icon="🏠" 
          label="Dashboard" 
          isActive={currentPage === 'dashboard'}
          onClick={() => navigate('/dashboard')}
        />
        <NavItem 
          icon="💬" 
          label="Chat" 
          isActive={currentPage === 'chat'}
          onClick={() => console.log('Navigate to chat')}
        />
        <NavItem 
          icon="➕" 
          label="Log" 
          isActive={currentPage === 'log'}
          onClick={() => navigate('/log')}
        />
        <NavItem 
          icon="👤" 
          label="Profile" 
          isActive={currentPage === 'profile'}
          onClick={() => console.log('Navigate to profile')}
        />
      </div>
    </nav>
  );
}
