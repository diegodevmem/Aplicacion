class actuacionService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}mem_expediente/actuacion`
    }

    razon(data){
      let self = this;
      return self.axios.post(`${self.baseUrl}/razonCongelacion`, data)
    }

    //Esta funcion representa un INDEX
    getAll() {
      let self = this
      return self.axios.get(`${self.baseUrl}`)
    }

    //Nuevo endpoint - lista los expedientes cerrrados del usuario
    getAllCerrados(){
      return this.axios.get(`${this.baseUrl}/listado/cerrado`)
    }

    //Nuevo endpoint - lista los expedientes congelados del usuario
    getAllCongelados(){
      return this.axios.get(`${this.baseUrl}/listado/congelado`)
    }

    //Esta funcion representa un INDEX
    getCerrados() {
      let self = this
      return self.axios.get(`${self.baseUrl}/cerrados`)
    }

    //Esta funcion representa un SHOW
    get(id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${id}`)
    }

    //Esta funcion es para llamar todos los documentos de la actuacion
    getDocument(id) {
      let self = this
      return self.axios.get(`${self.baseUrl}/${id}/edit`)
    }

    getRequisitosPendientes(id){
      let self = this
      return self.axios.get(`${self.baseUrl}/getRequisitosPendientes/${id}`)
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

    createActuacion(data){
      let self = this;
      return self.axios.post(`${self.baseUrl}/nueva`, data)
    }
}

export default actuacionService
