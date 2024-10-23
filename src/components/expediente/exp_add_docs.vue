<template>
  <div class="content-wrapper">
    <div v-if="mostrar">
      <section class="content-header">
        <h1 class="label bg-primary">
          Mis Expedientes
          <small style="color: white">Sistema de Expedientes Cerrados</small>
        </h1>
      </section>
      <br />
      <section class="content" v-loading="loading">
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12">
            <ol class="label breadcrumb bg-gray pull-right">
              <router-link tag="li" to="/exp_default" exact>
                <i class="fa fa-home"></i> Home
              </router-link>
              <router-link tag="li" to="/" exact>
                <i class="fa fa-dashboard"></i> Dashboard
              </router-link>
              <li><i class="fa fa-bug active"></i>Mis Expedientes</li>
              <router-link tag="li" to="/exp_cerrados" exact>
                <i class="fa fa-dashboard"></i> Cerrados
              </router-link>
            </ol>
          </div>
          <div>
          <tabla_mis_expedientes
            :opcion="5"
            :actuacion="false"
            :fields="fields"
            :expediente_id="expediente_id"
            :numero_expediente="numero_expediente"
            :tipo_tramite="tipo_tramite"
          ></tabla_mis_expedientes>

          </div>
        </div>
      </section>
    </div>
    <rechazado v-else></rechazado>
  </div>
</template>

<script>
import Rechazado from "../shared/Rechazado.vue";
import tabla_mis_expedientes from "../expediente/tabla_mis_exp/tabla_mis_expedientes";
export default {
  name: 'ExpCerrados',
  components: {
    tabla_mis_expedientes,
    Rechazado
  },
  data(){
    return {
      mostrar: false,
      loading: false,
      fields: [
        { key: "numero_expediente", label: "Número de Expediente", sortable: true },
        { key: "codigo_barra", label: "Código del Expediente", sortable: true },
        { key: "tipo_tramite", label: "Trámite", sortable: true },
        {
          key: "nombre_expediente",
          label: "Nombre del Expediente",
          sortable: true,
        },
        { key: "razon_social", label: "Razón Social", sortable: true },
        { key: "folio_actual", label: "Cantidad de Folios", sortable: true },
        {
          key: "folio_inicial",
          label: "Cantidad de Folios Inicial",
          sortable: true,
        },
        { key: "fecha_ingreso", label: "Fecha de Ingreso", sortable: true },
        { key: "usuario", label: "¿Quién creó el Expediente?", sortable: true },
        { key: "estado", label: "Estado Actual", sortable: false },
        { key: "opcion", label: "Acciones" },
      ],

      expediente_id: 0,
      numero_expediente: '',
      tipo_tramite: '',
      actuacion: true,
    }
  },
  created() {
    let self = this;
    self.getAll();
  },
  methods: {
    getAll() {
      let self = this;
      self.loading = true;
      self.$store.state.services.actuacionService
        .getAll()
        .then((r) => {
          self.loading = false;
        })
        .catch((r) => {});
    },
  }
}
</script>
