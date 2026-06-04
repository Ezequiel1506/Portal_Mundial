import math

def calcular_probabilidades_partido(
    elo_home: int, elo_away: int, 
    xg_home: float, xg_away: float, 
    descanso_home: int, descanso_away: int
):
    """
    Simulación del modelo de ML. 
    Cruza métricas de rendimiento y contexto para estimar probabilidades.
    """
    # 1. Influencia del ranking Elo (Probabilidad Base mediante fórmula Elo)
    # Exponente basado en la diferencia de nivel
    exponente = (elo_away - elo_home) / 400
    prob_base_home = 1 / (1 + 10 ** exponente)
    
    # 2. Ajuste por Goles Esperados (xG) y Táctica reciente
    # Calculamos un factor de ataque relativo
    factor_ataque_home = xg_home / (xg_home + xg_away) if (xg_home + xg_away) > 0 else 0.5
    
    # 3. Ajuste por fatiga (Días de descanso)
    diferencia_descanso = descanso_home - descanso_away
    # Cada día de diferencia aporta o resta un pequeño porcentaje de ventaja
    factor_fatiga = diferencia_descanso * 0.02 
    
    # 4. Ensamble de variables (Ponderación del modelo)
    # El modelo otorga un 40% de peso al histórico (Elo), 50% al momento actual (xG) y 10% al físico (Fatiga)
    score_home = (prob_base_home * 0.4) + (factor_ataque_home * 0.5) + (factor_fatiga * 0.1)
    # Aseguramos límites lógicos
    score_home = max(0.1, min(0.9, score_home))
    
    # Estimación del empate (históricamente ronda el 24% en mundiales, fluctúa según paridad)
    paridad = 1 - abs(score_home - (1 - score_home)) # A más paridad, más chance de empate
    prob_draw = max(0.15, min(0.35, 0.24 * paridad))
    
    # Distribución final del 100% de las probabilidades
    prob_restante = 1.0 - prob_draw
    prob_home = score_home * prob_restante
    prob_away = (1.0 - score_home) * prob_restante
    
    # 5. Predicción de Marcadores Más Probables (Simulación simplificada de Poisson)
    # Usamos los xG como la media de goles esperados
    goles_esperados_home = xg_home + (diferencia_descanso * 0.1)
    goles_esperados_away = xg_away - (diferencia_descanso * 0.1)
    
    marcador_principal = f"{round(goles_esperados_home)}-{round(goles_esperados_away)}"
    marcador_secundario = f"{max(0, round(goles_esperados_home))}-{max(0, round(goles_esperados_away))}"
    
    # Generar factores clave dinámicos basados en la variable dominante
    factores = []
    if abs(elo_home - elo_away) > 150:
        superior = "local" if elo_home > elo_away else "visitante"
        factores.append(f"Brecha de jerarquía histórica: Gran superioridad del equipo {superior} en ranking Elo.")
    else:
        factores.append("Paridad histórica: Ambos equipos presentan planteles con un nivel Elo muy equilibrado.")
        
    if abs(descanso_home - descanso_away) >= 2:
        desgastado = "visitante" if descanso_home > descanso_away else "local"
        factores.append(f"Déficit físico crítico: El equipo {desgastado} llega con una carga acumulada severa.")
        
    if xg_home > xg_away * 1.5:
        factores.append("Volumen de juego: La IA detecta una generación de peligro (xG) drásticamente mayor en el ataque local.")

    return {
        "probabilities": {
            "home_win": round(prob_home, 2),
            "draw": round(prob_draw, 2),
            "away_win": round(prob_away, 2)
        },
        "most_likely_scores": [marcador_principal, "1-1", "1-0"],
        "expected_goals": {
            "home_xG": round(goles_esperados_home, 2),
            "away_xG": round(goles_esperados_away, 2)
        },
        "key_factors": factores[:3], # Tomamos los 3 más importantes
        "radar_metrics": {
            "home": [int(prob_base_home*100), int(factor_ataque_home*100), max(50, 50 + diferencia_descanso*10), 80, 85],
            "away": [int((1-prob_base_home)*100), int((1-factor_ataque_home)*100), max(50, 50 - diferencia_descanso*10), 75, 70]
        }
    }