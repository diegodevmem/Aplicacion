<template>
<div>
     <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <!-- Main content -->
        <section class="content" v-loading="loading">
            <div class="box-header col-md-12">
                <a class="btn btn-block btn-primary"><i class="fa fa-list"></i> <b>LISTA DE ROLES</b> </a>
            </div>

               <!-- vista del grid-->
               <div class="col-md-12">

                <div class="box box-primary">
                    <!-- /.box-header -->
                    <!-- centro -->
                    <div class="panel-body table-responsive" id="listadoregistros">

                <!-- vista del grid-->
                <template>
                    <div class="col-sm-5">
                      <b-row>

                    <!--   <b-col md="2" class="my-1 form-inline">
                        <label>mostrando: </label>
                            <b-form-select :options="pageOptions" v-model="perPage" />
                          <label>entradas </label>
                      </b-col>

                      <b-col class="my-1 form-group pull-right">
                          <b-input-group>
                            <b-form-input v-model="filter" placeholder="buscar" />
                          </b-input-group>
                      </b-col>-->
                    </b-row>
                    <b-table responsive hover small flex
                       :fields="fields"
                       :items="items"
                       :filter = "filter"
                       :current-page="currentPage"
                       :per-page="perPage"
                       :bordered="isBordered"
                       @filtered="onFiltered">
                      <!-- A virtual column -->
                      <template slot="nombre" slot-scope="data">
                        {{data.item.nombre}}
                      </template>
                      <template slot="opcion" slot-scope="data">
                        <a class="btn btn-primary btn-xs" @click="getMenuByRol(data.item)"><i class="fa fa-eye"></i> ver permisos</a>
                      </template>
                    </b-table>
                    <b-row>

                    <b-col md="12" class="my-1">
                        <label v-if="totalRows > 0">Total: {{totalRows}} registros</label>
                        <div class="text-center">
                            <label v-if="totalRows === 0">No hay registros que mostrar</label>
                        </div>
                    </b-col>

                    <b-col class="my-1 pull-right">
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0 text-center" />
                      </b-col>
                    </b-row>
                    </div>
                    <div class="col-md-7">
                        <div class="box box-solid">
                            <div class="box-header with-border">
                            <i class="fa fa-text-width"></i>

                            <h3 class="box-title">Lista de permisos para rol {{rol.nombre}}</h3>
                            <br />
                            <small class="text-info text-bold">{{rol.detalle}}</small>
                            </div>
                            <!-- /.box-header -->
                            <div class="box-body">
                            <ul class="list-unstyled">
                                <div v-for="permiso in permisos">
                                    <li>{{permiso.text}}
                                    <ul v-for="child in permiso.childrens">
                                        <li>{{child.text}}</li>
                                    </ul>
                                    </li>
                                </div>
                            </ul>
                            </div>
                            <!-- /.box-body -->
                        </div>
                    </div>
                  </template>

                  <!-- fin vista del grid-->

                  <!-- formulario-->

                  <!-- fin vista formulario-->

                    </div>
                    <!--Fin centro -->
                  </div><!-- /.box -->
               </div>
            <!-- /.box-footer -->
      </section><!-- /.content -->

    </div><!-- /.content-wrapper -->
</div>
</template>

<script>

export default {
  name: 'Usuario',
  components: {
  },

  data() {
    return {
      loading: false,
      roles: [],
      items: [],
      permisos: [],
      rol: {},
      fields: [
        {key: 'nombre', label: 'Rol', sortable: true },
        {key: 'opcion', label: 'Acciones'},
      ],

      isBordered:true,
      filter: null,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [ 5, 10, 25 ],
      showStringEmpty: 'no hay registros que mostrar',
    };
  },
  created() {
    let self = this;
    self.getAll(self.$store.state.sistema.id)
  },

  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    //obtener todos los items
    getAll(id) {
      let self = this;
      self.loading = true;
      self.$store.state.services.sistemaService
        .getRoles(id)
        .then(r => {
          self.loading = false;
           self.items = r.data.data
           self.totalRows = self.items.length
        })
        .catch(r => {});
    },

    getMenuByRol(data){
      let self = this
      self.rol = data
      self.loading = true
      self.$store.state.services.rolSistemaService
        .getItemsMenu(data.pivot.id)
        .then(r => {
          self.loading = false
          self.mapMenu(r.data.data)
        })
        .catch(r => {});
    },

    mapMenu(data){
     let self = this
     self.permisos = []
      data.forEach(function(item){
        if(item.padre_id === 0 && !item.escondido){
          var object = new Object
          object.icon = item.icon
          object.text = item.text
          object.path = item.path
          object.childrens = []

          data.forEach(function(child,i){
              if(item.id === child.padre_id){
                var object2 = new Object()
                object2.icon = child.icon
                object2.text = child.text
                object2.path = child.path

                object.childrens.push(object2)
              }
            });
          self.permisos.push(object)
        }
      })
   },
  },

  mounted(){
        $("body").resize()
  },

  computed: {
      getSystem()
      {
          let self = this
          return self.$store.state.sistema.nombre + '('+self.$store.state.sistema.detalle+')'
      }
  }
};
</script>
