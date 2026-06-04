import React from 'react';
import { Trophy } from 'lucide-react';

export default function BracketWidget({ knockouts }: { knockouts: any[] }) {
  if (!knockouts || knockouts.length === 0) return null;

  // Definimos el orden cronológico y estructural de las columnas del cuadro
  const roundsOrder = [
    "Octavos de Final",
    "Cuartos de Final",
    "Semifinales",
    "Gran Final"
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mt-8">
      <div className="flex items-center justify-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <Trophy className="text-yellow-400 w-8 h-8" />
        <h3 className="text-white font-black text-2xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
          Cuadro de Fase Eliminatoria
        </h3>
      </div>

      {/* Contenedor con scroll horizontal para que el cuadro no se aplaste en pantallas chicas */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex flex-row gap-8 justify-between items-stretch py-4 min-w-[1100px]">
          
          {roundsOrder.map((roundName) => {
            const matchesInRound = knockouts.filter(m => m.round === roundName);

            return (
              <div key={roundName} className="flex-1 flex flex-col min-w-[240px]">
                {/* Cabecera de la columna */}
                <h4 className="text-center text-slate-400 font-mono text-xs font-bold uppercase tracking-wider mb-6 bg-slate-950/60 py-2 border border-slate-800/80 rounded-lg">
                  {roundName}
                </h4>
                
                {/* JUSTIFY-AROUND: El secreto mágico que alinea los cruces simétricamente en árbol */}
                <div className="flex-1 flex flex-col justify-around gap-6 min-h-[480px] relative">
                  {matchesInRound.length > 0 ? (
                    matchesInRound.map((match) => {
                      const isFinished = match.status === 'finished';
                      const homeWon = isFinished && Number(match.home_score) > Number(match.away_score);
                      const awayWon = isFinished && Number(match.away_score) > Number(match.home_score);

                      return (
                        <div 
                          key={match.id} 
                          className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-center relative group hover:border-yellow-500/40 transition-all shadow-2xl backdrop-blur-sm"
                        >
                          {/* Horario del partido */}
                          <div className="text-[10px] text-slate-500 font-mono mb-2 text-center border-b border-slate-900 pb-1">
                            {match.date}
                          </div>
                          
                          {/* Fila Equipo Local */}
                          <div className="flex justify-between items-center py-1">
                            <span className={`text-xs font-semibold truncate flex-1 ${homeWon ? 'text-yellow-400 font-black' : 'text-slate-300'}`}>
                              {match.home_team}
                            </span>
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ml-2 ${homeWon ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-slate-900 text-slate-500'}`}>
                              {isFinished ? match.home_score : '-'}
                            </span>
                          </div>

                          {/* Fila Equipo Visitante */}
                          <div className="flex justify-between items-center py-1 mt-1">
                            <span className={`text-xs font-semibold truncate flex-1 ${awayWon ? 'text-yellow-400 font-black' : 'text-slate-300'}`}>
                              {match.away_team}
                            </span>
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ml-2 ${awayWon ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-slate-900 text-slate-500'}`}>
                              {isFinished ? match.away_score : '-'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="border border-dashed border-slate-800/40 bg-slate-950/20 text-slate-600 text-xs rounded-xl p-4 text-center font-medium my-auto py-8">
                      Cruces por definir
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}