<template>
  <div v-if="roles.length > 0" class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Reasignacion de Expedientes
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
    </section>
    <br />
    <!-- <section class="content" v-loading="loading"> -->
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12">
        <ol class="label breadcrumb bg-gray pull-right">
          <router-link tag="li" to="/exp_default" exact>
            <i class="fa fa-home"></i> Home
          </router-link>
          <router-link tag="li" to="/" exact>
            <i class="fa fa-dashboard"></i> Dashboard
          </router-link>
          <router-link tag="li" to="/exp_mis_expedientes" exact>
            <i class="fa fa-dashboard"></i> Reasignar Expedientes
          </router-link>
        </ol>
      </div>
    </div>
    <tabla_mis_expedientes
      :opcion="4"
      :reasignacion="reasignacion"
      :actuacion="actuacion"
      :fields="fields"
      :expediente_id="expediente_id"
      :numero_expediente="numero_expediente"
      :tipo_tramite="tipo_tramite"
    ></tabla_mis_expedientes>

    <!-- </section> -->
  </div>
  <rechazado v-else></rechazado>
</template>

<script>
import Rechazado from "../shared/Rechazado";
import tabla_mis_expedientes from "../expediente/tabla_mis_exp/tabla_mis_expedientes";

export default {
  name: "exp_reasignacion",
  components: {
    tabla_mis_expedientes,
    Rechazado
  },
  data() {
    return {
      loading: false,
      fields: [
        { key: "exp_num", label: "Número de Expediente", sortable: true },
        {
          key: "nombre_expediente",
          label: "Nombre del Expediente",
          sortable: true
        },
        { key: "usuario", label: "Usuario Asignado", sortable: true },
        // { key: "ubicacion", label: "Ubicación", sortable: true },
        { key: "un_unidad", label: "Unidad", sortable: true },
        { key: "direccion", label: "Direccion", sortable: true },
        { key: "opcion", label: "Acciones" }
      ],

      roles: [],

      expediente_id: 0,
      numero_expediente: "",
      tipo_tramite: "",
      actuacion: false,
      reasignacion: true
    };
  },
  async created() {
    let self = this;
    // self.getAll();
    console.log("vista de reasignacion de expedientes");
    await this.rolesS();
  },
  methods: {
    async rolesS() {
      try {
        this.loading = true;
        let r = await this.$store.state.services.administracionexpedienteService.getRol();
        console.log("que es esto", r);
        if (r.data.length === 0) {
          this.roles = [
            { rol_id: 1, rol_nombre: "Adm", sistema_nombre: "EXP" }
          ];
        } else {
          this.roles = r.data;
          this.roles = r.data.filter(x => x.sistema_nombre === "EXP");
          this.roles = this.roles.filter(
            x => x.rol_id < 5 || r.rol_id === 14 || x.rol_id == 6 ||x.rol_id == 18
          );
        }
        this.loading = false;
      } catch (error) {
        this.$toastr.error(
          "Ocurrio un problema al obtener los roles",
          "Mensaje"
        );
      }

      // self.$store.state.services.administracionexpedienteService
      // .getRol()
      // .then((r) => {
      //   if (r.data.length === 0) {
      //     this.roles = [
      //       {rol_id: 1, rol_nombre: 'Adm', sistema_nombre: 'EXP'}
      //     ]
      //   } else {
      //     this.roles = r.data;
      //     this.roles = r.data.filter(x => x.sistema_nombre === 'EXP');
      //     this.roles = this.roles.filter(x => x.rol_id < 5 || r.rol_id === 14);
      //   }
      //   // self.loading = false;
      // })
      // .catch((r) => {
      //   this.$toastr.error(
      //     "Ocurrio un problema al obtener los roles",
      //     "Mensaje"
      //   );
      // });
    }
  }
};
</script>
