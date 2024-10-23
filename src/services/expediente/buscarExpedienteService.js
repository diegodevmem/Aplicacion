class buscarExpedienteService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}`
  }

  //Esta funcion representa un SHOW
  getActuacion(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}expediente/buscar/actuacion/${id}`)
  }

  //Esta funcion representa un SHOW
  getExpediente() {
    let self = this
    return self.axios.get(`${self.baseUrl}expediente/buscar`)
  }

  verificarExpedienteAntiguo(body) {
    const url = `${this.baseUrl}expediente/validar`
    return this.axios.post(url.toString(), body);
  }
}

export default buscarExpedienteService
