import React from 'react';
import { MapPin, Award } from 'lucide-react';

export default function PatrolDispatch(props) {
  const { patrols = [], handleDispatch } = props;
  
  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {patrols.map((patrol, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-72 bg-slate-900/60 border border-slate-800">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading text-lg font-bold text-white">{patrol.name || 'Officer'}</h4>
                    <span className="text-[11px] text-slate-400">Vehicle ID: {patrol.vehicleId || 'N/A'}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase py-0.5 px-2.5 rounded-full ${
                    patrol.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {patrol.status || 'Available'}
                  </span>
                </div>
                
                {/* Officer metrics */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-b border-slate-800/80 pb-3 mb-3 text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">HANDLED</span>
                    <strong className="text-xs text-white">{patrol.casesHandled || 0} cases</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">RESPONSE</span>
                    <strong className="text-xs text-white">{patrol.responseTime || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">CLEARED</span>
                    <strong className="text-xs text-green-400">{patrol.cleared || 0}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span>Distance: {patrol.distance || '0.0 km'} away from current active hotspot</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {patrol.status === 'Available' ? (
                  <button 
                    onClick={() => handleDispatch && handleDispatch(patrol.name, 'dispatch')}
                    className="w-full btn bg-cyan-500 text-slate-900 font-bold rounded-lg py-2.5 text-xs hover:bg-cyan-400 transition-colors"
                  >
                    Dispatch Patrol Unit
                  </button>
                ) : (
                  <button 
                    onClick={() => handleDispatch && handleDispatch(patrol.name, 'recall')}
                    className="w-full btn bg-slate-800 text-slate-300 font-bold rounded-lg py-2.5 text-xs border border-slate-700 hover:border-rose-500 hover:text-rose-500 transition-colors"
                  >
                    Recall Unit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 🏆 Officer Leaderboard */}
        <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" /> Officer Performance Leaderboard
              </h3>
              <p className="text-xs text-slate-400 mt-1">Gamified ranking based on cases handled, response time, and clearance rate.</p>
            </div>
            <span className="text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black px-2.5 py-1 rounded uppercase tracking-wider">SEASON 2026</span>
          </div>
          <div className="space-y-3">
            {[...patrols]
              .sort((a, b) => (b.points || 0) - (a.points || 0))
              .map((p, rank) => {
                const name = p.name || 'Officer';
                const badge = p.badge || 'Active';
                const stars = p.stars || 0;
                const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
                
                return (
                  <div key={name} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    rank === 0 ? 'bg-amber-500/5 border-amber-500/20' :
                    rank === 1 ? 'bg-slate-400/5 border-slate-400/20' :
                    rank === 2 ? 'bg-orange-500/5 border-orange-500/20' :
                    'bg-slate-900/40 border-slate-800/60'
                  }`}>
                    {/* Rank badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-sm flex-shrink-0 ${
                      rank === 0 ? 'bg-amber-500 text-slate-900' :
                      rank === 1 ? 'bg-slate-400 text-slate-900' :
                      rank === 2 ? 'bg-orange-600 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>{rank + 1}</div>
                    
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-xs flex-shrink-0">
                      {initials}
                    </div>
                    
                    {/* Name & badge */}
                    <div className="flex-grow">
                      <div className="font-bold text-white text-sm">{name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          badge === 'Elite'  ? 'bg-amber-500/20 text-amber-400' :
                          badge === 'Expert' ? 'bg-purple-500/20 text-purple-400' :
                          badge === 'Senior' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>{badge}</span>
                        <span className="text-[10px] text-amber-400">
                          {'★'.repeat(stars)}{'☆'.repeat(Math.max(0, 5 - stars))}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Handled</div>
                      <div className="font-bold text-white text-sm">{p.casesHandled || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Response</div>
                      <div className="font-bold text-cyan-400 text-sm">{p.responseTime || 'N/A'}</div>
                    </div>
                    <div className="text-center min-w-[70px]">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Points</div>
                      <div className={`font-heading font-black text-lg ${
                        rank === 0 ? 'text-amber-400' : rank === 1 ? 'text-slate-300' : rank === 2 ? 'text-orange-400' : 'text-slate-400'
                      }`}>{p.points ? p.points.toLocaleString() : 0}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
