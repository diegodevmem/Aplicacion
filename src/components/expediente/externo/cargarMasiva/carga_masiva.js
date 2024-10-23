import Attachment from "../../../shared/drag_and_drop/Attachment/Attachment.vue";
export default {
  props : ['data'],
  components: {
    Attachment,
  },
  data() {
    return {
      dialog: false,
      e1: 1,
      loading: false,
      search1: "",
      search2: "",
      archivo: [],
      facturas: [],

    }
  },

  created(){
    console.log("data");
    // console.log(this.data);
    // if(this.data.facturas){
    //   this.e1 = 2;
    // }
  },

  watch: {
    data(){
      console.log("data");
      console.log(this.data);
      if(this.data.facturas){
        this.e1 = 2;
      }
    }
  },
  computed: {
    totalFacturas() {
      let total = 0;
      this.facturas.forEach(x => {
        total = total + x.registros.length;
      });
      return total;
    },
    totalRetenciones() {
      let total = 0;
      this.retenciones.forEach(x => {
        total = total + x.registros.length;
      });
      return total;
    },

    size() {
      const size = { xs: "x-small", sm: 'small', md: 'small', lg: 'small' }[this.$vuetify.breakpoint.name];
      return size ? { [size]: true } : {}
    }
  },
  methods: {

    eliminarFactura(index) {
      this.facturas.splice(index);
    },

    eliminarRetencion(index) {
      this.retenciones.splice(index);
    },

    async guardarPresentacion() {
      console.log('this.facturas');
      console.log(this.facturas);
      this.loading = true;
      console.log({usuario_id:this.data.usuario_id, esFactura: this.data.facturas,facturas: this.facturas, retenciones: this.retenciones} );
      try {
        let r =
          await this.$store.state.services.presentacionService.presentarFacturas({usuario_id:this.data.usuario_id, esFactura: this.data.facturas,facturas: this.facturas, retenciones: this.retenciones });
        if (r.status === 200) {
          this.$toast.success(
            "DATOS GUARDADOS EXITOSAMENTE",
            "EXITO"
          );
          this.loading = false;
          this.$emit("regresar",this.data);
        } else {
          this.$toast.error(
            "Ocurrió un error al intentar guardar los datos",
            "ERROR"
          );
        }
        this.loading = false;
      } catch (error) {
        this.$toast.error(
          "Ocurrió un error al intentar guardar los datos: " + error,
          "ERROR"
        );
        this.loading = false;
      }
    },

    archivos(file) {
      this.archivo.push(file);
      console.log('file');
      console.log(file);
    },

    facturasEmit(obj) {
      console.log('obj1');
      console.log(obj);
      this.facturas.push(obj)
      console.log('this.facturas');
      console.log(this.facturas);
    },

    retencionesEmit(obj) {
      console.log('obj2');
      console.log(obj);
      this.retenciones.push(obj)
    },
  }
}