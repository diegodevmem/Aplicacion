class SistemaService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}sistema`
    }

    getAll() {
        let self = this
        return self.axios.get(`${self.baseUrl}`)
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

    getRoles(id) {
        let self = this;
        return self.axios.get(`${self.baseUrl}/${id}/rol`)
    }

    create(data) {
        let self = this
        return self.axios.post(`${self.baseUrl}`, data)
    }

    asignRol(id,data) {
        let self = this;
        return self.axios.post(`${self.baseUrl}/${id}/rol`, data)
    }

    update(data) {
        let self = this;
        return self.axios.put(`${self.baseUrl}/${data.id}`,data)
    }

    destroy(data){
        let self = this
        return self.axios.delete(`${self.baseUrl}/${data.id}`)
    }

    destroyRol(id,id_rol){
        let self = this
        return self.axios.delete(`${self.baseUrl}/${id}/rol/${id_rol}`)
    }
}

export default SistemaService