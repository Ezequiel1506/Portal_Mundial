import math

def poisson(k, lambd):
    """Calcula la probabilidad de que ocurran 'k' goles si se esperan 'lambd' goles."""
    return (lambd ** k) * math.exp(-lambd) / math.factorial(k)

def calcular_probabilidades_partido(elo_home, elo_away, xg_home, xg_away, descanso_home, descanso_away):
    # 1. Calculamos la matriz de todos los resultados posibles (de 0 a 5 goles por equipo)
    max_goles = 5
    probabilidades_marcadores = []
    
    prob_local_gana = 0
    prob_visitante_gana = 0
    prob_empate = 0

    # Cruzamos todos los resultados (0-0, 1-0, 0-1, etc.)
    for goles_local in range(max_goles + 1):
        for goles_visitante in range(max_goles + 1):
            # La probabilidad de un resultado exacto es multiplicar la prob. de goles del local por la del visitante
            prob_exacta = poisson(goles_local, xg_home) * poisson(goles_visitante, xg_away)
            
            probabilidades_marcadores.append({
                "marcador": f"{goles_local}-{goles_visitante}",
                "probabilidad": prob_exacta
            })
            
            # Sumamos a la estadística general
            if goles_local > goles_visitante:
                prob_local_gana += prob_exacta
            elif goles_visitante > goles_local:
                prob_visitante_gana += prob_exacta
            else:
                prob_empate += prob_exacta

    # 2. Normalizamos las probabilidades generales para que sumen exactamente 100%
    total_prob = prob_local_gana + prob_visitante_gana + prob_empate
    home_win = round((prob_local_gana / total_prob) * 100, 1)
    away_win = round((prob_visitante_gana / total_prob) * 100, 1)
    draw = round((prob_empate / total_prob) * 100, 1)

    # 3. Ordenamos la lista de marcadores de MAYOR a MENOR probabilidad y sacamos los 3 primeros
    probabilidades_marcadores.sort(key=lambda x: x["probabilidad"], reverse=True)
    top_3_marcadores = [item["marcador"] for item in probabilidades_marcadores[:3]]

    # Devolvemos la estructura exacta que espera FastAPI y nuestro Frontend
    return {
        "probabilities": {
            "home_win": home_win,
            "draw": draw,
            "away_win": away_win
        },
        "most_likely_scores": top_3_marcadores,
        "expected_goals": {
            "home_xG": round(xg_home, 2),
            "away_xG": round(xg_away, 2)
        },
        "key_factors": ["Diferencia de ELO", "Poder ofensivo (xG)", "Distribución de Poisson"],
        "radar_metrics": {
            "home": [80, 70, 60, 90, 85],
            "away": [75, 80, 65, 85, 90]
        }
    }