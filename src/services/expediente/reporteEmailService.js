class reporteEmailService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_reporte`
  }

  //Esta funcion representa un INDEX
  consolidado() {
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes/consolidado/mail`)
  }

  jefe(direccion) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes/jefe/mail/${direccion}`)
  }
}

export default reporteEmailService
