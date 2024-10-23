class municipioService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}municipio`
    }

    //Esta funcion representa un INDEX
    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
    }
}

export default municipioService