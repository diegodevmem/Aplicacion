class documentosService {
    axios
    baseUrl
  
    constructor(axios, baseUrl) {
      this.axios = axios
      this.baseUrl = `${baseUrl}mem_expediente`
      this.base = `${baseUrl}`
    }
  
    actualizarDocumentos(body){
        let self = this
        return self.axios.put(`${self.baseUrl}/documento/actualizar`, body)
      }

      createProvidencia(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}/documento_providencia`, data);
      }

      postCancelCorrelative(body){
        let self = this
        return self.axios.post(`${self.baseUrl}/anulacion/providencia`, body)
      }
  }
  

  
  export default documentosService
  

