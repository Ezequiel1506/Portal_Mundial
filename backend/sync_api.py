import os
import json
import requests
from dotenv import load_dotenv
import xml.etree.ElementTree as ET

load_dotenv()
API_KEY = os.getenv("API_SPORTS_KEY")

HEADERS = {
    "x-apisports-host": "v3.football.api-sports.io",
    "x-apisports-key": API_KEY
}

DB_FILE = "database_cache.json"
GROUPS_FILE = "groups_cache.json"

REAL_ELO_RATINGS = {
    "Argentina": 2140, "France": 2110, "Spain": 2060, "England": 2040, 
    "Brazil": 2030, "Portugal": 2020, "Netherlands": 2010, "Italy": 2000,
    "Colombia": 1990, "Uruguay": 1980, "Croatia": 1970, "Germany": 1960,
    "Morocco": 1930, "Ecuador": 1890, "Japan": 1880, "Senegal": 1870,
    "Mexico": 1850, "USA": 1840, "South Korea": 1820, "Canada": 1780,
    "Saudi Arabia": 1700, "Costa Rica": 1680, "Bolivia": 1650
}

NEWS_FILE = "news_cache.json"

def fetch_live_news():
    print("[INFO] Buscando noticias en vivo de Google News...")
    # URL del feed de Google Noticias filtrado por "Mundial 2026" en español
    url = "https://news.google.com/rss/search?q=Mundial+2026+futbol&hl=es-419&gl=AR&ceid=AR:es-419"
    
    try:
        resp = requests.get(url)
        root = ET.fromstring(resp.content)
        
        live_news = []
        # Extraemos solo las 4 noticias más recientes
        for idx, item in enumerate(root.findall('./channel/item')[:4]):
            title = item.find('title').text
            link = item.find('link').text
            pubDate = item.find('pubDate').text
            
            # Google News manda el título con el formato: "Titular - Nombre del Diario"
            # Vamos a separarlo para que quede prolijo
            if " - " in title:
                clean_title, author = title.rsplit(" - ", 1)
            else:
                clean_title = title
                author = "Agencia de Noticias"

            live_news.append({
                "id": f"live-news-{idx}",
                "title": clean_title,
                "summary": "Haz clic para leer el artículo completo en el portal original.",
                "category": "Mundial 2026",
                "author": author,
                "timestamp": pubDate[5:16], # Cortamos la fecha para mostrar ej: "04 Jun 2026"
                "is_featured": idx == 0, # Destacamos siempre la más reciente
                "url": link
            })
            
        with open(NEWS_FILE, "w", encoding="utf-8") as f:
            json.dump(live_news, f, indent=4, ensure_ascii=False)
        print("[INFO] ¡Noticias actualizadas exitosamente!")
        
    except Exception as e:
        print(f"[ERROR] No se pudo obtener el feed de noticias: {e}")

def obtener_elo(team_name: str) -> int:
    for key, value in REAL_ELO_RATINGS.items():
        if key.lower() in team_name.lower() or team_name.lower() in key.lower():
            return value
    return 1750 

def fetch_world_cup_data():
    print("[INFO] Iniciando extracción de Partidos y Grupos...")
    
    fixtures_url = "https://v3.football.api-sports.io/fixtures?league=1&season=2022"
    resp_fixtures = requests.get(fixtures_url, headers=HEADERS)
    
    if resp_fixtures.status_code != 200:
        print("[ERROR] Falló conexión con API de Fixtures.")
        return

    data_fixtures = resp_fixtures.json()
    matches = data_fixtures.get("response", [])
    
    new_matches_db = {}
    matches_list_for_groups = []
    
    for match in matches:
        match_id = f"w2026-{match['fixture']['id']}"
        home_team = match["teams"]["home"]["name"]
        away_team = match["teams"]["away"]["name"]
        
        elo_home_real = obtener_elo(home_team)
        elo_away_real = obtener_elo(away_team)
        
        match_data = {
            "id": match_id,
            "home_team": home_team,
            "away_team": away_team,
            "elo_home": elo_home_real, 
            "elo_away": elo_away_real,
            "xg_home": round(1.0 + ((elo_home_real - 1700) / 400), 2), 
            "xg_away": round(1.0 + ((elo_away_real - 1700) / 400), 2),
            "descanso_home": 5, 
            "descanso_away": 5,
            "status": match["fixture"]["status"]["short"], 
            "home_score": match["goals"]["home"],
            "away_score": match["goals"]["away"],
            "date": match["fixture"]["date"][:10]
        }
        new_matches_db[match_id] = match_data
        
        matches_list_for_groups.append({
            "id": match_id,
            "home_team": home_team,
            "away_team": away_team,
            "date": match["fixture"]["date"][:10],
            "status": "upcoming" if match["fixture"]["status"]["short"] == "NS" else "finished",
            "home_score": match["goals"]["home"],
            "away_score": match["goals"]["away"]
        })
        
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(new_matches_db, f, indent=4, ensure_ascii=False)
        
    standings_url = "https://v3.football.api-sports.io/standings?league=1&season=2022"
    resp_standings = requests.get(standings_url, headers=HEADERS)
    data_standings = resp_standings.json()
    
    groups_db = {}
    
    if data_standings.get("response"):
        list_of_groups = data_standings["response"][0]["league"]["standings"]
        
        for group_standings in list_of_groups:
            group_name = group_standings[0]["group"]
            
            # --- NUEVA LÓGICA DE AGRUPAMIENTO INTELIGENTE ---
            # 1. Sacamos los nombres de los 4 equipos de este grupo específico
            group_teams = [team["team"]["name"] for team in group_standings]
            
            # 2. Buscamos solo los partidos donde jueguen esos equipos
            group_matches = [
                m for m in matches_list_for_groups 
                if m["home_team"] in group_teams and m["away_team"] in group_teams
            ]
            # ------------------------------------------------
            
            formatted_standings = []
            for team in group_standings:
                formatted_standings.append({
                    "team": team["team"]["name"],
                    "played": team["all"]["played"],
                    "won": team["all"]["win"],
                    "drawn": team["all"]["draw"],
                    "lost": team["all"]["lose"],
                    "gf": team["all"]["goals"]["for"],
                    "ga": team["all"]["goals"]["against"],
                    "gd": team["goalsDiff"],
                    "points": team["points"]
                })
            
            groups_db[group_name] = {
                "group_name": group_name.replace("Group", "Grupo"),
                "standings": formatted_standings,
                "matches": group_matches
            }
            
    with open(GROUPS_FILE, "w", encoding="utf-8") as f:
        json.dump(groups_db, f, indent=4, ensure_ascii=False)

    print("[INFO] ¡Sincronización Total Exitosa! Partidos y Tablas guardadas.")

if __name__ == "__main__":
    fetch_world_cup_data()
    fetch_live_news() # <-- Agregamos esta línea