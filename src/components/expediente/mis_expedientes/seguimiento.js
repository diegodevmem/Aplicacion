
import Documentos from "../../shared/Documentos";
import cuerpo from "../cuerpo_seguimiento";
import FormError from "../../shared/FormError";
import pdf from "vue-pdf";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";
import moment from "moment";
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle,
} from "vue-enhanced-check";
export default {
  name: "MisSeguimientoExp",
  components: {
    cuerpo,
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    pdf,
    DatePicker,
    moment,
    Documentos
  },
  data() {
    return {
      datosFlujo: {
        numero_expediente: null,
        codigo_barra: null,
        tipo_tramite: null,
      },
      loading: false,
      seguimientos: [],
      actuacion: null,
      expediente: null,
      expediente_id: 0,
      actuacion_id: 0,
      numero_expediente: " ",
      codigo_barra: "",
      url: "",
      tipo_tramite_id: "",

      congelacion: {
        razon: " ",
        tipo: " ",
        dias: 0,
      },
      dias_congelado: null,

      // Modal Documento
      abrirModalDocumento: "modal fade",
      styleObjectDocumento: {},
      modalDocumento: false,

      // Modal AddDocumento
      abrirModalAddDocumento: "modal fade",
      styleObjectAddDocumento: {},
      modalAddDocumento: false,

      documents: [
        {
          folio: 0,
          formato: ".PDF",
          formato_id: 1,
          megas: 200,
          requisito: "ADJUNTAR DOCUMENTO",
          estado: "primary",
        }
      ],
      documentsSave: [],
      folios_correcion: null,

      documentos: [],
      documento_seleccionado: null,

      show: false,
      src: "",
      nombreDocumento: "",
      titleDocumento: "",
    };
  },
  created() {
    let self = this;
    self.actuacion_id = atob(self.$route.params.actuacion_id);
    self.expediente_id = atob(self.$route.params.expediente_id);
    self.codigo_barra = atob(self.$route.params.codigo_barra);
    console.log('actuacion_id');
    console.log(self.actuacion_id);
    console.log('self.expediente_id');
    console.log(self.expediente_id);
    console.log('self.codigo_barra');
    console.log(self.codigo_barra);
    self.getAll();
  },
  computed: {},
  methods: {

    abrirPdf() {
      console.log("hola perros");
      console.log(this.src);
      window.open(this.src, '_blank');
    },

    verFlujo() {
      let datasString = JSON.stringify(this.datosFlujo);
      console.log(datasString)
      let data = btoa(datasString);
      this.$router.push('/exp_actuacion_flujo/' + data);
    },

    cancel_showAddDocumento() {
      let self = this;
      // self.actuacion_selected = null;
      self.styleObjectAddDocumento.display = "";
      self.abrirModalAddDocumento = "modal fade";
      self.modalAddDocumento = false;
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

    getAll() {
      let self = this;
      self.loading = true;

      self.$store.state.services.seguimientoactuacionService
        .get(self.actuacion_id)
        .then((r) => {
          console.log('r.data');
          console.log(r.data);
          // self.dias_congelado = r.data.dias_congelado;
          if (r.data.congelacion.length > 0) {
            self.congelacion.razon = r.data.congelacion[0].razon;
            self.congelacion.dias = r.data.congelacion[0].dias_congelado;
            self.congelacion.tipo = r.data.congelacion[0].tipo_congelacion;
          }
          self.seguimientos = r.data.seguimiento;
          self.actuacion = r.data.actuacion;
          self.expediente = r.data.expediente;
          this.datosFlujo.numero_expediente = this.expediente.numero_expediente;
          this.datosFlujo.codigo_barra = this.actuacion.codigo_barra;
          this.datosFlujo.tipo_tramite = this.actuacion.tipo_tramite;
          this.numero_expediente = self.expediente.numero_expediente;

          self.loading = false;
        })
        .catch((r) => { });
    },

    buscar_documento() {
      this.titleDocumento = "Documentos de la Actuación " + this.actuacion.codigo_barra;
      let self = this;
      self.loading = true;
      self.documento_seleccionado = null;
      // self.actuacion_selected = item;
      self.documentos.push({ id: 0, nombre: "Caratula" });
      self.$store.state.services.actuacionService
        .getDocument(this.actuacion.id)
        .then((r) => {
          console.log("aqiu");
          console.log(r);
          self.documentos = r.data.filter(x => x.confidencial === false);
          // self.documentos = r.data;
          console.log('self.documentos ');
          console.log(self.documentos);
          self.documentos.push({ id: 0, nombre: "Caratula" });
          self.styleObjectDocumento.display = "block";
          self.abrirModalDocumento = "modal fade in";
          self.modalDocumento = true;
          self.loading = false;
        })
        .catch((r) => { });
    },

    abrirModalAgregarDocumento() {
      this.styleObjectAddDocumento.display = "block";
      this.abrirModalAddDocumento = "modal fade in";
      this.modalAddDocumento = true;
    },

    verDocumento(item) {
      this.show = false;
      this.src = "";
      if (this.actuacion) {
        let self = this;
        self.loading = true;
        if (item.id > 0) {
          self.$store.state.services.documentoactuacionService
            .get(item.path)
            .then((r) => {

              this.nombreDocumento = item.nombre;

              this.show = true

              let pdfData = this._base64ToArrayBuffer(r.data);
              let file = new Blob([pdfData], { type: 'application/pdf' });
              let fileUrl = URL.createObjectURL(file);


              
              this.src = fileUrl;

              self.loading = false;
            })
            .catch((r) => { self.loading = false; });
        } else {
          console.log('this.actuacion.id');
          console.log(this.actuacion.id);
          self.$store.state.services.caratulaexpedienteService
            .getCaratulaActuacion(this.actuacion.id)
            .then((r) => {
              this.show = true;
              this.src = r.data;
              self.loading = false;
            })
            .catch((r) => {
              self.loading = false;
            });
        }
      }
    },

    cancel_showDocumento() {
      let self = this;
      // self.actuacion_selected = null;
      self.styleObjectDocumento.display = "";
      self.abrirModalDocumento = "modal fade";
      self.modalDocumento = false;
      this.src = "";
    },
    regresa_expedientes() {
      console.log("estoy aqui")
      this.$router.go(-1)
    },

  },
  mounted() {
    $("body").resize();
  },
};
