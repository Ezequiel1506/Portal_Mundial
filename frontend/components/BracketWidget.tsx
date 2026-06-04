import React from 'react';
import { Trophy } from 'lucide-react';

export default function BracketWidget({ knockouts }: { knockouts: any[] }) {
  if (!knockouts || knockouts.length === 0) return null;

  // Agrupamos los partidos por la ronda a la que pertenecen
  const rounds = ["Octavos de Final", "Cuartos de Final", "Semifinales", "Tercer Puesto", "Gran Final"];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mt-8">
      <div className="flex items-center justify-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <Trophy className="text-yellow-400 w-8 h-8" />
        <h3 className="text-white font-black text-2xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
          Fase Eliminatoria
        </h3>
      </div>

      <div className="space-y-10">
        {rounds.map(roundName => {
          const matchesInRound = knockouts.filter(m => m.round === roundName);
          if (matchesInRound.length === 0) return null;

          return (
            <div key={roundName}>
              <h4 className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">
                — {roundName} —
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {matchesInRound.map(match => (
                  <div key={match.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-center text-center relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
                    <span className="text-[10px] text-slate-500 font-mono mb-2">{match.date}</span>
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-white truncate w-1/3 text-right">{match.home_team}</span>
                      <div className="bg-slate-800 px-3 py-1 rounded-md mx-2 text-yellow-400 font-black">
                        {match.status === 'finished' ? `${match.home_score} - ${match.away_score}` : 'VS'}
                      </div>
                      <span className="font-bold text-white truncate w-1/3 text-left">{match.away_team}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}