export type TipoSuelo = 'CEMENTO' | 'TIERRA' | 'MIXTO'
export type PendienteGrado = '0-10' | '10-20' | '20+'
export type EstadoPredio = 'ACTIVO' | 'INACTIVO' | 'OBSERVADO'
export type EstadoInspeccion = 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA'
export type TipoInspeccion = 'Verificación' | 'Nueva Construcción' | 'Tasación' | 'Ampliación'

/** Tipos de trámite catastral */
export type TipoTramiteCatastral =
  | 'Certificado catastral'
  | 'Nuevo registro'
  | 'Cambio de titular'
  | 'División / partición'
  | 'Fusión'
  | 'Actualización / mantenimiento'
  | 'Correspondencia'
  | 'Datos técnicos'

export type EstadoTramite = 'PENDIENTE' | 'EN_PROCESO' | 'OBSERVADO' | 'FINALIZADO'

export interface ServiciosPredio {
  luz: boolean
  agua: boolean
  alcantarillado: boolean
  telefono: boolean
  gas: boolean
}

export interface PlantaConstruccion {
  numeroConstruccion: number
  numeroPlanta: number
  nombrePlanta: string
  superficiePlanta: number
  antiguedad: number
  /** Código de tipología de construcción */
  codigoTipologia?: string
  tipologia: string
  propiedadHorizontal: boolean
  /** Crmc registrado (puede diferir del catálogo hasta recalcular) */
  valorUnitario: number
}

/** Resultado de valuación por año de gestión */
export interface ValuacionAnual {
  codigoCatastral: string
  anioGestion: number
  vt: number
  vc: number
  vi: number
  fechaCalculo: string
  detalleTerreno: {
    areaTotal: number
    areaBasica: number
    excedente: number
    valorSuelo: number
    valorExcedente: number
    vtBruto: number
    factores: Array<{ nombre: string; valor: number }>
  }
  detalleConstrucciones: Array<{
    numeroConstruccion: number
    numeroPlanta: number
    nombrePlanta: string
    ac: number
    crmc: number
    fi: number
    vc: number
    antiguedad: number
  }>
}

/** Valoraciones secundarias (no entran al Vi automático) */
export interface ValoracionSecundaria {
  id: string
  codigoCatastral: string
  tipo: string
  descripcion: string
  monto: number
  anioGestion: number
}

/** Transferencias / derechos reales */
export interface TransferenciaPredio {
  vendedor: string
  comprador: string
  testimonioVendedor: string
  partidaVendedor: string
  folioVendedor: string
  fechaVendedor: string
  testimonioComprador: string
  partidaComprador: string
  folioComprador: string
  fechaComprador: string
  nroBoletaImpuestos: string
  fechaBoletaImpuestos: string
}

/** Frentes, cite y observaciones del predio */
export interface FrentesVias {
  frenteLote: number
  excedente: number
  cite: string
  comentario: string
  observaciones: string
}

/** Datos del contribuyente / titular */
export interface DatosContribuyente {
  codigoPropietario: string
  nombre: string
  documento: string
  complemento: string
  fechaNacimiento: string
  telefono: string
  celular: string
  correo: string
  direccionNotificacion: string
  departamento: string
  provincia: string
  alcaldia: string
  zonaBarrio: string
}

/** Unidad catastral */
export interface Predio {
  codigoCatastral: string
  zona: string
  manzano: string
  lote: string
  subLote: string
  propietario: string
  codigoPropietario: string
  vendedor: string
  calle: string
  zonaMunicipal: string
  superficieTerreno: number
  superficieComun: number
  superficieConstruccion: number
  zonaRadio: number
  tipoSuelo: TipoSuelo
  codigoZona?: string
  codigoSuelo?: string
  pendiente: PendienteGrado
  servicios: ServiciosPredio
  usoPrimario?: string
  usoDestinado?: string
  valorTerreno: number
  valorConstruccion: number
  valorCatastral: number
  estado: EstadoPredio
  plantas: PlantaConstruccion[]
  transferencia: TransferenciaPredio
  frentes: FrentesVias
  contribuyente: DatosContribuyente
  mapX?: number
  mapY?: number
  uso: 'residencial' | 'comercial' | 'verde'
}

export interface Propietario {
  codigo: string
  nombre: string
  documento: string
  telefono: string
  nroPredios: number
}

export interface Inspeccion {
  id: string
  fecha: string
  hora: string
  codigoCatastral: string
  propietario: string
  inspector: string
  tipo: TipoInspeccion
  estado: EstadoInspeccion
}

/** Catálogo zona + tipo de suelo */
export interface ZonaSuelo {
  codigoZona: string
  codigoSuelo: string
  nombreSuelo: string
  valorSuelo: number
  valorExcedente: number
}

export interface FactorDepreciacion {
  cantidadAnos: number
  valor: number
}

export interface FactorPendienteCatalogo {
  gradoInclinacion: string
  valorFactor: number
}

export interface TipologiaVivienda {
  codigo: string
  nombre: string
  valorUnifamiliar: number
  valorPropiedadHorizontal: number
}

export interface TramiteCatastral {
  id: string
  numero: string
  tipo: TipoTramiteCatastral
  codigoCatastral: string
  solicitante: string
  estado: EstadoTramite
  fechaInicio: string
  tareaActual: string
  funcionario: string
}

export interface PreRegistro {
  id: string
  solicitante: string
  documento: string
  tipoTramite: TipoTramiteCatastral
  codigoCatastral?: string
  fecha: string
  sincronizado: boolean
}
