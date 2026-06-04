"use client";

import React from 'react';
import { Calendar, Trophy } from 'lucide-react';

interface TeamStanding {
  team: string; played: number; won: number; drawn: number; lost: number;
  gf: number; ga: number; gd: number; points: number;
}

interface MatchSimple {
  id: string; home_team: string; away_team: string;
  date: string; status: string; home_score: number | null; away_score: number | null;
}

interface GroupData {
  group_name: string;
  standings: TeamStanding[];
  matches: MatchSimple[];
}

export default function GroupsWidget({ groups }: { groups: GroupData[] }) {
  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Trophy className="text-yellow-500 w-8 h-8" />
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Fase de Grupos</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.group_name} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            
            {/* Cabecera del Grupo */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">{group.group_name}</h3>
            </div>

            {/* Tabla de Posiciones */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Equipo</th>
                    <th className="px-2 py-3 text-center font-bold text-white">PTS</th>
                    <th className="px-2 py-3 text-center">PJ</th>
                    <th className="px-2 py-3 text-center">G</th>
                    <th className="px-2 py-3 text-center">E</th>
                    <th className="px-2 py-3 text-center">P</th>
                    <th className="px-2 py-3 text-center hidden sm:table-cell">GF</th>
                    <th className="px-2 py-3 text-center hidden sm:table-cell">GC</th>
                    <th className="px-2 py-3 text-center">DIF</th>
                  </tr>
                </thead>
                <tbody>
                  {group.standings.map((team, index) => (
                    <tr key={team.team} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                        {/* Indicador visual de clasificación para los 2 primeros */}
                        <span className={`w-1.5 h-6 rounded-full ${index < 2 ? 'bg-emerald-500' : 'bg-transparent'}`}></span>
                        <span className="w-4 text-slate-500">{index + 1}</span>
                        {team.team}
                      </td>
                      <td className="px-2 py-3 text-center font-bold text-blue-400">{team.points}</td>
                      <td className="px-2 py-3 text-center text-slate-300">{team.played}</td>
                      <td className="px-2 py-3 text-center text-slate-300">{team.won}</td>
                      <td className="px-2 py-3 text-center text-slate-300">{team.drawn}</td>
                      <td className="px-2 py-3 text-center text-slate-300">{team.lost}</td>
                      <td className="px-2 py-3 text-center text-slate-400 hidden sm:table-cell">{team.gf}</td>
                      <td className="px-2 py-3 text-center text-slate-400 hidden sm:table-cell">{team.ga}</td>
                      <td className="px-2 py-3 text-center text-slate-300">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lista de Partidos del Grupo */}
            <div className="bg-slate-950/30 p-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar size={14} /> Fixture
              </h4>
              <div className="space-y-2">
                {group.matches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-lg text-sm">
                    <span className="text-slate-400 text-xs w-20">{match.date}</span>
                    
                    <div className="flex-1 flex justify-center items-center gap-4">
                      <span className="font-medium text-white text-right w-24">{match.home_team}</span>
                      
                      {match.status === 'upcoming' ? (
                        <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs font-bold">VS</span>
                      ) : (
                        <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold">
                          {match.home_score} - {match.away_score}
                        </span>
                      )}
                      
                      <span className="font-medium text-white text-left w-24">{match.away_team}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}