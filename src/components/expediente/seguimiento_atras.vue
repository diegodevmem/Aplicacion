<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Avanzar en el proceso
        <small style="color: white">Sistema de Catálogo</small>
      </h1>
    </section>
    <br />
    <section class="content">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <ol class="label breadcrumb bg-gray pull-right">
            <router-link tag="li" to="/exp_default" exact>
              <i class="fa fa-home"></i> Home
            </router-link>
            <router-link tag="li" to="/" exact>
              <i class="fa fa-dashboard"></i> Dashboard
            </router-link>
            <router-link tag="li" to="/exp_expediente" exact>
              <i class="fa fa-circle-o"></i> Expedientes
            </router-link>
            <router-link tag="li" :to="url" exact>
              <i class="fa fa-circle-o"></i> Actuaciones del Expediente
              {{ numero_expediente }}
            </router-link>
            <li><i class="fa fa-bug active"></i> Retorceder en el proceso</li>
          </ol>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-widget widget-user">
            <div class="widget-user-header bg-aqua-active text-center">
              <h1 class="widget-user-username">
                Expediente número <strong>{{ numero_expediente }}</strong>
              </h1>
              <h3 class="widget-user-desc">
                Código de la actuación <strong>{{ codigo_barra }}</strong>
              </h3>
            </div>
            <div class="box-footer">
              <div class="row">
                <div class="col-sm-12 col-md-1 col-lg-1"></div>
                <div class="col-sm-12 col-md-10 col-lg-10 bg-success">
                  <div class="description-block">
                    <h5 class="description-header text-center">
                      Información del paso anterior
                    </h5>
                    <span class="description-text"
                      >Paso anterior: {{ siguiente_paso }}</span
                    ><br />
                    <span class="description-text"
                      >Nombre del paso anterior: {{ paso }}</span
                    ><br />
                    <span class="description-text">Destino: {{ unidad }}</span>
                  </div>
                </div>
                <div class="col-sm-12 col-md-1 col-lg-1"></div>
                <div class="col-sm-12 col-md-12 col-lg-12"><hr /></div>
              </div>
              <div class="row" v-if="form.adjuntar">
                <div class="col-sm-12 col-md-6 col-lg-6 border-right">
                  <div class="row">
                    <div class="col-sm-12 col-md-8 col-lg-8">
                      <div class="form-group">
                        <label for="tipo de documento">Tipo de documento</label>
                        <multiselect
                          v-model="form.tipo_documento_id"
                          :options="tipos_documento"
                          placeholder="Seleccione uno por favor"
                          :searchable="true"
                          :allow-empty="true"
                          :preselect-first="false"
                          data-vv-name="tipo de documento"
                          v-validate="'required'"
                          :show-labels="false"
                          :show-no-result="true"
                          label="nombre"
                          track-by="id"
                        >
                          <span slot="noResult"
                            >No se encontró información</span
                          >
                        </multiselect>
                        <FormError
                          :attribute_name="'tipo de documento'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4">
                      <div class="form-group">
                        <label for="numero_doc">Número de documento</label>
                        <input
                          v-model="form.numero_doc"
                          type="text"
                          class="form-control"
                          placeholder="Escribir número del documento"
                          name="número del documento"
                          v-validate="'required|min:1|max:40'"
                          :class="{
                            input: true,
                            'has-errors': errors.has('número del documento'),
                          }"
                          @input="
                            form.numero_doc = $event.target.value.toUpperCase()
                          "
                        />
                        <FormError
                          :attribute_name="'número del documento'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-12">
                      <div class="input-group input-group-lg">
                        <div class="input-group-btn">
                          <button
                            type="button"
                            class="btn btn-primary btn-small btn-disabled"
                          >
                            Documento |
                          </button>
                        </div>
                        <input
                          type="file"
                          accept="application/pdf"
                          data-vv-name="documento"
                          v-validate="'required|mimes:application/pdf'"
                          name="documento"
                          @change="onFileChange($event)"
                          ref="inputFile"
                          class="form-control inputfile inputfile-6"
                        />
                        <FormError
                          :attribute_name="'documento'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 text-right">
                      <small>Páginas {{ form.cantidad_folio }}</small>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 text-right">
                      <small>Tamaño {{ form.size }} bytes</small>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-12">
                      <div class="form-group">
                        <label for="observacion">Observación</label>
                        <textarea
                          cols="30"
                          rows="10"
                          v-model="form.observacion"
                          type="textarea"
                          class="form-control"
                          id="observacion"
                          placeholder="escribir la observación"
                          name="observacion"
                          v-validate="'required|min:3|max:2500'"
                          :class="{
                            input: true,
                            'has-errors': errors.has('observacion'),
                          }"
                          @input="
                            form.observacion = $event.target.value.toUpperCase()
                          "
                        />
                        <FormError
                          :attribute_name="'observacion'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-12 col-lg-12 text-red">
                    <small
                      >La información que ingrese en este formulario es la que
                      aparecera en el seguimiento histórico de la actuación
                      {{ codigo_barra }}, los documentos serán agregados al
                      expedientes.</small
                    >
                  </div>
                  <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="box-footer">
                      <button
                        type="button"
                        class="btn btn-danger btn-block btn-large pull-left"
                        @click="clearData"
                      >
                        <i class="fa fa-ban"></i> Cancelar
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-block btn-large pull-right"
                        @click="guardar"
                      >
                        <i class="fa fa-save"></i> Guardar
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6">
                  <embed
                    :src="form.path"
                    type="application/pdf"
                    width="100%"
                    height="60%"
                  />
                </div>
              </div>
              <div class="row" v-if="!form.adjuntar">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="form-group">
                    <label for="observacion">Observación</label>
                    <textarea
                      cols="30"
                      rows="10"
                      v-model="form.observacion"
                      type="textarea"
                      class="form-control"
                      id="observacion"
                      placeholder="escribir la observación"
                      name="observacion"
                      v-validate="'required|min:3|max:2500'"
                      :class="{
                        input: true,
                        'has-errors': errors.has('observacion'),
                      }"
                      @input="
                        form.observacion = $event.target.value.toUpperCase()
                      "
                    />
                    <FormError
                      :attribute_name="'observacion'"
                      :errors_form="errors"
                    >
                    </FormError>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12 text-red">
                  <small
                    >La información que ingrese en este formulario es la que
                    aparecera en el seguimiento histórico de la actuación
                    {{ codigo_barra }}.</small
                  >
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="box-footer">
                    <button
                      type="button"
                      class="btn btn-danger btn-block btn-large pull-left"
                      @click="clearData"
                    >
                      <i class="fa fa-ban"></i> Cancelar
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary btn-block btn-large pull-right"
                      @click="guardar"
                    >
                      <i class="fa fa-save"></i> Guardar
                    </button>
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
import pdf from "vue-pdf";
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle,
} from "vue-enhanced-check";

