class seguimientoActuacionService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}mem_expediente/seguimiento_actuacion`
    }

    //Esta funcion representa un INDEX
    get(id) {
      let self = this
      return self.axios.get(`${self.baseUrl}/${id}`)
    }

    getDatosFlujo(id) {
      let self = this
      return self.axios.get(`${self.baseUrl}/flujo/${id}`)
    }

    //Esta funcion representa un STORE
    create(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}`, data)
    }

    //Esta funcion representa DESTROY
    destroy(data) {
        let self = this
        return self.axios.delete(`${self.baseUrl}/${data.id}`)
    }
}

export default seguimientoActuacionService
