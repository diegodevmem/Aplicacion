<template>
  <!--Contenido-->
  <!-- Content Wrapper. Contains page content -->
  <div>
    <!-- Main content -->
    <section>
      <div class="row">
        <div class="col-md-8">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">
                <i class="fa fa-plus-square-o"></i> Configurar rutas para menu
                {{ sistema.nombre }}
              </h3>
              <div class="box-tools pull-right"></div>
            </div>

            <div class="box-body">
              <form role="form">
                <div class="row">
                  <div class="col-md-5 col-sm-12">
                    <div class="form-group">
                      <input
                        type="text"
                        placeholder="ingrese texto del menu"
                        v-model="form.text"
                        name="text"
                        class="form-control"
                        v-validate="'required|min:3|max:25'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('text'),
                        }"
                      />
                      <FormError
                        :attribute_name="'text'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="!form.subitem">
                  <div class="col-md-4 col-sm-12">
                    <div class="form-group">
                      <!-- v-validate="
                          'required|regex:^[A-Za-z1-9_/]*$|prefijo:' +
                          sistema.nombre +
                          '_'
                        " -->
                      <input
                        type="text"
                        name="ruta"
                        
                        :placeholder="
                          ('ingrese ruta, por ejemplo: ' +
                            sistema.nombre +
                            '_nombre_ruta')
                            | lowercase
                        "
                        v-model="form.path"
                        class="form-control"
                        :class="{
                          input: true,
                          'has-errors': errors.has('ruta'),
                        }"
                        onkeyup="this.value = this.value.toLowerCase();"
                      />
                      <FormError
                        :attribute_name="'ruta'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="!form.escondido">
                  <div class="col-md-3 col-sm-12">
                    <div class="form-group">
                      <input
                        type="text"
                        placeholder="selecciones icono"
                        v-model="form.icon"
                        name="icon"
                        class="form-control"
                        v-validate="'required|min:3|max:20'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('icon'),
                        }"
                      />
                      <FormError
                        :attribute_name="'icon'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2 col-sm-12">
                    <div class="form-group">
                      <input
                        type="text"
                        placeholder="ingrese orden"
                        v-model="form.orden"
                        name="orden"
                        class="form-control"
                        v-validate="'min_value:1|integer'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('orden'),
                        }"
                      />
                      <FormError
                        :attribute_name="'orden'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4 col-sm-12">
                    <div class="form-group form-inline">
                      <span> ¿Desea esconder item del menu? </span>
                      <input
                        class="checkbox"
                        type="checkbox"
                        id="checkbox"
                        v-model="form.escondido"
                      />
                      <label for="checkbox" v-if="form.escondido">
                        <b-badge class="btn btn-warning">Si</b-badge></label
                      >
                      <label for="checkbox" v-if="!form.escondido">
                        <b-badge class="btn btn-success">No</b-badge></label
                      >
                    </div>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <div class="form-group form-inline">
                      <span> ¿Agregar sub items al item? </span>
                      <input
                        class="checkbox"
                        type="checkbox"
                        id="checkbox"
                        v-model="form.subitem"
                      />
                      <label for="checkbox" v-if="form.subitem">
                        <b-badge class="btn btn-warning">Si</b-badge></label
                      >
                      <label for="checkbox" v-if="!form.subitem">
                        <b-badge class="btn btn-success">No</b-badge></label
                      >
                    </div>
                  </div>
                </div>

                <div class="box-footer pull-right">
                  <a class="btn btn-success btn-xs" @click="createOrEdit">
                    <i class="fa fa-plus"></i> Agregar</a
                  >
                  <a class="btn btn-danger btn-xs" @click="clearData">
                    <i class="fa fa-eraser"></i> Limpiar</a
                  >
                </div>
              </form>
            </div>

            <div class="box-header with-border">
              <h3 class="box-title">
                <i class="fa fa-list"></i> Lista de items
              </h3>
              <div class="box-tools pull-right"></div>
            </div>
            <div class="box-body">
              <template>
                <div class="col-sm-12">
                  <b-row>
                    <b-col md="2" class="my-1 form-inline">
                      <label>mostrando: </label>
                      <b-form-select :options="pageOptions" v-model="perPage" />
                      <label>entradas </label>
                    </b-col>

                    <b-col class="my-1 form-group pull-right">
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="buscar" />
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-table
                    responsive
                    hover
                    small
                    flex
                    :fields="fields"
                    :items="items"
                    :filter="filter"
                    :current-page="currentPage"
                    :per-page="perPage"
                    @filtered="onFiltered"
                  >
                    <!-- A virtual column -->
                    <template slot="nombre" slot-scope="data">
                      {{ data.item.nombre }}
                    </template>
                    <template slot="text" slot-scope="data">
                      {{ data.item.text }}
                    </template>
                    <template slot="orden" slot-scope="data">
                      {{ numeroALetras(data.item.orden) | lowercase }}
                    </template>
                    <template slot="padre" slot-scope="data">
                      {{ data.item }}
                    </template>
                    <template slot="opcion" slot-scope="data">
                      <a
                        class="btn btn-success btn-xs"
                        @click="showSubItem(data.item)"
                        data-toggle="modal"
                        data-target="#subitem"
                      >
                        <i class="fa fa-plus"></i> sub-items</a
                      >
                      <a class="btn btn-warning btn-xs" @click="edit(data.item)"
                        ><i class="fa fa-pencil"></i
                      ></a>
                      <a
                        class="btn btn-danger btn-xs"
                        @click="destroy(data.item)"
                        ><i class="fa fa-trash"></i
                      ></a>
                    </template>
                  </b-table>
                  <b-row>
                    <b-col md="12" class="my-1">
                      <label v-if="totalRows > 0"
                        >total: {{ totalRows }} registros</label
                      >
                      <div class="text-center">
                        <label v-if="totalRows === 0"
                          >No hay registros que mostrar</label
                        >
                      </div>
                    </b-col>

                    <b-col class="my-1 pull-right">
                      <b-pagination
                        :total-rows="totalRows"
                        :per-page="perPage"
                        v-model="currentPage"
                        class="my-0 text-center"
                      />
                    </b-col>
                  </b-row>
                </div>
              </template>
            </div>
            <!-- /.box-body -->
          </div>
          <!-- /.box -->
        </div>
        <!-- /.box -->
      </div>
    </section>
    <!-- /.content -->

    <!-- Modal para mostrar subitems-->
    <div class="modal fade" id="subitem" data-backdrop="static">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Item</h4>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <SubItem v-if="subitem" :item="item" :sistema="sistema"></SubItem>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              @click="cancelar"
              class="btn btn-danger btn-xs"
              data-dismiss="modal"
            >
              <i class="fa fa-undo"></i> Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /.content-wrapper -->
  <!--Fin-Contenido-->
