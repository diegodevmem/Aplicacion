<template>
  <v-app v-if="userFromLawManagement">
    <div class="content-wrapper " v-loading="loading" style=" height: auto">


      <section class="content-header ">
        <h1 class="label bg-primary">
          Formulario Creación Providencia
          <small style="color: white">Sistema de Expedientes</small>
        </h1>
      </section>      
      

      <section class="m-10 mb-14 w-100 larger-text" style="height: 100% ">
        <div
        class="position-relative w-100 h-100 justify-content-center"
        >
          <v-btn color="error"
          style="position: absolute; right:3px; z-index: 1000;"
          @click="openAnularCorrelativoDialog()"
          >
            Anular un Correlativo 
            <!-- <v-icon>
              mdi-cancel
            </v-icon> -->
          </v-btn>
        </div>

        <div class="p-10 box box-primary" style="height: 100% ">

          <div class="my-10 text-center ">
            <h3 class="font-weight-bold">
              DATOS DE LA PROVIDENCIA <v-icon>mdi-file-document-outline</v-icon>
            </h3>
          </div>
          <div class="box-body" style="height:60%; ">
            <v-container>
              <v-form v-model="valid" ref="providenciaForm">
                <v-row
                  class="mb-5 d-flex justify-content-center align-items-center"
                >
                  <!-- <v-col cols="12" md="4">
                    <v-label for="fecha">Fecha<span style="color:red">*</span></v-label>
                    <v-date-picker
                      style="border: 1px solid rgb(135, 135, 135); border-radius: 6px; width: 100%;
                      padding: 0.67rem 0.75rem; font-size: 1rem; line-height: 1.5; color: #495057;
                      "

                      outlined
                      id="fecha"
                      v-model="providenciaDate"
                      :rules="requiredRules"
                    ></v-date-picker>
                  </v-col> -->
                  <v-col cols="12" md="4" class="mt-5">
                    <v-text-field
                      outlined
                      disabled
                      v-model="providenciaInfo.numero_expediente"
                      label="Número de expediente"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" class="mt-5">
                    <v-text-field
                      outlined
                      disabled
                      v-model="providenciaInfo.direccion"
                      label="Dirección"
                    ></v-text-field>
                    <!-- <v-select
                      v-model="providenciaInfo.direccion"
                      :items="memDirections"
                      item-text="name"
                      item-value="name"
                      :rules="requiredRules"
                      label="Dirección"
                      outlined
                    ></v-select> -->
                  </v-col>

                  <!-- <v-col cols="12" md="4" class="mt-5">
                    <v-text-field
                      outlined
                      v-model="providenciaInfo.numero_folio"
                      :rules="requiredRules"
                      :counter="10"
                      label="Número de Folio"
                      hide-details
                      ref="numero_folio"
                    ></v-text-field>
                  </v-col> -->

                  <!-- <v-col cols="12" md="4"  class="mt-5">
                    <v-text-field
                      outlined
                      v-model="providenciaInfo.correlativo"
                      :rules="requiredRules"
                      label="Correlativo"
                    ></v-text-field>
                  </v-col> -  -->

                </v-row>
                <v-row> </v-row>
                <v-label>
                    <v-icon>
                      mdi-card-text-outline
                    </v-icon>
                    Asunto <span style="color:red">*</span>
                  </v-label>
                <main
                  id="sample"
                  class="mt-4"
                  style=" overflow-y: auto; margin-bottom:3%; 
                   height:  auto
                  " 
                >

                  <quillEditor
                    style="  overflow-y: hidden;  height: max-content
                    "
                    class="quillEditor"
                    v-model="providenciaInfo.asuntoHTML"
                    @change="onEditorSubjectChange($event)"
                    :options="editorOption"
                  >
                  </quillEditor>
                </main>
                <div 
                style="margin-bottom:6%;"
                >
                <v-label>
                    <v-icon>
                      mdi-card-text-outline
                    </v-icon>
                    Previo a requisitos
                    <span style="color:red">*</span>
                  </v-label>
                <main
                  id="sample"
                  class="mt-4"
                  style=" overflow-y: auto; margin-bottom:3%; 
                   height:  auto 
                  "
                >

                  <quillEditor
                    style="  overflow-y: hidden;  height: max-content
                    "
                    class="quillEditor"
                    v-model="providenciaInfo.previoHTML"
                    @change="onEditorPrevioChange($event)"
                    :options="editorOption"
                  >
                  </quillEditor>
                </main>
                </div>

                <v-divider> </v-divider>
                <div class="my-12">
                  <div>
                    <v-label class="my-4">
                      <v-icon>mdi-file-document-outline</v-icon>
                      Requisitos <span style="color:red"> *</span>
                    </v-label>
                    <div class="row d-flex align-items-center">
                      <div class="col">
                        <v-text-field
                          outlined
                          label="Título del requisito"
                          v-model="requisito.nombre"
                          ref="requisitoNombre"
                        >
                        </v-text-field>
                      </div>
                      <div class="col">
                        <v-text-field
                          outlined
                          label="Descripción del requisito"
                          v-model="requisito.descripcion"
                          ref="requisitoDescripcion"
                        >
                        </v-text-field>
                      </div>
                      <div class="col">
                        <v-btn
                          color="success"
                          class="white--text w-100"
                          style="height: 65%; "
                          @click="addRequisito"
                        >
                          <v-icon>mdi-plus</v-icon>
                          Añadir requisito
                        </v-btn>
                      </div>
                    </div>

                    <!-- <v-file-input
                    v-model="providenciaInfo.documento"
                    :rules="requiredRules"
                    accept="application/pdf"
                    placeholder="Seleccione un archivo"
                    prepend-icon="mdi-paperclip"
                    label="Archivo"
                    outlined
                  ></v-file-input> -->
                  </div>
                  <v-data-table
                    :headers="[
                      { text: 'No.', value: 'numero' },
                      { text: 'Nombre', value: 'nombre' },
                      { text: 'Descripción', value: 'descripcion' },
                      {
                        text: 'Acciones',
                        value: 'actions',
                        sortable: false
                      }
                    ]"
                    :items="providenciaInfo.requisitos"
                    class="elevation-1"
                    :items-per-page="5"
                  >
                    <template v-slot:item.actions="{ item }">
                      <button
                        color="error"
                        class=""
                        style="background-color: rgb(241, 0, 0); color:white; border-radius: 20%; border: none; height: 30px; width: 30px;"
                        @click="
                          providenciaInfo.requisitos.splice(
                            providenciaInfo.requisitos.indexOf(item),
                            1
                          )
                        "
                      >
                        <v-icon style="color:white">mdi-delete</v-icon>
                      </button>
                    </template>
                  </v-data-table>
                </div>
                <v-divider> </v-divider>
                <v-label>
                    <v-icon>mdi-format-align-left</v-icon>
                    Conclusión <span style="color:red"> *</span>
                  </v-label>
                <main
                  id="sample"
                  class="mt-4"
                  style=" overflow-y: auto; margin-bottom:3%; 
                   height:  auto 
                  "
                >

                  <quillEditor
                    style= "overflow-y: hidden;  height: max-content "
                    @change="onEditorBodyChange($event)"
                    ref="myQuillEditor"
                    :options="editorOption"
                    v-model="providenciaInfo.conclusionHTML"
                  >
                  </quillEditor>
                </main>
              </v-form>
              <div
                class="mb-5"
                style="display: flex; justify-content: center; align-items: center;"
              >
                <button
                  type="button"
                  class="btn button btn-lg pull-right w-25"
                  @click="submitProvidencia()"
                  :disabled="isFormValid"
                >
                  <i class="fa fa-save"></i> Crear Providencia
                </button>
              </div>
            </v-container>
          </div>
        </div>

        <v-dialog
    v-model="cancelCorrelativeDialog"
    max-width="600"
    >
      <v-card
        style="padding :15px;"
      >
      <v-form
        ref="cancelCorrelativeForm" v-model="valid" lazy-validation
      >
        <v-card-title>
          <span class="headline">Anular Correlativo</span>
        </v-card-title>
        <v-card-text>
          <v-row>
          
              
            
            <v-col cols="12" md="12">
              <v-text-field
                v-model="cancelCorrelativePayload.numero_correlativo"
                label="Número de Correlativo"
                outlined
                :rules="requiredRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
              :rules="requiredRules"
                v-model="cancelCorrelativePayload.observacion"
                label="Observación"
                outlined
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions
          style="display: flex; justify-content: center; align-items: center;"
        >
          <v-spacer></v-spacer>
          <v-btn
            class="m-2 text-white"
            color="orange darken-2"
            flat
            style="color:white"
            @click="submitCancelCorrelative()"
          >
           Confirmar Anulación
          </v-btn>
          <v-btn
            class="m-2 text-white"
            color="red darken-1"
            flat
            style="color:white"
            @click="closeCancelCorrelativeDialog()"
          >
            Cancelar
          </v-btn>

        </v-card-actions>
      </v-form>
      </v-card>

    </v-dialog>
    <v-dialog v-model="pdfDialog" style="position: relative" overlay-color="black" max-width="1000"
      @click:outside="closePdfViewerDialog">
      <v-overlay :value="loading" color="white" opacity="0.5" transition="scale-transition">
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
      </v-overlay>
      
      <div class="d-flex align-content-center" style="
          flex-direction: row;
          position: relative;
          height: 60px;
          width:auto;
          background-color: white;
 
        ">
        <div class="d-flex align-content-center" style="
          flex-direction: row;
          position: relative;
          width:100%;
          background-color: white;
          justify-content: center;
        ">
        <h3 class="font-weight-bold">VISTA PREVIA</h3> <v-icon>
          mdi-file-pdf
        </v-icon>
      </div>
        <v-btn @click="closePdfViewerDialog" color="red darken-1" style="width: 40px; z-index: 1000;color:white;position: absolute;right: 0px;" class="">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <iframe :src="providencia_src" height="550" width="300"
      
      > </iframe>

      <div class="py-4 d-flex justify-content-center align-content-center" style="
          flex-direction: row;
          background-color: rgb(255 255 255);
          border-radius: 0 0 10px 10px;
          justify-content: center;
          width:auto;
        ">
         <v-btn  class="m-4 text-white fs-5" style="width: 18rem; height: 3rem;color:white;margin: 2px;" color="#4ea11a"
          @click="confirmProvidencia()" variant="flat">
            Confirmar
          <v-icon dark class="ml-1 text-center" v-if="!loading">
            mdi-check
          </v-icon>
        </v-btn>
        <v-btn   class="m-4 text-white fs-5" style="width: 18rem; height: 3rem;color:white;margin: 2px;" color="#f44336"
          @click="closePdfViewerDialog" variant="flat">
          Cancelar

          <v-icon dark class="ml-1 text-center" v-if="!loading">
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </v-dialog>
      </section>
  
    </div>

  </v-app>
  <RestrictedView v-else></RestrictedView>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

