<template>
  <!-- Modal para mostrar los datos para editar -->
  <div
    :class="abrirModalEditar"
    data-backdrop="static"
    v-bind:style="styleObjectEditar"
    v-loading="loading"
  >
    <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            {{ titleEditar }}
            <button
              type="button"
              @click="cancel_showEditar"
              class="btn btn-danger btn-xs pull-right"
            >
              <i class="fa fa-close"></i>
            </button>
          </h2>
        </div>

        <div
          class="modal-body text-center"
          style="overflow-y: auto; height: 100%"
          v-if="modalEditar"
        >
          <div class="row">
            <div class="col-sm-12 col-md-3 col-lg-3">
              <div class="form-group">
                <label for="fecha_ingreso">Fecha de ingreso</label>
                <date-picker
                  v-model="form.fecha_ingreso"
                  :input-props="{
                    class: 'form-control',
                    placeholder: 'seleccione la fecha de ingreso',
                  }"
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
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-group">
                <label for="nombre_expediente">Nombre del expediente</label>
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
                    'has-errors': errors.has('nombre del expediente'),
                  }"
                  @input="
                    form.nombre_expediente = $event.target.value.toUpperCase()
                  "
                />
                <FormError
                  :attribute_name="'nombre del expediente'"
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
                <input
                  v-model="form.nit"
                  type="text"
                  class="form-control"
                  id="nit"
                  placeholder="escribir el número de nit"
                  name="número de nit"
                  v-validate="
                    'required|min:5|max:15|regex:^[0-9]+(-?[0-9kK])?$'
                  "
                  :class="{
                    input: true,
                    'has-errors': errors.has('número de nit'),
                  }"
                  @input="form.nit = $event.target.value.toUpperCase()"
                />
                <FormError
                  :attribute_name="'número de nit'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div class="col-sm-12 col-md-9 col-lg-9">
              <div class="form-group">
                <label for="razon_social">Razon Social</label>
                <input
                  v-model="form.razon_social"
                  type="text"
                  class="form-control"
                  id="razon_social"
                  placeholder="escribir el nombre de la razon social"
                  name="nombre de la razon social"
                  v-validate="'required|min:1|max:100'"
                  :class="{
                    input: true,
                    'has-errors': errors.has('nombre de la razon social'),
                  }"
                  @input="
                    form.razon_social = $event.target.value.toUpperCase()
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
                    'has-errors': errors.has('observación'),
                  }"
                  @input="
                    form.observacion = $event.target.value.toUpperCase()
                  "
                ></textarea>
                <FormError
                  :attribute_name="'observación'"
                  :errors_form="errors"
                ></FormError>
              </div>
            </div>
          </div>
          <div
            class="row"
            v-if="form.tipo_razon_social != 'PERSONA INDIVIDUAL'"
          >
            <div class="col-md-12">
              <h3>{{ actuacion_selected.tipo_razon_social }}</h3>
            </div>
            <div
              class="col-sm-12 col-md-12 col-lg-12"
              v-if="'PERSONA JURIDICA'"
            >
              <div class="form-group">
                <label for="representante.representacion"
                  >Tipo de representación</label
                >
                <multiselect
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
                  <span slot="noResult">No se encontró información</span>
                </multiselect>
                <FormError
                  :attribute_name="'representante.tipo de representación'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div class="col-sm-12 col-md-3 col-lg-3">
              <div class="form-group">
                <label for="nit">CUI</label>
                <autocomplete
                  :search="buscar_nit_representante"
                  placeholder="Buscar número de CUI"
                  aria-label="Buscar número de CUI"
                  @submit="seleccionarNITR"
                  :get-result-value="getResultValueR"
                >
                </autocomplete>
              </div>
            </div>
            <div
              v-if="ver_tags_representante"
              class="col-sm-12 col-md-9 col-lg-9"
            >
              <div class="form-group">
                <label for="razon_social">Nombre de la Persona</label>
                <input
                  v-model="representante.razon_social"
                  type="text"
                  class="form-control"
                  id="razon_social"
                  placeholder="escribir el nombre de la persona"
                  name="nombre de la persona"
                  v-validate="'required|min:1|max:100'"
                  data-vv-scope="representante"
                  :class="{
                    input: true,
                    'has-errors': errors.has(
                      'representante.nombre de la persona'
                    ),
                  }"
                  @input="
                    representante.razon_social = $event.target.value.toUpperCase()
                  "
                />
                <FormError
                  :attribute_name="'representante.nombre de la persona'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div
              v-if="ver_tags_representante"
              class="col-sm-12 col-md-4 col-lg-4"
            >
              <div class="form-group">
                <label for="tipo_razon_social">Número de teléfono</label>
                <vue-phone-number-input
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
                  :attribute_name="'representante.número de teléfono'"
                  :errors_form="errors"
                ></FormError>
              </div>
            </div>
            <div
              v-if="ver_tags_representante"
              class="col-sm-12 col-md-4 col-lg-4"
            >
              <div class="form-group">
                <label for="email">Correo electrónico</label>
                <input
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
                    ),
                  }"
                  @input="
                    representante.email = $event.target.value.toLowerCase()
                  "
                />
                <FormError
                  :attribute_name="'representante.correo electrónico'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div
              v-if="ver_tags_representante"
              class="col-sm-12 col-md-12 col-lg-12"
            >
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
                  <span slot="noResult">No se encontró información</span>
                </multiselect>
                <FormError
                  :attribute_name="'representante.municipio'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div
              v-if="ver_tags_representante"
              class="col-sm-12 col-md-12 col-lg-12"
            >
              <div class="form-group">
                <label for="nombre">Ubicación</label>
                <input
                  v-model="representante.nombre"
                  type="text"
                  class="form-control"
                  placeholder="escribir la ubicación"
                  name="ubicación"
                  v-validate="'required|min:3|max:50'"
                  data-vv-scope="representante"
                  :class="{
                    input: true,
                    'has-errors': errors.has('representante.ubicación'),
                  }"
                  @input="
                    representante.nombre = $event.target.value.toUpperCase()
                  "
                />
                <FormError
                  :attribute_name="'representante.ubicación'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>

            <div class="col-sm-12 col-md-12 col-lg-12">
              <button
                type="button"
                class="btn btn-danger btn-sm pull-left"
                @click="clearDataR"
              >
                <i class="fa fa-ban"></i> Cancelar
              </button>
              <button
                v-if="esconder_representante && representante.nit"
                type="button"
                class="btn btn-success btn-sm pull-right"
                @click="agregarRepresentante('representante')"
              >
                <i class="fa fa-save"></i> Agregar representante
              </button>
            </div>
          </div>

          <div
            class="row"
            v-if="
              ver_tags_representante &&
              form.tipo_razon_social == 'PERSONA INDIVIDUAL'
            "
          >
            <div class="col-md-12">
              <h3>{{ actuacion_selected.tipo_razon_social }}</h3>
            </div>
            <div class="col-sm-12 col-md-3 col-lg-3">
              <div class="form-group">
                <label for="nit">CUI</label>
                <input
                  v-model="representante.nit"
                  type="text"
                  class="form-control"
                  id="nit"
                  placeholder="escribir el número de DPI"
                  name="número de DPI"
                  v-validate="'required|digits:13'"
                  :class="{
                    input: true,
                    'has-errors': errors.has('número de DPI'),
                  }"
                  @input="
                    representante.nit = $event.target.value.toUpperCase()
                  "
                />
                <FormError
                  :attribute_name="'número de DPI'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div class="col-sm-12 col-md-9 col-lg-9">
              <div class="form-group">
                <label for="razon_social">Nombre de la Persona</label>
                <input
                  v-model="representante.razon_social"
                  type="text"
                  class="form-control"
                  id="razon_social"
                  placeholder="escribir el nombre de la persona"
                  name="nombre de la persona"
                  v-validate="'required|min:1|max:100'"
                  :class="{
                    input: true,
                    'has-errors': errors.has('nombre de la persona'),
                  }"
                  @input="
                    representante.razon_social = $event.target.value.toUpperCase()
                  "
                />
                <FormError
                  :attribute_name="'nombre de la persona'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
              <div class="form-group">
                <label for="tipo_razon_social">Número de teléfono</label>
                <vue-phone-number-input
                  v-model="numero_representante"
                  default-country-code="GT"
                  size="lg"
                  :translations="translations"
                  show-code-on-list
                  @update="validar_numero_representante($event)"
                  v-validate="'required'"
                  data-vv-name="número de teléfono"
                  required
                />
                <FormError
                  :attribute_name="'número de teléfono'"
                  :errors_form="errors"
                ></FormError>
              </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
              <div class="form-group">
                <label for="email">Correo electrónico</label>
                <input
                  v-model="representante.email"
                  type="text"
                  class="form-control"
                  placeholder="escribir el correo electrónico"
                  name="correo electrónico"
                  v-validate="'required|min:3|max:50|email'"
                  :class="{
                    input: true,
                    'has-errors': errors.has('correo electrónico'),
                  }"
                  @input="
                    representante.email = $event.target.value.toLowerCase()
                  "
                />
                <FormError
                  :attribute_name="'correo electrónico'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
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
                  v-validate="'required'"
                  :show-labels="false"
                  :show-no-result="true"
                  label="nombre"
                  track-by="id"
                >
                  <span slot="noResult">No se encontró información</span>
                </multiselect>
                <FormError
                  :attribute_name="'municipio'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="form-group">
                <label for="nombre">Ubicación</label>
                <input
                  v-model="representante.nombre"
                  type="text"
                  class="form-control"
                  placeholder="escribir la ubicación"
                  name="ubicación"
                  v-validate="'required|min:3|max:50'"
                  :class="{
                    input: true,
                    'has-errors': errors.has('ubicación'),
                  }"
                  @input="
                    representante.nombre = $event.target.value.toUpperCase()
                  "
                />
                <FormError
                  :attribute_name="'ubicación'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>
          </div>
          <hr />
          <div
            class="row"
            v-if="
              actuacion_selected.tipo_razon_social != 'PERSONA INDIVIDUAL'
            "
          >
            <template v-for="(item, index) in form.representantes">
              <div class="col-md-4" v-bind:key="index">
                <div class="box box-widget">
                  <div class="widget-user-header bg-blue">
                    <br />
                    <h3 class="widget-user-username">
                      {{ item.razon_social }}
                    </h3>
                    <h5 class="widget-user-desc">{{ item.nit }}</h5>
                    <h5 class="widget-user-desc">
                      {{ item.representacion.nombre }}
                    </h5>
                    <br />
                  </div>
                  <div class="box-footer">
                    <a :href="item.url">{{ item.numero }}</a>
                    <hr />
                    <a :href="'mailto:' + item.email">{{ item.email }}</a>
                    <hr />
                    <a>{{ item.completo }}</a>
                    <a
                      class="btn btn-block btn-danger btn-small text-center"
                      @click="quitarRepresentante(item)"
                      >Eliminar</a
                    >
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="modal-footer">
          <button
            v-if="ver_tags_representante && esconder_representante"
            type="button"
            class="btn btn-warning btn-block btn-lg pull-right"
            @click="editarA"
          >
            <i class="fa fa-save"></i> Actualizar información
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
