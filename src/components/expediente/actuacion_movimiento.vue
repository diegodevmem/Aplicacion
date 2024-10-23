<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Crear Actuación
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
          <div :class="color">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-plus-square-o"></i> Selección del Tramite
              </h1>
            </div>

            <div class="col-12 text-center">
              <h4>
                Número del Expediente: <br><br>
                <strong v-if="form.exp !== null" v-text="form.exp.numero_expediente"></strong>
              </h4>
              <hr>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">

                <!-- TRAMITES -->
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group text-center">
                      <h4>
                        <strong>TRAMITES</strong>
                      </h4>
                      <!-- <label for="unidad_id">Tramites</label> -->
                      <multiselect
                        v-model="form.tramite"
                        @input="getFlujo"
                        :options="tramites"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="false"
                        data-vv-name="tramites"
                        v-validate="'required'"
                        :show-labels="false"
                        label="nombre"
                        track-by="id"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'tramites'"
                        :errors_form="errors"
                      >
                      </FormError>
                      <br>
                    </div>
                  </div>
                </div>

                <!-- NOMBRE Y FECHA -->
                <div class="row">
                  <div class="col-md-8">
                    <div class="form-group text-center">
                      <label for="nombre_actuacion">Nombre de la Actuación</label>
                      <input
                        v-model="form.nombre_actuacion"
                        type="text"
                        class="form-control"
                        id="nombre_actuacion"
                        placeholder="escribir el nombre de la actuación"
                        name="nombre de la Actuación"
                        v-validate="'required|min:1|max:100'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('nombre de la Actuación'),
                        }"
                        @input="
                          form.nombre_actuacion = $event.target.value.toUpperCase(),
                          isActive=false
                        "
                      />
                      <FormError
                        :attribute_name="'nombre de la Actuación'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group text-center">
                      <label for="fecha_ingreso">Fecha de ingreso</label><br>
                      <date-picker
                        v-model="form.fecha"
                        :input-props="{
                          class: 'form-control',
                          placeholder: 'seleccione la fecha de ingreso',

                        }"
                        @change="isActive=false"
                        :disabled-date="notAfterToday"
                        format="DD-MM-YYYY"
                        placeholder="seleccionar fecha"
                        data-vv-name="fecha de ingreso"
                        v-validate="'required|date_format:dd/MM/yyyy'"
                        show-caps
                      ></date-picker>
                      <br>
                      <FormError
                        :attribute_name="'fecha de ingreso'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>

                <!-- PASO SELECCIONADO -->
                <div class="row">
                  <hr>
                  <div class="row">
                    <div class="col-12 text-center">
                      <h4>
                        <strong v-if="form.paso !== null">PASO SELECCIONADO #{{ form.paso.no_paso }}</strong>
                        <strong v-else>PASO SELECCIONADO (NINGUNO)</strong>
                      </h4>
                    </div>
                  </div>
                  <div v-if="form.paso !== null" class="col-md-12 text-center">
                    <!-- <label>Paso Seleccionado: #{{ form.paso.no_paso }}</label><br> -->
                    <br>
                    <label>Nombre: </label>
                    <span>{{ form.paso.paso }}</span><br>
                    <label>Unidad: </label>
                    <span>{{ form.paso.unidad }}</span><br>
                  </div>
                </div>

                <!-- DIAGRAMA -->
                <div v-if="form.tramite !== null" class="accordion" role="tablist">
                  <br>
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.accordion-1 variant="info">PASOS DEL TRAMITE</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                      <b-card-body>
                        <!-- <b-card-text>I start opened because <code>visible</code> is <code>true</code></b-card-text>
                        <b-card-text>{{ text }}</b-card-text> -->
                        <vue-mermaid
                          class="text-center"
                          :nodes="diagrama"
                          :type="orientacion_text"
                          @nodeClick="editNode"
                          :config="config"
                        ></vue-mermaid>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>

                <!-- DOCUMENTOS -->
                <div v-if="form.paso !== null">
                  <hr>
                  <div class="row">
                    <div class="col-12 text-center">
                      <h4>
                        <strong>DOCUMENTOS</strong>
                      </h4>
                    </div>
                  </div>
                  <documentos :documentos="documentos" :documentosGuardar="form.documentos" :folios_correcion="form.folios_correcion" :botones="true" />
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="form-group">
                      <label for="observacion">Observación</label>
                      <textarea
                        v-model="form.observacion"
                        class="form-control"
                        id="observacion"
                        placeholder="escribir la observación del expediente"
                        name="observación"
                        v-validate="'max:250'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('validar.observación'),
                        }"
                        @input="
                          form.observacion = $event.target.value.toUpperCase()
                        "
                      ></textarea>
                      <FormError
                        :attribute_name="'validar.observación'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>

              </form>
            </div>
            <div class="box-footer">
              <button
                type="button"
                class="btn btn-danger btn-sm pull-left"
                @click="clearData"
              >
                <i class="fa fa-ban"></i> Cancelar
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm pull-right"
                @click="create()"
              >
                <i class="fa fa-save"></i> Guardar
              </button>
            </div>
          </div>
        </div>
        <!-- DIAGRAM DEL TRAMITE -->
        <!-- <div v-if="form.tramite !== null" class="col-sm-12 col-md-12 col-lg-12"> -->
          <!-- <div class="box box-primary"> -->
            <!-- <div class="box-header with-border">
              <div class="row">
                <div class="col-sm-12 col-md-2 col-lg-2">
                  <div class="form-group">
                    <label for="orientacion">Posición</label>
                    <multiselect
                      @input="cambiar_orientacion"
                      v-model="orientacion"
                      :options="orientaciones"
                      placeholder="Seleccione uno por favor"
                      :searchable="true"
                      :allow-empty="false"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                  </div>
                </div>
                <div class="col-sm-12 col-md-2 col-lg-2">
                  <div class="form-group">
                    <label for="color">Color</label>
                    <multiselect
                      @input="cambiar_color"
                      v-model="color_diagrama"
                      :options="colores"
                      placeholder="Seleccione uno por favor"
                      :searchable="true"
                      :allow-empty="false"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                  </div>
                </div>
                <div class="col-sm-12 col-md-5 col-lg-5">
                  <div class="form-group">
                    <label for="texto">Descripción de los estados</label>
                    <multiselect
                      @input="cambiar_texto"
                      v-model="texto_diagrama"
                      :options="textos"
                      placeholder="Seleccione uno por favor"
                      :searchable="true"
                      :allow-empty="false"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3">
                  <button
                    class="btn pull-right btn-block btn-primary btn-lg"
                    @click="verWorkFlow"
                  >
                    Recargar proceso de pasos
                  </button>
                </div>
              </div>
            </div> -->
            <!-- <div class="box-body text-center"> -->
              <!-- <vue-mermaid
                v-if="data.length > 0 && form.tramite !== null"
                :nodes="diagrama"
                :type="orientacion_text"
                @nodeClick="editNode"
                :config="config"
              ></vue-mermaid> -->
            <!-- </div> -->
          <!-- </div> -->
        <!-- </div> -->
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
  name: "actuacion_movimiento",
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

      nombreTramite: "",

      loading: false,
      tramites: [],

      orientacion: { id: "graph TD", nombre: "Centrado" },
      orientaciones: [
        { id: "graph TD", nombre: "Centrado" },
        { id: "graph LR", nombre: "De izquierda a derecha" },
        { id: "graph RL", nombre: "De derecha a izquierda" },
      ],
      texto_diagrama: { id: 1, nombre: "Nombre del Paso" },
      textos: [
        { id: 1, nombre: "Nombre del Paso"  },
        { id: 2, nombre: "Nombre de la Unidad"  },
        { id: 3, nombre: "Abreviatura de la Unidad"  },
        { id: 4, nombre: "Nombre del Paso más Nombre de la Unidad"  },
        { id: 5, nombre: "Nombre del Paso más Abreviatura de la Unidad"  },
      ],
      color_diagrama: { id: "default", nombre: "Por defecto" },
      colores: [
        { id: "dark", nombre: "Escala de Grises" },
        { id: "default", nombre: "Por defecto" },
        { id: "forest", nombre: "Bosque" },
        { id: "neutral", nombre: "Normal" },
      ],

      //formulario de campos
      form: {
        tramite: null,
        paso: null,
        exp: null,
        documentos: [],
        folios_correcion: null,
        folio_inicial: 0,
        nombre_actuacion: "",
        observacion: "",
        fecha: null,
      },

      orientacion_text: "graph TD",
      config: {
        theme: "base",
      },
      data: [],
      pasos: [],

      documentos:[
        {
          folio: 0,
          formato: ".PDF",
          formato_id: 1,
          megas: 200,
          requisito: "ADJUNTAR DOCUMENTO",
          estado: "primary",
        }
      ],
      documentosGuardar: [],

    };
  },
  created() {
    let self = this;

    let  decoded = atob(self.$route.params.exp);   
    // console.log(decoded);
    let original = this.fromBinary(decoded);
    this.form.exp = JSON.parse(original);
    // console.log(this.form);
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

    fromBinary(binary) {
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const charCodes = new Uint16Array(bytes.buffer);
      let result = '';
      for (let i = 0; i < charCodes.length; i++) {
        result += String.fromCharCode(charCodes[i]);
      }
      return result;
    },

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
        console.log('this.form.tramite');
        console.log(this.form.tramite);
        this.verWorkFlow();
      }

    },

    editNode(e) {
      e = parseInt(e);
      console.log('e');
      console.log(e);
      this.data.filter(x => {
        x.style !== '' ? x.style = "" : "";
      });
      let nodo = this.data.filter(x => x.id === e)[0];
      nodo.style = "fill:#60d6fe,stroke:#fff,color:#fff,font-weight:bold";
      let paso = this.pasos.filter(x => x.no_paso === e)[0];
      this.form.paso = paso;
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getTramites()])
        .then(() => {
          this.loading = false;
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
        .getWorkFlow(self.form.tramite.id)
        .then((r) => {
          self.loading = false;
          this.pasos = r.data;
          console.log('pasos');
          console.log(r.data);
          r.data.forEach((element) => {
            let objeto = new Object();
            objeto.id = element.no_paso;
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

    getTramites() {
      let self = this;
      self.$store.state.services.tipotramiteService
        .listado()
        .then((r) => {
          this.tramites = r.data;
        })
        .catch((r) => {});
    },

    //funcion para guardar registro
    create() {
      console.log('this.form');
      console.log(this.form);
      this.form.documentos.filter(x => {
        this.form.folio_inicial = this.form.folio_inicial + x.cantidad_folio
      });
      let self = this;
      self.loading = true;

      self.$store.state.services.actuacionService
        .createActuacion(self.form)
        .then((r) => {
          console.log('r.data');
          console.log(r.data);
          self.loading = false;

          // if (r.response) return;

          this.$toastr.success('ACTUACION CREADA EXITOSAMENTE', "EXITO");
          // self.getAll();
          self.clearData();
          this.$router.push(`/exp_cerrados`)
        })
        .catch((r) => {
          this.$toastr.error('HA OCURRIDO UN ERROR', "ERROR");
          console.log(r);
        });
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
<style scoped>
.text {
  font-size: 1em;
  text-align: center;
}

.text-admin {
  font-size: 1.5em;
  text-align: center;
}

.card {
  margin-bottom: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 100%;
  border-radius: 5px;
}

.card-dir {
  padding: 20px;
  height: auto;
  background: white;
}

.card-dash {
  height: auto;
  padding: 20px;
}

.card-admin {
  height: auto;
  padding: 30px;
  background: white;
}

.card-gray {
  background: gray;
}

.card-white {
  background: white;
}

img {
  width: 30%;
  height: auto;
  padding: 2px 16px;
  padding-top: 10;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

img {
  border-radius: 5px 5px 0 0;
}

.container {
  padding: 2px 16px;
}

.gris {
  color: gainsboro;
}

.normal {
  color: black;
}

.grises {
  filter: grayscale(1);
  transition-property: filter;
  transition-duration: 5s;
}

#suba:hover{

  transform: scale(1.1);
  z-index: 100;
  background-color: #25bcff;
  font-weight: bold;
  color: white;
  box-shadow: rgba(60, 208, 228, 0.502) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.56) 0px 22px 70px 4px inset;
  border-radius: 15px;
  transition: transform 0.5s;
  cursor: pointer;
}



#suba span:hover{

  font-weight: bold;
  color: white;

}


/*
  Hide radio button (the round disc)
  we will use just the label to create pushbutton effect
*/
.stv-radio-button {
    display:none;
    margin:10px;
}

/*
  Change the look'n'feel of labels (which are adjacent to radiobuttons).
  Add some margin, padding to label
*/
.stv-radio-button + label {
    display:inline-block;
    margin:-2px;
    padding: 4px 12px;
    background-color: #e7e7e7;
    border-color: #ddd;
    cursor: pointer;

}

   .stv-radio-button + label:first-of-type {
      border-radius: .7em 0 0 .7em;
    }

    .stv-radio-button + label:last-of-type {
      border-radius: 0 .7em .7em 0;
   }

/*
 Change background color for label next to checked radio button
 to make it look like highlighted button
*/
.stv-radio-button:checked + label {
   background-image: none;
    background-color:#216fb8;
    border: 2px solid rgba(0, 73, 133, 0.3);
    color: white;
    box-shadow: rgba(33, 105, 173, 0.502) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.56) 0px 22px 70px 4px inset;

}
</style>
