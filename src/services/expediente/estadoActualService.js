class estadoActualService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_expediente/estado_actuacion`
  }

  //Esta funcion representa un INDEX
  getAll() {
    let self = this
    return self.axios.get(`${self.baseUrl}`)
  }

  //Esta funcion representa un STORE
  create(data) {
    let self = this;
    return self.axios.post(`${self.baseUrl}`, data)
  }
}

export default estadoActualService