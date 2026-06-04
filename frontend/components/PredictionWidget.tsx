import React from 'react';
import { BarChart3, Target } from 'lucide-react';

export default function PredictionWidget({ data, homeTeam, awayTeam }: { data: any, homeTeam: string, awayTeam: string }) {
  if (!data) return null;

  // Extraemos los datos crudos del motor de Python
  const pHome = data.probabilities.home_win;
  const pDraw = data.probabilities.draw;
  const pAway = data.probabilities.away_win;
  const xgHome = data.expected_goals.home_xG;
  const xgAway = data.expected_goals.away_xG;

  // Diccionario interno de figuras clave para darle realismo al texto
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

  // El "Cerebro Narrativo": Construye un párrafo basándose en los números
  const generateNarrative = () => {
    const diff = Math.abs(pHome - pAway);
    let texto = "";
    let favorite = "";

    // 1. Detección de partido parejo
    if (diff < 0.10) { // Menos de 10% de diferencia
      return `Un duelo sumamente parejo y táctico. Las métricas proyectan una paridad casi absoluta (xG de ${xgHome} vs ${xgAway}). El encuentro podría definirse por destellos individuales, errores defensivos mínimos o la eficacia en las jugadas de pelota parada.`;
    }

    // 2. Análisis si gana el Local
    if (pHome > pAway) {
      favorite = homeTeam;
      if (pHome > 0.55) { // Supera el 55% de probabilidad
        texto = `Jerarquía pura. ${homeTeam} llega como gran candidato para llevarse el partido con un dominio abrumador en los papeles. Se espera que impongan su ritmo y asedien el área rival, obligando a ${awayTeam} a replegarse y depender del contragolpe. `;
      } else {
        texto = `Ligeramente a favor de ${homeTeam}. Aunque tienen ventaja en las métricas de poder ofensivo, ${awayTeam} no será un rival fácil y tiene herramientas suficientes para trabar el mediocampo y buscar la sorpresa. `;
      }
    } 
    // 3. Análisis si gana el Visitante
    else {
      favorite = awayTeam;
      if (pAway > 0.55) {
        texto = `Pese a la localía nominal, ${awayTeam} llega con una superioridad aplastante. Su volumen de juego esperado sugiere que tomarán las riendas del partido desde el minuto cero ante un ${homeTeam} que buscará sobrevivir defensivamente. `;
      } else {
        texto = `${awayTeam} llega con un leve favoritismo. Deberán imponer su ritmo frente a un ${homeTeam} que promete dar pelea, cerrar los espacios en defensa y aprovechar las transiciones rápidas. `;
      }
    }

    // 4. Inyección de Jugadores Clave
    if (JUGADORES_CLAVE[favorite]) {
      texto += `La capacidad de desequilibrio de ${JUGADORES_CLAVE[favorite]} será la llave principal para abrir la defensa rival y justificar este pronóstico.`;
    } else {
      texto += `El juego colectivo y la efectividad en el último cuarto de cancha serán determinantes para confirmar esta predicción matemática.`;
    }

    return texto;
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800 pt-6">
        <div>
          <p className="text-xs text-slate-500 font-bold tracking-widest mb-4 uppercase flex items-center gap-2">
            <Target className="w-4 h-4" /> Resultados Más Probables
          </p>
          <div className="flex gap-3">
            {data.most_likely_scores.map((score: string, i: number) => (
              <div key={i} className="bg-slate-950 border border-slate-700 px-5 py-3 rounded-xl font-mono text-xl font-bold text-white shadow-lg text-center flex-1">
                {score}
              </div>
            ))}
          </div>
        </div>

        {/* REEMPLAZAMOS LA LISTA POR EL MOTOR NARRATIVO */}
        <div>
           <p className="text-xs text-slate-500 font-bold tracking-widest mb-4 uppercase flex items-center gap-2">
            ⚽ Justificación Táctica
          </p>
          <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl h-full">
            <p className="text-sm text-slate-300 leading-relaxed">
              {generateNarrative()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}