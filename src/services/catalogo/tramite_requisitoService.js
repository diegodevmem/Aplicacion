class tramite_requisitoService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}tramite_requisito`
    this.baseUrlTwo = `${baseUrl}requisito/tramite/buscar`
  }

  getRequisito(requisito, tramite) {
    let self = this
    return self.axios.get(`${self.baseUrlTwo}/${requisito}/${tramite}`)
  }

  get(id) {
    let self = this
    return self.axios.get(`${self.baseUrl}/${id}`)
  }

  create(data) {
    let self = this;
    return self.axios.post(`${self.baseUrl}`, data)
  }

  destroy(data) {
    let self = this
    return self.axios.delete(`${self.baseUrl}/${data.id}`)
  }
}

export default tramite_requisitoService