export default {
  name: "SeguimientoSiguienteExp",
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    pdf,
  },
  data() {
    return {
      loading: false,
      expediente_id: 0,
      actuacion_id: 0,
      numero_expediente: "",
      codigo_barra: "",
      url: "",
      tipo_tramite_id: "",
      tipos_documento: [],
      paso: null,
      unidad: null,
      siguiente_paso: null,
      doc: null,

      numPages: 0,
      src: "",

      form: {
        observacion: "",
        numero_doc: "",
        tipo_documento_id: null,
        adjuntar: false,
        actuacion_id: 0,
        cantidad_folio: 0,
        size: 0,
        path: "",
        unidad_paso: 0,
        retroceder: true
      },
    };
  },
  created() {
    let self = this;
    self.actuacion_id = atob(self.$route.params.actuacion);
    self.expediente_id = atob(self.$route.params.expediente_id);
    self.codigo_barra = atob(self.$route.params.codigo_barra);
    self.paso = atob(self.$route.params.paso);
    self.unidad = atob(self.$route.params.unidad);
    self.siguiente_paso = atob(self.$route.params.siguiente_paso);
    self.numero_expediente = atob(
      self.$route.params.numero_expediente
    ).toUpperCase();
    self.tipo_tramite_id = atob(self.$route.params.tipo_tramite_id);
    self.url =
      "/exp_actuaciones/" +
      btoa(self.tipo_tramite_id) +
      "/" +
      btoa(self.numero_expediente.toLowerCase()) +
      "/" +
      btoa(self.expediente_id);
    self.form.adjuntar = false;
    self.form.actuacion_id = self.actuacion_id;
    self.form.unidad_paso = atob(self.$route.params.unidad_paso);
    self.getPromise();
  },
  computed: {},
  methods: {
    getPromise() {
      this.loading = true;
      Promise.all([this.getTipoDocumento()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    getTipoDocumento() {
      let self = this;
      self.tipos_documento = [];
      self.$store.state.services.tipodocumentoService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.tipos_documento.push(element);
          });
        })
        .catch((r) => {});
    },

    clearData() {
      let self = this;
      self.form.observacion = "";
      self.form.numero_doc = "";
      self.form.tipo_documento_id = null;
      self.form.cantidad_folio = 0;
      self.form.size = 0;
      self.form.path = "";
      self.$refs.inputFile.value = null;
    },

    guardar() {
        let self = this
      self.$validator.validateAll().then((result) => {
        if (result) {
          self.loading = true;

          self.$store.state.services.seguimientoactuacionService
            .create(self.form)
            .then((r) => {
              self.loading = false;

              if (r.response) return;

              this.$toastr.success(r.data, "Mensaje");

              self
                .$swal({
                  title: "Mensaje",
                  text: r.data,
                  type: "success",
                  showCancelButton: false,
                })
                .then((result) => {
                  self.$router.push({ path: self.url });
                });
            })
            .catch((r) => {
              console.log(r);
            });
        } else {
          this.$toastr.error("Verificar los datos", "Mensaje");
        }
      });
    },

    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.loading = true;
      this.form.cantidad_folio = 0;
      this.form.size = 0;
      this.form.path = "";
      if (!files.length) {
        this.loading = false;
        return;
      } else {
        this.validarDocumento(files[0]);
      }
    },

    validarDocumento(file) {
      let self = this;
      let reader = new FileReader();
      let tamanio = file.size;
      let formato = ".pdf";
      let equivalente = parseFloat(tamanio / 1000000);
      let extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      this.numPages = 0;

      if (
        formato.substring(formato.lastIndexOf(".")) !== extension.toLowerCase()
      ) {
        self.$swal("El formato del documeto debe de ser " + formato);
        self.loading = false;
      } else {
        if (equivalente < 5) {
          reader.onload = (e) => {
            this.src = pdf.createLoadingTask(e.target.result);
            this.src.promise.then((pdf) => {
              this.form.cantidad_folio = pdf.numPages;
              this.form.size = tamanio;
              this.form.path = e.target.result;
              self.$swal({
                position: "top-end",
                type: "success",
                title: "Documento agregado correctamente",
                showConfirmButton: false,
                timer: 1500,
              });
              self.loading = false;
            });
          };

          reader.readAsDataURL(file);
        } else {
          self.$swal(
            "El tamaño del documento debe de tener menos de " +
              5 +
              " MB y el documento tiene " +
              equivalente +
              " MB" 
              + " " + "Le recomendamos usar la siguiente herramienta para comprimir sus archivos " +
              "smallpdf.com/es/comprimir-pdf" 
          );
          self.loading = false;
        }
      }
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>