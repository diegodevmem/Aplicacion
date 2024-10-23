<template>
  <div class="content-wrapper">
    <section class="content">
        <div class="row">
          <div class="col-md-12">
              <div class="box">
                <div class="row">
                  Default Reportes
                  <!-- <grafica_semaforo></grafica_semaforo> -->
                </div>
              </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
// import grafica_semaforo from "./graficas/grafica_semaforo";
export default {
  name: 'DefaultRpts',
  components: {
    // grafica_semaforo
  },
  created(){
    let self = this
  },
  mounted(){
    $("body").resize()
  }
}
</script>
