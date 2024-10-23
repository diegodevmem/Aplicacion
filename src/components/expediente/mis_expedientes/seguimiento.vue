<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Seguimiento del código de Actuación {{ codigo_barra }}
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <ol class="label breadcrumb bg-blue pull-right">
            <li>
              <b-button
                @click="regresa_expedientes()"
                class="btn-sm datos m-0 p-0"
                variant="success"
              >
                <i class="fa fa-list-alt"></i>
                <span>Continuar viendo expedientes</span>
              </b-button>
            </li>
            <router-link tag="li" to="/exp_default" exact>
              <i class="fa fa-home"></i> Home
            </router-link>
            <router-link tag="li" to="/" exact>
              <i class="fa fa-dashboard"></i> Dashboard </router-link
            ><!--
            <router-link tag="li" to="/exp_mis_expedientes" exact>
              <i class="fa fa-circle-o"></i> Expedientes
            </router-link>-->
            <li>
              <i class="fa fa-bug active"></i> Seguimiento de la Actuación
            </li>
          </ol>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="panel-body">
              <div class="row">
                <div class="col-12 text-center">
                  <h1>
                    Número de Expediente <br />
                    <strong v-text="expediente.numero_expediente"></strong>
                    <br />
                    Código de Actuación <br />
                    <strong v-text="codigo_barra"></strong>
                  </h1>
                  <hr />
                  <a class="btn btn-success" @click="buscar_documento()">
                    <strong>Ver Documentos</strong>
                  </a>
                  <a
                    class="btn btn-info text-white rounded-pill"
                    @click="verFlujo()"
                  >
                    <strong>Ver Paso actual</strong>
                  </a>
                  <button
                    v-if="false"
                    @click="abrirModalAgregarDocumento()"
                    type="button"
                    class="btn btn-success btn-circle"
                    v-tooltip.botton="
                      'Al dar click podra adjuntar documentos al expediente'
                    "
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row" v-if="expediente">
                <div class="col-sm-12 col-md-6 col-lg-6 table-responsive">
                  <h2>Información del Expediente</h2>
                  <table class="table">
                    <tbody>
                      <tr>
                        <td width="30%">
                          <strong>Número de Expediente</strong>
                        </td>
                        <td class="text-left" v-text="numero_expediente"></td>
                      </tr>
                      <tr>
                        <td width="30%">
                          <strong>Nombre del Expediente</strong>
                        </td>
                        <td
                          class="text-left"
                          v-text="expediente.nombre_expediente"
                        ></td>
                      </tr>
                      <tr>
                        <td width="30%"><strong>Tipo de Trámite</strong></td>
                        <td
                          class="text-left"
                          v-text="actuacion.tipo_tramite"
                        ></td>
                      </tr>
                      <tr>
                        <td width="30%"><strong>Fecha de Creación</strong></td>
                        <td
                          class="text-left"
                          v-text="expediente.fecha_ingreso"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 table-responsive">
                  <h2>Información de la Actuación</h2>
                  <table class="table" v-if="actuacion">
                    <tbody>
                      <tr>
                        <td width="30%"><strong>Código</strong></td>
                        <td
                          class="text-left"
                          v-text="actuacion.codigo_barra"
                        ></td>
                      </tr>
                      <tr>
                        <td width="30%">
                          <strong>Nombre de la Actuación</strong>
                        </td>
                        <td
                          class="text-left"
                          v-text="actuacion.nombre_expediente"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  class="col-sm-12 col-md-12 col-lg-12 text-center"
                  v-if="actuacion.congelado"
                >
                  <hr />
                  <strong style="font-size: 2vw" class="label label-primary">
                    CONGELADO: {{ congelacion.dias }} DIAS </strong
                  ><br /><br />
                  <strong style="font-size: 1.5em" class="label label-primary">
                    TIPO: {{ congelacion.tipo }} </strong
                  ><br /><br />
                  <span>
                    <strong style="font-size: 1.5em" class="label-primary">
                      RAZON: {{ congelacion.razon }}
                    </strong>
                  </span>
                </div>
                <div
                  class="col-sm-12 col-md-12 col-lg-12 text-center"
                  v-if="actuacion.completo"
                >
                  <strong style="font-size: 2vw" class="label label-danger"
                    >CERRADO</strong
                  >
                </div>
              </div>
              <div class="row"><hr /></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="seguimientos.length > 0">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <cuerpo :seguimiento="seguimientos"></cuerpo>
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

    <!-- Modal para agregar los documentos de la actuacion seleccionada -->
    <!-- QUITAR EL IF PARA HACER VISIBLE -->
    <div
      v-if="false"
      :class="abrirModalAddDocumento"
      data-backdrop="static"
      v-bind:style="styleObjectAddDocumento"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ titleDocumento }}
              <button
                type="button"
                @click="cancel_showAddDocumento"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 100%"
            v-if="modalAddDocumento"
          >
            <div class="row">
              <div class="col-md-12">
                <div>
                  <documentos
                    :documentos="documents"
                    :documentosGuardar="documentsSave"
                    :folios_correcion="folios_correcion"
                    :botones="true"
                  />
                </div>
                <!-- <h1>HOLA MUNDO</h1> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script src="./seguimiento.js" />