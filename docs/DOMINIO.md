# Dominio TERRA

Modelo de datos del sistema catastral.

| Entidad | Uso |
|---------|-----|
| Unidades / predios | Listado, ficha, mapa |
| Contribuyentes / propietarios | Titulares |
| Plantas y tipologías | Construcciones |
| Zonas y suelos | Tarifas de terreno |
| Factores de depreciación / pendiente | Avalúo |
| Transferencias | DDRR |
| Cite / frentes / observaciones | Datos complementarios |

Código catastral: `ZZZ-MMMM-LLL-SS` (zona, manzano, lote, sub-lote).

## Módulos

| Módulo | Ruta |
|--------|------|
| Unidades | `/app/unidades`, `/app/mapa` |
| Trámites | `/app/tramites` |
| Ficha / registro | `/app/unidades/:codigo` |
| Recepción | `/app/recepcion` |
| Inspecciones | `/app/inspecciones` |
| Salidas | `/app/salidas` |
| Valoración | `/app/valoracion` |
| Catálogos | `/app/catalogos` |
