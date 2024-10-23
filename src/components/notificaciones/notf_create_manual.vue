<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Notificacion Manual
        <small style="color: white">Sistema de Notificaciones</small>
      </h1>
      <br /><br />
      <ol class="label breadcrumb bg-gray">
        <router-link tag="li" to="/cat_default" exact>
          <i class="fa fa-home"></i> Home
        </router-link>
        <router-link tag="li" to="/" exact>
          <i class="fa fa-dashboard"></i> Dashboard
        </router-link>
        <li><i class="fa fa-bug active"></i> Nuevo Expediente</li>
      </ol>
    </section>
    <br />
    <section class="content">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary" id="p0">
            <notf-cedula
              :manual="true"
              :copia="false"
              v-on:carga="carga"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import NotfCedula from "./notf_cedula.vue";
export default {
  name: 'notf_create_exp',
  components: {
    NotfCedula,
  },
  data(){
    return {
      loading: false,
    }
  },

  created(){
    let self = this
  },
  mounted(){
    $("body").resize()
  },
  methods: {
     carga(estado){
      this.loading = estado;
    },
  }
}
</script>
