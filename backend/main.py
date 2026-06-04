import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from apscheduler.schedulers.background import BackgroundScheduler

from predictor import calcular_probabilidades_partido
from sync_api import fetch_world_cup_data # <-- CAMBIO: Nueva función unificada

# --- 0. CONFIGURACIÓN DEL WORKER EN SEGUNDO PLANO ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[INFO] Iniciando Motor FastAPI y Worker en segundo plano...")
    scheduler = BackgroundScheduler()
    scheduler.add_job(fetch_world_cup_data, 'interval', hours=6)
    scheduler.start()
    
    if not os.path.exists("database_cache.json") or not os.path.exists("groups_cache.json"):
        fetch_world_cup_data()
    yield 
    print("[INFO] Apagando el servidor. Deteniendo workers...")
    scheduler.shutdown()

app = FastAPI(title="API Portal Mundial", version="1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. MODELOS DE DATOS ---
class Probabilities(BaseModel): home_win: float; draw: float; away_win: float
class ExpectedGoals(BaseModel): home_xG: float; away_xG: float
class RadarMetrics(BaseModel): home: List[int]; away: List[int]
class AIPrediction(BaseModel):
    probabilities: Probabilities; most_likely_scores: List[str]; expected_goals: ExpectedGoals; key_factors: List[str]; radar_metrics: RadarMetrics
class Player(BaseModel): name: str; number: int
class TeamLineup(BaseModel): formation: str; goalkeeper: List[Player]; defenders: List[Player]; midfielders: List[Player]; forwards: List[Player]
class MatchLineups(BaseModel): home: TeamLineup; away: TeamLineup
class MatchCenterPayload(BaseModel): match_id: str; home_team: str; away_team: str; prediction: AIPrediction; lineups: MatchLineups
class TeamStanding(BaseModel): team: str; played: int; won: int; drawn: int; lost: int; gf: int; ga: int; gd: int; points: int
class MatchSimple(BaseModel): id: str; home_team: str; away_team: str; date: str; status: str; home_score: int | None = None; away_score: int | None = None
class GroupData(BaseModel): group_name: str; standings: List[TeamStanding]; matches: List[MatchSimple]
class NewsArticle(BaseModel): id: str; title: str; summary: str; category: str; author: str; timestamp: str; is_featured: bool; url: str

# --- 2. LECTURA DE CACHÉ ---
DB_FILE = "database_cache.json"
GROUPS_FILE = "groups_cache.json"

def get_matches_db():
    if not os.path.exists(DB_FILE): return {} 
    with open(DB_FILE, "r", encoding="utf-8") as f: return json.load(f)

def get_groups_db():
    if not os.path.exists(GROUPS_FILE): return {} 
    with open(GROUPS_FILE, "r", encoding="utf-8") as f: return json.load(f)

# Mock DB de Noticias (Esto lo mantenemos simulado porque API-Sports no da noticias)
NEWS_DB = [
    {
        "id": "n-001", 
        "title": "El algoritmo predice sorpresas en la fase de grupos",
        "summary": "Nuestro modelo matemático cruzó los datos de la FIFA y detectó vulnerabilidades en los equipos cabeza de serie.",
        "category": "Inteligencia Artificial", 
        "author": "Redacción IA", 
        "timestamp": "Hace 2 horas", 
        "is_featured": True,
        "url": "https://www.espn.com.ar/futbol/mundial/" # <-- Link a ESPN
    },
    {
        "id": "n-002", 
        "title": "Actualización de Rankings Elo",
        "summary": "El motor ha recalibrado las métricas de fuerza relativa para todas las selecciones.",
        "category": "Motor de Datos", 
        "author": "Sistema", 
        "timestamp": "Hace 15 min", 
        "is_featured": False,
        "url": "https://inside.fifa.com/es/fifa-world-ranking/men" # <-- Link a FIFA
    }
]

# --- 3. RUTAS Y ENDPOINTS ---
@app.get("/")
def read_root(): return {"status": "ok"}

@app.get("/api/match/{match_id}", response_model=MatchCenterPayload)
def get_match_center(match_id: str):
    db = get_matches_db()
    match_data = db.get(match_id)
    if not match_data: raise HTTPException(status_code=404, detail="Partido no encontrado")

    prediccion_raw = calcular_probabilidades_partido(
        elo_home=match_data.get("elo_home", 1750), elo_away=match_data.get("elo_away", 1750),
        xg_home=match_data.get("xg_home", 1.5), xg_away=match_data.get("xg_away", 1.5),
        descanso_home=match_data.get("descanso_home", 5), descanso_away=match_data.get("descanso_away", 5)
    )

    default_lineups = {
        "home": {"formation": "4-3-3", "goalkeeper": [{"name": "Arquero", "number": 1}], "defenders": [{"name": "Lateral", "number": 4}, {"name": "Central", "number": 2}, {"name": "Central", "number": 6}, {"name": "Lateral", "number": 3}], "midfielders": [{"name": "Medio", "number": 8}, {"name": "Pivote", "number": 5}, {"name": "Medio", "number": 10}], "forwards": [{"name": "Extremo", "number": 7}, {"name": "Delantero", "number": 9}, {"name": "Extremo", "number": 11}]},
        "away": {"formation": "4-3-3", "goalkeeper": [{"name": "Arquero", "number": 1}], "defenders": [{"name": "Lateral", "number": 4}, {"name": "Central", "number": 2}, {"name": "Central", "number": 6}, {"name": "Lateral", "number": 3}], "midfielders": [{"name": "Medio", "number": 8}, {"name": "Pivote", "number": 5}, {"name": "Medio", "number": 10}], "forwards": [{"name": "Extremo", "number": 7}, {"name": "Delantero", "number": 9}, {"name": "Extremo", "number": 11}]}
    }

    return MatchCenterPayload(
        match_id=match_id, home_team=match_data["home_team"], away_team=match_data["away_team"],
        prediction=AIPrediction(**prediccion_raw), lineups=MatchLineups(**match_data.get("lineups", default_lineups))
    )

@app.get("/api/groups", response_model=List[GroupData])
def get_all_groups():
    groups_data = get_groups_db()
    # Convertimos el diccionario en una lista de objetos GroupData
    return [GroupData(**data) for data in groups_data.values()]

@app.get("/api/news", response_model=List[NewsArticle])
def get_latest_news(): return [NewsArticle(**news) for news in NEWS_DB]