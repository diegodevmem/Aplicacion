<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Expedientes
        <small style="color: white">Sistema de Notificaciones</small>
      </h1>
    </section>
    <br />

    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12">
        <ol class="label breadcrumb bg-gray pull-right">
          <router-link tag="li" to="/notf_default" exact>
            <i class="fa fa-home"></i> Home
          </router-link>
          <router-link tag="li" to="/" exact>
            <i class="fa fa-dashboard"></i> Dashboard
          </router-link>
          <li><i class="fa fa-bug active"></i>Expedientes</li>
          <router-link tag="li" to="/notf_create_exp" exact>
            <i class="fa fa-dashboard"></i> Activos
          </router-link>
        </ol>
      </div>
    </div>
    <tabla_mis_expedientes
      :opcion="6"
      :actuacion="actuacion"
      :fields="fields"
      :expediente_id="expediente_id"
      :numero_expediente="numero_expediente"
      :tipo_tramite="tipo_tramite"
    ></tabla_mis_expedientes>
  </div>
</template>

<script>
import tabla_mis_expedientes from "../expediente/tabla_mis_exp/tabla_mis_expedientes.vue";
export default {
  name: "notf_create_exp",
  components: {
    tabla_mis_expedientes,
  },
  data() {
    return {
      loading: false,
      fields: [
        {
          key: "numero_expediente",
          label: "Número de Expediente",
          sortable: true,
        },
        { key: "codigo_barra", label: "Código del Expediente", sortable: true },
        { key: "tipo_tramite", label: "Trámite", sortable: true },
        {
          key: "nombre_expediente",
          label: "Nombre del Expediente",
          sortable: true,
        },
        {
          key: "notificacion_electronica",
          label: "Notificación electrónica",
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
      numero_expediente: "",
      tipo_tramite: "",
      actuacion: false,
    };
  },
  created() {},
  methods: {},
};
</script>

<style scoped >
@import "../../dist/css/desing_profile/diseno.css";
</style>
