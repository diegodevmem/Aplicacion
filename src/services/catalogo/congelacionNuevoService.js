class congelacionNuevoService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}congelacion_nuevo`
    }

    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
    }

    create(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}`, data)
    }

    // descongelar(data) {
    //   let self = this;
    //   return self.axios.get(`${self.baseUrl}/descongelacion_nuevo/${data}`)
    // }

    update(data) {
        let self = this;
        return self.axios.put(`${self.baseUrl}/${data}`, data)
    }

    // destroy(data) {
    //     let self = this
    //     return self.axios.delete(`${self.baseUrl}/${data.id}`)
    // }
}
export default congelacionNuevoService