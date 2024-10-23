import moment from "moment";
import FormError from "../../shared/FormError";
import VJstree from "vue-jstree";
import pdf from "vue-pdf";
export default {
  name: "ExpedienteExp",
  components: {
    FormError,
    VJstree,
    pdf,
  },
  data() {
    return {
      loading: false,
      asyncData: [],
      abrirModalDocumento: "modal fade",
      styleObjectDocumento: {},
      modalDocumento: false,
      src: "",
      srcs: "",
      src2: "",
      documento: null,
      form: {
        id: 0,
        size: 0,
        cantidad_folio: 0,
        path: null,
        numero_doc: null,
        tabla: null,
        nombre_documento:''
      },
      numPages: 0,
      archivos: undefined,
      nombreDocumento: "",
    };
  },
  created() {
    let self = this;
    self.buscarData();
  },
  computed: {
    titleDocumento() {
      return this.documento ? this.documento : "";
    },
  },
  methods: {
    date(value) {
      return moment(String(value)).format("MM/DD/YYYY");
    },

    itemClick(node, item) {
      let self = this;
      self.show = false;
      self.show_two = false;
      self.src = "";
      // self.cancel_showDocumento();
      if (item.jerarquia == "documento") {
        self.loading = true;
        self.$store.state.services.documentoactuacionService
          .get(item.path)
          .then((r) => {
            console.log("item.size");
            console.log(item.size);
            this.nombreDocumento = item.nombre;
      
            let pdfData = this._base64ToArrayBuffer(r.data);
            let file = new Blob([pdfData], { type: 'application/pdf' });
            let fileUrl = URL.createObjectURL(file);
            this.src = fileUrl;
            
            self.loading = false;
            this.show = true;
            
            self.styleObjectDocumento.display = "block";
            self.abrirModalDocumento = "modal fade in";
            self.modalDocumento = true;
            self.documento = item.valor;
            self.form.id = item.id;
            self.form.tabla = item.tabla;
            self.loading = false;
          })
          .catch((r) => {});
      }
    },

    _base64ToArrayBuffer(base64) {
        console.log("llego");
        let binary_string = atob(base64.toString().split(",")[1]);
        console.log(binary_string);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        console.log(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
  
        return bytes.buffer;
      },

    cancel_showDocumento() {
      console.log("cerrar modal documentos");
      let self = this;
      self.documento = null;
      self.styleObjectDocumento.display = "";
      self.abrirModalDocumento = "modal fade";
      self.modalDocumento = false;
      this.src = null;
      self.clear();
    },

    clear() {

      console.log("que pasa aqui");
      let self = this;

      Object.keys(self.form).forEach(function (key, index) {
        if (typeof self.form[key] === "string") self.form[key] = "";
        else if (typeof self.form[key] === "object") self.form[key] = null;
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = 0;
      });
      self.$validator.reset();    
    },

    buscarData() {
      let self = this;
      self.loading = true;
      self.$store.state.services.administracionexpedienteService
        .getExpedientes()
        .then((r) => {
          console.log("r.data");
          console.log(r.data);
          r.data.length === 0 || r.data === null || r.data === undefined
            ? (this.archivos = null)
            : (this.archivos = r.data);
          self.loading = false;
        })
        .catch((r) => {
          // this.$toastr.error(
          //   "Ocurrio un problema al buscar los expedientes.\nERROR: "+r.message,
          //   "Mensaje: "
          // );
        });
    },

    loadData(oriNode, resolve) {
      let self = this;
      var id = oriNode.data.id ? oriNode.data.id : 0;
      if (!oriNode.data.id) {
        self.$store.state.services.administracionexpedienteService
          .getExpedientes()
          .then((r) => {
            let array = [];
            r.data.forEach((element) => {
              let objeto = new Object();
              objeto.id = element.id;
              objeto.isLeaf = false;
              objeto.selected = false;
              objeto.valor =
                element.numero_expediente +
                " - Folios " +
                element.folio_actual +
                " | " +
                element.direccion +
                " | " +
                element.anio +
                " | " +
                this.date(element.fecha_ingreso);
              objeto.icon = "fa fa-archive";
              objeto.jerarquia = "expediente";

              console.log("element.fecha_ingreso");
              console.log(element.fecha_ingreso);
              array.push(objeto);
            });
            resolve(array);
            self.loading = false;
          })
          .catch((r) => {
            console.log(r.message);
          });
      } else {
        let array = [];
        switch (oriNode.data.jerarquia) {
          case "expediente":
            self.$store.state.services.administracionexpedienteService
              .getActuaciones(oriNode.data.id)
              .then((r) => {
                r.data.forEach((element) => {
                  let objeto = new Object();
                  objeto.id = element.id;
                  objeto.isLeaf = false;
                  objeto.selected = false;
                  objeto.valor =
                    element.codigo_barra +
                    " - Folios " +
                    element.folio_actual +
                    " | " +
                    element.tipo_tramite +
                    " | " +
                    element.nombre_expediente +
                    " | " +
                    element.razon_social;
                  objeto.icon = "fa fa-folder-open";
                  objeto.jerarquia = "actuacion";

                  array.push(objeto);
                });
                resolve(array);
              })
              .catch((r) => {
                this.$toastr.error(
                  "Ocurrios un problema al obtener los expedientes " +
                    oriNode.data.valor,
                  "Mensaje"
                );
                resolve(array);
              });
            break;

          case "actuacion":
            self.$store.state.services.administracionexpedienteService
              .getDocumentos(oriNode.data.id)
              .then((r) => {
                r.data.forEach((element) => {
                  let objeto = new Object();
                  objeto.id = element.id;
                  objeto.path = element.path;
                  objeto.orden = element.orden;
                  objeto.tabla = element.tabla;
                  objeto.isLeaf = true;
                  objeto.selected = false;
                  objeto.valor =
                    element.nombre + " - Folios " + element.cantidad_folio;
                  objeto.icon = "fa fa-file-pdf-o";
                  objeto.jerarquia = "documento";

                  array.push(objeto);
                });

                resolve(array);
              })
              .catch((r) => {
                this.$toastr.error(
                  "Ocurrios un problema al obtener los documentos del expediente " +
                    oriNode.data.valor,
                  "Mensaje"
                );
                resolve(array);
              });
            break;

          default:
            resolve(array);
            break;
        }
        return;
      }
    },

    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;

      this.loading = true;
      this.form.cantidad_folio = 0;
      this.form.size = 0;
      this.form.path = "";
      this.show = true;
      this.show_two = false;
      if (!files.length) {
        this.loading = false;
        return;
      } else {
        this.show_two = true;
        this.show = false;
        this.validarDocumento(files[0]);
      }
    },

    validarDocumento(file) {
      let self = this;
      let reader = new FileReader();
      let tamanio = file.size;
      let formato = ".pdf";
      let equivalente = parseFloat(tamanio / 1048576).toFixed(2)
      let nombre = file.name;
      let extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      this.numPages = 0;

 
      console.log(file.name);

      if (
        formato.substring(formato.lastIndexOf(".")) !== extension.toLowerCase()
      ) {
        self.$swal("El formato del documeto debe de ser " + formato);
        self.loading = false;
      } else {
        if (equivalente < 50) {
          reader.onload = (e) => {

            this.srcs = pdf.createLoadingTask(e.target.result);
            this.srcs.promise.then((pdf) => {
              this.form.cantidad_folio = pdf.numPages;
              this.form.size = tamanio;
              
              let pdfData = this._base64ToArrayBuffer(e.target.result);
              let file = new Blob([pdfData], { type: 'application/pdf' });
              let fileUrl = URL.createObjectURL(file);
              this.form.path = e.target.result;
              this.src2 = fileUrl;
              this.form.nombre_documento = nombre;
              
              self.$swal({
                position: "top-end",
                type: "success",
                title: "Documento agregado correctamente",
                showConfirmButton: false,
                timer: 1500,
              });
              self.loading = false;
            });
          };

          reader.readAsDataURL(file);
        } else {
          self.$swal(
            "El tamaño del documento debe de tener menos de " +
              50 +
              " MB y el documento tiene " +
              equivalente +
              " MB" +
              " " +
              "Le recomendamos usar la siguiente herramienta para comprimir sus archivos " +
              "smallpdf.com/es/comprimir-pdf"
          );
          self.loading = false;
        }
      }
    },

    guardar() {
      let self = this;
      console.log(this.form);
      self.$validator.validateAll().then((result) => {
        if (result) {
          if(this.form.tabla === 'documento_actuacion'){
            this.form.documento_actuacion = true;
          }else{
            this.form.documento_actuacion = false;
          }
          self.loading = true;
          this.src2 = '';

          self.$store.state.services.documentosService.actualizarDocumentos(self.form)
            .then((r) => {
              self.loading = false;
              self.$toastr.success(r.data, "Mensaje");
              self.asyncData = [self.$refs.tree2.initializeLoading()];
              self.$refs.tree2.handleAsyncLoad(
                self.asyncData,
                self.$refs.tree2
              );

              self.cancel_showDocumento();
              if (r.response) return;
            })
            .catch((r) => {
              console.log(r);
            });
        } else {
          self.$toastr.error("Verificar los datos", "Mensaje");
        }
      });
    },
  },
  mounted() {
    $("body").resize();
  },
};