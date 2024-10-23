class documentoActuacionService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_expediente/documento_actuacion`
  }

  //Esta funcion regres el documento
  get(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/${id}`)
  }


  //Esta funcion representa un UPDATE
  update(data) {
    let self = this;
    return self.axios.put(`${self.baseUrl}/${data.id}`, data)
  }

  notificacion(data){
    let self = this;
    return self.axios.post(`${self.baseUrl}/aceptacion`, data)
  }
}

export default documentoActuacionService
