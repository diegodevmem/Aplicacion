class newExpedienteService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}expediente/actualizar`
  }
  //Esta funcion representa un UPDATE
  update(data) {
    let self = this;
    return self.axios.put(`${self.baseUrl}/persona`, data)
  }
}

export default newExpedienteService
