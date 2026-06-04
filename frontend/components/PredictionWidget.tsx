"use client";

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap, Target, Activity } from 'lucide-react';

// Tipamos las props basándonos en el JSON que diseñamos en FastAPI
interface PredictionProps {
  data: {
    probabilities: { home_win: number; draw: number; away_win: number };
    most_likely_scores: string[];
    expected_goals: { home_xG: number; away_xG: number };
    key_factors: string[];
    radar_metrics: { home: number[]; away: number[] };
  };
  homeTeam: string;
  awayTeam: string;
}

export default function PredictionWidget({ data, homeTeam, awayTeam }: PredictionProps) {
  // 1. Preparamos los datos para el gráfico de Radar de Recharts
  const radarData = [
    { subject: 'Histórico (Elo)', A: data.radar_metrics.home[0], B: data.radar_metrics.away[0], fullMark: 100 },
    { subject: 'Ataque (xG)', A: data.radar_metrics.home[1], B: data.radar_metrics.away[1], fullMark: 100 },
    { subject: 'Físico', A: data.radar_metrics.home[2], B: data.radar_metrics.away[2], fullMark: 100 },
    { subject: 'Táctica', A: data.radar_metrics.home[3], B: data.radar_metrics.away[3], fullMark: 100 },
    { subject: 'Defensa', A: data.radar_metrics.home[4], B: data.radar_metrics.away[4], fullMark: 100 },
  ];

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Zap className="text-yellow-400" />
        IA Predictor Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* COLUMNA IZQUIERDA: Probabilidades y Goles */}
        <div className="space-y-6">
          {/* Barras de Probabilidad (Hechas puramente con Tailwind) */}
          <div>
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-3">Probabilidad de Victoria</h3>
            <div className="flex h-8 rounded-full overflow-hidden text-xs font-bold text-center border border-slate-700">
              <div style={{ width: `${data.probabilities.home_win * 100}%` }} className="bg-blue-500 flex items-center justify-center">
                {homeTeam} {(data.probabilities.home_win * 100).toFixed(0)}%
              </div>
              <div style={{ width: `${data.probabilities.draw * 100}%` }} className="bg-slate-500 flex items-center justify-center">
                EMPATE {(data.probabilities.draw * 100).toFixed(0)}%
              </div>
              <div style={{ width: `${data.probabilities.away_win * 100}%` }} className="bg-red-500 flex items-center justify-center">
                {awayTeam} {(data.probabilities.away_win * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Marcadores Exactos */}
          <div>
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target size={16} /> Resultados Más Probables
            </h3>
            <div className="flex gap-3">
              {data.most_likely_scores.map((score, index) => (
                <div key={index} className="bg-slate-800 px-4 py-2 rounded-lg font-mono text-xl border border-slate-700">
                  {score}
                </div>
              ))}
            </div>
          </div>

          {/* Factores Clave */}
          <div>
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity size={16} /> Factores Clave (Motor Lógico)
            </h3>
            <ul className="space-y-2">
              {data.key_factors.map((factor, index) => (
                <li key={index} className="text-sm bg-slate-800/50 p-3 rounded border-l-4 border-blue-500">
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUMNA DERECHA: Gráfico de Radar */}
        <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-700">
          <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Comparativa de Fuerzas</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={homeTeam} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name={awayTeam} dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-sm font-bold">
            <span className="text-blue-500">● {homeTeam}</span>
            <span className="text-red-500">● {awayTeam}</span>
          </div>
        </div>
      </div>
    </div>
  );
}