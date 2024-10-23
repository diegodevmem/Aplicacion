class userAdmService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}mem_expediente/usuario`
    }

    //Esta funcion representa un INDEX
    getAll() {
      let self = this
      return self.axios.get(`${self.baseUrl}/usuarios_unidad`)
    }

    create(data) {
      let self = this
      return self.axios.post(`${self.baseUrl}/actividad_usuario/guardar`, data)
    }

    getActivos() {
      let self = this
      return self.axios.get(`${self.baseUrl}/listado_usuarios/activos`)
    }

    getInactivos() {
      let self = this
      return self.axios.get(`${self.baseUrl}/listado_usuarios/inactivos`)
    }

    getBajas() {
      let self = this
      return self.axios.get(`${self.baseUrl}/listado_usuarios/bajas`)
    }
}

export default userAdmService
