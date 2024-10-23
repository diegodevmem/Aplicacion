<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Llamar Documentos
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <ol class="label breadcrumb bg-gray pull-right">
            <router-link tag="li" to="/exp_default" exact>
              <i class="fa fa-home"></i> Home
            </router-link>
            <router-link tag="li" to="/" exact>
              <i class="fa fa-dashboard"></i> Dashboard
            </router-link>
            <li><i class="fa fa-bug active"></i> Adminsitrar Documentos</li>
          </ol>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Información ingresada en el sistema.
              </h1>
            </div>
            <div class="panel-body table-responsive">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <v-jstree
                    v-if="archivos !== null"
                    :data="asyncData"
                    :async="loadData"
                    text-field-name="valor"
                    value-field-name="id"
                    allow-batch
                    size="large"
                    whole-row
                    @item-click="itemClick"
                    ref="tree2"
                  ></v-jstree>
                  <h3 v-else>No se encontraron expedientes</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal para mostrar los documentos de la actuacion seleccionada -->
    <div
      :class="abrirModalDocumento"
      data-backdrop="static"
      v-bind:style="styleObjectDocumento"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 94%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ titleDocumento }}
              <button
                type="button"
                @click="cancel_showDocumento"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 80%"
            v-if="modalDocumento"
          >
            <div class="row">
              <div class="col-md-12">
                <div class="row">
              
                  <div
                    :class="                 
                    
                         'col-sm-12 col-md-12 col-lg-12'
                    "
                  >
                    <br />
                    <div class="input-group input-group-lg">
                      <div class="input-group-btn">
                        <button
                          type="button"
                          class="btn btn-primary btn-small btn-disabled"
                        >
                          Documento nuevo|
                        </button>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        data-vv-name="documento"
                        v-validate="'required|mimes:application/pdf'"
                        name="documento"
                        @change="onFileChange($event)"
                        ref="inputFile"
                        id="documento"
                        class="form-control inputfile inputfile-6"
                      />
                      <FormError
                        :attribute_name="'documento'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="box-footer">
                      <button
                        type="button"
                        class="btn btn-danger btn-block btn-large pull-left"
                        @click="cancel_showDocumento"
                      >
                        <i class="fa fa-ban"></i> Cancelar
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-block btn-large pull-right"
                        @click="guardar"
                      >
                        <i class="fa fa-save"></i> Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div v-if="show_two" class="p-0 m-0" >
               <span class="text-center"><h4><strong> Sustitución de documentos </strong>  </h4> </span>
               <br />
             <v-row style="height: 60vh">
               <v-col  md="5" >
              <h4>    <strong>Nuevo  </strong> </h4>
                 <iframe
                   :src="src2"
                   type="application/pdf"
                   width="100%"
                   height="100%"
                 />
               </v-col>
 
               <v-col md="2" > <v-icon x-large color="#142638">change_circle</v-icon></v-col>
               <v-col md="5" >
                <h4> <strong> Actual </strong></h4>
                 <iframe
                   :src="src"
                   type="application/pdf"
                   width="100%"
                   height="100%"
                 />
               </v-col>


             </v-row>
            </div>

            <iframe
              v-if="show"
              :src="src"
              style="width: 100%; height: 70vh; border: none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./expediente_documento.js">
</script>
