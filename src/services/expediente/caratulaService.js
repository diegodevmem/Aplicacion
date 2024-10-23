class caratulaService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_expediente/caratula`
  }

  getCaratulaActuacion(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/actuacion/${id}`)
  }

  getCaratulaExpediente(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/expediente/${id}`)
  }

  getCaratulaCorreo(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/correo/${id}`)
  }
}

export default caratulaService