class administracionExpedientesService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_expediente/administracion`
  }

  //Esta funcion representa un INDEX
  getExpedientes() {
    let self = this
    return self.axios.get(`${self.baseUrl}/expedientes`)
  }

  //Esta funcion representa un INDEX
  getUnidades() {
    let self = this
    return self.axios.get(`${self.baseUrl}/unidad_direccion`)
  }

  getExpU(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/exp/${id}`)
  }

  //GET DASHBOARD REPORTES DE EXPEDIENTES CONSOLIDADOS ACTVIOS
  getExpTableDashConsolidadoSemaforoTodo() {
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash_consolidado`)
  }

  getExpTableDashConsolidadoSemaforoRango(inicio,fin) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/consolidado/rango/${inicio}/${fin}`)
  }

  getExpTableDashConsolidadoSemaforoMensual(mes,anio) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/consolidado/mensual/${mes}/${anio}`)
  }

  //GET DASHBOARD REPORTES DE EXPEDIENTES CONSOLIDADOS CERRADOS
  getExpTableDashCerradosConsolidadosTodo(){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash_consolidado_completo`)
  }

  getExpTableDashCerradosConsolidadosRango(inicio,fin){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/consolidado/completo/rango/${inicio}/${fin}`)
  }

  getExpTableDashCerradosConsolidadosMensual(mes,anio){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/consolidado/completo/mensual/${mes}/${anio}`)
  }

  //GET DASHBOARD REPORTES DE EXPEDIENTES CONSOLIDADOS CONGELADOS
  getExpTableDashCongeladosConsolidados(){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash_consolidado_congelado`)
  }

  getExpTableDashCongeladosConsolidadosRango(inicio, fin){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/consolidado/congelado/rango/${inicio}/${fin}`)
  }

  getExpTableDashCongeladosConsolidadosMensual(mes,anio){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/consolidado/congelado/mensual/${mes}/${anio}`)
  }
  
  //GET DASHBOARD REPORTES DE EXPEDIENTES ACTVIOS DE DIRECCIONES
  getExpTableDashSemaforoTodo(id, direccion) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/${id}/${direccion}`)
  }

  getExpTableDashSemaforoRango(id, direccion,inicio,fin) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/rango/${id}/${direccion}/${inicio}/${fin}`)
  }

  getExpTableDashSemaforoMensual(id, direccion,mes,anio) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/mensual/${id}/${direccion}/${mes}/${anio}`)
  }

  //GET DASHBOARD REPORTES DE EXPEDIENTES CERRADOS DE DIRECCIONES  
  getExpTableDashCerrados(id){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash_completo/${id}`)
  }

  getExpTableDashCerradosRango(id,inicio,fin){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/completo/rango/${id}/${inicio}/${fin}`)
  }

  getExpTableDashCerradosMensual(id,mes,anio){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/completo/mensual/${id}/${mes}/${anio}`)
  }


  //GET DASHBOARD REPORTES DE EXPEDIENTES CONGELADOS DE DIRECCIONES  
  getExpTableDashCongelados(id, direccion, pertenece_id){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash_congelado/${id}/${direccion}/${pertenece_id}`)
  }
  getExpTableDashCongeladosRango(id, direccion, pertenece_id,inicio,fin){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/congelado/rango/${id}/${direccion}/${pertenece_id}/${inicio}/${fin}`)
  }

  getExpTableDashCongeladosMensual(id, direccion, pertenece_id,mes,anio){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash/congelado/mensual/${id}/${direccion}/${pertenece_id}/${mes}/${anio}`)
  }





  getExp() {
    let self = this
    return self.axios.get(`${self.baseUrl}/exp`)
  }

  getExpConsolidado() {
    let self = this
    return self.axios.get(`${self.baseUrl}/exp_consolidado`)
  }

  // ESTE ESTA EN USO
  getExpReporte() {
    let self = this
    return self.axios.get(`${self.baseUrl}/exp_reporte`)
  }

  // ESTE ESTA EN USO
  getExpDash(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/exp_dash/${id}`)
  }

  getUnidadReporte() {
    let self = this
    return self.axios.get(`${self.baseUrl}/unidad_reporte`)
  }

  getRol() {
    let self = this
    return self.axios.get(`${self.baseUrl}/rol`)
  }

  //Esta funcion representa un SHOW
  getActuaciones(expediente) {
    let self = this
    return self.axios.get(`${self.baseUrl}/actuaciones/${expediente}`)
  }

  //Esta funcion representa un SHOW
  getDocumentos(actuacion) {
    let self = this
    return self.axios.get(`${self.baseUrl}/documentos/${actuacion}`)
  }

  // Reportes por usuario. Congelados y Activos
  //http://127.0.0.1:8001/serviciosMEM/public/mem_expediente/administracion/reporte_exp_dash_congelado_by_user
  getExpCongelados(){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash_congelado_by_user`)
  }

  getExpActivos(){
    let self = this
    return self.axios.get(`${self.baseUrl}/reporte_exp_dash_by_user`)
  }

}

export default administracionExpedientesService
