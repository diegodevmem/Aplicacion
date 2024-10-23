<template>
<!--Contenido-->
      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper" v-loading="loading">
        <!-- Main content -->
        <section class="content">
          
              <div class="col-md-12">
                  <div class="box box-primary">
                    <!-- /.box-header -->
                    <!-- centro -->
                    <div class="box-header with-border">
                         <h1 class="box-title"><i class="fa fa-cog"></i> Configuracion de sistema {{model.nombre}}</h1>
                         <a class="btn btn-danger btn-xs pull-right" @click="$router.push(`/sau_sistema`)"><i class="fa fa-undo"></i> volver</a>
                    </div>
                  </div><!-- /.box -->
                  <div class="box box-primary">
                    <!-- /.box-header -->
                    <!-- centro -->
                    <div class="box-header with-border">
                         <a class="btn btn-success btn-xs" @click="showMenu()"><i class="fa fa-plus"></i> Menu</a>
                         <a class="btn btn-info btn-xs" @click="asignRolesItem()"><i class="fa fa-plus"></i> Roles asignados</a>
                    </div>
                  </div><!-- /.box -->
              </div>
              <div class="col-md-8" v-if="showRoles">
                  <div class="box box-primary col-md-12">
                    <div class="box-header with-border">
                      <h3 class="box-title"><i class="fa fa-list"></i> Asignar roles</h3>

                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                      </div><br/><br/>
                        <div class="form-group col-md-6">
                              <multiselect v-model="rol_select"
                                  :options="rolesSelect" placeholder="asignacion rol"
                                  :searchable="true"
                                  label="nombre" track-by="id">
                                <span slot="noResult">Ningun rol encontrado</span>
                              </multiselect>
                        </div>

                          <a class="btn btn-success" @click="asignRol"><i class="fa fa-plus"></i></a>
                    </div>

                    <!-- /.box-header -->
                    <div class="box-body no-padding">
                          <b-table responsive hover small flex
                              :fields="fields"
                              :items="roles"
                              :current-page="currentPage"
                              :per-page="perPage">
                              <!-- A virtual column -->
                              <template slot="nombre" slot-scope="data">
                                {{data.item.nombre}}
                              </template>
                              <template slot="detalle" slot-scope="data">
                                {{data.item.detalle}}
                              </template>
                              <template slot="opcion" slot-scope="data">
                                <a class="btn btn-primary btn-xs" data-toggle="modal" data-target="#rol" @click="menuItemsRol(data.item)"><i class="fa fa-plus"></i> Agregar Items</a>
                                <a class="btn btn-info btn-xs" @click="showMenuByRol(data.item)"><i class="fa fa-eye"></i></a>
                                <a class="btn btn-danger btn-xs" @click="destroy(data.item)"><i class="fa fa-minus"></i></a>
                              </template>
                            </b-table>
                            <b-row>
                                <b-col md="12" class="my-1">
                                  <label v-if="totalRows > 0">total: {{totalRows}} registros</label>
                                  <div class="text-center">
                                      <label v-if="totalRows === 0">No hay registros que mostrar</label>
                                  </div>
                                </b-col>
                            </b-row>
                      <!-- /.row -->
                    </div>
                    <!-- /.box-body -->
                  </div>
              </div><!-- /.col -->

                <div class="col-md-4 pull-right" v-if="showInfo">
                    <aside class="main-sidebar">
                      <section class="sidebar">
                        <!-- sidebar menu: : style can be found in sidebar.less -->
                        <ul class="sidebar-menu">
                          <li class="header"> {{'menu-'+sistema.nombre | uppercase }}</li>

                          <template v-for="(item, i) in menu">
                            <!-- renderisar los items que no tengan sub items y no esten escondidos -->
                            <template v-if="item.childrens.length === 0">
                              <router-link tag="li" :to="''+item.path" v-bind:key="i" exact>
                                <a><i :class="'fa fa-' + item.icon"></i> <span>{{item.text}}</span></a>
                              </router-link>
                            </template>

                              <!-- renderisar los items que tengan sub items y no esten escondidos -->
                              <li class="treeview" v-if="item.childrens.length > 0" v-bind:key="i">
                                <a class="sidebar-toggle" href="#">
                                  <i :class="'fa fa-' + item.icon"></i>
                                  <span>{{item.text}}</span>
                                  <i class="fa fa-angle-left pull-right-container"></i>
                                </a>
                                <ul class="treeview-menu">
                                <template v-for="(child, c) in item.childrens" :index="(i.toString() + c)">
                                  <router-link tag="li" :to="''+child.path" exact v-bind:key="c">
                                      <a><i :class="'fa fa-' + child.icon"></i>{{child.text}}</a>
                                  </router-link>
                                </template>
                                </ul>
                              </li>
                          </template>
                        </ul>
                      </section>
                    </aside>


              </div><!-- /.col -->

              <div class="col-md-12">
              <Menu v-if="showMenuItems" :sistema="sistema"></Menu>
              </div>
          <!-- /.row -->
      </section><!-- /.content -->

    <!-- Modal para agregar roles-->
  <div class="modal fade" id="rol" data-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">agregar items a rol </h4>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
            <AsignarRol v-if="isRol" :rol="rol"></AsignarRol>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" @click="cancelar" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-undo"></i> Volver</button>
        </div>
      </div>
    </div>
  </div>
  </div><!-- /.content-wrapper -->
  <!--Fin-Contenido-->
</template>

<script>
import Menu from './menu'
import AsignarRol from './AsignarRolMenu'

