<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Registro de Notificaciones
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
   
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary" id="p0">
            <div class="box-body"  >
              <!-- <form role="form" autocomplete="off"> -->
                <notf-data-table/>
              <!-- </form> -->
            </div>
          </div>
        </div>
      </div>
 
  </div>
</template>
<script>
import NotfDataTable from "./notf_data_table.vue";
export default {
  name: 'notf_reg',
  components: {
    NotfDataTable,
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
  }
}
</script>