import RestrictedView from "../../shared/Rechazado.vue";

export default {
  components: {
    quillEditor,
    RestrictedView
  },
  data() {
    return {
      cancelCorrelativePayload: {
        numero_correlativo: "",
        observacion: ""
      },
      cancelCorrelativeDialog: false, 
      loading: false,
      providenciaInfo: {
        direccion_abreviacion: "",
        direccion: "",
        // numero_folio: "",
        // correlativo: "",
        fecha: null,
        previoText: "",
        previoHTML: "",
        asuntoHTML: "",
        asuntoText: "",
        conclusionHTML: "",
        conclusionText: "",
        numero_expediente: "",
        requisitos: [],
        expediente_id: null
      },
      requisito: {
        nombre: "",
        descripcion: ""
      },
      providenciaAsunto: "",
      providenciaDate: null,
      memDirections: [
        { name: "Dirección General de Hidrocarburos", abbreviation: "DGH" },
        { name: "Dirección General de Minería", abbreviation: "DGM" },
        { name: "Dirección General de Energía", abbreviation: "DGE" }
      ],

      requiredRules: [v => !!v || "Este campo es requerido"],
      directionRules: [v => !!v || "Please select a direction"],
      isFormValid: false,
      resolutionNumberRules: [
        v => !!v || "Número de resolución es requerido",
        v =>
          (v && v.length >= 1) ||
          "Número de resolución debe tener al menos 10 caracteres"
      ],
      folioNumberRules: [v => !!v || "Número de folio es requerido"],
      valid: false,
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"]
            //   ["blockquote", "code-block"],
            //   [{ header: 1 }, { header: 2 }],
            //   [{ list: "ordered" }, { list: "bullet" }],
            //   [{ script: "sub" }, { script: "super" }],
            //   [{ indent: "-1" }, { indent: "+1" }],
            //   [{ direction: "rtl" }],
            //   [{ size: ["small", false, "large", "huge"] }],
            //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
            //   [{ color: [] }, { background: [] }],
            //   [{ font: [] }],
            //   [{ align: [] }],
            //   ["clean"],
            //   ["link", "image", "video"]
          ]
        }
      },

      testPayload: {
        direccion: "Direción General de Hidrocarburos",
        numero_folio: "564654",
        // correlativo: "546545",
        fecha: "Guatemala 24 de noviembre de 2023",
        asuntoHTML: "<p><strong>TEXTO de ASUNTO</strong></p>",
        descripcionHTML:
          "<p><strong><em><u>TEXTO</u></em></strong></p><p><u>Prueba</u></p><p><br></p><p><em>Italic</em></p>",
        numero_expediente: "DGH-505-2023",
        requisitos: [
          { nombre: "Requisito 1", descripcion: "Descripcion 1" },
          { nombre: "Requisito 2", descripcion: "Descripcion 2" },
          { nombre: "Requisito 3", descripcion: "Descripcion 3" }
        ]
      },
      userFromLawManagement: false,
      pdfDialog: false,
      providencia_src: ""
    };
  },
  watch: {
    providenciaDate: function(val) {
      const date = new Date(val);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
      };

      const formattedDate = date.toLocaleDateString("es-GT", options);
      const output = `Guatemala ${formattedDate}`;
      this.providenciaInfo.fecha = output;
    },
    "providenciaInfo.numero_folio": function(val) {
      // console.log(this.$refs.numero_folio);
    },
    "providenciaInfo.direccion": function(val) {
      // const direccion = this.memDirections.find(x => x.name === val);
      // this.providenciaInfo.direccion_abreviacion = direccion.abbreviation;
    },
    "providenciaInfo.requisitos": function(val) {
 
    }
  },
  created() {
    
    this.verifyUnitUser();
    this.getExpediente();
    // expediente_seleccionado
  },
  methods: {
    closePdfViewerDialog() {
      this.pdfDialog = false;
    },
    async getExpediente(){
      const expediente_seleccionado = this.$store.state.expediente_seleccionado;
      if(expediente_seleccionado === null){
        this.$toastr.warning(
          "¡Error!",
          "No se encuentra ningún expediente seleccionado"
        );
        this.$router.push("/exp_mis_expedientes");
        return;
      }
      this.providenciaInfo.numero_expediente = expediente_seleccionado.numero_expediente;
      this.providenciaInfo.expediente_id = parseInt(expediente_seleccionado.id)
      this.providenciaInfo.direccion = expediente_seleccionado.direccion;
      // find the direccion object from the memDirections
      const direccion = this.memDirections.find(direction => {
        if(direction.name.toLowerCase() === expediente_seleccionado.direccion.toLowerCase()){
          return direction;
        }

      });
      if(!direccion) return
      this.providenciaInfo.direccion_abreviacion = direccion.abbreviation ? direccion.abbreviation : "-";

    },

    async addRequisito() {
      const valid = await this.validateRequirementForm();
      // if (this.requisito.nombre === "" || this.requisito.descripcion === "") {
      if (!valid) {
        this.$toastr.warning(
          "¡Por favor llenar la información del requ!",
          "Requisito Incompleto"
        );
        // show error message of the v-text-field
        return;
      }
      this.requisito.numero = this.providenciaInfo.requisitos.length + 1;
      this.providenciaInfo.requisitos.push(this.requisito);
      this.requisito = {
        nombre: "",
        descripcion: ""
      };
    },

    async verifyUnitUser() {
      const userUnidadId = sessionStorage.getItem("userUnidadId");
    const GestionLegalUnidadesId = [68, 25, 38, 42];
    this.userFromLawManagement = GestionLegalUnidadesId.includes(
      parseInt(userUnidadId)
    );
    },

    onEditorSubjectChange({ quill, html, text }) {
      let stringWithoutNewlines = text.replace(/\n/g, " ");
      this.providenciaInfo.asuntoHTML = html;
      this.providenciaInfo.asuntoText = stringWithoutNewlines;
    },

    onEditorBodyChange({ quill, html, text }) {
      let stringWithoutNewlines = text.replace(/\n/g, " ");
      this.providenciaInfo.conclusionHTML = html;
      this.providenciaInfo.conclusionText = stringWithoutNewlines;
    },

    onEditorPrevioChange({ quill, html, text }) {
      let stringWithoutNewlines = text.replace(/\n/g, " ");
      this.providenciaInfo.previoHTML = html;
      this.providenciaInfo.previoText = stringWithoutNewlines;
    },

 
    async submitProvidencia() {
      try {
        const valid = await this.validateForm();
        console.log("Creando providencia, payload:", this.providenciaInfo);

        if (
          !valid ||
          this.providenciaInfo.asuntoHTML === "" ||
          this.providenciaInfo.conclusionHTML === "" ||
          this.providenciaInfo.requisitos.length === 0
        ) {
          this.$toastr.warning(
            "¡Debe completar los campos requeridos!",
            "Campos requeridos"
          );
          return;
        }
        this.loading = true;
        let r = await this.$store.state.services.documentosService.createProvidencia(
          this.providenciaInfo
        );
        if(r.status === 200){
          this.$toastr.success(
            "¡Providencia creada con éxito!",
            "Creación de providencia"
          );
          // this.$store.state.expediente_seleccionado = null;

            console.log(r.data.data )
            let pdfData = this._base64ToArrayBuffer(r.data.data);
            let file = new Blob([pdfData], { type: "application/pdf" });
            let fileUrl = URL.createObjectURL(file);

            this.providencia_src = fileUrl;
            this.pdfDialog = true;  




          // this.$router.push("/exp_mis_expedientes");
          // create a providencia and download it. Would u like to create another one?
        }
        // documento_providencia
        this.loading = false;
      } catch (error) {
        console.log("error en la creacion de providencia", error);
        this.loading = false;
      }
    },

    async confirmProvidencia() {
      try {
          this.loading = true;
                      // in order to download the file from the base64 string i need to create a blob and then create a url from that blob
            const link = document.createElement('a');
            link.href = this.providencia_src;
            link.download = `Providencia_${this.providenciaInfo.numero_expediente}.pdf`;
            link.click();
            this.pdfDialog = false;
            setTimeout(() => {
              this.$router.push("/exp_mis_expedientes");
            }, 1500);
        }catch (error) {
          console.log("error en la creacion de providencia", error);
          this.loading = false;
        }finally{
          this.loading = false;
          this.pdfDialog = false;
          this.providencia_src = "";
          this.$store.state.expediente_seleccionado = null;
        }
    },

    async validateForm() {
      // validate the v-for except for the v-text-field of the requisitos which are refs.requisitoNombre and refs.requisitoDescripcion
      // if (this.providenciaInfo.fecha === null) {
      //   this.$toastr.warning(
      //     "¡Debe seleccionar una fecha!",
      //     "Campos requeridos"
      //   );
      //   return false;
      // }

      const isValid = await this.$refs.providenciaForm.validate();
      return isValid;
    },
    async validateRequirementForm() {
      const isNombreEmpty = this.requisito.nombre.trim() === "";
      const isDescripcionEmpty = this.requisito.descripcion.trim() === "";
      if (isNombreEmpty || isDescripcionEmpty) {
        return false;
      }
      return true;
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


      openAnularCorrelativoDialog(){
        this.cancelCorrelativeDialog = true;
     },

     async submitCancelCorrelative(){
      const isValid = await this.$refs.cancelCorrelativeForm.validate();
      if(!isValid){
        this.$toastr.warning(
          "¡Debe completar los campos requeridos!",
          "Campos requeridos"
        );
        return;
      }
       let response = await this.$store.state.services.documentosService.postCancelCorrelative(
          this.cancelCorrelativePayload
        );

        if(response.status === 200){
          this.$toastr.success(
            "¡Correlativo anulado con éxito!",
            "Anulación de correlativo"
          );
          this.closeCancelCorrelativeDialog();
        }
       console.log("response", response);
       console.log("Anulando correlativo", this.cancelCorrelativePayload);
     },

     closeCancelCorrelativeDialog(){
      console.log("close that shit")
        this.cancelCorrelativeDialog = false;
        this.cancelCorrelativePayload = {
          numero_correlativo: "",
          observacion: ""
       }
      }
       
  }
};
</script>

<style scoped>
.button {
  background-color: rgb(0, 153, 255);
  color: white;
}

.larger-text {
  /* font-size: 15em !important  */
}

.quillEditor::-webkit-scrollbar {
  display: none;
}
</style>
