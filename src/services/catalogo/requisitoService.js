class requisitoService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}requisito`
    }

    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
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

export default requisitoService