<template>
  <!--Contenido-->
  <!-- Content Wrapper. Contains page content -->
  <div>
    <!-- Main content -->
    <section>
      <div class="row" v-loading="loading">
        <div class="col-md-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">
                <i class="fa fa-plus-square-o"></i> Agregar items a rol
                {{ rol.nombre }}
              </h3>
              <div class="box-tools pull-right"></div>
            </div>
            <div class="box-body">
              <div class="col-md-12">
                <div class="checkbox">
                  <label
                    ><input type="checkbox" v-model="editable" />Habilitar
                    arrastrar y soltar</label
                  >
                </div>
                <button
                  type="button"
                  class="btn btn-default"
                  @click="orderList"
                >
                  Orden original
                </button>
                <hr />
              </div>

              <div class="col-md-6">
                <h4 class="box-title">Menu del sistema</h4>
                <draggable
                  class="list-group"
                  tag="ul"
                  v-model="itemsMenu"
                  v-bind="dragOptions"
                  :move="onMove"
                  @start="isDragging = true"
                  @end="isDragging = false"
                >
                  <transition-group type="transition" :name="'flip-list'">
                    <li
                      class="list-group-item"
                      v-for="element in itemsMenu"
                      :key="element.id"
                    >
                      <i
                        :class="'fa fa-' + element.icon"
                        @click="element.fixed = !element.fixed"
                        aria-hidden="true"
                      ></i>
                      {{ element.text }}
                    </li>
                  </transition-group>
                </draggable>
              </div>

              <div class="col-md-6">
                <h4 class="box-title">Menu del rol</h4>
                <draggable
                  tag="span"
                  v-model="items"
                  v-bind="dragOptions"
                  :move="onMove"
                >
                  <transition-group name="no" class="list-group" tag="ul">
                    <li
                      class="list-group-item"
                      v-for="element in items"
                      :key="element.id"
                    >
                      <i
                        :class="'fa fa-' + element.icon"
                        @click="element.fixed = !element.fixed"
                        aria-hidden="true"
                      ></i>
                      {{ element.text }}
                    </li>
                  </transition-group>
                </draggable>
              </div>
            </div>

            <div class="box-footer pull-right">
              <button type="button" class="btn btn-primary" @click="create">
                <i class="fa fa-save"></i> Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FormError from "../shared/FormError";
import draggable from "vuedraggable";

export default {
  name: "menu_rol",
  props: {
    rol: Object,
  },
  components: {
    FormError,
    draggable,
  },

  data() {
    return {
      loading: false,
      gridMode: true,
      insertMode: false,
      item: null,
      subitem: false,
      itemsMenu: [],
      items: [],
      itemsMenuShow: [],
      editable: true,
    };
  },

  created() {
    let self = this;
    self.getAll(self.rol.pivot.sistema_id);
  },

  methods: {
    orderList() {
      let self = this;
      self.itemsMenuShow = this.itemsMenuShow.sort((one, two) => {
        return one.id - two.id;
      });
    },

    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },

    getAll(id) {
      let self = this;
      self.loading = true;

      self.$store.state.services.sistemaService
        .getItemsMenu(id)
        .then((r) => {
          self.loading = false;
          self.itemsMenu = r.data.data;

          self.getRolMenu(self.rol.pivot.id);
        })
        .catch((r) => {});
    },

    getRolMenu(id) {
      let self = this;
      self.loading = true;

      self.$store.state.services.rolSistemaService
        .getItemsMenu(id)
        .then((r) => {
          self.mapArrayItems(r.data.data);
        })
        .catch((r) => {});
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;
      var items = {
        items: [],
      };

      items.items = self.items;

      self.$store.state.services.rolSistemaService
        .createRolMenu(self.rol.pivot.id, items)
        .then((r) => {
          self.loading = false;
          if (r.response) {
            this.$toastr.error(r.response.data.error, "error");
            return;
          }

          this.$toastr.success("menu para rol agregado con exito", "exito");
          self.getRolMenu(self.rol.pivot.id);
        })
        .catch((r) => {});
    },

    cancelar() {
      let self = this;
      self.subitem = false;
      self.getAll(self.sistema.id);
      self.updateMenu();
    },

    mapArrayItems(items) {
      let self = this;
      self.items = items
      self.items.forEach(function (item, index) {
        if(index != 0) {
          self.itemsMenu.forEach(function (data) {
            if (data.id == item.id) {
              self.itemsMenu.splice(self.itemsMenu.indexOf(data), 1);
            }
          });
        }
      });
      self.loading = false;
      console.log(self.items, self.itemsMenu)
    },
  },

  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: !this.editable,
        ghostClass: "ghost",
      };
    },
  },

  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
  },

  mounted() {
    $("body").resize();
  },
};
</script>