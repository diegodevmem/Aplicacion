class reporteSolicitudesService {
  axios;
  baseUrl;

  constructor(axios, baseUrl) {
    this.axios = axios;
    this.baseUrl = `${baseUrl}api_externo/reporte`;
  }

  solicitudes() {
    let self = this;
    return self.axios.get(`${self.baseUrl}/reporteSolicitudesEstado`);
  }

  solicitudUsuario(estado_id, direccion_id) {
    let self = this;
    return self.axios.get(`${self.baseUrl}/reporteSolicitudesEstadoUsuario?estado_id=${estado_id}&direccion=${direccion_id}`);
  }
}

export default reporteSolicitudesService;
