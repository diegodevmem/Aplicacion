<template>
      <!-- Modal para mostrar los pasos a los que puede ir un expediente-->
    <div
      :class="abrirModal"
      data-backdrop="static"
      v-bind:style="styleObject"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 50%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ title
              }}<button
                type="button"
                @click="cancel_show"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 100%"
            v-if="modal"
          >
            <div class="row">
              <div
                class="col-sm-12 col-md-12 col-lg-12"
                v-if="botones_siguiente.length > 0"
              >
                <h3>Pasos a donde puede ir el trámite</h3>
                <template v-for="(item, index) in botones_siguiente">
                  <a
                    v-bind:key="item.nombre + index"
                    @click="seguimiento_siguiente(item)"
                    v-tooltip.botton="
                      'Al dar click, el proceso continuará en el paso número ' +
                      item.siguiente_paso
                    "
                    class="btn btn-primary btn-block btn-lg"
                    ><span>{{ item.nombre }}</span></a
                  >
                  <br /><br />
                </template>
              </div>
              <div
                class="col-sm-12 col-md-12 col-lg-12"
                v-if="botones_atras.length > 0"
              >
                <hr />
              </div>
              <div
                class="col-sm-12 col-md-12 col-lg-12"
                v-if="botones_atras.length > 0"
              >
                <h3>Pasos a donde puede regresar el trámite</h3>
                <template v-for="(item, index) in botones_atras">
                  <a
                    v-bind:key="item.nombre + index"
                    @click="seguimiento_atras(item)"
                    v-tooltip.botton="
                      'Al dar click, el proceso regresará al paso número ' +
                      item.atras_paso
                    "
                    class="btn btn-success btn-block btn-lg"
                    ><span>{{ item.nombre }}</span></a
                  >
                  <br /><br />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
