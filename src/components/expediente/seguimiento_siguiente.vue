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
            <li><i class="fa fa-bug active"></i> Avanzar en el proceso</li>
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
                      Información del paso siguiente
                    </h5>
                    <span class="description-text"
                      >Paso siguiente: {{ siguiente_paso }}</span
                    ><br />
                    <span class="description-text"
                      >Nombre del paso siguiente: {{ paso }}</span
                    ><br />
                    <span class="description-text">Destino: {{ unidad }}</span>
                  </div>
                </div>
                <div class="col-sm-12 col-md-1 col-lg-1"></div>
                <div class="col-sm-12 col-md-12 col-lg-12"><hr /></div>
              </div>

              <div class="row">
                <div class="col-sm-12 col-md-6 border-right">
                  <div class="row">
                    <div class="col-sm-12 col-md-4 col-lg-4">
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
                          v-validate="'min:1|max:40'"
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
                    <div class="col-sm-12 col-md-4 col-lg-4">
                      <!-- <div class="form-group"> -->
                      <label>Confidencial</label>
                      <input
                        class="checkbox"
                        type="checkbox"
                        v-model="form.confidencial"
                      />
                      <!-- </div> -->
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
                          v-validate="'mimes:application/pdf'"
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
                          v-validate="'min:1|max:2500'"
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
                  <iframe
                    :src="src.toString()"
                    v-if="form.path != ''"
                    style="width: 100%; height: 60vh; border: none"
                  />
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
// import PSPDFKitContainer from "../PSPDFKitContainer/PSPDFKitContainer.vue";
import FormError from "../shared/FormError";
import pdf from "vue-pdf";
// import pdfv from "pdfvuer";
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
    // pdfv,
    // PSPDFKitContainer,
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
        observacion: " ",
        numero_doc: "",
        tipo_documento_id: null,
        adjuntar: false,
        actuacion_id: 0,
        cantidad_folio: 0,
        size: 0,
        path: "",
        unidad_paso: 0,
        retroceder: false,
        confidencial: false,
        nombre_documento: " ",
      },
      src:'',

      pdfFile: this.pdfFile || "/example.pdf",
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
    self.form.adjuntar =
      atob(self.$route.params.adjuntar) == "false" ? false : true;
    self.form.actuacion_id = self.actuacion_id;
    self.form.unidad_paso = atob(self.$route.params.unidad_paso);
    self.getPromise();
  },
  computed: {},
  methods: {
    handleLoaded(instance, hola) {
      console.log("hola ", hola);
      console.log("PSPDFKit has loaded: ", instance);
      // Do something.
    },

    openDocument() {
      // To access the Vue instance data properties, use `this` keyword.
      if (this.pdfFile) {
        window.URL.revokeObjectURL(this.pdfFile);
      }
      this.pdfFile = window.URL.createObjectURL(event.target.files[0]);
    },

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
      let self = this;

      console.log("self.form");
      console.log(self.form);

      if (this.form.size > 0) {
        if (this.form.tipo_documento_id == null || this.form.numero_doc == "") {
          this.$toastr.error(
            "Si adjunta un documento , es necesario que llene las celdas Tipo documento y Número de documento ",
            "Atención"
          );
          return;
        }
      }

      self.$validator.validateAll().then((result) => {
        if (result) {
          self.loading = true;

          self.$store.state.services.seguimientoactuacionService
            .create(self.form)
            .then((r) => {
              self.loading = false;
              this.src='';

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
                  self.$router.push("/exp_mis_expedientes");
                });
            })
            .catch((r) => {
              console.log(r);
            });
        } else {
          this.$toastr.error("Verificar los datos", "Mensaje");
        }
      });
      console.log("this.form");
      console.log(this.form);
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
      let equivalente = parseFloat(tamanio / 1048576);
      self.form.nombre_documento = file.name;
      let extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      self.numPages = 0;

      if (
        formato.substring(formato.lastIndexOf(".")) !== extension.toLowerCase()
      ) {
        self.$swal("El formato del documeto debe de ser " + formato);
        self.loading = false;
      } else {
        if (equivalente <= 25) {
          reader.onload = (e) => {
            // this.src = pdf.createLoadingTask(e.target.result);
            // this.src.promise.then((pdf) => {

            self.form.size = tamanio;
            // self.form.path = e.target.result;

            let pdfData = this._base64ToArrayBuffer(e.target.result);
            let file = new Blob([pdfData], { type: "application/pdf" });
            let fileUrl = URL.createObjectURL(file);
            self.form.path = e.target.result;
            this.src = fileUrl;
            // console.log(this.form.path);
            self
              .$swal({
                position: "top-end",
                type: "success",
                title: "Documento agregado correctamente",
                showConfirmButton: false,
                timer: 1500,
              })
              .catch((e) => {
                console.log("error");
                console.log(e);
              });
            self.loading = false;
            // });
          };

          reader.readAsDataURL(file);

          let reader2 = new FileReader();
          reader2.readAsBinaryString(file);
          reader2.onloadend = function () {
            let count = reader2.result.match(/\/Type[\s]*\/Page[^s]/g).length;
            self.numPages = count;
            self.form.cantidad_folio = count;
            console.log("Number of Pages:", count);
          };
        } else {
          self.$swal({
            html: '<a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank"><h1>Dar clic aquí</h1></a> ',
            title:
              "El tamaño del documento debe de tener menos de " +
              "25" +
              " MB y el documento tiene " +
              parseFloat(equivalente).toFixed(2) +
              " MB" +
              " " +
              "Le recomendamos usar la siguiente herramienta para comprimir sus archivos PDF",
          });
          self.loading = false;
        }
      }
    },

    _base64ToArrayBuffer(base64) {
      console.log("llego");
      let binary_string = atob(base64.toString().split(",")[1]);
      console.log(binary_string);
      let len = binary_string.length;
      let bytes = new Uint8Array(len);
      console.log(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }

      return bytes.buffer;
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>

<style>
.custom-file-upload {
  border: 1px solid #ccc;
  border-radius: 4px;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background: #4a8fed;
  padding: 10px;
  color: #fff;
  font: inherit;
  font-size: 16px;
  font-weight: bold;
}
</style>
