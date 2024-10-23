class tipo_tramiteService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}tipo_tramite`
    }

    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
    }

    listado() {
      let self = this
      return self.axios.get(`${self.baseUrl}/listado`)
  }

    create(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}`, data)
    }

    update(data) {
        let self = this;
        return self.axios.put(`${self.baseUrl}/${data.id}`, data)
    }

    destroy(data) {
        let self = this
        return self.axios.delete(`${self.baseUrl}/${data.id}`)
    }
}

export default tipo_tramiteService
