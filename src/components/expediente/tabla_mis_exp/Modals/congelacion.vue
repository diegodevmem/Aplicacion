<template>
  <!-- Modal para ingresar razon de congelacion de un expediente-->
  <div
    :class="abrirModalCongelar"
    data-backdrop="static"
    v-bind:style="styleObjectCongelar"
    v-loading="loading"
  >
    <div class="modal-dialog modal-lg" style="width: 80%">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            Razon de congelación para la actuación {{ barcode }}
            <button
              type="button"
              @click="cancel_showCongelar"
              class="btn btn-danger btn-xs pull-right"
            >
              <i class="fa fa-close"></i>
            </button>
          </h2>
        </div>

        <div
          class="modal-body text-center"
          style="overflow-y: auto; height: auto"
          v-if="modalCongelar"
        >
          <div class="row">
            <div class="content">

              <div class="col-md-12">
                <div class="form-group">
                  <label for="unidad_id">Tipo de Congelacion</label>
                  <multiselect
                    v-model="congelacion.tipo"
                    :options="tipoCongelaciones"
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

              <div v-if="congelacion.agregar===false" class="col-md-12">
                <div class="form-group">
                  <label for="unidad_id">Razon de Congelacion</label>
                  <multiselect
                    v-model="congelacion.razon"
                    :options="razonCongelaciones"
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

              <div class="col-md-4">
                <div class="form-group">
                  <enhanced-check
                    :label="congelacion.agregar ? 'LA RAZON DE CONGELACION NO EXISTE' : 'LA RAZON DE CONGELACION YA EXISTE'"
                    subClass="success"
                    :animate="true"
                    :inline="false"
                    v-model="congelacion.agregar"
                    v-validate="'required'"
                    data-vv-name="adjuntar documento"
                    data-vv-scope="paso"
                  ></enhanced-check>
                  <FormError :attribute_name="'paso.adjuntar documento'" :errors_form="errors">
                  </FormError>
                </div>
              </div>

              <div v-if="congelacion.agregar" class="col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="observacion">Razon de Congelacion</label>
                  <textarea
                    cols="30"
                    rows="10"
                    v-model="congelacion.razon"
                    type="textarea"
                    class="form-control"
                    id="observacion"
                    placeholder="escriba la razon"
                    name="observacion"
                    v-validate="'required|min:3|max:2500'"
                    :class="{
                      input: true,
                      'has-errors': errors.has('observacion'),
                    }"
                    @input="
                      form.observacion = $event.target.value.toUpperCase()
                    "
                  />
                  <FormError
                    :attribute_name="'observacion'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
              </div>
              <div v-if="congelacion.agregar" class="col-sm-12 col-md-12 col-lg-12 text-red">
                <small
                  >La información que ingrese en este formulario es la que
                  aparecera en el seguimiento histórico de la actuación
                  {{ barcode }}.
                </small>
              </div>
              <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="box-footer">
                    <button
                      type="button"
                      class="btn btn-danger btn-block btn-large pull-left"
                      @click="cleanCongelacion()"
                    >
                      <i class="fa fa-ban"></i> Cancelar
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary btn-block btn-large pull-right"
                      @click="guardarCongelacion()"
                    >
                      <i class="fa fa-save"></i> Guardar
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
