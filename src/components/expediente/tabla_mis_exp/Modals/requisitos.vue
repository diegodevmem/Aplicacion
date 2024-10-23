<template>
  <!-- Modal para mostrar los requisistos faltantes -->
  <div
    :class="abrirModalRequisitos"
    data-backdrop="static"
    v-bind:style="styleObjectRequisitos"
    v-loading="loading"
  >
    <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            Requisitos faltantes para la actuación {{ barcode }}
            <button
              type="button"
              @click="cancel_showRequisitos"
              class="btn btn-danger btn-xs pull-right"
            >
              <i class="fa fa-close"></i>
            </button>
          </h2>
        </div>

        <div
          class="modal-body text-center"
          style="overflow-y: auto; height: 100%"
          v-if="modalRequisitos"
        >
          <h3 class="text-center">REQUISITOS PARA EL TRÁMITE <br /></h3>
          <br /><br />
          <pdf
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            style="display: inline-block; width: 10%"
          ></pdf>
            <!-- <div class="row"> -->
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
                    numero correcto:</label
                  >
                  <input
                    v-model="forms.folio_correcion"
                    type="text"
                    class="form-control"
                    id="folio_correcion"
                    placeholder="escribir la cantidad de folios correcta"
                    name="cantidad de folios correcta"
                    :class="{
                      input: true,
                      'has-errors': errors.has(
                        'cantidad de folios correcta'
                      ),
                    }"
                  />
                  <FormError
                    :attribute_name="'cantidad de folios correcta'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
              </div>
            <!-- </div> -->
          <template v-for="(item, index) in requisitos">
          <div
            v-bind:key="index"
            class="col-sm-12 col-md-12 col-lg-12"
          >
            <label for="">{{ item.nombre }}</label>
            <div class="input-group input-group-lg">
              <div class="input-group-btn">
                <button
                  type="button"
                  class="btn btn-primary btn-small btn-disabled"
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
            <br>
          </div>
        </template>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary btn-block btn-lg pull-right"
            @click="updateRequisitos"
          >
            <i class="fa fa-save"></i> Actualizar requisitos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
