<template>
<div>
     <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">        
        <!-- Main content -->
        <section class="content">
            <div class="row">
              <div class="col-md-12">
                  <div class="box box-primary">
                    <div class="box-header with-border">
                          <h1 v-if="gridMode"  class="box-title">Usuarios <button class="btn btn-success" @click="nuevo"><i class="fa fa-plus-circle"></i> Agregar</button></h1>
                          <h1 v-if="insertMode"  class="box-title"> Nuevo Registro</h1>
                        <div class="box-tools pull-right">
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <!-- centro -->
                    <div class="panel-body table-responsive" id="listadoregistros">

                <template>
                <!-- Grid table-->
                    <div class="col-sm-12" v-if="gridMode">
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
                      <template slot="id" slot-scope="data">
                        {{data.item.id}}
                      </template>
                      <template slot="title" slot-scope="data">
                        {{data.item.title}}
                      </template>
                      <template slot="body" slot-scope="data">
                        {{data.item.body}}
                      </template>
                      <template slot="option" slot-scope="data">
                        <a v-b-tooltip.hover title="Ver" class="btn btn-primary btn-sm"><i class="fa fa-eye"></i></a>
                        <a class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></a>
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
                  <!-- centro -->

                  <!-- Formulario -->
                  <div v-if="insertMode">
                      <form role="form">
                              <div class="box-body">
                                <div class="row">
                                  <div class="form-group col-md-4 col-sm-4 col-lg-4">
                                    <label for="exampleInputEmail1">Empleado</label>
                                    <select v-model="form.empleado_id" class="form-control">
                                      <option v-for="item in empleados" v-bind:value="item.id">
                                        {{  }}
                                      </option>
                                    </select>
                                  </div>

                                  <div class="form-group col-md-4 col-sm-4 col-lg-4">
                                    <label for="password">Contraseña</label>
                                    <input v-model="form.password" type="password" class="form-control" ref="password" id="password" placeholder="ingrese contraseña" name="password"  v-validate="'required|min:6'"
                                     :class="{'input':true,'has-errors': errors.has('password')}">

                                     <FormError :attribute_name="'password'" :errors_form="errors"> </FormError>
                                  </div>

                                  <div class="form-group col-md-4 col-sm-4 col-lg-4">
                                    <label for="contraseña">Confirmar contraseña</label>
                                    <input v-model="form.password_confirmation" type="password" class="form-control" id="password_confirmation" placeholder="ingrese contraseña" name="password_confirmation"
                                    v-validate="'required|confirmed:password'" data-vv-as="password">
                                    <FormError :attribute_name="'password_confirmation'" :errors_form="errors"> </FormError>
                                  </div>
                                </div>
                              </div>
                              <!-- /.box-body -->

                              <div class="box-footer pull-right">
                                <button type="button" class="btn btn-primary" @click="create"><i class="fa fa-save"></i> Guardar</button>
                                <button type="button" class="btn btn-danger" @click="cancelar"><i class="fa fa-undo"></i> Cancelar</button>
                              </div>
                        </form>                     
                  </div>
                  <!-- Formulario -->

                  </template>
                         
                    </div>
                    <!--Fin centro -->
                  </div><!-- /.box -->
              </div><!-- /.col -->
          </div><!-- /.row -->
      </section><!-- /.content -->

    </div><!-- /.content-wrapper -->
</div>
</template>

<script>
import FormError from '../shared/FormError'

export default {
  name: 'Usuario',
  components: {
    FormError
  },

  data() {
    return {
      loading: false,
      gridMode: true,
      insertMode: false,
      selected: 1,

      items: [],
      empleados: [],
      fields: [
        { key: 'id', label: 'Dpi', sortable: true },
        { key: 'title', label: 'Nombre', sortable: true },
        { key: 'body', label: 'Email', sortable: true },
        { key: 'option', label: 'Opciones', sortable: true },
      ],
      filter: null,
      currentPage: 1,
      perPage: 100,
      totalRows: 0,
      pageOptions: [ 5, 10, 25 ],
      showStringEmpty: 'no hay registros que mostrar',
      
      form: {
          empleado_id: null,
          password: '',
          password_confirmation: ''
      },
    };
  },
  created() {
    let self = this;
    self.getAll();
  },
  methods: {
  //metodo on filteres
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    //obtener todos los items
    getAll() {
      let self = this;
      self.loading = true;
    },

    //nuevo registro mostrar formulario esconder grid
    nuevo(){
      let self = this
      self.insertMode = true
      self.gridMode = false
      self.getEmpleados()
    },

    create(){
        this.$validator.validateAll().then((result) => {
          if (result) {
               alert("form valido")
              }
        });
    },

    //cancelar operacion
    cancelar(){
      let self = this
      self.gridMode = true
      self.insertMode = false
    },

    //seccion para alimentar arrays externos
    getEmpleados(){
      let self = this
      self.$store.state.services.empleadoService
        .getAll()
        .then(r => {
          self.empleados = r.data.data
        })
        .catch(r => {});
    }
  },

  mounted(){
        $("body").resize()
  }
};
</script>