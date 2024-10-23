class razonSocialService {
  axios
  baseUrl

  constructor(axios, baseUrl) {
    this.axios = axios
    this.baseUrl = `${baseUrl}mem_expediente/razon_social`
  }

  //Esta funcion representa un INDEX
  getAll() {
    let self = this
    return self.axios.get(`${self.baseUrl}`)
  }

  get() {
    let self = this
    return self.axios.get(`${self.baseUrl}/show`)
  }

  //Esta funcion representa un STORE
  create(data) {
    let self = this;
    return self.axios.post(`${self.baseUrl}`, data)
  }

  //Esta funcion representa un UPDATE
  update(data) {
    let self = this;
    return self.axios.put(`${self.baseUrl}/${data.id}`, data)
  }

  //Esta funcion representa DESTROY
  destroy(data) {
    let self = this
    return self.axios.delete(`${self.baseUrl}/${data.id}`)
  }
}

export default razonSocialService
