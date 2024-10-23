<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Teléfonos de la persona
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
        <router-link tag="li" to="/exp_personas" exact>
          <i class="fa fa-bug"></i> Personas
        </router-link>
        <li><i class="fa fa-bug active"></i> Teléfonos de la persona</li>
      </ol>
    </section>

    <br />

    <section class="content" v-loading="loading">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div :class="color">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-plus-square-o"></i> {{ titulo }}
              </h1>
            </div>

            <div class="col-12 text-center">
              <h4>
                Nombre Persona:
                <strong>{{ razon_social }}</strong>
              </h4>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">
                <div class="row">
                  <div class="col-sm-12 col-md-4 col-lg-4">
                    <div class="form-group">
                      <label for="numero">Número de teléfono</label>
                      <vue-phone-number-input
                        v-model="numero"
                        default-country-code="GT"
                        size="lg"
                        :translations="translations"
                        show-code-on-list
                        @update="validar_numero($event)"
                        v-validate="'required'"
                        data-vv-name="número de teléfono"
                        required
                      />
                      <FormError
                        :attribute_name="'número de teléfono'"
                        :errors_form="errors"
                      ></FormError>
                      <div style="color: #cc2900;font-size:12px;" v-if="numberOk">
                            Verificar extensión seleccionada
                      </div>

                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6 col-lg-6 text-center">
                    <label for="notificar">¿Notificar?</label>
                    <enhanced-check
                      :label="
                        form.notificar
                          ? 'SI, SELECCIONAR COMO NUMERO PRINCIPAL'
                          : 'NO, SELECCIONAR COMO NUMERO PRINCIPAL'
                      "
                      subClass="success"
                      :animate="true"
                      :inline="false"
                      v-model="form.notificar"
                      v-validate="'required'"
                      data-vv-name="notificar número de teléfono"
                    ></enhanced-check>
                    <FormError
                      :attribute_name="'notificar número de teléfono'"
                      :errors_form="errors"
                    >
                    </FormError>
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
                @click="createOrEdit"
                :disabled="isActive"
              >
                <i class="fa fa-save"></i> Guardar
              </button>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Información ingresada en el sistema.
              </h1>
            </div>
            <div class="panel-body table-responsive" id="listadoregistros">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                  <label class="pull-left"
                    >mostrando:
                    <b-form-select :options="pageOptions" v-model="perPage" />
                  </label>
                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <b-table
                    responsive
                    hover
                    small
                    flex
                    :fields="fields"
                    :items="items"
                    :filter="form.nombre"
                    :current-page="currentPage"
                    :per-page="perPage"
                    @filtered="onFiltered"
                  >
                    <!-- A virtual column -->

                    <template slot="notificar" slot-scope="data">
                      <h5 v-text="data.item.notificar ? 'SI' : 'NO'"></h5>
                    </template>

                    <template slot="opcion" slot-scope="data">
                      <a class="btn btn-warning btn-md" @click="edit(data.item)"
                        ><i class="fa fa-pencil"></i
                      ></a>
                      <a
                        :class="
                          data.item.deleted_at
                            ? 'btn btn-md btn-success'
                            : 'btn btn-md btn-danger'
                        "
                        @click="destroy(data.item)"
                        ><i
                          :class="
                            data.item.deleted_at
                              ? 'fa fa-thumbs-o-up'
                              : 'fa fa-thumbs-o-down'
                          "
                        ></i
                      ></a>
                    </template>
                  </b-table>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label v-if="totalRows > 0"
                    >Total: {{ totalRows }} registros en el sistema.</label
                  >
                  <div class="text-center">
                    <label v-if="totalRows === 0"
                      >No hay registros que mostrar</label
                    >
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label class="pull-right"
                    ><b-pagination
                      :total-rows="totalRows"
                      :per-page="perPage"
                      v-model="currentPage"
                      class="my-0 text-center"
                  /></label>
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
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle,
} from "vue-enhanced-check";
import razonSocialService from "../../services/expediente/razonSocialService";
export default {
  name: "TelefonoExp",
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
  },
  data() {
    return {
      loading: false,
      items: [],
      numero: null,
      url: null,
      razon_social: null,

      translations: {
        countrySelectorLabel: "Código de país",
        countrySelectorError: "Elige un país",
        phoneNumberLabel: "Número de teléfono",
        example: "Ejemplo :",
      },

      fields: [
        { key: "pais", label: "País", sortable: true },
        { key: "codigo_area", label: "Código Area", sortable: true },
        { key: "numero", label: "Número Teléfono", sortable: true },
        { key: "notificar", label: "Notificar", sortable: true },
        { key: "opcion", label: "Acciones" },
      ],

      filter: null,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",

      //formulario de campos
      form: {
        id: null,
        razon_social_id: null,
        pais: null,
        codigo_area: null,
        numero: null,
        notificar: false,
        url: null,
      },
      isActive:false,
      numberOk:true,

    };
  },

  created() {
    let self = this;
    self.form.razon_social_id = self.$route.params.razon_social_id;
    self.razon_social_id = self.$route.params.razon_social_id;
    self.razon_social = self.$route.params.razon_social;
    self.getPromise();
  },

  computed: {
    titulo() {
      return !this.form.id
        ? "Formulario de Registro para Crear"
        : "Formulario de Registro para Editar";
    },
    color() {
      return !this.form.id ? "box box-primary" : "box box-warning";
    },
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    validar_numero(e) {
      
      if (e.isValid) {
        this.form.numero = e.phoneNumber;
        this.form.codigo_area = e.countryCallingCode;
        this.form.pais = e.countryCode;
        this.form.url = e.uri;
        this.esconder = true;
        this.numberOk=false //number ok indica que el numero es valido según la extesión seleccionada
        this.isActive=false //desactiva el bloqueo del boton 
      } else if(!e.isValid && String(e.phoneNumber).startsWith(1) && String(e.phoneNumber).length===9){
        this.form.numero = e.phoneNumber;
        this.form.codigo_area = e.countryCallingCode;
        this.form.pais = e.countryCode;
        this.form.url = e.uri;
        this.esconder = true;
        this.numberOk=false //number ok indica que el numero es valido según la extesión seleccionada
        this.isActive=false //desactiva el bloqueo del boton 

      }else {
        this.form.numero = e.phoneNumber;
        this.form.codigo_area = e.countryCallingCode;
        this.form.pais = e.countryCode;
        this.form.url = e.uri;
        this.esconder = false;
        this.isActive=true
        this.numberOk=true  //activa el bloqueo del boton al exister errores en el numero  
    
      }
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getAll()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    getAll() {
      let self = this;
      self.loading = true;

      self.$store.state.services.telefonoService
        .getAll(self.form.razon_social_id)
        .then((r) => {
          console.log(r);
          self.loading = false;
          self.items = r.data.data;
          self.totalRows = self.items.length;
        })
        .catch((r) => {
          console.log(r);
        });
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;

      self.$store.state.services.telefonoService
        .create(self.form)
        .then((r) => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data, "Mensaje");
          self.getAll();
          self.clearData();
        })
        .catch((r) => {
          console.log(r);
        });
    },

    //funcion para actualizar registro
    update() {
      let self = this;
      self.loading = true;

      self.$store.state.services.telefonoService
        .update(self.form)
        .then((r) => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data, "Mensaje");
          self.getAll();
          self.clearData();
        })
        .catch((r) => {
          console.log(r);
        });
    },

    //funcion para eliminar registro
    destroy(data) {
      let self = this;
      let title = !data.deleted_at ? "Desactivar" : "Activar";
      let type = !data.deleted_at ? "error" : "success";
      self
        .$swal({
          title: title,
          text: "¿Está seguro de realizar esta acción?",
          type: type,
          showCancelButton: true,
        })
        .then((result) => {
          if (result.value) {
            self.loading = true;
            self.$store.state.services.telefonoService
              .destroy(data)
              .then((r) => {
                self.loading = false;

                if (r.response) return;

                this.$toastr.success(r.data, "Mensaje");
                self.getAll();
                self.clearData();
              })
              .catch((r) => {
                console.log(r);
              });
          }
        });
    },

    //limpiar data de formulario
    clearData() {
      let self = this;

      Object.keys(self.form).forEach(function (key, index) {
        if (typeof self.form[key] === "string") self.form[key] = null;
        else if (typeof self.form[key] === "object") self.form[key] = null;
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = null;
      });

      self.$validator.reset();
      self.$validator.reset();

      self.numero = null;
      self.form.razon_social_id = self.razon_social_id;
    },

    //editar registro
    edit(data) {
      let self = this;
      self.mapData(data);
    },

    //mapear datos a formulario
    mapData(data) {
      let self = this;
      self.form.id = data.id;
      self.form.razon_social_id = data.razon_social_id;
      self.form.pais = data.pais;
      self.form.codigo_area = data.codigo_area;
      self.form.numero = data.numero;
      self.numero = data.numero;
      self.form.notificar = data.notificar;
    },

    //funcion, validar si se guarda o actualiza
    createOrEdit() {
      let self = this;
      self.$validator.validateAll().then((result) => {
        if (result) {
          self.form.id > 0 && self.form.id !== null
            ? self.update()
            : self.create();
        }else{
          this.$toastr.error("Verificar los datos", "Mensaje");
          self.isActive=true;
        }
      });
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>