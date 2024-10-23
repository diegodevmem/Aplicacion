<template>
  <div class="content-wrapper">
    <v-app>
      <!-- EMPRESA -->
      <div v-if="!loading_info_expediente">
        <v-container>
          <div class="row d-flex justify-center">
            <div>
              <h3>
                <strong>NÚMERO DE SOLICITUD</strong>
              </h3>
            </div>
          </div>

          <div   class="row d-flex justify-center">
            <div>
              <h4>
                <strong>{{ this.formExterno.numero_solicitud }}</strong>
              </h4>
            </div>
          </div>
          <div v-if="formExterno.tipo_tramite">
            <div class="mt-4 row d-flex justify-center">
            <div>
              <h3>
                <strong>Tipo Trámite</strong>
              </h3>
            </div>
          </div>

          <div class="row d-flex justify-center">
            <div>
              <h4>
                <strong>{{ formExterno.tipo_tramite.nombre }}</strong>
              </h4>
            </div>
          </div>
          </div>


          <div class="row">
            <div class="col-md-12">
              <v-alert flat border="top" color="#ECEFF1">
                <h3><strong>EMPRESA</strong></h3>
                <br />
                <div class="row">
                  <div class="col-md-4">
                    <span
                      ><strong>NOMBRE: </strong
                      >{{ empresaExterna.razon_social }}</span
                    >
                  </div>
                  <div class="col-md-4">
                    <span><strong>NIT: </strong>{{ empresaExterna.nit }}</span>
                  </div>
                  <div class="col-md-4">
                    <span
                      ><strong>PATENTE: </strong
                      >{{ empresaExterna.patente }}</span
                    >
                  </div>
                </div>
              </v-alert>
            </div>
          </div>
          <v-data-table
            :headers="columnas_representantes"
            :items="representantesExternos"
            :items-per-page="-1"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title
                  ><strong>REPRESENTANTES</strong></v-toolbar-title
                >
              </v-toolbar>
            </template>
          </v-data-table>

          <v-form ref="form">
            <div class="row" v-if="numero_expediente_exist">
              <div class="text-center  m-0 p-0">
                <h2>
                  <strong
                    >NÚMERO DE EXPEDIENTE: <br />
                    {{ numero_expediente }}</strong
                  >
                </h2>
              </div>
            </div>
            <br />
            <div
              class="row"
              v-if="existe_expediente != null && existe_expediente"
            >
              <div class="col-md-3 m-0 p-0">
                <h3><strong>NÚMERO DEL EXPEDIENTE: </strong></h3>
              </div>
              <div class="col-md-9 m-0 p-0 d-flex justify-start">
                <h3>{{ formExterno.numero_expediente }}</h3>
                <h3 style="color: red; padding-top: .1rem; margin-left: 1.5rem;">
                  Es necesario crear primero el expediente
                </h3>
              </div>
            </div>
            <br />
            <div class="row">
              <div class="col-md-3 m-0 p-0">
                <h3><strong>NOMBRE DEL EXPEDIENTE: </strong></h3>
              </div>
              <div
                v-if="IsExist && formExterno.nombre_expediente"
                class="col-md-9 m-0 p-0 d-flex justify-start"
              >
                <h3>{{ formExterno.nombre_expediente }}</h3>
              </div>
            </div>
            <br />

            <!-- <v-text-field
              v-if="!IsExist"
              :rules="[(v) => (!!v || !!input_required) || 'El nombre es obligatorio']"
              outlined
              label="Escriba el nombre del expediente"
              append-outer-icon="border_color"
              v-model="formExterno.nombre_expediente"
              :disabled="IsExist"
            ></v-text-field> -->
            <span v-if="input_required" class="text-danger"
              >Este campo es requerido</span
            >
            <v-text-field
              v-if="!IsExist"
              outlined
              label="Escriba el nombre del expediente"
              append-outer-icon="border_color"
              v-model="formExterno.nombre_expediente"
              :disabled="IsExist"
              :required="input_required"
              class="{}"
            ></v-text-field>

            <h3><strong>REQUISITOS</strong></h3>
            <v-container>
              <v-text-field
                class="mt-0 mb-5 p-1"
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar..."
                single-line
                hide-details
              ></v-text-field>

              <v-data-table
                :loading="loading"
                :search="search"
                :headers="titulosExterna"
                :items="requisitosSubidos"
                :items-per-page="5"
                class="elevation-1"
              >
                <v-progress-linear
                  v-show="loading"
                  slot="progress"
                  color="#142638"
                  indeterminate
                ></v-progress-linear>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    color="info"
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                </template>

                <template v-slot:[`item.revision`]="{ item }">
                  <!-- <div class="custom-radios">
                    <input
                      type="radio"
                      @click="denegar(item)"
                      :id="item.id + 'false'"
                      class="rojo"
                      :name="'req-' + item.id"
                    />
                    <label :for="item.id + 'false'">
                      <span>
                        <img
                          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                          alt="Checked Icon"
                        />
                      </span>
                    </label>
                  </div> -->
                  <v-radio-group v-model="item.aceptado" row>
                    <v-radio
                      label="Aprobar"
                      :value="true"
                      @click="aprobar(item)"
                      color="green"
                    ></v-radio>
                    <v-radio
                      label="Rechazar"
                      :value="false"
                      @click="denegar(item)"
                      color="red"
                    ></v-radio>
                  </v-radio-group>
                </template>
                <template v-slot:[`item.razon_rechazo`]="{ item }">
                  <v-textarea
                    style="border-radius: 10px"
                    v-model="item.razon_rechazo"
                    type="text"
                    v-if="!item.aceptado"
                    :rules="[v => !!v || 'La observacion es obligatoria']"
                    id="observacion"
                    placeholder="Escribe aqui"
                    name="observacion"
                  />
                </template>
                <template v-slot:[`item.ver`]="{ item }">
                  <v-btn
                    fab
                    color="primary"
                    :loading="item.loading"
                    @click="verDocumentoExterno(item)"
                  >
                    <v-icon>insert_drive_file </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
              <!-- <div class="mt-4" v-if="pendingRequirements && pendingRequirements.length > 0">
              <h3><strong>REQUISITOS PENDIENTES</strong></h3>
              <v-data-table
                :loading="loading"
                :search="search"
                :headers="headersPendingDocs"
                :items="pendingRequirements"
                :items-per-page="5"
                class="elevation-1 mt-12"
              >
                <v-progress-linear
                  v-show="loading"
                  slot="progress"
                  color="#142638"
                  indeterminate
                ></v-progress-linear>


              </v-data-table>
            </div> -->
            </v-container>
          </v-form>
          <!-- </v-alert> -->

          <div class="d-flex justify-center">
            <v-btn
              :loading="loading"
              :disabled="!allAccepted || loading || existe_expediente || (formExterno.expediente_interno && formExterno.expediente_interno.completado === 0)"
              color="blue-grey"
              class="ma-2 white--text"
              @click="procesarSolicitudExterna"
              v-if="allAccepted"
            >
              {{ this.labelButton }}
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <v-btn
              :loading="loading"
              :disabled="!just_save || loading "
              class="ma-2 white--text primary"
              @click="procesarSolicitudExterna"
              v-if="!IsExist"
            >
              Guardar Documentos
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <v-btn
              v-else
              :loading="validate_loading"
              :disabled="validate_loading"
              color="blue-grey"
              class="ma-2 white--text"
              @click="agregarDocumentosSolicitudExterno"
            >
              Validar documentos al expediente<br />
              {{ this.formExterno.nombre_expediente }}
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </div>
        </v-container>
      </div>
      <br />
      <div v-if="loading_info_expediente" class="d-flex justify-center">
        <br />
        <v-progress-circular
          :size="70"
          :width="7"
          color="blue-grey"
          indeterminate
        ></v-progress-circular>
      </div>

      <v-dialog v-model="showExterno" persistent>
        <v-card class="text-center" height="800px" style="margin-left: 250px">
          <v-card-title>
            {{ nombreDocumentoExterno }}
            <button
              class="btn btn-danger btn-circle"
              @click="
                (srcExterno = ''),
                  (showExterno = false),
                  (nombreDocumentoExterno = '')
              "
            >
              <i class="fa fa-close"></i>
            </button>
          </v-card-title>
          <v-card-actions>
            <iframe
              :src="srcExterno"
              style="width: 100%; height: 700px; border: none"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>
