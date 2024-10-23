class razonSocialNewService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}razon_social`
    }

    eliminarRepresentante(actuacion_id, dpi){
      let self = this;
      return self.axios.delete(`${self.baseUrl}/eliminar/${actuacion_id}/${dpi}`)
    }
}

export default razonSocialNewService
