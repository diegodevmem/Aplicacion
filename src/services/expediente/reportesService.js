class reportesService {
  axios;
  baseUrl;

  constructor(axios, baseUrl) {
    this.axios = axios;
    this.baseUrl = `${baseUrl}mem_expediente/reporte`;
  }

  expedientesPorUsuario() {
    let self = this;
    return self.axios.get(`${self.baseUrl}/reporteExpedientesUsuario`);
  }

  expedientesPorTramite(params) {
    let self = this;
    console.log(params, "expedientesPorTramite");
    if (params && params.fecha_inicio && params.fecha_fin) {
      return self.axios.get(
        `${self.baseUrl}/reporteExpedientesTramite?start=${
          params.fecha_inicio
        }&end=${params.fecha_fin}`
      );
    }
    return self.axios.get(`${self.baseUrl}/reporteExpedientesTramite`);
  }

  asignadosExpedientesPorTramite(params) {
    console.log(params, "expedientesPorTramite Usuarios");
    let self = this;
    if (params && params.fecha_inicio && params.fecha_fin) {
      return self.axios.get(
        `${self.baseUrl}/reporteTramitesUsuario?id=${params.id}&start=${
          params.fecha_inicio
        }&end=${params.fecha_fin}`
      );
    }
    return self.axios.get(
      `${self.baseUrl}/reporteTramitesUsuario?id=${params.id}`
    );
  }

  solicitudesExternasExpediente(params) {
    let self = this;
    if (params && params.fecha_inicio && params.fecha_fin) {
      return self.axios.get(
        `${self.baseUrl}/solicitudesExternasExpediente?start=${
          params.fecha_inicio
        }&end=${params.fecha_fin}`
      );
    }
    return self.axios.get(
      `${self.baseUrl}/solicitudesExternasExpediente`
    );
  }
}

export default reportesService;
