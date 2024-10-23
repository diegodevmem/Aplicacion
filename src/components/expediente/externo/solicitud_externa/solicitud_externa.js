// import tabla_mis_expedientes from "../../tabla_mis_exp/tabla_mis_expedientes";
import Rechazado from "../../../shared/Rechazado";
export default {
  name: "solicitud_externa",
  components: {
    // tabla_mis_expedientes,
    Rechazado
  },
  data(){
    return {
      loading: false,
      headers: [
        { value: "solicitud.numero_solicitud", text: "Número de Solicitud", sortable: true },
        { value: "solicitud.fecha_ingreso", text: "Fecha de Ingreso", sortable: true },
        { value: "tipo_tramite.nombre", text: "Trámite", sortable: true },
        { value: "opcion", text: "Acciones" },
      ],
      filas: [],
      expediente_id: 0,
      numero_expediente: '',
      tipo_tramite: '',
      actuacion: false,
      loading: false,
      search:""
    }
  },
  created() {
    let self = this;
    this.solicitudExterna()
  },
  methods:{

    async solicitudExterna() {
      try {
        this.loading = true;
        let r = await this.$store.state.services.solicitudService.getAll();
        if (r.status === 200) {
          console.log(r);
          this.filas = r.data;
 
          this.$toastr.success("Solicitudes Obtenidas Exitosamente", "EXITO");
          this.loading = false;
        } else {
          this.$toastr.error(
            "A OCURRIDO UN ERROR AL INTENTAR OBTENER LAS SOLICITUDES",
            "ERROR"
          );
        }
      } catch (error) {
        this.$toastr.error(
          "A OCURRIDO UN ERROR AL INTENTAR OBTENER LAS SOLICITUDES: " + error,
          "ERROR"
        );
      }
    },

    async verSolicitudesExternas(item) {

      console.log(item); // await this.buscarSolicitud(item);
      let info = btoa(JSON.stringify(item));
      this.$router.push("/exp_solicitud_ver/"+info)
      // this.titleExterna =
      //   "Datos de la solitictud " + item.solicitud.numero_solicitud;
      // this.styleObjectExterna.display = "block";
      // this.abrirModalExterna = "modal fade in";
      // this.modalExterna = true;
    },


  }
}