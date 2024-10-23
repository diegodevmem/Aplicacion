class unidad_pasoService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}unidad_paso`
    }

    get(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}`)
    }

    getWorkFlow(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}/edit`)
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

export default unidad_pasoService