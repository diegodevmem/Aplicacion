class evaluacionService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}api_rrhh`
  }

  //Esta funcion representa un INDEX
  getAll(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/factor/${id}`)
  }

  getEmpleados(){
    let self = this
    return self.axios.get(`${self.baseUrl}/empleado`)
  }

  save(data){
    let self = this
    return self.axios.post(`${self.baseUrl}/evaluacion`, data)
  }

  saveEvaluacion(data){
    let self = this
    return self.axios.post(`${self.baseUrl}/detalleEvaluacion`, data)
  }

  generarPDF(data){
    let self = this
    return self.axios.get(`${self.baseUrl}/detalleEvaluacion/${data}`)
  }
}

export default evaluacionService
