<template>
  <v-app>
    <div>
      <div class="content-wrapper" v-loading="loading">
        <section class="content-header">
          <h1 class="label bg-primary">
            Adhesión Electronica
            <small style="color: white">Sistema de Expedientes</small>
          </h1>
        </section>
        <section class="content">
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="box box-primary" id="p0">
                <div class="box-body">
                  <label for="search-input">DPI de razón social:</label>
                  <br />
                  <div class="box-tools" style="height: 50px;">
                    <div class="d-flex justify-left align-left">
                      <input id="search-input" type="text" style="border-radius: 5px; width: 40%; left:0%"
                        name="table_search" class="form-control" placeholder="Ingrese DPI" v-model="search"
                        :disabled="user_dpi" />
                      <div class="input-group-append ml-2">
                        <button class="btn custom-button" @click="getAdhesion()" type="button">
                          Buscar
                        </button>
                        <button class="btn bg-yellow" @click="cleanDpiInput()" type="button">
                          Limpiar DPI
                        </button>
                      </div>
                    </div>
                  </div>
                  <v-divider></v-divider>

                  <label for="nit">Nombre razón social: </label>
                  <div class="box-tools" style="height: 50px;">
                    <div style="position: relative; width: 100%;">
                      <div style="position: absolute; width: 40%;">
                        <div class="form-group">
                          <autocomplete ref="autocomplete" :search="searchNombreRazonSocial"
                            :default-value="autocomplete_value" placeholder="Ingrese nombre de razón social"
                            aria-label="Ingrese nombre de razón social" id="razon_social_input"
                            @submit="seleccionarRazonSocial" :get-result-value="getResultValue">
                          </autocomplete>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div class="m-8 text-center" v-if="show_error_message">
                    <div class="text-center">
                      <v-spacer></v-spacer>
                      <div class="p-3 d-inline-block">
                        <span class="m-3">{{ error_message }}</span>
                      </div>
                      <br />
                      <v-spacer></v-spacer>
                      <span v-if="warning_icon" class="material-icons"
                        style="color: rgb(224, 127, 0); background-clip: text; background-image: -webkit-linear-gradient(top, rgb(255, 255, 255), rgb(255, 255, 255));">
                        warning
                      </span>
                      <span v-if="sucess_icon" class="material-icons"
                        style="color: rgb(0, 224, 67); background-clip: text; background-image: -webkit-linear-gradient(top, rgb(255, 255, 255), rgb(255, 255, 255));">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <br />
                  <div class="m-8 text-center" v-if="adhesion_uploader">
                    <div class="text-center">
                      <!-- <div class="p-3 d-inline-block">
                        <span class="m-3">El usuario con DPI
                          <strong>{{ this.search }}</strong> aún no posee
                          adhesión electrónica en el sistema.</span>
                        <br />
                        <v-card class="container custom-file text-center "
                          style="border: 1px solid #3c8dbc ; padding: 8px; border-radius: 10px; width: 100%; margin-right: 20%; margin-top: 20px; margin-bottom: 20px;">
                          <span v-if="selectedFile" class="pull-right" @click="clearFileInput()"
                            style="z-index: 1000px; cursor: pointer;">
                            <i class="fa fa-trash fa-2x" style="color: rgb(197, 0, 0);"></i>
                          </span>
                          <input ref="fileInput" type="file" class="custom-file-input" @change="handleFileChange"
                            style="height: 15%;" />
                          <img v-if="selectedFile" :src="require('../../assets/pdf_icon.png')"
                            style="width: 40px; height: 40px;" />
                        </v-card>
                      </div> -->
                    </div>

                    <template>
                      <v-spacer></v-spacer>
                      <div class="d-flex justify-center align-center">
                        <v-btn v-bind="size" color="success" class="mr-4 mt-2 text-center"
                          @click="dialog_terms_doc = true">
                          <v-icon>fact_check</v-icon>
                          Leer términos
                        </v-btn>
                      </div>
                      <div class="d-flex justify-center align-center">
                        <v-checkbox v-model="termsAccepted" label="Acepto términos de responsabilidad"></v-checkbox>
                      </div>
                      <v-spacer></v-spacer>
                    </template>
                    <div class="" v-if="termsAccepted">
                      <button type="button" class="btn btn-lg pull-center custom-button" @click="saveAdhesion()">
                        <i class="fa fa-save"></i> Añadir Adhesión electrónica
                      </button>
                    </div>
                  </div>
                  <div class="m-8 text-center" v-if="adhesion_view && user_has_document">
                    <button @click="seeAdhesion()" type="button" class="btn btn-primary btn-lg">
                      <i class="fa fa-eye"></i> Visualizar Adhesión Electrónica
                    </button>
                  </div>
                </div>
                <div class="box-footer"></div>
              </div>
              <section style="z-index: 1000" v-if="dialog_adhesion && src_adhesion !== null">
                <!-- DIALOG ADHESION -->
                <div class="modal-dialog modal-lg" style="width: 100%; height: 80%;z-index: 1000">
                  <v-card class="text-center" height="800px" style="background-color: #323639;">
                    <v-card-title class="d-flex justify-end m-0 p-0">
                      <v-btn small class="btn btn-danger btn-circle btn-sm" @click="closeDialogAdhesion()">
                        <v-icon>cancel</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-actions>
                      <iframe :src="src_adhesion" style="width: 100%; height: 700px; border: none" />
                    </v-card-actions>
                  </v-card>
                </div>
              </section>
              <v-dialog style="z-index: 1000" v-model="dialog_terms_doc">
                <v-card class="text-center" height="800px" style="background-color: #323639">
                  <v-card-title class="d-flex justify-end m-0 p-0">
                    <v-btn small class="btn btn-danger btn-circle btn-sm" @click="dialog_terms_doc = false">
                      <v-icon>cancel</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-actions>
                    <iframe :src="src_termsDoc" style="width: 100%; height: 700px; border: none" />
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </section>
      </div>
    </div>
  </v-app>
