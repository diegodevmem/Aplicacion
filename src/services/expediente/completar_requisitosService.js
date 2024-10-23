class completar_requisitosService {
    axios
    baseUrl
  
    constructor(axios, baseUrl) {
      this.axios = axios
      this.baseUrl = `${baseUrl}`
    }

    getAll(data) {
      let self = this
      return self.axios.get(`${self.baseUrl}`)
    }
  }
  
  export default completar_requisitosService