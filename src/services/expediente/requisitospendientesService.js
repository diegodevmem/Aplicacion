class requisitospendientesService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}mem_expediente/RequisitosPendientes`
    }

    //Esta funcion representa un show
    get(id){
      let self = this
      return self.axios.get(`${self.baseUrl}/${id}`)
    }

    show(barcode){
      let self = this
      return self.axios.get(`${self.baseUrl}/show/${barcode}`)
    }

    update(data){
      let self = this
      return self.axios(
        {
          url: `${self.baseUrl}/requisitos_pendientes/store`,
          method: 'POST',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
    }
}

export default requisitospendientesService
