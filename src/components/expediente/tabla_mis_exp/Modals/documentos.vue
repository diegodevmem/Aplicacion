<template>
  <!-- Modal para mostrar los documentos de la actuacion seleccionada -->
  <div
    :class="abrirModalDocumento"
    data-backdrop="static"
    v-bind:style="styleObjectDocumento"
    v-loading="loading"
  >
    <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
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
          style="overflow-y: auto; height: 100%"
          v-if="modalDocumento"
        >
          <div class="row">
            <div class="col-md-12">
              <multiselect
                @input="verDocumento"
                v-model="documento_seleccionado"
                :options="documentos"
                placeholder="Seleccione uno por favor"
                :searchable="true"
                :allow-empty="true"
                :preselect-first="false"
                :show-labels="false"
                :show-no-result="true"
                label="nombre"
                track-by="id"
              >
                <span slot="noResult">No se encontró información</span>
              </multiselect>
            </div>
            <div class="col-md-12" v-if="show">
              <embed
                :src="src"
                type="application/pdf"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
