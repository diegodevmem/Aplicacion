class graficaService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_reporte`
  }

  //Esta funcion representa un INDEX
  getAll(unidad_id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes/${unidad_id}`)
  }

  // INICIA ENDPOINTS DE GRAFICA DIRECCIONES
  getAllDashTodo(unidad_id, direccion) {
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes_dash/${unidad_id}/${direccion}`)
  }

  getAllDashRango(unidad_id, direccion,inicio,fin) {
    console.log(inicio,fin)
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes_dash/${unidad_id}/${direccion}`)
  }

  getAllDashMensual(unidad_id, direccion,mes,anio) {
    console.log(mes,anio)
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes_dash/${unidad_id}/${direccion}`)
  }

  // INICIA ENDPOINTS DE GRAFICA CONSOLIDADOS
  getAllConsolidadoTodo() {
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes_consolidado`)
  }

  getAllConsolidadoRango(inicio, fin) {
    console.log(inicio,fin)
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes_consolidado`)
  }

  getAllConsolidadoMensual(mes, anio) {
    console.log(mes,anio)
    let self = this
    return self.axios.get(`${self.baseUrl}/reportes_consolidado`)
  }
}

export default graficaService
