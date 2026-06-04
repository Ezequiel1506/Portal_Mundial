# Manual Técnico - Backend (Motor de IA & ETL)

Este módulo maneja toda la lógica de negocio, extracción de datos y predicciones matemáticas. Está construido con **FastAPI** por su velocidad y validación estricta con Pydantic.

## Archivo: `sync_api.py` (El Sincronizador / ETL)
Este script es responsable de mantener la base de datos actualizada. Se conecta a *API-Sports*, descarga el fixture y las posiciones, y genera la caché.

* **`obtener_elo(team_name: str) -> int`**: 
  - Recibe el nombre de un equipo de fútbol y busca coincidencias en el diccionario `REAL_ELO_RATINGS`. 
  - Retorna el puntaje ELO real del equipo (usado para medir su fuerza histórica). Si no lo encuentra, asigna 1750 por defecto.
* **`fetch_world_cup_data()`**: 
  - **Fase de Extracción**: Realiza dos peticiones HTTP GET a *API-Sports* (una para Fixtures y otra para Standings).
  - **Fase de Transformación**: Formatea los JSON crudos. Cruza el ELO de cada equipo para calcular los *Goles Esperados (xG)* mediante una fórmula lineal. Luego, agrupa los partidos inteligentemente verificando si los equipos participantes pertenecen al mismo grupo.
  - **Fase de Carga**: Sobrescribe los archivos `database_cache.json` y `groups_cache.json` para que FastAPI los consuma sin latencia.

## Archivo: `predictor.py` (El Cerebro IA)
Contiene la lógica matemática pura. No interactúa con bases de datos ni con internet, solo procesa números.

* **`poisson(k, lambd)`**: 
  - Aplica la fórmula estadística de Poisson. Calcula la probabilidad exacta de que un equipo marque `k` goles sabiendo que su promedio de goles esperados es `lambd`.
* **`calcular_probabilidades_partido(elo_home, elo_away, xg_home, xg_away, descanso_home, descanso_away)`**:
  - **Matriz de resultados**: Genera dos bucles anidados (`for`) probando todos los resultados posibles del 0-0 al 5-5. 
  - **Cálculo de probabilidad**: Multiplica la probabilidad de Poisson del local por la del visitante para cada marcador.
  - **Clasificación**: Suma todas las probabilidades de victoria local, empate y victoria visitante para dar el porcentaje global (ej: 54% vs 29%). Luego ordena los resultados exactos de mayor a menor y extrae el "Top 3" de marcadores más probables para enviar al Frontend.

## Archivo: `main.py` (El Servidor y Enrutador)
Es el archivo que mantiene la aplicación viva y expone los datos a internet.

* **`lifespan(app: FastAPI)`**: 
  - Es un administrador de contexto que se ejecuta al encender el servidor. Inicializa un `BackgroundScheduler` que ejecuta `fetch_world_cup_data` automáticamente cada 6 horas para mantener los datos frescos sin intervención humana.
* **Modelos Pydantic (`Probabilities`, `AIPrediction`, `MatchCenterPayload`, etc.)**: 
  - Clases que definen la estructura estricta (tipos de datos) que debe tener cada JSON antes de ser enviado al Frontend. Evitan errores de estructura.
* **`get_matches_db()` y `get_groups_db()`**: 
  - Funciones utilitarias que leen los archivos `.json` generados por el ETL y los suben a la memoria RAM.
* **Endpoints (`@app.get(...)`)**:
  - `/api/match/{match_id}`: Busca el partido solicitado. Llama a `calcular_probabilidades_partido()` en tiempo real y devuelve el JSON armado.
  - `/api/groups`: Devuelve el array completo de tablas de posiciones.
  - `/api/news`: Devuelve un arreglo de noticias simuladas (`NEWS_DB`).