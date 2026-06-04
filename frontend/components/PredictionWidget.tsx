"use client";

import React from 'react';
import { BarChart3, Target, BrainCircuit, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export default function PredictionWidget({ data, homeTeam, awayTeam }: { data: any, homeTeam: string, awayTeam: string }) {
  if (!data) return null;

  const pHome = data.probabilities.home_win;
  const pDraw = data.probabilities.draw;
  const pAway = data.probabilities.away_win;
  const xgHome = data.expected_goals.home_xG;
  const xgAway = data.expected_goals.away_xG;

  const JUGADORES_CLAVE: Record<string, string> = {
    "Argentina": "Lionel Messi y la jerarquía de su ataque",
    "France": "Kylian Mbappé",
    "Brazil": "Vinícius Júnior",
    "England": "Jude Bellingham",
    "Portugal": "Rafael Leão",
    "Spain": "Lamine Yamal",
    "Germany": "Jamal Musiala",
    "Senegal": "Sadio Mané",
    "Uruguay": "Federico Valverde",
    "Colombia": "Luis Díaz",
    "Netherlands": "Xavi Simons",
    "Italy": "Nicolò Barella",
    "Belgium": "Kevin De Bruyne",
    "Croatia": "Luka Modrić"
  };

  const generateNarrative = () => {
    const diff = Math.abs(pHome - pAway);
    let texto = "";
    let favorite = "";

    if (diff < 0.10) {
      return `Un duelo sumamente parejo y táctico. Las métricas proyectan una paridad casi absoluta (xG de ${xgHome} vs ${xgAway}). El encuentro podría definirse por destellos individuales, errores defensivos mínimos o la eficacia en las jugadas de pelota parada.`;
    }

    if (pHome > pAway) {
      favorite = homeTeam;
      if (pHome > 0.55) {
        texto = `Jerarquía pura. ${homeTeam} llega como gran candidato para llevarse el partido con un dominio abrumador en los papeles. Se espera que impongan su ritmo y asedien el área rival, obligando a ${awayTeam} a replegarse. `;
      } else {
        texto = `Ligeramente a favor de ${homeTeam}. Aunque tienen ventaja en las métricas de poder ofensivo, ${awayTeam} no será un rival fácil y tiene herramientas suficientes para trabar el partido. `;
      }
    } else {
      favorite = awayTeam;
      if (pAway > 0.55) {
        texto = `Pese a la localía nominal, ${awayTeam} llega con una superioridad aplastante. Su volumen de juego sugerido indica que tomarán las riendas ante un ${homeTeam} que buscará sobrevivir defensivamente. `;
      } else {
        texto = `${awayTeam} llega con un leve favoritismo. Deberán imponer su ritmo frente a un ${homeTeam} que promete dar pelea, cerrar espacios y aprovechar las transiciones. `;
      }
    }

    if (JUGADORES_CLAVE[favorite]) {
      texto += `La capacidad de desequilibrio de ${JUGADORES_CLAVE[favorite]} será la llave principal para abrir el marcador y romper el cerrojo rival.`;
    } else {
      texto += `El juego colectivo y la efectividad en el último cuarto de cancha serán determinantes para inclinar la balanza.`;
    }

    return texto;
  };

  const radarData = [
    { subject: 'Histórico (Elo)', home: data.radar_metrics.home[0], away: data.radar_metrics.away[0] },
    { subject: 'Ataque (xG)', home: data.radar_metrics.home[1], away: data.radar_metrics.away[1] },
    { subject: 'Físico', home: data.radar_metrics.home[2], away: data.radar_metrics.away[2] },
    { subject: 'Táctica', home: data.radar_metrics.home[3], away: data.radar_metrics.away[3] },
    { subject: 'Defensa', home: data.radar_metrics.home[4], away: data.radar_metrics.away[4] }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mt-6">
      
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-blue-400 w-6 h-6" />
        <h3 className="text-white font-bold text-xl">IA Predictor Analysis</h3>
      </div>

      <div className="mb-8">
        <p className="text-xs text-slate-500 font-bold tracking-widest mb-3 uppercase">Probabilidad de Victoria</p>
        <div className="flex h-8 rounded-lg overflow-hidden font-bold text-xs text-white shadow-inner">
          <div style={{ width: `${(pHome * 100).toFixed(1)}%` }} className="bg-blue-500 flex items-center justify-center transition-all duration-1000">
            {pHome > 0.1 && `${homeTeam} ${(pHome * 100).toFixed(0)}%`}
          </div>
          <div style={{ width: `${(pDraw * 100).toFixed(1)}%` }} className="bg-slate-500 flex items-center justify-center transition-all duration-1000">
            {pDraw > 0.1 && `EMPATE ${(pDraw * 100).toFixed(0)}%`}
          </div>
          <div style={{ width: `${(pAway * 100).toFixed(1)}%` }} className="bg-red-500 flex items-center justify-center transition-all duration-1000">
            {pAway > 0.1 && `${awayTeam} ${(pAway * 100).toFixed(0)}%`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800/60 pt-6">
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col justify-between shadow-md">
          <p className="text-xs text-slate-500 font-bold tracking-widest mb-4 uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" /> Resultados Más Probables
          </p>
          <div className="flex gap-3">
            {data.most_likely_scores.map((score: string, i: number) => (
              <div key={i} className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl font-mono text-xl font-black text-white shadow-md text-center flex-1">
                {score}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl flex flex-col justify-between shadow-md">
          <p className="text-xs text-slate-500 font-bold tracking-widest mb-4 uppercase flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-emerald-400" /> Justificación de la IA
          </p>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {generateNarrative()}
          </p>
        </div>
      </div>

      <div className="mt-6 bg-slate-950 border border-slate-850 p-6 rounded-xl shadow-md">
        <p className="text-xs text-slate-500 font-bold tracking-widest mb-6 uppercase flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" /> Comparativa de Fuerzas
        </p>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              <Radar 
                name={homeTeam} 
                dataKey="home" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.4} 
              />
              <Radar 
                name={awayTeam} 
                dataKey="away" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.4} 
              />
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 'bold' }} 
                iconType="circle" 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}