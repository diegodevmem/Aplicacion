<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Crear {{ completar_titulo }}
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
      <br /><br />
      <ol class="label breadcrumb bg-gray">
        <router-link tag="li" to="/cat_default" exact>
          <i class="fa fa-home"></i> Home
        </router-link>
        <router-link tag="li" to="/" exact>
          <i class="fa fa-dashboard"></i> Dashboard
        </router-link>
        <li><i class="fa fa-bug active"></i> Nuevo Expediente</li>
      </ol>
    </section>
    <br />
    <section class="content">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary" id="p0">
            <div class="box-header" v-if="numero_expediente">
              Agregar actuación al expediente número
              <strong>{{ numero_expediente }}</strong>
            </div>
            <div class="box-body">
              <form role="form" autocomplete="off">
                <div class="row">
                  <div class="col-sm-12 col-md-8 col-lg-8">
                    <div class="form-group">
                      <label for="tipo_tramite_id">Tipo de trámite</label>
                      <multiselect
                        @input="buscar_requisitos"
                        @select="isActive = false"
                        v-model="form.tipo_tramite_id"
                        :options="tipos_tramites"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="true"
                        :preselect-first="true"
                        data-vv-name="tipo de trámite"
                        v-validate="'required'"
                        :show-labels="false"
                        :show-no-result="true"
                        label="nombre"
                        track-by="id"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'tipo de trámite'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>

                  <div class="col-sm-12 col-md-3 col-lg-3">
                    <div class="form-group">
                      <label for="tipo_requisito_id"
                        >Tipo de requerimiento</label
                      >
                      <multiselect
                        @input="buscar_requisitos"
                        @select="isActive = false"
                        v-model="form.tipo_requisito_id"
                        :options="tipo_requisitos"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="true"
                        :preselect-first="true"
                        data-vv-name="tipo de requisito"
                        v-validate="'required'"
                        :show-labels="false"
                        :show-no-result="true"
                        label="nombre"
                        track-by="id"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>
                      <FormError
                        :attribute_name="'tipo de requisito'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                  <!-- <pre>{{ this.form }}</pre> -->

                  <div class="col-md-6" v-if="form.tipo_tramite_id">
                    <input
                      v-if="form.tipo_tramite_id.antiguo"
                      v-model="form.num_antiguo"
                      type="text"
                      class="form-control"
                      id="nombre_expediente"
                      placeholder="Escribir el número del expediente"
                      name="nombre del expediente"
                    />
                  </div>
                  <div class="col-md-6" v-if="form.tipo_tramite_id">
                    <button
                      type="button"
                      v-if="form.tipo_tramite_id.antiguo"
                      class="btn btn-primary"
                      style="border-radius: 15px"
                      @click="validarExpedienteantiguo()"
                    >
                      Verificar si el número de expediente existe
                    </button>
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <!-- <pre>{{form.num_antiguo}}</pre> -->
                  <div v-if="!bloquearFormulario">
                    <div
                      class="col-sm-12 col-md-12 col-lg-12"
                      v-if="form.tipo_tramite_id && !bloquearFormulario"
                    >
                      <hr />
                      <h3 class="text-center">
                        REQUISITOS PARA EL TRÁMITE <br />
                        {{ form.tipo_tramite_id.nombre }}
                      </h3>
                      <br /><br />
                      <!-- <pdf
                        v-for="i in numPages"
                        :key="i"
                        :src="src"
                        :page="i"
                        style="display: inline-block; width: 10%"
                      ></pdf> -->
                      <br /><br />
                    </div>
                    <template v-for="(item, index) in requisitos">
                      <div
                        v-bind:key="index"
                        class="col-sm-12 col-md-12 col-lg-12"
                        v-if="form.tipo_tramite_id && form.tipo_requisito_id"
                      >
                        <label for="file">{{ item.requisito }}</label>
                        <div class="input-group input-group-lg">
                          <div class="input-group-btn">
                            <button
                              type="button"
                              :class="
                                'btn btn-' +
                                  item.estado +
                                  ' btn-small btn-disabled'
                              "
                            >
                              Adjuntar documento |
                              <small>Páginas {{ item.folio }}</small>
                            </button>
                          </div>
                          <input
                            type="file"
                            accept="application/pdf"
                            :data-vv-name="item.requisito"
                            v-validate="'mimes:application/pdf'"
                            :name="item.requisito"
                            @change="onFileChange($event, item)"
                            ref="inputFile"
                            class="form-control inputfile inputfile-6"
                          />
                          <FormError
                            :attribute_name="item.requisito"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div>
                    </template>
                    <div
                      class="col-sm-12 col-md-12 col-lg-12"
                      v-if="form.tipo_tramite_id && form.tipo_requisito_id"
                    >
                      <hr />
                    </div>
                  </div>
                </div>
                <!-- <pre>{{form}}</pre> -->
                <div v-if="!bloquearFormulario">
                  <div class="row">
                    <div
                      class="col 
                    "
                    >
                      <label for="fecha_ingreso">Fecha de ingreso</label>

                      <div class="form-group">
                        <date-picker
                          v-model="form.fecha_ingreso"
                          :input-props="{
                            class: 'form-control',
                            placeholder: 'seleccione la fecha de ingreso'
                          }"
                          @change="isActive = false"
                          :disabled-date="notAfterToday"
                          format="DD-MM-YYYY"
                          placeholder="seleccionar fecha"
                          data-vv-name="fecha de ingreso"
                          v-validate="'required|date_format:dd/MM/yyyy'"
                          show-caps
                        ></date-picker>
                        <FormError
                          :attribute_name="'fecha de ingreso'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                    <!-- <div class="col"
                    v-show="tramite_notificacion_electronica"
                    >
                          <label
                            >Notificación a casillero electrónico.</label
                          ><br />
  
                          <label  class="pure-material-switch">
                            <input
                            disabled checked
                              type="checkbox"
                            
                            />
                            <span
                             
                              >Sí</span
                            >
                        
                          </label>
                        </div> -->
                    <div class="col pr-8" v-if="form.notificacion_electronica">
                      <label class="pure-material-switch">
                        <strong>Buscar Nit/Nombre de la empresa:</strong>
                      </label>
                      <autocomplete
                        :search="buscar_empresa_nombre"
                        placeholder="Buscar nombre de empresa"
                        aria-label=" Buscar nombre de empresa"
                        @submit="seleccionarNombreEmpresa"
                        :get-result-value="getResultValueEmpresa"
                      >
                      </autocomplete>
                    </div>
                    <div class="col"></div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 col-md-10 col-lg-10">
                      <div class="form-group">
                        <label for="nombre_expediente"
                          >Nombre del expediente</label
                        >
                        <input
                          v-model="form.nombre_expediente"
                          type="text"
                          class="form-control"
                          id="nombre_expediente"
                          placeholder="escribir el nombre del expediente"
                          name="nombre del expediente"
                          v-validate="'required|min:1|max:100'"
                          :class="{
                            input: true,
                            'has-errors': errors.has('nombre del expediente')
                          }"
                          @input="
                            form.nombre_expediente = $event.target.value.toUpperCase();
                            isActive = false;
                          "
                        />
                        <FormError
                          :attribute_name="'nombre del expediente'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-2 col-lg-2">
                      <div class="form-group text-center">
                        <label for="folio_inicial">Cantidad de folios</label>
                        <h3>
                          <strong> {{ total_folios }} </strong>
                        </h3>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-10 col-lg-10">
                      <div class="form-group">
                        <label for="folio_correcion"
                          >Si la cantidad de folios es incorrecta, ingrese el
                          número correcto:</label
                        >
                        <input
                          v-model="form.folio_correcion"
                          type="number"
                          class="form-control"
                          id="folio_correcion"
                          min="0"
                          placeholder="escribir la cantidad de folios correcta"
                          name="cantidad de folios correcta"
                          :class="{
                            input: true,
                            'has-errors': errors.has(
                              'cantidad de folios correcta'
                            )
                          }"
                        />
                        <FormError
                          :attribute_name="'cantidad de folios correcta'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 col-md-3 col-lg-3">
                      <div class="form-group">
                        <label for="nit">NIT</label>
                        <autocomplete
                          :search="buscar_nit"
                          placeholder="Buscar número de NIT"
                          aria-label="Buscar número de NIT"
                          @submit="seleccionarNIT"
                          :get-result-value="getResultValue"
                        >
                        </autocomplete>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-10 col-lg-10" v-if="ver_tags">
                      <div class="form-group">
                        <label for="razon_social">Nombre de Empresa: </label>
                        <input
                          :disabled="bloquearCeldasPredeterminadonits"
                          v-model="form.razon_social"
                          type="text"
                          class="form-control"
                          placeholder="escribir el nombre de la razon social"
                          name="nombre de la razon social"
                          v-validate="'required|min:3|max:75'"
                          :class="{
                            input: true,
                            'has-errors': errors.has(
                              'nombre de la razon social'
                            )
                          }"
                          @input="
                            form.razon_social = $event.target.value.toUpperCase();
                            isActive = false;
                          "
                        />
                        <FormError
                          :attribute_name="'nombre de la razon social'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 col-md-4 col-lg-4" v-if="ver_tags">
                      <div class="form-group">
                        <label for="tipo_razon_social">Tipo de Empresa</label>
                        <multiselect
                          v-model="form.tipo_razon_social"
                          :options="tipos_razones"
                          @input="limpiarRepresentantes"
                          @select="isActive = false"
                          placeholder="Seleccione uno por favor"
                          :searchable="false"
                          :allow-empty="true"
                          :preselect-first="false"
                          data-vv-name="tipo de razon social"
                          v-validate="'required'"
                          :show-labels="false"
                          :show-no-result="true"
                          label="nombre"
                          track-by="id"
                          :disabled="bloquearCeldasPredeterminadonits"
                        >
                          <span slot="noResult"
                            >No se encontró información</span
                          >
                        </multiselect>
                        <FormError
                          :attribute_name="'tipo de razon social'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-3 col-lg-3" v-if="ver_tags">
                      <div class="form-group">
                        <label for="patente"
                          >Número de registro de patente de empresa</label
                        >
                        <input
                          :disabled="bloquearCeldasPredeterminadonits"
                          v-model="form.patente"
                          type="text"
                          class="form-control"
                          placeholder="escribir el número de la patente"
                          name="número de la patente"
                          v-validate="'required|min:3|max:18'"
                          :class="{
                            input: true,
                            'has-errors': errors.has('número de la patente')
                          }"
                          @input="
                            form.patente = $event.target.value.toUpperCase();
                            isActive = false;
                          "
                        />
                        <FormError
                          :attribute_name="'número de la patente'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <!-- Direccion del propiertario -->
                    <div class="col-sm-12 col-md-4" v-if="ver_tags">
                      <div class="carta">
                        <div class="carta_content">
                          <div>
                            <div style="text-align: center">
                              <div>
                                <h4>
                                  <span>
                                    <strong>Dirección del Propietario</strong>
                                  </span>
                                </h4>
                              </div>
                            </div>

                            <div class="form-group">
                              <label for="nombre">Departamento:</label>

                              <multiselect
                                :disabled="bloquearCeldasPredeterminadonits"
                                v-model="form.departamento_propietario"
                                :options="departamentos"
                                placeholder="Seleccione uno por favor"
                                :searchable="true"
                                :allow-empty="false"
                                :preselect-first="false"
                                data-vv-name="tipo de documento"
                                v-validate="'required'"
                                data-vv-scope="representante"
                                :show-labels="false"
                                :show-no-result="true"
                                label="nombre"
                                track-by="id"
                                @close="
                                  setDep(form.departamento_propietario, 1)
                                "
                              >
                                <span slot="noResult"
                                  >No se encontró información</span
                                >
                              </multiselect>

                              <br />
                              <label for="nombre">Municipio:</label>
                              <multiselect
                                :disabled="bloquearCeldasPredeterminadonits"
                                v-model="form.mun_propietario"
                                :options="municipiosTemp1"
                                placeholder="Seleccione uno por favor"
                                :searchable="true"
                                :allow-empty="false"
                                :preselect-first="false"
                                data-vv-name="tipo de documento"
                                v-validate="'required'"
                                data-vv-scope="representante"
                                :show-labels="false"
                                :show-no-result="true"
                                label="nombre"
                                track-by="id"
                                @close="setMun(form.mun_propietario)"
                              >
                                <span slot="noResult"
                                  >No se encontró información</span
                                >
                              </multiselect>
                              <br />
                              <label for="nombre"
                                >Dirección del Propietario:</label
                              >

                              <textarea
                                :disabled="bloquearCeldasPredeterminadonits"
                                v-model="form.direccion_propietario"
                                type="text"
                                class="form-control"
                                placeholder="escribir la ubicación"
                                name="ubicación"
                                v-validate="'required|min:3|max:200'"
                                data-vv-scope="form"
                                :class="{
                                  input: true,
                                  'has-errors': errors.has(
                                    'form.direccion_propietario'
                                  )
                                }"
                                @input="
                                  form.direccion_propietario = $event.target.value.toUpperCase()
                                "
                              />
                              <FormError
                                :attribute_name="'representante.ubicación'"
                                :errors_form="errors"
                              >
                              </FormError>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-sm-12 col-md-4" v-if="ver_tags">
                      <div class="carta">
                        <div class="carta_content">
                          <div
                            style="text-align: right; position: absolute"
                            v-if="!bloquearCeldasPredeterminadonits"
                          >
                            <h5>
                              <span
                                @click="limpiarDirecciones(1)"
                                style="
                                  background: #cd3432;
                                  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px
                                      0px inset,
                                    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
                                    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
                                    rgba(0, 0, 0, 0.06) 0px 2px 1px,
                                    rgba(0, 0, 0, 0.09) 0px 4px 2px,
                                    rgba(0, 0, 0, 0.09) 0px 8px 4px,
                                    rgba(0, 0, 0, 0.09) 0px 16px 8px,
                                    rgba(0, 0, 0, 0.09) 0px 32px 16px;
                                  color: white;
                                  padding: 4px;
                                  cursor: pointer;
                                  border-radius: 10px;
                                "
                                >Limpiar</span
                              >
                            </h5>
                          </div>

                          <div style="text-align: center">
                            <div>
                              <h4>
                                <span>
                                  <strong>Dirección Comercial</strong>
                                </span>
                              </h4>
                            </div>
                          </div>

                          <div class="form-group">
                            <label for="nombre">Departamento:</label>

                            <multiselect
                              :disabled="bloquearCeldasPredeterminadonits"
                              v-model="form.departamento_comercial"
                              :options="departamentos"
                              placeholder="Seleccione uno por favor"
                              :searchable="true"
                              :allow-empty="false"
                              :preselect-first="false"
                              data-vv-name="tipo de documento"
                              data-vv-scope="representante"
                              :show-labels="false"
                              :show-no-result="true"
                              label="nombre"
                              track-by="id"
                              @close="setDep(form.departamento_comercial, 3)"
                            >
                              <span slot="noResult"
                                >No se encontró información</span
                              >
                            </multiselect>

                            <br />
                            <label for="nombre">Municipio:</label>
                            <multiselect
                              :disabled="bloquearCeldasPredeterminadonits"
                              v-model="form.mun_comercial"
                              :options="municipiosTemp3"
                              placeholder="Seleccione uno por favor"
                              :searchable="true"
                              :allow-empty="false"
                              :preselect-first="false"
                              data-vv-name="tipo de documento"
                              data-vv-scope="representante"
                              :show-labels="false"
                              :show-no-result="true"
                              label="nombre"
                              track-by="id"
                              @close="setMun(form.mun_comercial)"
                            >
                              <span slot="noResult"
                                >No se encontró información</span
                              >
                            </multiselect>
                            <br />
                            <label for="observacion"
                              >Dirección comercial:
                            </label>
                            <textarea
                              v-if="
                                form.departamento_comercial != '' &&
                                  form.mun_comercial != ''
                              "
                              :disabled="bloquearCeldasPredeterminadonits"
                              v-model="form.direccion_comercial"
                              class="form-control"
                              id="direccion_comercial"
                              placeholder="escribir la direccion correspondiente"
                              name="direccion_comercial"
                              @input="
                                form.direccion_comercial = $event.target.value.toUpperCase()
                              "
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-4" v-if="ver_tags">
                      <div class="carta">
                        <div class="carta_content">
                          <div
                            style="text-align: right; position: absolute"
                            v-if="!bloquearCeldasPredeterminadonits"
                          >
                            <h5>
                              <span
                                @click="limpiarDirecciones(2)"
                                style="
                                  background: #cd3432;
                                  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px
                                      0px inset,
                                    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
                                    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
                                    rgba(0, 0, 0, 0.06) 0px 2px 1px,
                                    rgba(0, 0, 0, 0.09) 0px 4px 2px,
                                    rgba(0, 0, 0, 0.09) 0px 8px 4px,
                                    rgba(0, 0, 0, 0.09) 0px 16px 8px,
                                    rgba(0, 0, 0, 0.09) 0px 32px 16px;
                                  color: white;
                                  padding: 4px;
                                  cursor: pointer;
                                  border-radius: 10px;
                                "
                                >Limpiar</span
                              >
                            </h5>
                          </div>
                          <div style="text-align: center">
                            <div>
                              <h4>
                                <span>
                                  <strong>Dirección a Notificar</strong>
                                </span>
                              </h4>
                            </div>
                          </div>

                          <div class="form-group">
                            <label for="nombre">Departamento:</label>

                            <multiselect
                              :disabled="bloquearCeldasPredeterminadonits"
                              historyButton
                              v-model="form.departamento_notificacion"
                              :options="departamentos"
                              placeholder="Seleccione uno por favor"
                              :searchable="true"
                              :allow-empty="false"
                              :preselect-first="false"
                              data-vv-name="tipo de documento"
                              data-vv-scope="representante"
                              :show-labels="false"
                              :show-no-result="true"
                              label="nombre"
                              track-by="id"
                              @close="setDep(form.departamento_notificacion, 2)"
                            >
                              <span slot="noResult"
                                >No se encontró información</span
                              >
                            </multiselect>

                            <br />
                            <label for="nombre">Municipio:</label>
                            <multiselect
                              :disabled="bloquearCeldasPredeterminadonits"
                              historyButton
                              v-model="form.mun_notificacion"
                              :options="municipiosTemp2"
                              placeholder="Seleccione uno por favor"
                              :searchable="true"
                              :allow-empty="false"
                              :preselect-first="false"
                              data-vv-name="tipo de documento"
                              data-vv-scope="representante"
                              :show-labels="false"
                              :show-no-result="true"
                              label="nombre"
                              track-by="id"
                              @close="setMun(form.mun_notificacion)"
                            >
                              <span slot="noResult"
                                >No se encontró información</span
                              >
                            </multiselect>
                            <br />
                            <label for="observacion"
                              >Dirección a notificar:
                            </label>

                            <textarea
                              :disabled="bloquearCeldasPredeterminadonits"
                              v-if="
                                form.departamento_notificacion != '' &&
                                  form.mun_notificacion != ''
                              "
                              v-model="form.direccion_notificacion"
                              class="form-control"
                              id="observacion"
                              placeholder="escribir la direccion correspondiente"
                              name="direccion"
                              @input="
                                form.direccion_notificacion = $event.target.value.toUpperCase()
                              "
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <pre>{{representante}}</pre> -->
                  <div class="row" v-if="form.tipo_razon_social ? 1 : null">
                    <div class="col-sm-12 col-md-12 col-lg-12">
                      <hr />
                      <h1>{{ form.tipo_razon_social.nombre }}</h1>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-12">
                      <div
                        class="row"
                        v-if="
                          form.tipo_razon_social
                            ? form.tipo_razon_social.id == 'PERSONA JURIDICA'
                              ? 1
                              : null
                            : null
                        "
                      >
                        <!-- <div class="col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                          <label for="representante.representacion"
                            >Tipo de representación: </label
                          >
                          <span v-if="tipo_rep === true">{{ representante.representacion.nombre }}</span>
                          <multiselect
                            v-if="tipo_rep === false"
                            v-model="representante.representacion"
                            :options="representaciones"
                            placeholder="Seleccione uno por favor"
                            :searchable="true"
                            :allow-empty="true"
                            :preselect-first="false"
                            data-vv-name="tipo de representación"
                            v-validate="'required'"
                            data-vv-scope="representante"
                            :show-labels="false"
                            :show-no-result="true"
                            label="nombre"
                            track-by="id"
                          >
                            <span slot="noResult"
                              >No se encontró información</span
                            >
                          </multiselect>
                          <FormError
                            :attribute_name="'representante.tipo de representación'"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div> -->
                      </div>
                      <div class="row">
                        <div class="col-sm-12 col-md-3 col-lg-3">
                          <div class="form-group">
                            <label for="representante.representacion"
                              >Tipo de representación:
                            </label>
                            <span v-if="form.tipo_rep === true">{{
                              representante.representacion.nombre
                            }}</span>
                            <multiselect
                              @input="setRepresentante()"
                              v-if="form.tipo_rep === false"
                              v-model="representante.representacion"
                              :options="representaciones"
                              placeholder="Seleccione uno por favor"
                              :searchable="true"
                              :allow-empty="true"
                              :preselect-first="false"
                              data-vv-name="tipo de representación"
                              v-validate="'required'"
                              data-vv-scope="representante"
                              :show-labels="false"
                              :show-no-result="true"
                              label="nombre"
                              track-by="id"
                            >
                              <span slot="noResult"
                                >No se encontró información</span
                              >
                            </multiselect>
                            <!-- <pre>{{representante}}</pre> -->
                            <FormError
                              :attribute_name="
                                'representante.tipo de representación'
                              "
                              :errors_form="errors"
                            >
                            </FormError>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-12 col-md-3 col-lg-3">
                          <div class="form-group">
                            <label for="nit">DPI O PASAPORTE</label>
                            <autocomplete
                              :search="buscar_nit_representante"
                              aria-label="Buscar número de CUI"
                              @submit="seleccionarCUI"
                              :get-result-value="getResultValueR"
                            >
                            </autocomplete>
                          </div>
                        </div>
                        <!-- <pre>{{ bloquearCeldasPredeterminadocuis }}</pre> -->
                        <div
                          class="col-sm-12 col-md-10 col-lg-10"
                          v-if="ver_tags_representante"
                        >
                          <div class="form-group">
                            <label for="razon_social"
                              >Nombre de la Persona:
                            </label>
                            <input
                              :disabled="bloquearCeldasPredeterminadocuis"
                              v-model="representante.razon_social"
                              type="text"
                              class="form-control"
                              placeholder="escribir el nombre"
                              name="nombre"
                              v-validate="'required|min:3|max:75'"
                              data-vv-scope="representante"
                              :class="{
                                input: true,
                                'has-errors': errors.has(
                                  'representante.razon_social'
                                )
                              }"
                              @input="
                                representante.razon_social = $event.target.value.toUpperCase()
                              "
                            />
                            <FormError
                              :attribute_name="'representante.razon_social'"
                              :errors_form="errors"
                            >
                            </FormError>
                          </div>
                        </div>
                      </div>
                      <div class="row" v-if="ver_tags_representante">
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="form-group">
                            <label for="tipo_razon_social"
                              >Número de teléfono</label
                            >
                            <vue-phone-number-input
                              :disabled="bloquearCeldasPredeterminadocuis"
                              v-model="numero_representante"
                              default-country-code="GT"
                              size="lg"
                              :translations="translations"
                              show-code-on-list
                              @update="validar_numero_representante($event)"
                              v-validate="'required'"
                              data-vv-name="número de teléfono"
                              data-vv-scope="representante"
                              required
                            />
                            <FormError
                              :attribute_name="
                                'representante.número de teléfono'
                              "
                              :errors_form="errors"
                            ></FormError>
                            <div
                              style="color: #cc2900; font-size: 12px"
                              v-if="numberOk"
                            >
                              Verificar extensión seleccionada
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row" v-if="ver_tags_representante">
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="form-group">
                            <label for="email">Correo electrónico</label>
                            <input
                              :disabled="bloquearCeldasPredeterminadocuis"
                              v-model="representante.email"
                              type="text"
                              class="form-control"
                              placeholder="escribir el correo electrónico"
                              name="correo electrónico"
                              v-validate="'required|min:3|max:50|email'"
                              data-vv-scope="representante"
                              :class="{
                                input: true,
                                'has-errors': errors.has(
                                  'representante.correo electrónico'
                                )
                              }"
                              @input="
                                representante.email = $event.target.value.toLowerCase()
                              "
                            />
                            <FormError
                              :attribute_name="
                                'representante.correo electrónico'
                              "
                              :errors_form="errors"
                            >
                            </FormError>
                            <br />
                            <label for="email"
                              >Correo electrónico Alterno</label
                            >
                            <input
                              :disabled="bloquearCeldasPredeterminadocuis"
                              v-model="representante.emailAlterno"
                              type="text"
                              class="form-control"
                              placeholder="escribir el correo electrónico"
                              name="correo electrónico alterno"
                              v-validate="'min:3|max:50|email'"
                              data-vv-scope="representante"
                              :class="{
                                input: true,
                                'has-errors': errors.has(
                                  'representante.correo electrónico alterno'
                                )
                              }"
                              @input="
                                representante.emailAlterno = $event.target.value.toLowerCase()
                              "
                            />
                            <FormError
                              :attribute_name="
                                'representante.correo electrónico alterno'
                              "
                              :errors_form="errors"
                            >
                            </FormError>
                          </div>
                        </div>
                        <!-- <pre>{{representante}}</pre> -->
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label
                            >¿Acepta ser notificado via correo
                            electronico?</label
                          ><br />

                          <label class="pure-material-switch">
                            <input
                              type="checkbox"
                              v-model="representante.notificacion_correo"
                            />
                            <span v-if="representante.notificacion_correo"
                              >Sí</span
                            >
                            <span v-else>No</span>
                          </label>
                        </div>
                      </div>

                      <!-- <div class="row" v-if="ver_tags_representante">
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                          <label for="municipio_id"
                            >Continente - País, Departamento, Municipio</label
                          >
                          <multiselect
                            v-model="representante.municipio_id"
                            :options="municipios"
                            placeholder="Seleccione uno por favor"
                            :searchable="true"
                            :allow-empty="true"
                            :preselect-first="false"
                            data-vv-name="municipio"
                            data-vv-scope="representante"
                            v-validate="'required'"
                            :show-labels="false"
                            :show-no-result="true"
                            label="nombre"
                            track-by="id"
                          >
                            <span slot="noResult"
                              >No se encontró información</span
                            >
                          </multiselect>
                          <FormError
                            :attribute_name="'representante.municipio'"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-6 col-lg-6">
                        <div class="form-group">
                          <label for="nombre">Dirección del Propietario</label>
                          <input
                            v-model="representante.nombre"
                            type="text"
                            class="form-control"
                            placeholder="escribir la ubicación"
                            name="ubicación"
                            v-validate="'required|min:3|max:200'"
                            data-vv-scope="representante"
                            :class="{
                              input: true,
                              'has-errors': errors.has(
                                'representante.ubicación'
                              ),
                            }"
                            @input="
                              representante.nombre =
                                $event.target.value.toUpperCase()
                            "
                          />
                          <FormError
                            :attribute_name="'representante.ubicación'"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div>
                    </div> -->
                      <div
                        class="box-footer"
                        v-if="
                          form.tipo_razon_social
                            ? form.tipo_razon_social.id != 'PERSONA INDIVIDUAL'
                              ? 1
                              : null
                            : null
                        "
                      >
                        <button
                          type="button"
                          class="btn btn-danger btn-sm pull-left"
                          @click="clearDataR"
                        >
                          <i class="fa fa-ban"></i> Cancelar
                        </button>
                        <button
                          v-if="esconder_representante && representante.dpi"
                          type="button"
                          class="btn btn-success btn-sm pull-right"
                          @click="agregarRepresentante('representante')"
                        >
                          <i class="fa fa-save"></i> Agregar representante
                        </button>
                      </div>
                    </div>
                    <!-- <pre>{{ representante }}</pre> -->
                    <div
                      class="
                        col-sm-12 col-md-12 col-lg-12
                        table-responsive
                        no-padding
                      "
                      v-if="
                        ver_tags_representante && form.tipo_razon_social
                          ? form.tipo_razon_social.id != 'PERSONA INDIVIDUAL'
                            ? 1
                            : null
                          : null
                      "
                    >
                      <!-- <pre>{{ form.representantes }}</pre> -->
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th class="text-center">DPI</th>
                            <th class="text-center">REPRESENTANTE</th>
                            <th class="text-center">REPRESENTACIÓN</th>
                            <th class="text-center">OPCIÓN</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in form.representantes"
                            v-bind:key="index"
                          >
                            <td class="text-center">{{ item.dpi }}</td>
                            <td class="text-center">{{ item.razon_social }}</td>
                            <td class="text-center">
                              {{ item.representacion.nombre }}
                            </td>
                            <td class="text-center">
                              <a
                                @click="quitarRepresentante(item)"
                                class="btn btn-info btn-small"
                                >Quitar al representante de la lista</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-12">
                      <hr />
                    </div>
                  </div>
                  <!-- <pre>{{representante}}</pre> -->
                  <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-12">
                      <div class="form-group">
                        <label for="observacion">Observación</label>
                        <textarea
                          v-model="form.observacion"
                          class="form-control"
                          id="observacion"
                          placeholder="escribir la observación del expediente"
                          name="observación"
                          v-validate="'max:250'"
                          :class="{
                            input: true,
                            'has-errors': errors.has('validar.observación')
                          }"
                          @input="
                            form.observacion = $event.target.value.toUpperCase()
                          "
                        ></textarea>
                        <FormError
                          :attribute_name="'validar.observación'"
                          :errors_form="errors"
                        ></FormError>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <div class="box-footer">
                <button
                  type="button"
                  class="btn btn-danger btn-lg pull-left"
                  @click="clearData"
                >
                  <i class="fa fa-ban"></i> Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-lg pull-right"
                  @click="createOrEdit"
                  :disabled="isActive"
                >
                  <i class="fa fa-save"></i> Guardar información
                </button>
              </div>
            </div>

            <!-- <pre>{{ form }}</pre> -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script src="./crear_expediente.js" />
<style scoped>
@import "../../../dist/css/desing_profile/diseno.css";

.carta {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
}

.carta_content {
  height: auto;
  justify-content: center;
  padding: 20px;
}
</style>
