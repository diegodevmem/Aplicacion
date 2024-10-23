<template>
<div v-loading="loading">
     <!-- Content Wrapper. Contains page content -->   
     <div class="content-wrapper">

        <!-- Main content -->
        <section class="content">
            <div class="row">
              <div class="col-md-5">
                  <div class="box box-primary">
                    <div class="box-header with-border">
                          <h1 class="box-title"><i class="fa fa-plus-square-o"></i> Nuevo registro</h1>
                        <div class="box-tools pull-right">
                        </div>
                    </div>
                       <form role="form">
                           <div class="box-body">
                               <div class="row">
                              <div class="form-group col-md-12 col-sm-12 col-lg-12">
                                <label for="nombre">Nombre</label>
                                
                                <input v-model="form.nombre" type="text" class="form-control" id="nombre" placeholder="ingrese nombre" name="nombre"  v-validate="'required|min:3'"
                                  :class="{'input':true,'has-errors': errors.has('nombre')}">
                                  <FormError :attribute_name="'nombre'" :errors_form="errors"></FormError>
                              </div>
                              <div class="form-group col-md-12 col-sm-12 col-lg-12">
                                <label for="detalle">Detalle</label>
                                
                                <input v-model="form.detalle" type="text" class="form-control" id="nombre" placeholder="ingrese detalle de siglas" name="detalle"  v-validate="'required|min:6'"
                                  :class="{'input':true,'has-errors': errors.has('detalle')}">
                                  <FormError :attribute_name="'detalle'" :errors_form="errors"></FormError>
                              </div> 

                              
                              <div class="form-group col-md-6 col-sm-6 col-lg-6">
                                <label for="url">Ruta</label>
                                
                                <input v-model="form.path" type="text" class="form-control" id="path" placeholder="ingrese ruta principal" name="path"  v-validate="'required'"
                                  :class="{'input':true,'has-errors': errors.has('url')}">
                                  <FormError :attribute_name="'path'" :errors_form="errors"></FormError>
                              </div> 

                              <div class="form-group col-md- col-sm-6 col-lg-6">
                                <label for="icon">Icono</label>
                                <input v-model="form.icon" type="text" class="form-control" id="nombre" placeholder="ingrese nombre" name="icon"  v-validate="'required'"
                                  :class="{'input':true,'has-errors': errors.has('icon')}">
                                  <FormError :attribute_name="'icon'" :errors_form="errors"></FormError>
                              </div>

                             <!-- <div class="form-group col-md-3 col-sm-3 col-lg-3">
                                <label for="url">Asignar roles</label>
                                <div class="checkbox form-inline" v-for="role in roles" :key="role.id">
                                    <label>
                                        <input type="checkbox" v-model="form.roles" :value="role.id"/> {{role.nombre}}
                                    </label>
                               </div>
                              </div> -->
                        </div>
                    
                         <div class="box-footer pull-right">
                            <button type="button" class="btn btn-primary" @click="createOrEdit"><i class="fa fa-save"></i> Guardar</button>
                            <button type="button" class="btn btn-danger" @click="clearData"><i class="fa fa-undo"></i> Cancelar</button>
                          </div>
                           </div>
                         <!-- /.box-body -->
                    </form> 
                  </div><!-- /.box -->
              </div><!-- /.col -->
              <div class="col-md-7">
                  <div class="box box-primary">
                    <div class="box-header with-border">
                          <h1 class="box-title"><i class="fa fa-list"></i> Lista de sistemas</h1>
                        <div class="box-tools pull-right">
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <!-- centro -->
                    <div class="panel-body table-responsive" id="listadoregistros">

                <!-- vista del grid-->
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
                    <b-table responsive hover small flex
                       :fields="fields" 
                       :items="items"
                       :filter = "filter"
                       :current-page="currentPage"
                       :per-page="perPage"
                       @filtered="onFiltered">
                      <!-- A virtual column -->
                      <template slot="nombre" slot-scope="data">
                        {{data.item.nombre}}
                      </template>
                      <template slot="detalle" slot-scope="data">
                        {{data.item.detalle}}
                      </template>
                      <template slot="path" slot-scope="data">
                        {{data.item.path}}
                      </template>
                      <template slot="opcion" slot-scope="data">
                        <a class="btn btn-info btn-sm" @click="$router.push(`/sau_configuracion_sistema/`+data.item.id)"><i class="fa fa-cog"></i> Configurar</a>
                        <a class="btn btn-warning btn-sm" @click="edit(data.item)"><i class="fa fa-pencil"></i></a>
                        <a class="btn btn-danger btn-sm" @click="destroy(data.item)"><i class="fa fa-trash"></i></a>
                      </template>

                    </b-table>
                    <b-row>

                        <b-col md="12" class="my-1">
                           <label v-if="totalRows > 0">total: {{totalRows}} registros</label> 
                           <div class="text-center">
                              <label v-if="totalRows === 0">No hay registros que mostrar</label> 
                           </div>   
                         </b-col>

                    <b-col class="my-1 pull-right">
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0 text-center" />
                      </b-col>
                    </b-row>
                    </div>
                  </template>

                  <!-- fin vista del grid-->

                  <!-- formulario-->
                    
                  <!-- fin vista formulario-->
                         
                    </div>
                    <!--Fin centro -->
                  </div><!-- /.box -->
              </div><!-- /.col -->
          </div><!-- /.row -->
      </section><!-- /.content -->
    </div>