</template>

<script>
import FormError from "../shared/FormError";
import SubItem from "./SubItem";

export default {
  name: "Menu",
  props: {
    sistema: Object,
  },
  components: {
    FormError,
    SubItem,
  },

  data() {
    return {
      loading: false,
      gridMode: true,
      insertMode: false,
      item: null,
      subitem: false,
      mostrar: false,
      excludes: [],
      items: [],
      fields: [
        { key: "text", label: "Nombre", sortable: true },
        { key: "path", label: "Ruta", sortable: true },
        { key: "orden", label: "Orden", sortable: true },
        { key: "padre.text", label: "Item Principal", sortable: true },
        { key: "opcion", label: "Acciones" },
      ],

      filter: null,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 25],
      showStringEmpty: "no hay registros que mostrar",

      form: {
        id: null,
        padre_id: 0,
        text: "",
        path: "",
        icon: "",
        sistema_id: null,
        escondido: false,
        orden: null,
        subitem: false,
      },
    };
  },

  created() {
    let self = this;
    self.getAll(self.sistema.id);

    if (!self.form.subitem) {
      self.$validator.extend("prefijo", {
        getMessage(field, val) {
          return (
            "la ruta debe iniciar con el prefijo " + val.join("").toLowerCase()
          );
        },
        validate(value, field) {
          return field.every((f) => value.includes(f.toLowerCase()));
        },
      });
    } else {
      self.form.path = "";
    }
    /*events.$on('getAll', (data) =>{
        self.getAll(data.id)
    })*/
  },

  methods: {
    //metodo on filteres
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    getAll(id) {
      let self = this;
      self.loading = true;

      self.$store.state.services.sistemaService
        .getItemsMenu(id)
        .then((r) => {
          self.loading = false;
          self.items = r.data.data;
          self.totalRows = self.items.length;
        })
        .catch((r) => {});
    },

    getExcludes(array_data) {
      let self = this;
      var arr = array_data.slice();
      if (self.form.id !== null) {
        var obj = arr.find((a) => a.id === self.form.id);
        var index = arr.indexOf(obj);
        arr.splice(index, 1);
      }

      arr = arr.filter((x) => x.orden !== null);
      return arr.map((e) => e.orden).join(",");
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;
      let data = self.form;

      self.$store.state.services.menuService
        .create(data)
        .then((r) => {
          self.loading = false;
          if (r.response) {
            this.$toastr.error(r.response.data.error, "error");
            return;
          }

          this.$toastr.success("registro agregado con exito", "exito");
          self.getAll(data.sistema_id);
          self.clearData();
          self.updateMenu();
        })
        .catch((r) => {});
    },

    //funcion para actualizar registro
    update() {
      let self = this;
      self.loading = true;
      let data = self.form;
      self.$store.state.services.menuService
        .update(data)
        .then((r) => {
          self.loading = false;
          if (r.response) {
            this.$toastr.error(r.response.data.error, "error");
            return;
          }
          self.getAll(data.sistema_id);
          this.$toastr.success("registro actualizado con exito", "exito");
          self.clearData();
          self.updateMenu();
        })
        .catch((r) => {});
    },

    //funcion para eliminar registro
    destroy(data) {
      let self = this;
      self
        .$swal({
          title: "Eliminar item?",
          text: "Esta seguro de elminar item " + data.text + "?",
          type: "warning",
          showCancelButton: true,
        })
        .then((result) => {
          // <--
          if (result.value) {
            // <-- if confirmed
            self.loading = true;
            self.$store.state.services.menuService
              .destroy(data)
              .then((r) => {
                self.loading = false;
                if (r.response) {
                  this.$toastr.error(r.response.data.error, "error");
                  return;
                }
                this.$toastr.success("registro eliminado con exito", "exito");
                self.getAll(data.sistema_id);
                self.clearData();
                self.updateMenu();
              })
              .catch((r) => {});
          }
        });
    },

    //limpiar data de formulario
    clearData() {
      let self = this;

      Object.keys(self.form).forEach(function (key, index) {
        if (typeof self.form[key] === "string") self.form[key] = "";
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = null;
      });

      self.form.padre_id = 0;
      self.form.escondido = false;
      self.$validator.reset();
      self.$validator.reset();
    },

    //editar registro
    edit(data) {
      let self = this;
      self.gridMode = false;
      self.insertMode = true;
      self.mapData(data);
    },

    //mapear datos a formulario
    mapData(data) {
      let self = this;
      self.form.id = data.id;
      self.form.text = data.text;
      self.form.padre_id = data.padre_id;
      self.form.icon = data.icon;
      self.form.path = data.path;
      self.form.sistema_id = data.sistema_id;
      self.form.escondido = data.escondido;
      self.form.orden = data.orden;
    },

    //funcion, validar si se guarda o actualiza
    createOrEdit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (self.form.path === "") {
            self.form.path = "#";
          }
          if (self.form.id > 0 && self.form.id !== null) {
            self.update();
          } else {
            self.form.sistema_id = self.sistema.id;
            self.create();
          }
        }
      });

      let self = this;
    },

    cancelar() {
      let self = this;
      self.subitem = false;
      self.getAll(self.sistema.id);
      self.updateMenu();
    },

    showSubItem(data) {
      let self = this;
      self.subitem = true;
      self.item = data;
    },

    updateMenu() {
      let self = this;
      events.$emit("updateMenu");
    },

    mostrarIcon() {
      let self = this;
      if (self.form.escondido) self.mostrar = true;
      else self.mostrar = false;
    },

    numeroALetras(n) {
      let self = this;
      return self.$store.state.global.numeroALetras(n);
    },
  },

  mounted() {
    $("body").resize();
  },
};
</script>
