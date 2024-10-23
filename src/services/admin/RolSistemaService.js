class RolSistemaService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}rol_sistema`
    }

    getAll(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}/menu`)
    }

    getItemsMenu(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}/menu`)
    }

    getAllMenu(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}/menu?padre_id=0`)
    }

    get(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}/${id}`)
    }

    create(data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}`, data)
    }

    createRolMenu(id,data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}/${id}/menu`, data)
    }

    update(data) {
        let self = this;
        return self.axios.put(`${self.baseUrl}/${data.id}`,data)
    }

    destroy(data){
        let self = this
        return self.axios.delete(`${self.baseUrl}/${data.id}`)
    }
}

export default RolSistemaService