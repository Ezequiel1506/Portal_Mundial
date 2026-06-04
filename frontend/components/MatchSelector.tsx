"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Cpu } from 'lucide-react';

interface MatchSimple {
  id: string;
  home_team: string;
  away_team: string;
}

export default function MatchSelector({ matches }: { matches: MatchSimple[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Leemos si hay un partido seleccionado en la URL, si no, tomamos el primero
  const currentMatchId = searchParams.get('matchId') || matches[0]?.id;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMatchId = e.target.value;
    // Esto inyecta el ID en la URL de forma invisible y fuerza al backend a recalcular
    router.push(`/?matchId=${newMatchId}`, { scroll: false });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
      <div className="flex items-center gap-3">
        <Cpu className="text-emerald-400 w-8 h-8 animate-pulse" />
        <div>
          <h3 className="text-white font-bold text-lg">Simulador Inteligente</h3>
          <p className="text-slate-400 text-sm">Elegí un partido del fixture para correr la simulación</p>
        </div>
      </div>

      <select
        value={currentMatchId}
        onChange={handleSelect}
        className="bg-slate-950 text-white font-bold border border-slate-700 px-4 py-3 rounded-xl outline-none focus:border-blue-500 w-full sm:w-auto min-w-[300px] cursor-pointer hover:bg-slate-800 transition-colors"
      >
        {matches.map((match) => (
          <option key={match.id} value={match.id}>
            {match.home_team} VS {match.away_team}
          </option>
        ))}
      </select>
    </div>
  );
}