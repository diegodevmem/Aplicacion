class representanteActuacionService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_expediente/representante_actuacion`
  }

  getAll(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/${id}`)
  }
}

export default representanteActuacionService