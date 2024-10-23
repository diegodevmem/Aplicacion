<template>
<div class="hold-transition lockscreen" style="height: 100%; min-height: 100%;">
     <!-- Content Wrapper. Contains page content -->
     <!--  -->
     <div class="row">
       <div class="col-md-8 col-md-offset-2">
          <div style="margin-top:75px"></div>
          <div class="box box-danger">
              <div class="box-body">
                  <section class="content">
                      <div class="error-page">
                          <div class="row text-center">
                              <img class="img-circle" height="150px;" width="300px;" src="../../assets/error_connection.png" alt="Error" style="width: 145;">
                              <div class="col-md-12"><h2 class="text-red"><i class="fa fa-warning text-red"></i> Error de conexión</h2></div>
                          </div>
                          <div class="row text-center">
                              <div class="col-md-12">
                                  <h4>Algo salió mal, parece que no se ha podido establecer una conexión con el servidor.</h4>
                              </div>
                          </div>
                          <div class="row">
                              <div class="col-md-12">
                                 <p>1. Por favor verifique su conexión a internet y vuelva a recargar la página.</p>
                                 <p>2. Si tiene una conexión a internet estable y el error persiste, póngase en contacto con el Departamento de Informática.</p>
                              </div>
                          </div>
                      </div>
                  </section>
              </div>
          </div>
       </div>
     </div>
     <!--  -->
</div>

</template>

<script>
export default 
{

  name: "network_error",

  created()
  {

      let self = this
      
      self.$store.dispatch("setSistema",{})

  }
};
</script>