class expedienteService {
  axios;
  baseUrl;

  constructor(axios, baseUrl) {
    this.axios = axios;
    this.baseUrl = `${baseUrl}mem_expediente/expediente`;
  }

  //Esta funcion representa un INDEX
  getAll() {
    let self = this;
    return self.axios.get(`${self.baseUrl}`);
  }

  //Esta funcion representa un STORE
  create(data) {
    let self = this;
    return self.axios.post(`${self.baseUrl}`, data);
  }

  //Esta funcion representa un UPDATE
  update(data) {
    let self = this;
    return self.axios.put(`${self.baseUrl}/${data.id}`, data);
  }

  //Esta funcion representa DESTROY
  destroy(data) {
    let self = this;
    return self.axios.delete(`${self.baseUrl}/${data.id}`);
  }

  createProvidencia(data) {
    let self = this;
    return self.axios.post(`${self.baseUrl}/documento_providencia`, data);
  }
}

export default expedienteService;
