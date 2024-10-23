<template>
<div v-loading="loading">
     <!-- Content Wrapper. Contains page content -->   
     <div class="content-wrapper">

        <!-- Main content -->
        <section class="content">
            <div class="row">
              <div class="col-md-6">
                  <div class="box box-primary">
                    <div class="box-header with-border">
                          <h1 class="box-title"><i class="fa fa-plus-square-o"></i> Nueva imagen</h1>
                        <div class="box-tools pull-right">
                        </div>
                    </div>
                    <form role="form">
                          <div class="box-body">
                            <div class="row">
                              <div class="form-group col-md-6">
                                <label for="imagen">Imagen</label>
                                
                                <input type="file" id="file" ref="file" v-on:change="onFileChange()"/>
                              </div>  
                              <div v-if="form.imagen">
                                <img :src="form.imagen" style="width: 40%; height:30%;">
                              </div>  
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
              <div class="col-md-6">
                  <div class="box box-primary">
                    <div class="box-header with-border">
                          <h1 class="box-title"><i class="fa fa-list"></i> Lista de imagenes</h1>
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
                      <template slot="imagen" slot-scope="data">
                        <img :src="data.item.imagen" style="width: 30%; height:30%;">
                     </template> 
                      <template slot="opcion" slot-scope="data">
                        <!--
                        <a class="btn btn-warning btn-sm" @click="edit(data.item)"><i class="fa fa-pencil"></i></a>
                        -->
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
  name: "imagenes",
  components: {
    FormError
  },

  data() {
    return {
     //configuracion del grid
      loading: false,
      items: [],
      fields: [
        {key: 'imagen', label: 'imagen', sortable: true },
        {key: 'opcion', label: 'Acciones' },
      ],

      filter: null,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [ 5, 10, 25 ],
      showStringEmpty: 'no hay registros que mostrar',
      options: ['Select option', 'options', 'selected', 'mulitple', 'label', 'searchable', 'clearOnSelect', 'hideSelected', 'maxHeight', 'allowEmpty', 'showLabels', 'onChange', 'touched'],


      //formulario de campos
      form: {
          id: null,
          imagen: '',
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

      self.$store.state.services.imagenService
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

      self.$store.state.services.imagenService
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
      self.$store.state.services.imagenService
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
        title: "Eliminar rol?",
        text: "Esta seguro de elminar imagen?",
        type: "warning",
        showCancelButton: true
      }).then((result) => { // <--
          if (result.value) { // <-- if confirmed
               self.loading = true
              self.$store.state.services.imagenService
                .destroy(data)
                .then(r => {
                  self.loading = false
                    if(r.response){
                        this.$toastr.error(r.response.data.error, 'error')
                        return
                    }
                  this.$toastr.success('imagen eliminado con exito', 'exito')                  
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
        self.$refs.file.value = '';
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
        self.form.imagen = data.imagen
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
    },

    showRole(data){
      let self = this
      self.rol = data
    },

    onFileChange() {
      let self = this
      var file = this.$refs.file.files[0];

      if (!file.type.includes('image/')) {
        alert('por favor seleccione una imagen')
        return
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader()

        reader.onload = (event) => {
          self.form.imagen = event.target.result
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },

  },

  mounted(){
        $("body").resize()
  }
};
</script>





