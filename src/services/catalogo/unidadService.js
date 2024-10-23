class unidadService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}unidad2`
    }

    //Esta funcion representa un INDEX
    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
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

export default unidadService