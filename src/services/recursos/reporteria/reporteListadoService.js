class reporteListadoService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}api_rrhh/listado/`
  }

  listadoEvaluacion() {
    let self = this
    return self.axios.get(`${self.baseUrl}evaluacion`)
  }

  direccionGeneral() {
    let self = this
    return self.axios.get(`${self.baseUrl}direccionGeneral`)
  }

  busquedaDireccionGeneral(direccion) {
    let self = this
    return self.axios.get(`${self.baseUrl}direccionGeneral/search/${direccion}`)
  }

  departamentoGeneral() {
    let self = this
    return self.axios.get(`${self.baseUrl}departamentoGeneral`)
  }

  busquedaDepartamentoGeneral(departamento) {
    let self = this
    return self.axios.get(`${self.baseUrl}departamentoGeneral/search/${departamento}`)
  }

}

export default reporteListadoService
