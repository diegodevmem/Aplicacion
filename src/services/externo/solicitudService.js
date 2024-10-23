class solicitudService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}api_externo`
  }

  getAll() {
    let self = this
    return self.axios.get(`${self.baseUrl}/solicitud/listado`);
  }

  buscar(id_solicitud) {
    let self = this
    return self.axios.get(`${self.baseUrl}/solicitud/buscar/${id_solicitud}`)
  }

  documento(documento_id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/solicitud/documento/${documento_id}`)
  }

  procesarSolicitudExterna(body){
    let url = `${this.baseUrl}/expediente/insert`
    return this.axios.post(url.toString(),body);
  }

  agregarDocumentosSolicitudExterno(body){
    let url = `${this.baseUrl}/expediente/documento`
    return this.axios.post(url.toString(),body);
  }
}

export default solicitudService
