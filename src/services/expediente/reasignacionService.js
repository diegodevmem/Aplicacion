class reasignacionService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}mem_expediente/expediente/reasignacion`
    }

    //Esta funcion representa un INDEX
    getAll() {
      let self = this
      return self.axios.get(`${self.baseUrl}/info_exp`)
    }

    getUsuarios(actuacion_id) {
      let self = this
      return self.axios.get(`${self.baseUrl}/usuarios/${actuacion_id}`)
    }

    save(data) {
      let self = this
      return self.axios.post(`${self.baseUrl}/guardar`, data)
    }

    // getActivos() {
    //   let self = this
    //   return self.axios.get(`${self.baseUrl}/listado_usuarios/activos`)
    // }

    // getInactivos() {
    //   let self = this
    //   return self.axios.get(`${self.baseUrl}/listado_usuarios/inactivos`)
    // }

    // getBajas() {
    //   let self = this
    //   return self.axios.get(`${self.baseUrl}/listado_usuarios/bajas`)
    // }
    // REASIGNACION MASIVA DE EXPEDIENTES
    
  // REASIGNACION MASIVA DE EXPEDIENTES
      getAllExpedientes() {
        //http://192.168.1.56:8008/mem_expediente/expediente/reasignacion/info_exp/masivo
        //this.baseUrl = `${baseUrl}mem_expediente/estado_actuacion`
        let self = this
        return self.axios.get(`${self.baseUrl}/info_exp/masivo`)
      }
      
      getUsers() {
        let self = this
        return self.axios.get(`${self.baseUrl}/masiva/usuarios`)
      }

      postMassiveReasignation(body_reasignation){
        let self = this
        return self.axios.post(`${self.baseUrl}/masiva`, body_reasignation)
      }

      //http://192.168.1.56:8008/mem_expediente/expediente/reasignacion/reporte
      getPdfReport(body_report){
        let self = this
        return self.axios.get(`${self.baseUrl}/reporte`, body_report)
      }
      //I don't understand why why the url is kinda the same.
      getReassignationReportView(){
        return this.axios.get(`${this.baseUrl}/reporte`)
      }

}

export default reasignacionService
