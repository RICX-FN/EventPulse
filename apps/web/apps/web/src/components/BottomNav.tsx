import React from 'react';
import { Calendar, Ticket, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'events' | 'tickets' | 'profile';
  setActiveTab: (tab: 'events' | 'tickets' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 sm:hidden shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'events' ? 'text-indigo-600 font-semibold' : 'text-slate-400'
          }`}
        >
          <Calendar size={20} />
          <span className="text-[10px]">Eventos</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'tickets' ? 'text-indigo-600 font-semibold' : 'text-slate-400'
          }`}
        >
          <Ticket size={20} />
          <span className="text-[10px]">Bilhetes</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'profile' ? 'text-indigo-600 font-semibold' : 'text-slate-400'
          }`}
        >
          <User size={20} />
          <span className="text-[10px]">Perfil</span>
        </button>
      </div>
    </nav>
  );
};