</div>

</template>


<script>
import FormError from '../shared/FormError'

export default {
  name: "sistemas",
  components: {
    FormError
  },

  data() {
    return {
     //configuracion del grid
      loading: false,
      items: [],
      fields: [
        {key: 'nombre', label: 'Nombre', sortable: true },
        {key: 'detalle', label: 'Detalle', sortable: true },
        {key: 'url', label: 'Url', sortable: true },
        {key: 'opcion', label: 'Acciones' },
      ],

      filter: null,
      currentPage: 1,
      perPage: 100,
      totalRows: 0,
      pageOptions: [ 5, 10, 25 ],
      showStringEmpty: 'no hay registros que mostrar',


      //formulario de campos
      form: {
          id: null,
          nombre: '',
          detalle: '',
          icon: '',
          path: ''
      }

    };
  },

  created() {
    let self = this
    self.getAll()
  },

  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    getAll() {
      let self = this;
      self.loading = true;

      self.$store.state.services.sistemaService
        .getAll()
        .then(r => {
          self.loading = false
          self.items = r.data.data;
          self.totalRows = self.items.length
        })
        .catch(r => {});
    },

    //funcion para guardar registro
    create(){
      let self = this
      self.loading = true
      let data = self.form

      self.$store.state.services.sistemaService
        .create(data)
        .then(r => {
        self.loading = false
        if(r.response){
            this.$toastr.error(r.response.data.error, 'error')
            return
          }
          
          this.$toastr.success('registro agregado con exito', 'exito')
          self.getAll()
          self.clearData()
        })
        .catch(r => {});
    },

    //funcion para actualizar registro
    update(){
      let self = this
      self.loading = true
      let data = self.form
      self.$store.state.services.sistemaService
        .update(data)
        .then(r => {
          self.loading = false
          if(r.response){
            this.$toastr.error(r.response.data.error, 'error')
            return
          }
          self.getAll()
          this.$toastr.success('registro actualizado con exito', 'exito')
          self.clearData()
        })
        .catch(r => {});
    },

    //funcion para eliminar registro
    destroy(data){
      let self = this

      self.$swal({
        title: "Eliminar sistema?",
        text: "Esta seguro de elminar sistema "+data.nombre + '?',
        type: "warning",
        showCancelButton: true
      }).then((result) => { // <--
          if (result.value) { // <-- if confirmed
               self.loading = true
              self.$store.state.services.sistemaService
                .destroy(data)
                .then(r => {
                  self.loading = false
                    if(r.response){
                        this.$toastr.error(r.response.data.error, 'error')
                        return
                    }
                  this.$toastr.success('registro eliminado con exito', 'exito')                  
                  self.getAll()
                  self.clearData()
                })
                .catch(r => {});
          }
      });
    },

    //limpiar data de formulario
    clearData(){
        let self = this

        Object.keys(self.form).forEach(function(key,index) {
          if(typeof self.form[key] === "string") 
            self.form[key] = ''
          else if (typeof self.form[key] === "boolean") 
            self.form[key] = false
          else if (typeof self.form[key] === "number") 
            self.form[key] = false
        });

        self.$validator.reset()
        self.$validator.reset()
    },

    //editar registro
    edit(data){
        let self = this
        self.gridMode = false
        self.insertMode = true
        self.mapData(data)
        
    },

    //mapear datos a formulario
    mapData(data){
        let self = this
        self.form.id = data.id
        self.form.nombre = data.nombre
        self.form.detalle = data.detalle
        self.form.icon = data.icon
        self.form.path = data.path
    },

    //funcion, validar si se guarda o actualiza
    createOrEdit(){
      this.$validator.validateAll().then((result) => {
          if (result) {
              if(self.form.id > 0 && self.form.id !== null){
                self.update()
              }else{
                self.create()
              }
           }
      });

      let self = this
    },

    cancelar(){
      let self = this
      self.isRol = false
    }
  },

  mounted(){
        $("body").resize()
  }
};
</script>