<script src="./ver_solicitud.js" />

<style lang="scss" scoped>
.vue-pdf-embed > div {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

.app-header {
  padding: 16px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: #ddd;
}

.app-content {
  padding: 24px 16px;
  height: 10px;
}

.right {
  float: right;
}
input[type="radio"] {
  // Colors
  $verde: #2ecc71;
  $rojo: #e74c3c;

  display: none;

  + label {
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 14px;

    span {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin: -1px 4px 0 0;
      vertical-align: middle;
      cursor: pointer;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33);
      background-repeat: no-repeat;
      background-position: center;
      text-align: center;
      line-height: 44px;

      img {
        margin: 10px;
        opacity: 0;
        transition: all 0.3s ease;
      }
    }
  }

  //

  &.verde:checked + label span {
    background-color: $verde;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $verde;
  }

  &.verde:hover + label span {
    background-color: $verde;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $verde;
  }

  &.verde + label span {
    background-color: $verde;
  }

  //

  &.rojo:checked + label span {
    background-color: $rojo;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $rojo;
  }

  &.rojo:hover + label span {
    background-color: $rojo;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $rojo;
  }

  &.rojo + label span {
    background-color: $rojo;
  }

  &:checked + label span img {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes wave {
  50%,
  75% {
    transform: scale(2.5);
  }

  80%,
  100% {
    opacity: 0;
  }
}
</style>
