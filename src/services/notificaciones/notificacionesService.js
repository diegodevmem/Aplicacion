class notificacionesService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}notificacion`
  }

  //Esta funcion representa un INDEX
  getAll(actuacion_id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/${actuacion_id}`)
  }

  getVerCedula(cedula_id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/cedula/${cedula_id}`)
  }

  getDocumentos(cedula_id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/documentos_notificacion/${cedula_id}`)
  }

  verDocumento(path) {
    let self = this
    return self.axios.get(`${self.baseUrl}/documentos/mostrar/${path}`)
  }

  getCedulaCopia(cedula_id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/cedula/copia/${cedula_id}`)
  }

  getAllManual() {
    let self = this
    return self.axios.get(`${self.baseUrl}_manual`);
  }

  getAllReporte() {
    let self = this
    return self.axios.get(`${self.baseUrl}/listado/cedula`)
  }

  //Esta funcion representa un INDEX
  getRepresentantes(expediente_id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/representante/${expediente_id}`)
  }

  save(data){
    let self = this;
    return self.axios.post(`${self.baseUrl}/guardar`, data)
  }

  saveCopia(data){
    let self = this;
    return self.axios.post(`${self.baseUrl}/cedula/guardar/copia`, data)
  }

  saveManual(data){
    let self = this;
    return self.axios.post(`${self.baseUrl}/cedula/guardar/manual`, data)
  }

  saveNotificationCedula(data){
    //notificacion/electronica/store
    return this.axios.post(`${this.baseUrl}/electronica/store`, data)
  }

  enviarCorreo(data){
    let self = this;
    return self.axios.post(`${self.baseUrl}/correo`, data)
  }

  enviarCorreoManual(data){
    return this.axios.post(`${this.baseUrl}/correo/manual`, data)
    
  }

  update(data){
    let self = this;
    return self.axios.put(`${self.baseUrl}/cedula/actualizar`, data)
  }

  enviarCodigoVerificacion(){
    let self = this
    return self.axios.get(`${self.baseUrl}/verificacion`)

  }

  // getDataFromCompany
  getDataFromCompany(expediente_id){
    //http://127.0.0.1:8001/serviciosMEM/public/notificacion/informacion/persona/19176
    return this.axios.get(`${this.baseUrl}/informacion/persona/${expediente_id}`)
  }


}

export default notificacionesService