</template>
<script>

export default {
  components: {},
  data: () => ({
    show_error_message: false,
    adhesion_uploader: false,
    adhesion_view: false,
    selectedFile: null,
    dialog_adhesion: false,
    src_adhesion: null,
    loading: false,
    size: false,
    headers: [],
    search: null,
    adhesion: {
      dpi: null,
      documento: null,
      nombre_documento: null
    },
    error_message: null,
    adhesion_response: null,
    razones_sociales: [],
    dpiEntered: false,
    autocomplete_value: null,
    dialog_terms_doc: false,
    termsAccepted: true,
    src_termsDoc: null,
    user_adhered: false,
    user_dpi: false,
    warning_icon: false,
    sucess_icon: false,
    user_has_document: false
  }),

  created() {
    let self = this;
    self.getRazonesSociales();
    this.getTermsDoc();
  },

  watch: {},

  computed: {},

  methods: {
    async getAdhesion() {
      let self = this;
      self.src_adhesion = null;
      this.loading = true;
      self.sucess_icon = false;
      self.warning_icon = false;
      try {
        if (this.search && this.search.trim() !== "") {
          await self.$store.state.services.adhesionService
            .getAdhesionUsuario(this.search)
            .then(response => {
              // Handle successful response
              this.dialog_adhesion = false;
              if (response === undefined) {
                this.adhesion_view = false;
                this.show_error_message = false;
                this.adhesion_uploader = true;
                console.log("There is no adhesion");
                this.user_dpi = true;
              } else {
                if (response.response) {
                  const status = response.response.status;
                  this.adhesion_view = false;
                  if (status === 500) {
                    console.log("The DPI is not valid");
                    this.warning_icon = true;
                    this.show_error_message = true;
                    this.error_message = "El DPI ingresado no es válido.";
                    this.adhesion_view = false;
                  } else if (status === 400) {
                    this.show_error_message = true;
                    this.error_message =
                      "La razón social no tiene correos registrados.";
                  } else if (status === 404) {
                    console.log("No adhesion found...");
                  }
                } else if (
                  response.data.data &&
                  response.data.data !== "data:application/pdf;base64,"
                ) {
                  this.dpiEntered = true;
                  console.log("It has an adhesion");
                  this.adhesion_view = true;
                  this.adhesion_uploader = false;
                  this.adhesion_response = response.data.data;
                  this.show_error_message = true;
                  this.user_has_document = true;
                  this.error_message = "El usuario ya se encuentra adherido.";
                  this.sucess_icon = true;
                } else {
                  console.log("No document but already adhered");
                  this.show_error_message = true;
                  this.error_message = "El usuario ya se encuentra adherido.";
                  this.sucess_icon = true;
                }
              }
              // Here when there's no adhesion yet.
            })
            .catch(error => {
              // Handle error, including 404 error
              this.adhesion_view = false;
              console.log("Error:", error);
              if (error.response && error.response.status === 404) {
                console.log("404 Not Found");
                // Handle the 404 error here
              }
            });
        } else {
          // Code to execute when search is empty or contains only spaces at the end
          console.log("Search value is invalid");
          this.adhesion_view = false;
          this.adhesion_uploader = false;
          this.show_error_message = false;
        }
      } catch (error) {
        console.log("An error occurred:", error);
      }
      this.loading = false;
    },

    async getTermsDoc() {
      let r = await this.$store.state.services.adhesionService.getLiabilityTermsDocument();
      if (r.data) {
        const doc = r.data.data;
        this.src_termsDoc = doc;
      }
    },

    async saveAdhesion() {
      let self = this;
      if (this.adhesion.dpi == null) {
        this.adhesion.dpi = this.search;
      }
      await this.$store.state.services.adhesionService
        .addAdhesionUsuario(this.adhesion)
        .then(r => {
          if (r.status === 200) {
            this.adhesion_uploader = false;

            if (this.adhesion.documento == null) {
              this.adhesion_view = false;
            } else {
              this.adhesion_view = true;
            }
            this.$toastr.success(
              "La adhesión fue adjuntada correctamente",
              "Felicidades"
            );
            this.show_error_message = true;
            this.error_message = "El usuario ya se encuentra adherido.";
            this.sucess_icon = true;
          }
          self.loading = false;
        })
        .catch(r => { });
    },

    async getRazonesSociales() {
      await this.$store.state.services.adhesionService
        .getRazonesSociales()
        .then(r => {
          this.razones_sociales = r.data.data;
        })
        .catch(r => {
          console.log(r);
        });
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      this.selectedFile = file;
      const nombre_documento = this.selectedFile.name.replace(/\s+/g, "_");
      this.adhesion.nombre_documento = nombre_documento;
      this.adhesion.dpi = this.search;
      const fileToLoad = this.selectedFile;
      const fileReader = new FileReader();

      fileReader.onload = fileLoadedEvent => {
        const base64 = fileLoadedEvent.target.result;
        this.adhesion.documento = base64;
        // You can perform additional logic or emit an event here
      };
      fileReader.readAsDataURL(fileToLoad);
    },

    clearFileInput() {
      this.selectedFile = null;
      // Reset the file input value
      this.$refs.fileInput.value = "";
    },

    closeDialogAdhesion() {
      this.dialog_adhesion = false;
      this.src_adhesion = null;
    },
    async seeAdhesion() {
      try {
        this.src_adhesion = null;
        await this.getAdhesion();
        this.dialog_adhesion = true;
        let pdfData = this._base64ToArrayBuffer(this.adhesion_response);
        let file = new Blob([pdfData], { type: "application/pdf" });
        let fileUrl = URL.createObjectURL(file);
        this.src_adhesion = fileUrl;
      } catch (error) {
        console.log(error);
        this.$toast.error(
          "Lo sentimos, no es posible visualizar el documento."
        );
      }
    },

    _base64ToArrayBuffer(base64) {
      let binary_string = atob(base64.toString().split(",")[1]);
      let len = binary_string.length;
      let bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    },

    async searchNombreRazonSocial(searchValue) {
      if (searchValue.length > 0) {
        return new Promise(resolve => {
          setTimeout(() => {
            const filteredItems = this.razones_sociales.filter(item => {
              if (item.razon_social) {
                const nombre_razon_social = item.razon_social.toLowerCase();
                return nombre_razon_social.includes(searchValue.toLowerCase());
              } else {
                return false;
              }
            });
            resolve(filteredItems);
          }, 2000); // 3 seconds timeout
        });
      } else {
        return [];
      }
    },

    getResultValue(option) {
      return option.razon_social + " -  " + option.dpi;
    },

    async seleccionarRazonSocial(value) {
      self.sucess_icon = false;
      self.warning_icon = false;
      this.adhesion.dpi = value.dpi;
      this.src_adhesion = null;
      this.search = value.dpi;
      await this.getAdhesion();
    },

    cleanDpiInput() {
      this.search = null;
      this.dpiEntered = false;
      this.adhesion_uploader = false;
      this.adhesion_view = false;
      this.dialog_adhesion = false;
      this.src_adhesion = null;
      this.autocomplete_value = null;
      this.$refs.autocomplete.value = "";
      this.user_dpi = false;
      this.show_error_message = false;
      this.error_message = null;
      this.user_has_document = false;
      this.sucess_icon = false;
      this.warning_icon = false;
    },

    cleanRazonSocialInput() {
      // Clean the autocomplete input
      const inputElement = document.getElementById("razon_social_input");
      if (inputElement) {
        inputElement.value = "";
      }
    }
  }
};
</script>
<style scoped>
.custom-button {
  background-color: rgb(26, 128, 230);
  color: white;
}

.custom-button:hover {
  background-color: rgb(31, 86, 141);
}

input[type="file"]::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #de8314;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background: #bc6f11;
}

.input-button {
  background: #2c7b89;
}
</style>
