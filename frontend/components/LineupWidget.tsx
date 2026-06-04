"use client";

import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface Player {
  name: string;
  number: number;
}

interface TeamLineup {
  formation: string;
  goalkeeper: Player[];
  defenders: Player[];
  midfielders: Player[];
  forwards: Player[];
}

interface LineupWidgetProps {
  lineups: {
    home: TeamLineup;
    away: TeamLineup;
  };
  homeTeam: string;
  awayTeam: string;
}

export default function LineupWidget({ lineups, homeTeam, awayTeam }: LineupWidgetProps) {
  // Estado para controlar qué equipo estamos viendo en la cancha
  const [activeTab, setActiveTab] = useState<'home' | 'away'>('home');
  
  const currentTeam = activeTab === 'home' ? homeTeam : awayTeam;
  const currentLineup = activeTab === 'home' ? lineups.home : lineups.away;

  // Renderizador de una línea de jugadores (Defensas, Medios, etc.)
  const renderRow = (players: Player[]) => (
    <div className="flex justify-around w-full my-4">
      {players.map((player) => (
        <div key={player.number} className="flex flex-col items-center animate-fade-in">
          {/* Círculo de la camiseta */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 ${
            activeTab === 'home' 
              ? 'bg-blue-600 text-white border-sky-300' 
              : 'bg-slate-200 text-slate-900 border-white'
          }`}>
            {player.number}
          </div>
          {/* Nombre con fondo semitransparente para que se lea bien sobre el verde */}
          <span className="text-xs bg-slate-950/80 px-2 py-0.5 rounded mt-1 font-medium text-center max-w-[90px] truncate">
            {player.name}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-800 mt-8">
      {/* Encabezado e Interruptor de Equipos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-blue-400" />
          Alineaciones Tácticas
        </h2>
        
        {/* Selectores de pestaña */}
        <div className="bg-slate-800 p-1 rounded-xl flex border border-slate-700 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'home' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {homeTeam} ({lineups.home.formation})
          </button>
          <button 
            onClick={() => setActiveTab('away')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'away' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {awayTeam} ({lineups.away.formation})
          </button>
        </div>
      </div>

      {/* --- LA CANCHA DE FÚTBOL --- */}
      <div className="relative w-full max-w-lg mx-auto aspect-[3/4] bg-gradient-to-b from-emerald-800 to-green-800 rounded-xl overflow-hidden border-4 border-slate-700 p-4 flex flex-col justify-between shadow-2xl">
        
        {/* Líneas reglamentarias dibujadas con CSS absoluto */}
        <div className="absolute inset-0 border border-white/20 pointer-events-none m-2 rounded-lg" /> {/* Borde interno */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-x border-white/20 pointer-events-none" /> {/* Área grande norte */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-x border-white/20 pointer-events-none" /> {/* Área grande sur */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 pointer-events-none" /> {/* Línea de mitad de cancha */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full pointer-events-none" /> {/* Círculo central */}

        {/* DISTRIBUCIÓN DE FILAS DE JUGADORES */}
        {/* Delanteros */}
        {renderRow(currentLineup.forwards)}

        {/* Mediocampistas */}
        {renderRow(currentLineup.midfielders)}

        {/* Defensores */}
        {renderRow(currentLineup.defenders)}

        {/* Arquero */}
        {renderRow(currentLineup.goalkeeper)}
      </div>
    </div>
  );
}