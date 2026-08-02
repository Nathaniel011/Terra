export const environment = {
  production: false,
  apiUrl: 'http://localhost:8091/api/v1',
  keycloak: {
    /** false = bypass demo. true = redirige a Keycloak real. */
    enabled: false,
    url: 'http://localhost:8180',
    realm: 'gamp',
    clientId: 'terra-frontend',
  },
}
