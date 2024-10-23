<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Ver Flujo
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
      <br /><br />
      <ol class="label breadcrumb bg-gray">
        <router-link tag="li" to="/cat_default" exact>
          <i class="fa fa-home"></i> Home
        </router-link>
        <router-link tag="li" to="/" exact>
          <i class="fa fa-dashboard"></i> Dashboard
        </router-link>
        <router-link tag="li" to="/cat_tipo_tramite" exact>
          <i class="fa fa-bug"></i> Tipo Trámite
        </router-link>
        <li><i class="fa fa-bug active"></i> Proceso del trámite</li>
      </ol>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-plus-square-o"></i> Selección del Tramite
              </h1>
            </div>

            <div class="col-12 text-center">
              <h4>
                Número del Expediente: <br><br>
                <strong v-if="exp !== null" v-text="exp.numero_expediente"></strong>
              </h4>
              <hr>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">
                <!-- PASO ACTUAL -->
                <div class="row">
                  <!-- <hr> -->
                  <div class="row">
                    <div class="col-12 text-center">
                      <h4>
                        <strong v-if="paso !== null">PASO ACTUAL #{{ paso.no_paso }}</strong>
                        <strong v-else>PASO SELECCIONADO (NINGUNO)</strong>
                      </h4>
                    </div>
                  </div>
                  <div v-if="paso !== null" class="col-md-12 text-center">
                    <!-- <label>Paso Seleccionado: #{{ paso.no_paso }}</label><br> -->
                    <!-- <br> -->
                    <!-- <label>Nombre: </label> -->
                    <span>{{ paso.paso }}</span><br>
                    <!-- <label>Unidad: </label> -->
                    <span>{{ paso.unidad }}</span><br>
                  </div>
                </div>
                <br>

                <!-- DIAGRAMA -->
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.accordion-1 variant="info">{{ exp.tipo_tramite }}</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                      <b-card-body>
                        <br>
                        <vue-mermaid
                          class="text-center"
                          :nodes="diagrama"
                          :type="orientacion_text"
                          :config="config"
                        ></vue-mermaid>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Documentos from "../shared/Documentos";
import FormError from "../shared/FormError";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle,
} from "vue-enhanced-check";
export default {
  name: "actuacion_flujo",
  components: {
    FormError,
    Documentos,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    DatePicker,
  },
  data() {
    return {
      loading: false,

      orientacion_text: "graph TD",
      config: {
        theme: "base",
      },
      data: [],
      pasos: [],
      paso: null,
      exp: null,
      datos: null,

    };
  },
  created() {
    let self = this;

    // let decode = atob(self.$route.params.codigo);
    this.exp = JSON.parse(atob(self.$route.params.codigo));
    console.log('codigo');
    console.log(this.exp);
    self.getPromise();
  },
  computed: {
    color() {
      return !this.form.id ? "box box-primary" : "box box-warning";
    },
    title_Paso() {
      return this.unidad_tramite ? this.unidad_tramite.unidad.nombre : "";
    },
    diagrama() {
      return this.data;
    },

  },
  methods: {

    notAfterToday(date) {
      return date > new Date(new Date().setHours(0, 0, 0, 0));
    },

    guardar(){
      let x = this.form;
      return x.tramite !== null && x.paso !== null && x.exp !== null && x.documentos !== [] && x.folios_correcion !== null && x.nombre_actuacion !== null ? true : false;
    },

    crearActuacion(){
      console.log('this.form');
      console.log(this.form);
      this.create();
    },

    clearData(){
      this.form.tramite = null;
      this.form.paso = null;
      // this.form.exp = null;
      this.form.documentos = [];
      this.form.folios_correcion = null;
      this.form.folio_inicial = null;
      this.form.nombre_actuacion = null;
      this.form.observacion = null;
      this.form.fecha = null;
      this.documentos = [
        {
          folio: 0,
          formato: ".PDF",
          formato_id: 1,
          megas: 200,
          requisito: "ADJUNTAR DOCUMENTO",
          estado: "primary",
        }
      ];
    },

    getFlujo(){
      if (this.form.tramite !== null) {
        this.verWorkFlow();
      }

    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getDatos()])
        .then(() => {
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    verWorkFlow() {
      let self = this;
      self.loading = true;
      self.data = [];

      self.$store.state.services.unidadpasoService
        .getWorkFlow(this.datos.tipo_tramite_id)
        .then((r) => {
          self.loading = false;
          this.pasos = r.data;
          console.log('pasos');
          console.log(r.data);
          r.data.forEach((element) => {
            let objeto = new Object();
            objeto.id = element.no_paso;
            element.no_paso === this.datos.paso.no_paso ? this.paso = element : console.log();
            objeto.text = "Paso No. " + element.no_paso +  " <br> " + element.paso +  " <br> " + element.unidad
            objeto.editable = true;
            objeto.style = '';

            let next = [];
            r.data.forEach((item) => {
              if (item.padre_id == element.id && item.id != element.id) {
                next.push(item.no_paso);
              }
            });

            if (next.length > 0) objeto.next = next;

            if (next.length > 1) { // AQUI DEBE DE IR LA VALIDACION
              objeto.edgeType = "rhombus";
            } else {
              objeto.edgeType = "round";
            }

            self.data.push(objeto);
          });
          console.log('this.datos');
          console.log(this.datos);
          this.data.filter(x => {
            if (x.id === this.datos.paso.no_paso) {
              x.style = "fill:#60d6fe,stroke:#fff,color:#fff,font-weight:bold";
              // this.paso = x;
            }
          })
          this.loading = false;
        })
        .catch((r) => {});
    },

    cambiar_orientacion(item) {
      this.orientacion_text = item ? item.id : "graph TD";
    },

    cambiar_color(item) {
      this.config.theme = item ? item.id : "forest";
      this.verWorkFlow()
    },

    cambiar_texto() {
      this.verWorkFlow()
    },

    getDatos() {
      let self = this;
      self.$store.state.services.seguimientoactuacionService
        .getDatosFlujo(this.exp.codigo_barra)
        .then((r) => {
          this.datos = r.data;
          console.log('r.data');
          console.log(r.data);
          this.verWorkFlow()
        })
        .catch((r) => {});
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
