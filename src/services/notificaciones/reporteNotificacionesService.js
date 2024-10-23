class reporteNotificacionesService {
  axios;
  baseUrl;

  constructor(axios, baseUrl) {
    this.axios = axios;
    this.baseUrl = `${baseUrl}mem_expediente`;
  }

  getAll(filtro = "", fecha_inicio = "", fecha_fin = "") {
    let self = this;
    let searchParams = new URLSearchParams();
    if (filtro != "") {
      searchParams.append("filtro", filtro);
    }
    if (fecha_inicio != "") {
      searchParams.append("fecha_inicio", fecha_inicio);
    }
    if (fecha_fin != "") {
      searchParams.append("fecha_fin", fecha_fin);
    }
    console.log(searchParams.toString());
    return self.axios.get(
      `${self.baseUrl}/reporte/reporteNotificaciones${
        searchParams.toString().length > 0 ? "?" + searchParams.toString() : ""
      }`
    );
  }
}

export default reporteNotificacionesService;
