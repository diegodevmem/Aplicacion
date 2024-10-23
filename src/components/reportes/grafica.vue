<template>
  <div class="content-wrapper">
    <section class="content">
        <div class="row">
          <div class="col-md-12">
              <div class="box">
                <div class="row">
                  <!-- <grafica_semaforo></grafica_semaforo> -->
                  <dash_grafica_semaforo :consolidado="consolidado" :reporte="reporte"></dash_grafica_semaforo>
                </div>
              </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
import grafica_semaforo from "../expediente/graficas/grafica_semaforo";
import dash_grafica_semaforo from "../dashboard/dash_grafica_semaforo";
export default {
  name: 'GraficaRpts',
  components: {
    grafica_semaforo,
    dash_grafica_semaforo
  },
  data () {
    return {
      consolidado: 0,
      reporte: 1,
    }
  },
  created(){
    let self = this
    // console.log('this.$store.state.user.pertenece');
    // console.log(this.$store.state.user.pertenece);
  },
  mounted(){
    $("body").resize()
  }
}
</script>