export default {
  name: 'Default',
  components: {
    Menu,
    AsignarRol
  },

  data() {
    return {
      loading: false,
      model: {},
      roles: [],
      rolesSelect: [],
      rol: null,
      rol_select: null,
      sistema: null,
      showInfo: false,
      showMenuItems: false,
      showRoles: false,
      isRol: false,
      menu: [],
      fields: [
        {key: 'nombre', label: 'Nombre', sortable: true },
        {key: 'detalle', label: 'Detalle', sortable: true },
        {key: 'opcion', label: 'Acciones' },
      ],

      filter: null,
      currentPage: 1,
      perPage: 100,
      totalRows: 0,
      pageOptions: [ 5, 10, 25 ],
      showStringEmpty: 'no hay registros que mostrar',
      form: {
        rol_id: null
      }
    };
  },

  created() {
    let self = this
    self.get(self.$route.params.id)
    //self.getRoles(self.$route.params.id)

    events.$on('updateMenu', () => {
      self.getMenu(self.model.id)
    })
  },

  ready() {
    /*events.$on('updateMenu', (data) => {
      debugger
      self.getMenu(data.sistema_id)
    });*/
  },

  methods: {
    get(id) {
      let self = this
      self.loading = true

      self.$store.state.services.sistemaService
        .get(id)
        .then(r => {
          self.loading = false
          self.model = r.data.data
        })
        .catch(r => {});
    },

    getRoles(id) {
      let self = this
      self.loading = true
      self.$store.state.services.sistemaService
        .getRoles(id)
        .then(r => {
          self.loading = false
          self.roles = r.data.data
          self.totalRows = self.roles.length
          self.getRolesSelect()

        })
        .catch(r => {});
    },

    getRolesSelect(){
      let self = this
      self.loading = true
      self.$store.state.services.rolService
        .getAll()
        .then(r => {
          self.loading = false
          self.rolesSelect = r.data.data
          self.mapArraySelect()
        })
        .catch(r => {});
    },

    //mostrar componente del menu
    showMenu(){
      let self = this
      self.sistema = self.model
      self.showMenuItems = true
      self.showRoles = false
      self.getMenu(self.model.id)
    },

    showInfoMenu(data){
      let self = this
      self.showInfo = true
      self.role = data
      self.getMenu(data.id)
    },

    getMenu(id){
      let self = this
      self.loading = true
      self.$store.state.services.sistemaService
        .getItemsMenu(id)
        .then(r => {
          self.loading = false
          self.showInfo = true
          self.mapMenu(r.data.data)
        })
        .catch(r => {});
    },

    getMenuByRol(id){
      let self = this
      self.loading = true
      self.$store.state.services.rolSistemaService
        .getItemsMenu(id)
        .then(r => {
          self.loading = false
          self.showInfo = true
          self.mapMenu(r.data.data)
        })
        .catch(r => {});
    },

//asignar roles a menu
    asignRolesItem(){
      let self = this
      self.sistema = self.model
      self.showMenuItems = false
      self.showRoles = true
      self.getRoles(self.model.id)
    },


    showMenuByRol(data){
      let self = this
      self.getMenuByRol(data.pivot.id)
    },

   //mostrar modal para asignar roles
   menuItemsRol(data){
     let self = this
     self.isRol = true
     self.rol = data
   },

   //cancelar asignacion de roles
   cancelar(){
     let self = this
     self.isRol = false
     self.getMenuByRol(self.rol.pivot.id)
   },

   mapArraySelect(){
      let self = this
      self.roles.forEach(function(item){
        self.rolesSelect.forEach(function(data){
          if(data.id === item.id)
          {
            self.rolesSelect.splice(self.rolesSelect.indexOf(data),1);
          }
        });
      });
    },

    asignRol(){
      let self = this
      var data = self.form
      data.rol_id = self.rol_select.id

      self.$store.state.services.sistemaService
        .asignRol(self.model.id, data)
        .then(r => {
        self.loading = false
        if(r.response){
            this.$toastr.error(r.response.data.error, 'error')
            return
          }

          this.$toastr.success('registro agregado con exito', 'exito')
          self.rol = null
          self.getRoles(self.model.id)
        })
        .catch(r => {});

    },

        //funcion para eliminar registro
    destroy(data){
      let self = this

      self.$swal({
        title: "Eliminar rol del sistema?",
        text: "Esta seguro de elminar rol "+data.nombre + '?',
        type: "warning",
        showCancelButton: true
      }).then((result) => { // <--
          if (result.value) { // <-- if confirmed
               self.loading = true
              self.$store.state.services.sistemaService
                .destroyRol(self.model.id, data.id)
                .then(r => {
                  self.loading = false
                    if(r.response){
                        this.$toastr.error(r.response.data.error, 'error')
                        return
                    }
                  this.$toastr.success('registro eliminado con exito', 'exito')
                  self.getRoles(self.model.id)
                })
                .catch(r => {});
          }
      });
    },

   mapMenu(data){
     let self = this
     self.menu = []
      data.forEach(function(item){
        if(item.padre_id === 0 && !item.escondido){
          var object = new Object
          object.icon = item.icon
          object.text = item.text
          object.path = item.path
          object.childrens = []

          data.forEach(function(child,i){
              if(item.id === child.padre_id && !child.escondido){
                var object2 = new Object()
                object2.icon = child.icon
                object2.text = child.text
                object2.path = child.path

                object.childrens.push(object2)
              }
            });
          self.menu.push(object)
        }
      })
   },
  },
  mounted(){
      $("body").resize()
  }
}
</script>
