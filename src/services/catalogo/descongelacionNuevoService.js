class descongelacionNuevoService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}descongelacion_nuevo`
    }
    // descongelar(data) {
    //   let self = this;
    //   return self.axios.get(`${self.baseUrl}`, data)
    // }

    descongelar(data) {
      let self = this;
      return self.axios.get(`${self.baseUrl}/${data}`)
    }

    update(data) {
      let self = this;
      return self.axios.put(`${self.baseUrl}/${data}`, data)
    }

    // destroy(data) {
    //     let self = this
    //     return self.axios.delete(`${self.baseUrl}/${data.id}`)
    // }
}

export default descongelacionNuevoService
