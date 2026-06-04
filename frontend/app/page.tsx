import PredictionWidget from '@/components/PredictionWidget';
import LineupWidget from '@/components/LineupWidget';
import GroupsWidget from '@/components/GroupsWidget';
import NewsWidget from '@/components/NewsWidget';
import MatchSelector from '@/components/MatchSelector';
import BracketWidget from '@/components/BracketWidget';

async function getMatchCenterData(matchId: string) {
  const res = await fetch(`https://portal-mundial.onrender.com/api/match/${matchId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error en API de Partido (Status: ${res.status})`);
  return res.json();
}

async function getGroupsData() {
  const res = await fetch(`https://portal-mundial.onrender.com/api/groups`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error en API de Grupos (Status: ${res.status})`);
  return res.json();
}

async function getNewsData() {
  const res = await fetch(`https://portal-mundial.onrender.com/api/news`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error en API de Noticias (Status: ${res.status})`);
  return res.json();
}

async function getKnockoutsData() {
  const res = await fetch(`https://portal-mundial.onrender.com/api/knockouts`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home(props: any) {
  try {
    const searchParams = await props.searchParams;
    const urlMatchId = searchParams?.matchId;

    const [groupsData, newsData, knockoutsData] = await Promise.all([
      getGroupsData(),
      getNewsData(),
      getKnockoutsData()
    ]);

    // Verificación de seguridad por si las tablas vinieron vacías
    if (!groupsData || groupsData.length === 0) {
      throw new Error("La API de grupos respondió con una lista vacía. Revisá los archivos caché del backend.");
    }

    const allMatches = groupsData.flatMap((g: any) => g.matches);
    
    if (!allMatches || allMatches.length === 0) {
      throw new Error("No se encontraron partidos dentro de los grupos cargados.");
    }

    const matchIdToPredict = urlMatchId || allMatches[0].id;
    const matchData = await getMatchCenterData(matchIdToPredict);

    return (
      <main className="min-h-screen bg-slate-950 p-4 sm:p-8 text-white">
        <div className="max-w-6xl mx-auto space-y-12 pb-16">
          
          <header className="border-b border-slate-800 pb-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Portal del Mundial '26
            </h1>
            <div className="text-sm font-medium text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Motor IA: En línea
            </div>
          </header>

          <MatchSelector matches={allMatches} />

          <section>
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                Simulación en Tiempo Real
              </span>
              <h2 className="text-4xl sm:text-5xl font-black mt-3 uppercase tracking-tight">
                {matchData.home_team} <span className="text-slate-500 text-2xl mx-2">VS</span> {matchData.away_team}
              </h2>
            </div>
            
            <PredictionWidget data={matchData.prediction} homeTeam={matchData.home_team} awayTeam={matchData.away_team} />
            <LineupWidget lineups={matchData.lineups} homeTeam={matchData.home_team} awayTeam={matchData.away_team} />
          </section>

          <section>
            <GroupsWidget groups={groupsData} />
          </section>

          <section>
            <BracketWidget knockouts={knockoutsData} /> {/* <-- NUEVO WIDGET */}
          </section>

          <section>
            <NewsWidget articles={newsData} />
          </section>

        </div>
      </main>
    );
  } catch (error: any) {
    // NUEVO: Pantalla de diagnóstico avanzado
    return (
      <main className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-8 rounded-2xl max-w-xl w-full shadow-2xl">
          <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">🚨 Error de Ejecución</h2>
          <p className="text-slate-400 text-sm mb-4">El frontend no pudo renderizar la página debido al siguiente motivo:</p>
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs text-red-400 overflow-x-auto whitespace-pre-wrap">
            {error?.message || String(error)}
          </div>
          
          <p className="mt-4 text-xs text-slate-500">
            Tip: Si dice "FetchError" o "Failed to fetch", Next.js no llega a hablar con FastAPI (revisá el puerto 8000). Si menciona "lista vacía", tus archivos caché JSON se descargaron sin datos.
          </p>
        </div>
      </main>
    );
  }
}