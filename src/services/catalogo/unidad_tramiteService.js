class unidad_tramiteService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}undiad_tramite`
        this.baseUrlTwo = `${baseUrl}show_botones`
    }

    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
    }

    get(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}`)
    }

    getBotones(tipo_tramite, actuacion) {
        let self = this
        return self.axios.get(`${self.baseUrlTwo}/${tipo_tramite}/${actuacion}`)
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

export default unidad_tramiteService