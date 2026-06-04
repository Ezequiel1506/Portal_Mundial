# Portal Mundial '26 - Arquitectura y Documentación General

Este repositorio contiene un sistema *Full-Stack* desacoplado diseñado para simular, predecir y visualizar el torneo del Mundial utilizando Inteligencia Artificial, extracción automática de datos (ETL) y una interfaz de usuario reactiva.

## Topología del Sistema

El proyecto está diseñado bajo una arquitectura de microservicios:

1. **Backend (`/backend`)**: Motor de procesamiento en Python (FastAPI). 
   - **Responsabilidad**: Extracción de datos de API-Sports, limpieza, almacenamiento en caché local, cálculo de probabilidades mediante Distribución de Poisson y exposición de endpoints REST.
   - **Infraestructura**: Desplegado como un Web Service en **Render** para soportar procesos en segundo plano (workers) y cálculos matemáticos pesados.

2. **Frontend (`/frontend`)**: Interfaz de usuario en React (Next.js).
   - **Responsabilidad**: Consumo de la API interna, renderizado del lado del servidor (SSR) para SEO y velocidad, y manejo de estado del lado del cliente para la interactividad.
   - **Infraestructura**: Desplegado en la CDN global de **Vercel** para garantizar una entrega estática e instantánea a los usuarios.

## Despliegue Local (Quick Start)

Para iniciar el entorno de desarrollo local, se requieren dos terminales:

**Terminal 1 (Motor API):**
```bash
cd backend
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 2 (Interfaz Web):**
```bash
cd frontend
npm install
npm run dev
```