class AutService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}auth/`
    }

    getAll() {
      let self = this
      return self.axios.get(self.baseUrl)
    }

    get() {
        let self = this
        return self.axios.get(`${self.baseUrl}me`);
    }

    login(params) {
        let self = this
        return self.axios.post(`${self.baseUrl}login`, params)
    }

    isAdmin(sistema,empleado) {
        let self = this
        return self.axios.get(`${self.baseUrl}check_is_admin/${sistema}/${empleado}`)
    }

    logout(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}logout`);
    }
}

export default AutService