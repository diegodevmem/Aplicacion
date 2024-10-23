<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="row">
        <div class="col-md-12">
          <div class="box">
            <div class="row">
              Default Expedientes
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
  name: "DefaultExp",
  components: {
    // grafica_semaforo
  },
  async created() {
    await this.getNit();
    await this.getCui();
  },
  
  methods: {
    async getNit() {
      let r = await this.$store.state.services.empresaService.get();
      try {
        this.$store.state.nits = r.data.data;
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + r, "Error");
        console.log(r);
      }
    },

    async getCui() {
      try {
        let r = await this.$store.state.services.razonsocialService.get();
        this.$store.state.cuis = r.data;
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + r, "Error");
        console.log(r);
      }
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>

