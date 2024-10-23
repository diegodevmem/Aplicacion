class PropietarioService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}propietario`
    }

    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
    }
}

export default PropietarioService