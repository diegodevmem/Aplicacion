class notificacionValidacionService {
    axios
    baseUrl
  
    constructor(axios, baseUrl) {
      this.axios = axios
      this.baseUrl = `${baseUrl}`
    }
  
    //Envia un código de verificación para válidar la edición
    enviarCodigoVerificacion(){
      let self = this
      return self.axios.get(`${self.baseUrl}mem_expediente/notificacion/verificacion`)
    }

    //Verifica el codigo 
    validarCodigo(token){
        let self = this
        return self.axios.post(`${self.baseUrl}mem_expediente/notificacion/verificacion/token`,token)
      }
  
  
  
  }
  
  export default notificacionValidacionService
  