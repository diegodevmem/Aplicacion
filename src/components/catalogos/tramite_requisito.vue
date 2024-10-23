<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Requisitos para el trámite
        <small style="color: white">Sistema de Catálogo</small>
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
        <li><i class="fa fa-bug active"></i> Requisitos</li>
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
                Nombre del Tramite: <br><br>
                <strong>{{ nombreRequisito }}</strong>
              </h4>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="tipo_requisito_id">Tipo de Requisito</label>
                      <multiselect
                        v-model="form.tipo_requisito_id"
                        :options="tipo_requisitos"
                        placeholder="Seleccione uno porfavor"
                        :searchable="true"
                        :allow-empty="false"
                        data-vv-name="tipo de requisito"
                        v-validate="'required'"
                        :show-labels="false"
                        label="nombre"
                        track-by="id"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'tipo de requisito'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="requisito_id">Requisito</label>
                      <multiselect
                        v-model="form.requisito_id"
                        :options="requisitos"
                        placeholder="Seleccione uno porfavor"
                        :searchable="true"
                        :allow-empty="false"
                        data-vv-name="requisito"
                        v-validate="'required'"
                        :show-labels="false"
                        label="nombre"
                        track-by="id"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'requisito'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                    <button
                      type="button"
                      class="btn btn-warning btn-sm pull-center"
                      @click="getRequisito()"
                    >
                      <i class="fa fa-undo"></i> Refrescar Requisitos
                    </button><br><br>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <enhanced-check
                        :label="
                          form.interno
                            ? 'ES UN REQUERIMIENTO INTERNO'
                            : 'NO ES UN REQUERIMIENTO INTERNO'
                        "
                        subClass="success"
                        :animate="true"
                        :inline="false"
                        v-model="form.interno"
                        v-validate="'required'"
                        data-vv-name="requisito interno"
                      ></enhanced-check>
                      <FormError
                        :attribute_name="'requisito interno'"
                        :errors_form="errors"
                      >
                      </FormError>
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
                @click="createOrEdit"
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
                    <template slot="opcion" slot-scope="data">
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
export default {
  name: "TramiteRequisitoCat",
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
  },
  data() {
    return {

      nombreRequisito: " ",

      loading: false,
      items: [],
      tipo_requisitos: [],
      requisitos: [],

      fields: [
        {
          key: "tipo_requisito.nombre",
          label: "Tipo de Requisito",
          sortable: true,
        },
        { key: "requisito.nombre", label: "Requisito", sortable: true },
        {
          key: "tipo_tramite.nombre",
          label: "Tipo de Trámite",
          sortable: true,
        },
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
        tipo_tramite_id: null,
        tipo_requisito_id: null,
        requisito_id: null,
        interno: true,
      },
    };
  },
  created() {
    let self = this;
    self.form.tipo_tramite_id = self.$route.params.tramite;
    // self.nombreRequisito = self.$route.params.nombre;
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

    getPromise() {
      this.loading = true;
      Promise.all([this.getAll(), this.getTipoRequisito(), this.getRequisito()])
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

      self.$store.state.services.tramiterequisitoService
        .get(self.form.tipo_tramite_id)
        .then((r) => {
          self.loading = false;
          self.items = r.data.datos;
          this.nombreRequisito = r.data.nombre_tramite;
          self.totalRows = self.items.length;
        })
        .catch((r) => {});
    },

    getTipoRequisito() {
      let self = this;
      self.tipo_requisitos = [];
      self.$store.state.services.tiporequisitoService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.tipo_requisitos.push(element);
          });
        })
        .catch((r) => {});
    },

    getRequisito() {
      let self = this;
      self.requisitos = [];
      self.$store.state.services.requisitoService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.requisitos.push(element);
          });
        })
        .catch((r) => {});
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;

      self.$store.state.services.tramiterequisitoService
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
            self.$store.state.services.tramiterequisitoService
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

      self.form.id = null;
      self.form.tipo_requisito_id = null;
      self.form.requisito_id = null;
      self.form.interno = false;

      self.$validator.reset();
      self.$validator.reset();
    },

    //editar registro
    edit(data) {
      let self = this;
      self.mapData(data);
    },

    //mapear datos a formulario
    mapData(data) {
      let self = this;
      self.loading = true;
      self.loading = false;
    },

    //funcion, validar si se guarda o actualiza
    createOrEdit() {
      let self = this;
      self.$validator.validateAll().then((result) => {
        if (result) {
          self.create();
        }
      });
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
