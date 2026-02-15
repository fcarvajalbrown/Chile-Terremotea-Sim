# Simulador de Terremotos en Chile
Por Felipe Carvajal Brown

Aplicación web interactiva para simular impactos sísmicos en Chile utilizando modelos empíricos de atenuación del movimiento del suelo.

## Stack Técnico

- React 18 con sistema de construcción Vite
- Leaflet.js para mapeo interactivo
- Cálculos de física pura en JavaScript (sin APIs externas)
- Despliegue estático en GitHub Pages

## Modelos Científicos

**Modelo de Atenuación:**
Fórmula empírica simplificada calibrada con el terremoto de Maule 2010 (M8.8):
```
I = a + b*M - c*log10(R) - d*R
```
Donde M = magnitud momento (Mw), R = distancia hipocentral (km).

**Modelo de Daño:**
Función logística para estimación de daño:
```
Daño% = 100 / (1 + e^(-k*(I - umbral)))
```

**Escala MMI:**
Conversión de intensidad a escala de Mercalli Modificada (I-XII) según definiciones USGS.

## Instalación
```bash
npm install
npm run dev          # Servidor de desarrollo
npm run build        # Construcción de producción
npm run preview      # Vista previa local
npm run deploy       # Despliegue a GitHub Pages
```

## Estructura de Datos

- 62 ciudades chilenas con datos de población
- 30 terremotos históricos significativos (M ≥ 7.0)
- Cálculo de distancia Haversine para precisión geográfica

## Limitaciones

Modelo educativo simplificado. No considera amplificación de sitio, efectos de directividad, ni geometría de falla 3D. No apto para planificación de emergencias reales.

## Licencia

Código abierto para uso educativo.