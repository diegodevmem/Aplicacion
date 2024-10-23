class tipo_documentoService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}tipo_documento`
  }

  getAll() {
    let self = this
    return self.axios.get(`${self.baseUrl}`)
  }
}

export default tipo_documentoService