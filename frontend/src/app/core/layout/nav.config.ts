export interface NavItem {
  label: string
  path: string
  icon: string
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

/** Menú principal de TERRA */
export const TERRA_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Inicio', path: '/app/inicio', icon: 'pi-home' },
      { label: 'Unidades', path: '/app/unidades', icon: 'pi-building' },
      { label: 'Mapa', path: '/app/mapa', icon: 'pi-globe' },
    ],
  },
  {
    label: 'Operación',
    items: [
      { label: 'Trámites', path: '/app/tramites', icon: 'pi-sitemap' },
      { label: 'Recepción', path: '/app/recepcion', icon: 'pi-inbox' },
      { label: 'Inspecciones', path: '/app/inspecciones', icon: 'pi-clipboard' },
      { label: 'Valoración', path: '/app/valoracion', icon: 'pi-calculator' },
    ],
  },
  {
    label: 'Soporte',
    items: [
      { label: 'Catálogos', path: '/app/catalogos', icon: 'pi-table' },
      { label: 'Salidas', path: '/app/salidas', icon: 'pi-file' },
    ],
  },
]

export const TERRA_NAV: NavItem[] = TERRA_NAV_GROUPS.flatMap((g) => g.items)
