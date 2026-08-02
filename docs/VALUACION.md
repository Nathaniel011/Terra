# Valoración catastral

## Fórmulas

```
Vt = (Área_básica × ValorSuelo + Excedente × ValorExcedente) × ∏ Fi_terreno
Vc_i = Ac × Crmc × Fi_depreciacion
Vc = Σ Vc_i
Vi = Vt + Vc
```

| Término | Origen |
|---------|--------|
| Área / excedente | Superficie del predio y excedente registrado |
| ValorSuelo / ValorExcedente | Catálogo zona + tipo de suelo |
| Fi terreno | Factor de pendiente |
| Ac | Superficie de cada planta |
| Crmc | Valor unitario según tipología (unifamiliar / PH) |
| Fi dep. | Factor por antigüedad |

## Código

- `frontend/src/app/data-access/mock/valoracion.engine.ts`
- `frontend/src/app/data-access/mock/valoracion-mock.service.ts`
- UI: `/app/valoracion`

## Modos

1. Individual — una unidad + año de gestión
2. Masivo — todas las unidades del año
3. Consulta — valuaciones guardadas
4. Secundarias — registros complementarios (no entran al Vi)
