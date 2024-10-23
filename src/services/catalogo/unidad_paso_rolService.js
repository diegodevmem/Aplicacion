class unidad_paso_rolService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}unidad_paso_rol`
    }

    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
    }

    get(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}`)
    }

    create(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}`, data)
    }
}

export default unidad_paso_rolService