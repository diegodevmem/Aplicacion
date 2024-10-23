<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Estatus Expediente
        <small style="color: white">Reportes</small>
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
            <li><i class="fa fa-bug active"></i> Adminsitrar Documentos</li>
          </ol>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Información ingresada en el sistema.
              </h1>
            </div>
            <div class="panel-body table-responsive">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div class="content">
                    <div class="row">
                      <div class="col-md-4">
                        <img style="float: left;" :src="require('../../assets/LogoLogin2.png')" width="60%">
                      </div>

                      <div class="col-md-4">
                        <h2 class="text-center"> <strong>Sistema de Control de Expedientes Web</strong></h2>
                        <h3 class="text-center"> <strong>Ministerio de Energía y Minas</strong></h3>
                      </div>

                      <div class="col-md-4">
                        <div class="row m-0 p-0">
                          <h4 class="datos m-0 p-0"> Fecha: {{ fecha }} {{ hora }} </h4> <br>
                        </div>
                        <div class="row m-0 p-0">
                          <h4 class="datos m-0 p-0">Usuario: {{ nombre }}</h4>
                        </div>
                        <div class="row m-0 p-0">
                          <!-- <b-button @click="enviarReporte()" class="datos m-0 p-0" variant="primary">Enviar Reporte</b-button> -->
                        </div>
                      </div>
                    </div>
                    <rpts_estatus_expediente :unidad="unidad"></rpts_estatus_expediente>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FormError from "../shared/FormError";
import VJstree from "vue-jstree";
import pdf from "vue-pdf";
import rpts_estatus_expediente from "../reportes/rpts_estatus_expediente";
export default {
  name: "RptsEstatusExp",
  components: {
    FormError,
    VJstree,
    pdf,
    rpts_estatus_expediente
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
      documento: null,
      form: {
        id: 0,
        size: 0,
        cantidad_folio: 0,
        path: null,
        numero_doc: null,
        tabla: null,
      },
      numPages: 0,
      pertenece_id: 0,
      unidad: 0,
    };
  },
  created() {
    let self = this;
    // console.log('this.$store.state.user');
    // console.log(this.$store.state.user);
    // this.unidad = this.$store.state.user.unidad_id;
    this.unidad = this.$store.state.user.unidad_id;
  },
  computed: {
    hora(){
      let hoy = new Date(Date.now());
      let hora = hoy.getHours();
      let min = hoy.getMinutes();
      return hora+':'+min;
    },
    fecha(){
      let hoy = new Date(Date.now());
      return hoy.toLocaleDateString();
    },
    nombre(){
      let nombre = this.$store.state.user.nombre;
      let apellido = this.$store.state.user.apellido;

      return nombre+' '+apellido;
    },
    titleDocumento() {
      return this.documento ? this.documento : "";
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
<style scoped>
.datos {
  float: right;
}
</style>
