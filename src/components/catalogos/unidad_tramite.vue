<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Proceso del Tipo de Trámite
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
        <li><i class="fa fa-bug active"></i> Proceso del trámite</li>
      </ol>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <!-- Modal para mostrar tipo de congelacion de la unidad-->
      <div
        :class="abrirModal"
        data-backdrop="static"
        v-bind:style="styleObject"
        v-loading="loading"
      >
        <div class="modal-dialog modal-lg" style="width: 50%">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title" v-if="informacion_unidad_congelacion">
                Administrar Tipo de Congelaciones del paso número {{ informacion_unidad_congelacion.no_paso }}<button
                  type="button"
                  @click="cancel_show"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
            </div>

            <div class="modal-body" v-if="modalAgregar">
              <form role="form" autocomplete="off">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="tipo_congelacion_id"
                        >Tipo de Congelaciones</label
                      >
                      <multiselect
                        v-model="form_unidad_congelacion.tipo_congelacion_id"
                        :options="tipo_congelaciones"
                        placeholder="Seleccione uno o más por favor"
                        :searchable="false"
                        :allow-empty="true"
                        data-vv-name="tipo de congelación"
                        data-vv-scope="congelacion"
                        :show-labels="false"
                        label="nombre"
                        track-by="id"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :hide-selected="true"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'congelacion.tipo de congelación'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary btn-sm pull-right"
                @click="createCongelacion('congelacion')"
              >
                <i class="fa fa-save"></i> Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para mostrar agregar paso a la unidad-->
      <div
        :class="abrirModalRol"
        data-backdrop="static"
        v-bind:style="styleObjectRol"
        v-loading="loading"
      >
        <div class="modal-dialog modal-lg" style="width: 50%">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title" v-if="informacion_unidad_rol">
                Administrar Rol del paso número {{ informacion_unidad_rol.no_paso }}<button
                  type="button"
                  @click="cancel_showRol"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
            </div>

            <div class="modal-body" v-if="modalAgregarRol">
              <form role="form" autocomplete="off">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="tipo_congelacion_id"
                        >Roles</label
                      >
                      <multiselect
                        v-model="form_unidad_rol.rol_id"
                        :options="roles"
                        placeholder="Seleccione uno o más por favor"
                        :searchable="false"
                        :allow-empty="true"
                        data-vv-name="roles"
                        data-vv-scope="unidad_rol"
                        :show-labels="false"
                        label="nombre"
                        track-by="id"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :hide-selected="true"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'unidad_rol.roles'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary btn-sm pull-right"
                @click="createRol('unidad_rol')"
              >
                <i class="fa fa-save"></i> Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        :class="abrirModalPaso"
        data-backdrop="static"
        v-bind:style="styleObjectPaso"
        v-loading="loading"
      >
        <div class="modal-dialog modal-lg" style="width: 94%">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">
                Administrar pasos para {{ title_Paso }}
                <button
                  type="button"
                  @click="cancel_showPaso"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
            </div>

            <div class="modal-body" v-if="modalAgregarPaso" style="overflow-y:auto; height: 80%;">
              <form role="form" autocomplete="off">
                <div class="row">
                  <div class="col-md-4 text-center">
                    <div class="form-group">
                      <label for="no_paso">Número de paso</label>
                      <br />
                      <el-input-number
                        v-model="form_paso.no_paso"
                        :min="0"
                        controls-position="right"
                        v-validate="'required|between:1,1000'"
                        data-vv-name="número de paso"
                        data-vv-scope="paso"
                        :max="1000"
                      ></el-input-number>
                      <br />
                      <FormError
                        :attribute_name="'paso.número de paso'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                  <div class="col-md-4 text-center">
                    <div class="form-group">
                      <enhanced-check
                        :label="form_paso.adjuntar ? 'ES NECESARIO ADJUNTAR DOCUMENTO EN ESTE PASO' : 'NO ES NECESARIO ADJUNTAR DOCUMENTO EN ESTE PASO'"
                        subClass="success"
                        :animate="true"
                        :inline="false"
                        v-model="form_paso.adjuntar"
                        v-validate="'required'"
                        data-vv-name="adjuntar documento"
                        data-vv-scope="paso"
                      ></enhanced-check>
                      <FormError :attribute_name="'paso.adjuntar documento'" :errors_form="errors">
                      </FormError>
                    </div>
                  </div>
                  <div class="col-md-4 text-center">
                    <div class="form-group">
                      <enhanced-check
                        :label="form_paso.regreso ? 'HABILITAR REGRESAR' : 'NO ESTA HABILITADO EL REGRESO'"
                        subClass="success"
                        :animate="true"
                        :inline="false"
                        v-model="form_paso.regreso"
                        @submit="regresoPaso"
                        v-validate="'required'"
                      ></enhanced-check>
                    </div>
                  </div>

                </div>
                <div class="row">
                  <div class="col-md-4 text-center">
                    <div class="form-group">
                      <label for="días">Días para operar</label>
                      <br />
                      <el-input-number
                        v-model="form_paso.dias"
                        :min="0"
                        controls-position="right"
                        v-validate="'required'"
                        data-vv-name="días"
                      ></el-input-number>
                      <br />
                      <FormError :attribute_name="'días'" :errors_form="errors">
                      </FormError>
                    </div>
                  </div>
                  <div class="col-md-4 text-center">
                    <div class="form-group">
                      <label for="notificar_dia"
                        >Días con anticipación para notificar</label
                      >
                      <br />
                      <el-input-number
                        v-model="form_paso.notificar_dia"
                        :min="0"
                        controls-position="right"
                        v-validate="'required'"
                        data-vv-name="notificar día"
                        :max="(form_paso.dias-1)"
                      ></el-input-number>
                      <br />
                      <FormError
                        :attribute_name="'notificar día'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="paso_id">Paso siguiente</label>
                      <autocomplete
                        :search="buscar_paso"
                        clear
                        placeholder="Buscar número de PASO"
                        aria-label="Buscar número de PASO"
                        @submit="seleccionarPaso"
                        :get-result-value="getResultValue"
                      >
                      </autocomplete>
                      <FormError
                        :attribute_name="'paso.paso siguiente'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="padre_id">Asociar paso</label>
                      <multiselect
                        v-model="form_paso.padre_id"
                        :options="unidades_pasos"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="true"
                        data-vv-name="asociar paso"
                        data-vv-scope="paso"
                        :show-labels="false"
                        label="no_paso"
                        track-by="id"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :hide-selected="true"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'paso.asociar paso'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                    <div v-if="form_paso.regreso != false" class="form-group">
                      <label for="padre_id">Asociar paso regreso</label>
                      <multiselect
                        v-model="form_paso.padre_regreso"
                        :options="unidades_pasos"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="true"
                        data-vv-name="asociar paso"
                        data-vv-scope="paso"
                        :show-labels="false"
                        label="no_paso"
                        track-by="id"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :hide-selected="true"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'paso.asociar paso'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm pull-right"
                      @click="createPaso('paso')"
                    >
                      <i class="fa fa-save"></i> Guardar
                    </button>
                  </div>
                </div>
              </form>
              <div class="row">
                <div class="col-xs-12">
                  <div class="box">
                    <div class="box-header">
                      <h3 class="box-title">Pasos configuradors</h3>
                    </div>

                    <div class="box-body table-responsive no-padding">
                      <table class="table table-hover" >
                        <thead>
                          <tr>
                            <th class="text-center">Número de Paso</th>
                            <th class="text-center">Nombre de Paso</th>
                            <th class="text-center">¿Adjuntar Archivo?</th>
                            <th class="text-center">Paso Asociado</th>
                            <th class="text-center">Opción</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in unidad_tramite_pasos"
                            v-bind:key="index"
                          >
                            <td>Número de paso {{ item.no_paso }}</td>
                            <td>{{ item.paso.nombre }}</td>
                            <td>{{ item.adjuntar ? 'SI' : 'NO'}}</td>
                            <td>
                              Número de paso {{ item.no_paso }} asociado al paso
                              número {{ item.padre ? item.padre.no_paso : 0 }}
                            </td>
                            <td>
                              <!-- <a
                                class="btn btn-warning btn-sm"
                                @click="showCongelacion(item)"
                              >
                                <small>Agregar tipo de congelaciones</small>
                              </a> -->
                              <a
                                class="btn btn-primary btn-sm"
                                @click="showRol(item)"
                              >
                                <small>Agregar rol con acceso al paso</small>
                              </a>
                              <a
                                class="btn btn-md btn-danger"
                                @click="destroyPaso(item)"
                                ><i class="fa fa-thumbs-o-down"></i
                              ></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <strong>{{ nombreTramite }}</strong>
              </h4>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="unidad_id">Unidad</label>
                      <multiselect
                        v-model="form.unidad_id"
                        :options="unidades"
                        placeholder="Seleccione uno porfavor"
                        :searchable="true"
                        :allow-empty="false"
                        data-vv-name="unidad"
                        v-validate="'required'"
                        :show-labels="false"
                        label="nombre"
                        track-by="id"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'unidad'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                  <!-- <div class="col-md-3 text-center">
                    <div class="form-group">
                      <label for="días">Días para operar</label>
                      <br />
                      <el-input-number
                        v-model="form.dias"
                        :min="0"
                        controls-position="right"
                        v-validate="'required'"
                        data-vv-name="días"
                      ></el-input-number>
                      <br />
                      <FormError :attribute_name="'días'" :errors_form="errors">
                      </FormError>
                    </div>
                  </div>
                  <div class="col-md-3 text-center">
                    <div class="form-group">
                      <label for="notificar_dia"
                        >Días con anticipación para notificar</label
                      >
                      <br />
                      <el-input-number
                        v-model="form.notificar_dia"
                        :min="0"
                        controls-position="right"
                        v-validate="'required'"
                        data-vv-name="notificar día"
                        :max="(form.dias-1)"
                      ></el-input-number>
                      <br />
                      <FormError
                        :attribute_name="'notificar día'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div> -->
                  <div class="col-md-6 text-center">
                    <div class="form-group" v-if="form.es_padre">
                      <label for="padre_id">Asociar tipo de trámite</label>
                      <multiselect
                        v-model="form.padre_id"
                        :options="padres"
                        placeholder="Seleccione uno porfavor"
                        :searchable="true"
                        :allow-empty="false"
                        data-vv-name="asociar"
                        v-validate="'required'"
                        :show-labels="false"
                        label="nombre"
                        track-by="id"
                      >
                        <span slot="noResult">Ningún registro encontrado</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'asociar'"
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
                      <a class="btn btn-success btn-md" @click="edit(data.item)"
                        ><i class="fa fa-code-fork"></i
                      ></a>
                      <a
                        class="btn btn-info btn-sm"
                        @click="showPasos(data.item)"
                      >
                        <small>Agregar pasos</small>
                      </a>
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
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <div class="row">
                <div class="col-sm-12 col-md-2 col-lg-2">
                  <div class="form-group">
                    <label for="orientacion">Posición</label>
                    <multiselect
                      @input="cambiar_orientacion"
                      v-model="orientacion"
                      :options="orientaciones"
                      placeholder="Seleccione uno por favor"
                      :searchable="true"
                      :allow-empty="false"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                  </div>
                </div>
                <div class="col-sm-12 col-md-2 col-lg-2">
                  <div class="form-group">
                    <label for="color">Color</label>
                    <multiselect
                      @input="cambiar_color"
                      v-model="color_diagrama"
                      :options="colores"
                      placeholder="Seleccione uno por favor"
                      :searchable="true"
                      :allow-empty="false"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                  </div>
                </div>
                <div class="col-sm-12 col-md-5 col-lg-5">
                  <div class="form-group">
                    <label for="texto">Descripción de los estados</label>
                    <multiselect
                      @input="cambiar_texto"
                      v-model="texto_diagrama"
                      :options="textos"
                      placeholder="Seleccione uno por favor"
                      :searchable="true"
                      :allow-empty="false"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3">
                  <button
                    class="btn pull-right btn-block btn-primary btn-lg"
                    @click="verWorkFlow"
                  >
                    Recargar proceso de pasos
                  </button>
                </div>
              </div>
            </div>
            <div class="box-body text-center">
              <vue-mermaid
                v-if="data.length > 0"
                :nodes="diagrama"
                :type="orientacion_text"
                @nodeClick="editNode"
                :config="config"
              ></vue-mermaid>
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
  name: "UnidadTramiteCat",
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
  },
  data() {
    return {

      nombreTramite: "",

      loading: false,
      items: [],
      unidades: [],
      padres: [],
      unidades_congelaciones: [],
      tipo_congelaciones: [],
      roles: [],
      unidad_tramite_pasos: [],
      pasos: [],
      unidades_pasos: [],

      abrirModal: "modal fade",
      styleObject: {},
      modalAgregar: false,

      abrirModalPaso: "modal fade",
      styleObjectPaso: {},
      modalAgregarPaso: false,

      abrirModalRol: "modal fade",
      styleObjectRol: {},
      modalAgregarRol: false,

      informacion_unidad_congelacion: null,
      informacion_unidad_rol: null,

      fields: [
        { key: "id", label: "Número", sortable: true },
        { key: "unidad.nombre", label: "Dirección / Unidad", sortable: true },
        { key: "dias", label: "Días", sortable: true },
        { key: "notificar_dia", label: "Días para notificar", sortable: true },
        { key: "padre_id", label: "Asociación", sortable: true },
        { key: "opcion", label: "Acciones" },
      ],

      orientacion: { id: "graph TD", nombre: "Centrado" },
      orientaciones: [
        { id: "graph TD", nombre: "Centrado" },
        { id: "graph LR", nombre: "De izquierda a derecha" },
        { id: "graph RL", nombre: "De derecha a izquierda" },
      ],
      texto_diagrama: { id: 1, nombre: "Nombre del Paso" },
      textos: [
        { id: 1, nombre: "Nombre del Paso"  },
        { id: 2, nombre: "Nombre de la Unidad"  },
        { id: 3, nombre: "Abreviatura de la Unidad"  },
        { id: 4, nombre: "Nombre del Paso más Nombre de la Unidad"  },
        { id: 5, nombre: "Nombre del Paso más Abreviatura de la Unidad"  },
      ],
      color_diagrama: { id: "default", nombre: "Por defecto" },
      colores: [
        { id: "dark", nombre: "Escala de Grises" },
        { id: "default", nombre: "Por defecto" },
        { id: "forest", nombre: "Bosque" },
        { id: "neutral", nombre: "Normal" },
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
        unidad_id: null,
        padre_id: null,
        es_padre: false,
      },

      form_unidad_congelacion: {
        tipo_congelacion_id: [],
        unidad_tramite_id: null,
        unidad_paso_id: null
      },

      form_paso: {
        dias: 0,
        notificar_dia: 0,
        padre_regreso: [],
        regreso: false,
        no_paso: 0,
        paso_id: null,
        unidad_id: null,
        unidad_tramite_id: null,
        padre_id: [],
        mostrar_padre: false,
        adjuntar: true
      },

      form_unidad_rol: {
        rol_id: [],
        unidad_paso_id: null
      },

      unidad_tramite: null,

      orientacion_text: "graph TD",
      config: {
        theme: "default",
      },
      data: [],
      pasos: [],
    };
  },
  created() {
    let self = this;
    self.form.tipo_tramite_id = self.$route.params.tramite;
    // this.nombreTramite = self.$route.params.nombre;
    // console.log('this.nombreTramite');
    // console.log(this.nombreTramite);
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
    title_Paso() {
      return this.unidad_tramite ? this.unidad_tramite.unidad.nombre : "";
    },
    diagrama() {
      return this.data;
    },
  },
  methods: {
    editNode(e) {
      this.data.filter(x => {
        x.style !== '' ? x.style = "" : "";
      });
      this.data[parseInt(e)-1].style = "fill:#60d6fe,stroke:#fff,color:#fff,font-weight:bold";
      // let paso = this.pasos.filter(x => x.no_paso === parseInt(e))[0];
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getAll(), this.getUnidad(), this.verWorkFlow()])
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

      self.$store.state.services.unidadtramiteService
        .get(self.form.tipo_tramite_id)
        .then((r) => {
          self.loading = false;
          // console.log('r.data');
          // console.log(r.data);
          self.items = r.data.data;
          this.nombreTramite = r.data.nombre_tramite;
          self.totalRows = self.items.length;
        })
        .catch((r) => {});
    },

    verWorkFlow() {
      let self = this;
      self.loading = true;
      self.data = [];

      self.$store.state.services.unidadpasoService
        .getWorkFlow(self.form.tipo_tramite_id)
        .then((r) => {
          self.loading = false;
          this.pasos = r.data;
          r.data.forEach((element) => {
            let objeto = new Object();
            objeto.id = element.no_paso;
            if(this.texto_diagrama) {
              switch (this.texto_diagrama.id) {
                case 1:
                  objeto.text = "Paso No. " + element.no_paso +  " <br> " + element.paso
                  break;

                case 2:
                  objeto.text = "Paso No. " + element.no_paso +  " <br> " + element.unidad
                  break;

                case 3:
                  objeto.text = "Paso No. " + element.no_paso +  " <br> " + element.abreviatura
                  break;

                case 4:
                  objeto.text = "Paso No. " + element.no_paso +  " <br> " + element.paso +  " <br> " + element.unidad
                  break;

                case 5:
                  objeto.text = "Paso No. " + element.no_paso +  " <br> " + element.paso +  " <br> " + element.abreviatura
                  break;
              }
            } else {
              objeto.text = "Paso No. " + element.no_paso
            }
            objeto.editable = true;
            objeto.style = '';

            let next = [];
            r.data.forEach((item) => {
              if (item.padre_id == element.id && item.id != element.id) {
                next.push(item.no_paso);
              }
            });

            if (next.length > 0) objeto.next = next;

            if (next.length > 1) { // AQUI DEBE DE IR LA VALIDACION
              objeto.edgeType = "rhombus";
            } else {
              objeto.edgeType = "round";
            }

            self.data.push(objeto);
          });
        })
        .catch((r) => {});
    },

    cambiar_orientacion(item) {
      this.orientacion_text = item ? item.id : "graph TD";
    },

    cambiar_color(item) {
      this.config.theme = item ? item.id : "forest";
      this.verWorkFlow()
    },

    cambiar_texto() {
      this.verWorkFlow()
    },

    getUnidad() {
      let self = this;
      self.unidades = [];
      self.$store.state.services.unidadService
        .getAll()
        .then((r) => {
          self.unidades = r.data.data;
        })
        .catch((r) => {});
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;

      self.$store.state.services.unidadtramiteService
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
            self.$store.state.services.unidadtramiteService
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
      self.form.dias = 0;
      self.form.notificar_dia = 0;
      self.form.unidad_id = null;
      self.form.padre_id = null;
      self.form.es_padre = false;
      self.form_paso.regreso = false;
      self.form_paso.padre_regreso = [];
      self.form_paso.dias = 0;
      self.form_paso.notificar_dia = 0;

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
      self.clearData();

      self.items.forEach((element) => {
        self.padres.push(element.unidad);
      });

      self.form.es_padre = true;
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

    showCongelacion(item) {
      let self = this;
      this.loading = true;
      Promise.all([this.congelaciones(item.id), this.getTipoCongelacion()])
        .then(() => {
          self.cancel_showPaso()
          self.informacion_unidad_congelacion = item
          self.form_unidad_congelacion.unidad_tramite_id = item.unidad_tramite_id;
          self.form_unidad_congelacion.unidad_paso_id = item.id;
          self.styleObject.display = "block";
          self.abrirModal = "modal fade in";
          self.modalAgregar = true;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    showRol(item) {
      let self = this;
      this.loading = true;
      Promise.all([this.paso_roles(item.id), this.getRol()])
        .then(() => {
          self.cancel_showPaso()
          self.informacion_unidad_rol = item
          self.form_unidad_rol.unidad_paso_id = item.id;
          self.styleObjectRol.display = "block";
          self.abrirModalRol = "modal fade in";
          self.modalAgregarRol = true;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    showPasos(item) {
      let self = this;
      this.loading = true;
      Promise.all([this.unidadesPasos(item.id), self.verWorkFlow()])
        .then(() => {
          self.unidad_tramite = item;
          self.form_paso.unidad_tramite_id = item.id;
          self.form_paso.unidad_id = item.unidad;
          self.form_paso.padre_id = [];
          self.form_paso.mostrar_padre = false;
          // self.form_paso.adjuntar = false;
          self.styleObjectPaso.display = "block";
          self.abrirModalPaso = "modal fade in";
          self.modalAgregarPaso = true;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    destroyPaso(data) {
      let self = this;
      let title = "Eliminar";
      let type = "error";
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
            self.$store.state.services.unidadpasoService
              .destroy(data)
              .then((r) => {
                self.loading = false;

                if (r.response) return;

                this.$toastr.success(r.data, "Mensaje");
                self.showPasos(self.unidad_tramite);
              })
              .catch((r) => {
                console.log(r);
              });
          }
        });
    },

    congelaciones(id) {
      let self = this;
      self.form_unidad_congelacion.tipo_congelacion_id = [];

      self.$store.state.services.unidadtramitecongelacionService
        .get(id)
        .then((r) => {
          r.data.data.forEach((element) => {
            self.form_unidad_congelacion.tipo_congelacion_id.push(
              element.tipo_congelacion
            );
          });
        })
        .catch((r) => {});
    },

    paso_roles(id) {
      let self = this;
      self.form_unidad_rol.rol_id = [];
      self.$store.state.services.unidadpasorolService
        .get(id)
        .then((r) => {
          r.data.data.forEach((element) => {
            self.form_unidad_rol.rol_id.push(
              element.rol
            );
          });
        })
        .catch((r) => {});
    },

    unidadesPasos(id) {
      let self = this;
      self.$store.state.services.unidadpasoService
        .get(id)
        .then((r) => {
          self.unidad_tramite_pasos = r.data.unidad_paso;
          self.unidades_pasos = r.data.unidades;
          self.pasos = r.data.pasos;
        })
        .catch((r) => {});
    },

    getTipoCongelacion() {
      let self = this;
      self.tipo_congelaciones = [];
      self.$store.state.services.tipocongelacionService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.tipo_congelaciones.push(element);
          });
        })
        .catch((r) => {
          console.log(r);
        });
    },

    getRol() {
      let self = this;
      self.roles = [];
      self.$store.state.services.unidadpasorolService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.roles.push(element.rol);
          });
        })
        .catch((r) => {
          console.log(r);
        });
    },

    cancel_show() {
      let self = this;
      self.informacion_unidad_congelacion = null
      self.form_unidad_congelacion.tipo_congelacion_id = [];
      self.form_unidad_congelacion.unidad_tramite_id = null;
      self.styleObject.display = "";
      self.abrirModal = "modal fade";
      self.modalAgregar = false;
      self.showPasos(self.unidad_tramite);
    },

    cancel_showPaso() {
      let self = this;
      self.form_paso.regreso = false;
      self.form_paso.padre_regreso = [];
      self.form_paso.no_paso = 0;
      self.form_paso.paso_id = null;
      self.form_paso.unidad_id = null;
      self.form_paso.unidad_tramite_id = null;
      self.form_paso.padre_id = [];
      self.form_paso.mostrar_padre = false;
      self.form_paso.adjuntar = false;
      self.form_paso.dias = 0;
      self.form_paso.notificar_dia = 0;
      self.styleObjectPaso.display = "";
      self.abrirModalPaso = "modal fade";
      self.modalAgregarPaso = false;
    },

    cancel_showRol() {
      let self = this;
      self.informacion_unidad_rol = null
      self.form_unidad_rol.rol_id = [];
      self.form_unidad_rol.unidad_tramite_id = null;
      self.styleObjectRol.display = "";
      self.form_paso.dias = 0;
      self.form_paso.notificar_dia = 0;
      self.abrirModalRol = "modal fade";
      self.modalAgregarPaso = false;
      self.showPasos(self.unidad_tramite);
    },

    createCongelacion(scope) {
      let self = this;
      self.$validator.validateAll(scope).then((result) => {
        if (result) {
          self.loading = true;

          self.$store.state.services.unidadtramitecongelacionService
            .create(self.form_unidad_congelacion)
            .then((r) => {
              self.loading = false;

              if (r.response) return;

              this.$toastr.success(r.data, "Mensaje");
              self.showCongelacion(
                self.informacion_unidad_congelacion
              );
            })
            .catch((r) => {
              console.log(r);
            });
        }
      });
    },

    createRol(scope) {
      let self = this;
      self.$validator.validateAll(scope).then((result) => {
        if (result) {
          self.loading = true;

          self.$store.state.services.unidadpasorolService
            .create(self.form_unidad_rol)
            .then((r) => {
              self.loading = false;

              if (r.response) return;

              this.$toastr.success(r.data, "Mensaje");
              self.showRol(
                self.informacion_unidad_rol
              );
            })
            .catch((r) => {
              console.log(r);
            });
        }
      });
    },

    buscar_paso(input) {
      let self = this;
      let pos = -1;
      let temporal = [];
      self.form_paso.paso_id = null;

      return new Promise((resolve) => {
        self.pasos.forEach(element => {
            pos = element.nombre.search(input.toUpperCase());
            if(pos != -1) {
              temporal.push(element)
            } else {
              this.form_paso.paso_id = input.toUpperCase()
            }
        })

	      resolve(temporal);
      });
    },

    seleccionarPaso(result) {
      if (result) {
	      this.form_paso.paso_id = result.nombre
      } else {
	      this.form_paso.paso_id = null
      }
    },

    regresoPaso(){
      this.form_paso.regreso = true;
    },

    createPaso(scope) {
      let self = this;
      self.$validator.validateAll(scope).then((result) => {
        if (result) {
          self.loading = true;
          self.$store.state.services.unidadpasoService
            .create(self.form_paso)
            .then((r) => {
              self.loading = false;

              if (r.response) return;

              this.$toastr.success(r.data, "Mensaje");
              self.showPasos(self.unidad_tramite);
              self.form_paso.no_paso = 0;
              self.form_paso.paso_id = null;
              self.form_paso.padre_id = []
              self.form_paso.regreso = false;
              self.form_paso.padre_regreso = [];
              self.form_paso.dias = 0;
              self.form_paso.notificar_dia = 0;
            })
            .catch((r) => {
              console.log(r);
            });
        }
      });
    },

    getResultValue(result) {
      return result.nombre;
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
