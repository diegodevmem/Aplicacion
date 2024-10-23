class representacionService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_expediente/representantacion`
  }

  //Esta funcion representa un INDEX
  getAll() {
    let self = this
    return self.axios.get(`${self.baseUrl}`)
  }
}

export default representacionService