<template>
  <div class="content-wrapper" v-loading="loading">
    <div v-if="block === false">
      <section class="content-header">
        <h1 class="label bg-primary">
          Evaluación de Desempeño
          <small style="color: white">Sistema de Recursos Humanos</small>
        </h1>
        <br /><br />
        <ol class="label breadcrumb bg-gray">
          <router-link tag="li" to="/cat_default" exact>
            <i class="fa fa-home"></i> Home
          </router-link>
          <router-link tag="li" to="/" exact>
            <i class="fa fa-dashboard"></i> Dashboard
          </router-link>
          <li><i class="fa fa-bug active"></i> Evaluación de Desempeño</li>
        </ol>
      </section>
      <br />
      <section id="evaluacion" class="content">
        <div class="html body">
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div class="box box-primary" id="p0">
                <div class="box-body">
                  <form role="form" autocomplete="off">
                    <!-- PRIMER ENCABEZADO -->
                    <div class="row">
                      <!-- IMAGEN GOBIERNO GUATEMALA -->
                      <div class="col-md-4 text-center">
                        <br />
                        <br />
                        <div>
                          <img
                            :src="require('../../assets/LogoLogin2.png')"
                            width="60%"
                          />
                        </div>
                      </div>

                      <!-- TITULOS -->
                      <div class="col-md-4">
                        <h2 class="text-center">
                          <strong>Unidad de Recursos Humanos</strong>
                        </h2>
                        <h3 class="text-center">
                          <strong>Evaluación de Desempeño</strong><br />
                          <strong>Ejercicio Fiscal {{ anio }}</strong>
                        </h3>
                      </div>

                      <!-- FECHA CODIGO -->
                      <div class="col-md-4">
                        <div class="row mx-3 px-3 text-center">
                          <br /><br />
                          <h4 class="datos m-0 p-0">
                            Fecha: {{ fecha }} {{ hora }}
                          </h4>
                          <h4 v-if="evaluacion !== null" class="datos m-0 p-0">Código: {{ evaluacion[0].id }}</h4>
                          <!-- <h4 class="datos m-0 p-0">Usuario: {{ nombre }}</h4> -->
                        </div>
                      </div>
                    </div>
                    <br />


                    <!--TABLA DE DATOS DEL EMPLEADO -->
                    <div class="container-flex" style="margin: 2% 7%">
                      <h4 class="text-center"><strong>EVALUADOR: </strong> {{ nombre }}</h4>
                      <div class="card">
                        <div class="card-body-title">

                          <!-- NIVEL DE EVALUACION -->
                          <div v-if="tipoEvaluacion !== null" class="row">
                            <div class="col-md-12 text-center">
                              <h4>
                                <strong>{{ tipoEvaluacion.descripcion }}: </strong> {{ tipoEvaluacion.texto }}
                              </h4>
                            </div>
                          </div>
                          <br />

                          <!-- TABLA DE DATOS DEL EMPLEADO -->
                          <div class="row text-center">
                            <table class="table d-flex justify-content-center">
                              <tbody class="text-center">
                                <tr>
                                  <td
                                    class="bg-light text-center"
                                    style="vertical-align: middle"
                                  >
                                    <div v-if="empleado === null" >
                                      <label>NOMBRE DEL EVALUADO:</label>
                                      <multiselect
                                        style="width: auto"
                                        v-model="empleado"
                                        :options="empleados"
                                        placeholder="Seleccione uno por favor"
                                        :searchable="true"
                                        :allow-empty="true"
                                        :preselect-first="false"
                                        data-vv-name="empleado"
                                        v-validate="'required'"
                                        :show-labels="false"
                                        :show-no-result="true"
                                        label="nombre"
                                        track-by="id"
                                        @close="save()"
                                      >
                                        <span slot="noResult">No se encontró información</span>
                                      </multiselect>
                                      <FormError
                                        :attribute_name="'empleado'"
                                        :errors_form="errors"
                                      >
                                      </FormError>
                                    </div>
                                    <div v-if="empleado !== null">
                                      <span><strong>NOMBRE DEL EVALUADO: </strong> <br> {{ empleado.nombre }}</span>
                                      <button
                                        class="btn btn-info btn-circle"
                                        @click="loading = true, empleado = null, getAll(), verObs=false; loading = false"
                                      >
                                        <i class="fa fa-edit"></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>RENGLON: </strong>
                                      <span v-if="empleado !== null">{{ empleado.renglon }}</span>
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="bg-light text-center"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>PUESTO NOMINAL: </strong><br>
                                      <span v-if="empleado !== null">{{ empleado.puestonominal.toUpperCase() }}</span>
                                    </span>
                                  </td>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>PUESTO FUNCIONAL: </strong><br>
                                      <span v-if="empleado !== null">{{ empleado.puestofuncional.toUpperCase() }}</span>
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>UNIDAD O DEPARTAMENTO: </strong><br>
                                      <span v-if="empleado !== null">{{ empleado.unidad.toUpperCase() }}</span>
                                    </span>
                                  </td>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>DIRECCION: </strong><br>
                                      <span v-if="empleado !== null">{{ empleado.direccion.toUpperCase() }}</span>
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--INSTRUCCIONES -->
                    <div class="container-flex" style="margin: 2% 7%">
                      <div class="card">
                        <div class="card-body-title">
                          <!--INSTRUCCIONES -->
                          <div class="row">
                            <div class="col-md-12 text-center">
                              <span>
                                <strong>INSTRUCCIONES</strong><br>
                                A continuación se presentan cuatro posibles
                                respuestas para cada numeral, usted debe elegir el color que considere conveniente,
                                según el desempeño demostrado por su subalterno.
                              </span>
                            </div>
                          </div>
                          <br />

                          <!-- TABLA DE INSTRUCCIONES -->
                          <div class="row text-center">
                            <table class="table d-flex justify-content-center">
                              <tbody class="">
                                <tr>
                                  <td style="vertical-align: middle">
                                    <div class="custom-radios">
                                      <div>
                                        <input type="radio" class="azul" checked/>
                                        <label><span>
                                          <img
                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                            alt="Checked Icon"
                                          />
                                        </span></label>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="bg-light text-center"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>SIEMPRE</strong>
                                    </span>
                                  </td>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    Cumple con todos los requisitos y expectativas
                                    planteadas. Sobrepasa el nivel de desempeño
                                    que se espera de un empleado con ese nivel de
                                    responsabilidad.
                                  </td>
                                </tr>
                                <tr>
                                  <td style="vertical-align: middle">
                                    <div class="custom-radios">
                                      <div>
                                        <input type="radio" class="verde" checked/>
                                        <label><span>
                                          <img
                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                            alt="Checked Icon"
                                          />
                                        </span></label>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="bg-light text-center"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>CASI SIEMPRE</strong>
                                    </span>
                                  </td>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    Cumple con todos los requisitos y expectativas
                                    planteadas. Presenta un desempeño
                                    satisfactorio y es el nivel que se espera de
                                    un empleado.
                                  </td>
                                </tr>
                                <tr>
                                  <td style="vertical-align: middle">
                                    <div class="custom-radios">
                                      <div>
                                        <input type="radio" class="amarillo" checked/>
                                        <label><span>
                                          <img
                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                            alt="Checked Icon"
                                          />
                                        </span></label>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="bg-light text-center"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>CASI NUNCA</strong>
                                    </span>
                                  </td>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    El nivel y calidad de los resultados, no
                                    siempre cubren los requisitos básicos. El
                                    desempeño es inferior al esperado.
                                  </td>
                                </tr>
                                <tr>
                                  <td style="vertical-align: middle">
                                    <div class="custom-radios">
                                      <div>
                                        <input type="radio" class="rojo" checked/>
                                        <label><span>
                                          <img
                                            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                            alt="Checked Icon"
                                          />
                                        </span></label>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    class="bg-light text-center"
                                    style="vertical-align: middle"
                                  >
                                    <span>
                                      <strong>NUNCA</strong>
                                    </span>
                                  </td>
                                  <td
                                    class="bg-light"
                                    style="vertical-align: middle"
                                  >
                                    No cumple con los requisitos mínimos
                                    establecidos para el desempeño de sus labores.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- <div v-if="resumen === false"> -->
                      <div v-if="empleado !== null" class="container-flex" style="margin: 2% 7%">
                        <div class="card text-center">
                          <div class="card-body-title">
                            <!-- FACTORES -->
                            <!-- BOTON -->
                            <h2 class="text-center">VARIABLES DE EVALUACIÓN</h2>
                            <b-button
                              :class="
                                (x.active === false ? 'collapsed' : '') +
                                'm-1 option-button btn-' +
                                x.type
                              "
                              style="margin: 5px"
                              @click="viewFactor(x)"
                              :aria-expanded="x.active"
                              v-for="(x, i) in factores"
                              :key="i"
                              :aria-controls="'collapse-f' + x.id"
                            >
                              <span>{{ x.descripcion }} <strong>({{ x.valor }}pts.)</strong></span>
                            </b-button>
                          </div>
                        </div>
                      </div>

                      <div v-if="empleado !== null" class="container-flex" style="margin: 2% 7%">
                        <!-- CONTENIDO -->
                        <b-collapse
                          v-for="(x, i) in factores"
                          :key="i"
                          v-model="x.active"
                          :id="'collapse-f' + x.id"
                        >
                          <div class="card text-center">
                            <div class="card-body-title">
                              <div>
                                <h2>FACTORES DE EVALUACION</h2>
                                <h4 class="text-center">{{ x.descripcion }}</h4>
                                <!-- SUBFACTORES -->
                                <!-- BOTON -->
                                <b-button
                                  v-for="(y, j) in x.subfactor"
                                  :key="j"
                                  :aria-expanded="y.active"
                                  :aria-controls="'collapse-sf' + y.id"
                                  :class="
                                    (y.active === false
                                      ? 'collapsed'
                                      : '') +
                                    'm-1 option-button btn-' +
                                    y.type
                                  "
                                  @click="viewSubfactor(x.subfactor, y)"
                                >
                                  <span>{{ y.descripcion }} <strong>({{ y.puntuacionSubFactor }}pts.)</strong></span>
                                </b-button>

                              </div>
                            </div>
                          </div>
                          <div style="margin: 2% 0% 2% 0%">
                            <b-collapse
                              v-for="(y, k) in x.subfactor"
                              :key="k"
                              v-model="y.active"
                              :id="'collapse-sf' + y.id"
                            >

                              <div class="card text-center">
                                <div class="card-body-title">
                                  <div>
                                    <h3 class="text-center" style="margin: 0% 0% 2% 0%">{{ y.descripcion }}</h3>

                                    <!-- INSTRUCCIONES -->
                                    <div class="row" style="margin: 0% 0% 2% 0%">
                                      <div class="col-md-2"></div>
                                      <div class="col-md-2">
                                        <div id="siempre">
                                          <div class="custom-radios">
                                            <div>
                                              <input type="radio" class="azul" checked/>
                                              <label><span>
                                                <img
                                                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                                  alt="Checked Icon"
                                                />
                                              </span></label>
                                            </div>
                                          </div>
                                          <span>
                                            <strong>SIEMPRE</strong>
                                          </span>
                                        </div>
                                      </div>
                                      <div class="col-md-2">
                                        <div id="casi_siempre" style="display: inline">
                                          <div class="custom-radios">
                                            <div>
                                              <input type="radio" class="verde" checked/>
                                              <label><span>
                                                <img
                                                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                                  alt="Checked Icon"
                                                />
                                              </span></label>
                                            </div>
                                          </div>
                                          <span>
                                            <strong>CASI SIEMPRE</strong>
                                          </span>
                                        </div>
                                      </div>
                                      <div class="col-md-2">
                                        <div id="casi_siempre" style="display: inline">
                                          <div class="custom-radios">
                                            <div>
                                              <input type="radio" class="amarillo" checked/>
                                              <label><span>
                                                <img
                                                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                                  alt="Checked Icon"
                                                />
                                              </span></label>
                                            </div>
                                          </div>
                                          <span>
                                            <strong>CASI NUNCA</strong>
                                          </span>
                                        </div>
                                      </div>
                                      <div class="col-md-2">
                                        <div id="casi_siempre" style="display: inline">
                                          <div class="custom-radios">
                                            <div>
                                              <input type="radio" class="rojo" checked/>
                                              <label><span>
                                                <img
                                                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                                  alt="Checked Icon"
                                                />
                                              </span></label>
                                            </div>
                                          </div>
                                          <span>
                                            <strong>NUNCA</strong>
                                          </span>
                                        </div>
                                      </div>
                                      <div class="col-md-2"></div>
                                    </div>

                                    <div class="row">
                                      <div
                                        v-for="(z, i) in y.pregunta"
                                        :key="i"
                                        class="col-md-4"
                                      >
                                        <div class="card text-center">
                                          <div class="card-body">
                                            <span>
                                              {{ z.descripcion }}
                                              <strong>({{ z.valor }})pts.</strong>
                                            </span>
                                            <div
                                              class="custom-radios"
                                              style="margin: 0 auto"
                                            >
                                              <div style="margin-top: 10px">
                                                <div v-for="(a, i) in z.respuesta" :key="i">
                                                  <div v-if="a.ver === true">
                                                    <input
                                                      type="radio"
                                                      :id="'color-' +x.id +'-' +y.id +'-' +z.id +'-'+a.respuesta_id"
                                                      :class="a.color+' check'"
                                                      v-model="z.selecion"
                                                      :value="a.respuesta_id"
                                                      :name="'color-' +x.id +'-' +y.id +'-' +z.id"
                                                      @click="select(a, z)"
                                                    />
                                                    <label
                                                      :for="'color-' +x.id +'-' +y.id +'-' +z.id +'-'+a.respuesta_id"

                                                    >
                                                      <span>
                                                        <img
                                                          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                                          alt="Checked Icon"
                                                        />
                                                      </span>
                                                    </label>
                                                  </div>
                                                  <div v-if="a.ver === false">
                                                    <input
                                                      type="radio"
                                                      :id="'color-' +x.id +'-' +y.id +'-' +z.id +'-'+a.respuesta_id"
                                                      :class="a.color"
                                                      v-model="z.selecion"
                                                      :value="a.respuesta_id"
                                                      :name="'color-' +x.id +'-' +y.id +'-' +z.id"
                                                      @click="select(a, z)"
                                                    />
                                                    <label
                                                      :for="'color-' +x.id +'-' +y.id +'-' +z.id +'-'+a.respuesta_id"
                                                    >
                                                      <span>
                                                        <img
                                                          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                                          alt="Checked Icon"
                                                        />
                                                      </span>
                                                    </label>
                                                  </div>
                                                </div>
                                                <br>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <br />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </b-collapse>
                          </div>
                        </b-collapse>
                      </div>
                    <!-- </div> -->

                    <!-- RESUMEN -->
                    <div v-if="verObs" class="container-flex" style="margin: 2% 7%">
                      <div class="card">
                        <div class="card-body-title">
                          <div class="row">
                            <div class="col-md-12 text-center">
                              <h4 v-if="estado !== null"><strong>ESTADO: </strong>{{ estado.descripcion }}</h4>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12 text-center">
                              <b-button
                                class="m-1 option-button btn-info"
                                style="margin: 5px"
                                @click="verResumen()"
                                v-if="estado.id !== 4"
                              >
                                <span v-if="!resumen"><strong>Ver Resumen</strong></span>
                                <span v-if="resumen"><strong>Cerrar Resumen</strong></span>
                              </b-button>
                              <b-button
                                class="m-1 option-button btn-info"
                                style="margin: 5px"
                                @click="generarPDF()"

                              >
                                <span><strong>Imprimir Reporte de Evaluacion</strong></span>
                              </b-button>
                            </div>
                          </div>
                          <br />

                          <!-- TABLA DE RESUMEN -->
                          <div v-if="resumen === true">
                            <div v-for="(x, i) in factores" :key="i" class="row text-center">
                              <div class="container-flex" style="margin: 2% 7%">
                                <div class="card">
                                  <div class="card-body-title">
                                    <h4><strong>{{ x.descripcion }}</strong></h4>
                                    <div v-for="(y, j) in x.subfactor" :key="j">
                                      <h5><strong>{{ y.descripcion }}</strong></h5>
                                      <table class="table d-flex justify-content-center">
                                        <thead>
                                          <tr>
                                            <th scope="col">PREGUNTA</th>
                                            <th scope="col">CALIFICACIÓN</th>
                                            <th scope="col">NOTA</th>
                                          </tr>
                                        </thead>
                                        <tbody class="">
                                          <tr v-for="(z, k) in y.pregunta" :key="k">
                                            <td>{{ z.descripcion }}</td>
                                            <td class="text-center">{{ parseFloat(z.valor).toFixed(3)}}</td>
                                            <td class="text-center">{{ parseFloat(z.punteo).toFixed(3)}}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-if="resumen" class="row">
                            <div class="col-md-6">
                              <h4 class="text-center"><strong>CALIFICACIÓN TOTAL: </strong>{{ calificacion.toFixed(3) }} pts.</h4>
                            </div>
                            <div class="col-md-6">
                              <h4 class="text-center"><strong>NOTA OBTENIDA: </strong>{{ nota.toFixed(3) }} pts.</h4>
                            </div>
                          </div>
                          <div v-if="resumen" class="row text-center">
                            <b-button
                              class="m-1 option-button btn-info"
                              style="margin: 5px"
                              @click="verResumen()"
                              v-if="estado.id !== 4"
                            >
                              <span v-if="!resumen"><strong>Ver Resumen</strong></span>
                              <span v-if="resumen"><strong>Cerrar Resumen</strong></span>
                            </b-button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- OBSERVACION -->
                    <div v-if="verObs" class="container-flex" style="margin: 2% 7%">
                      <div class="card">
                        <div class="card-body-title">
                          <div class="row">
                            <div class="col-sm-12 col-md-12 col-lg-12">
                              <div class="form-group">
                                <label for="observacion">Comentarios sobre el funcionario o servidor público</label>
                                <textarea
                                  v-model="observacion"
                                  class="form-control"
                                  id="observacion"
                                  placeholder="escribir la observación del expediente"
                                  name="observación"
                                  v-validate="'max:250'"
                                  :class="{
                                    input: true,
                                    'has-errors': errors.has('validar.observación'),
                                  }"
                                  @input="
                                    observacion = $event.target.value.toUpperCase()
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
                      </div>
                    </div>
                    <div id="mypdf"></div>
                  </form>
                </div>
                <div v-if="estado !== null" class="box-footer">
                  <!-- <button type="button" class="btn btn-danger btn-lg pull-left">
                    <i class="fa fa-ban"></i> Cancelar
                  </button> -->
                  <button type="button" class="btn btn-primary btn-lg pull-right"
                    @click="saveEvaluacion()"
                  >
                    <i class="fa fa-save"></i> Guardar información
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <h2 v-if="evaluacion !== null" class="modal-title text-center">
                  Evaluación {{ evaluacion[0].id }}
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
      </section>
    </div>
    <rechazado v-if="block === true || block === null"></rechazado>
  </div>
</template>

<script>
import FormError from "../shared/FormError";
import Index from '../panel/Index.vue';
import Rechazado from "../shared/Rechazado.vue";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

export default {
  components: {
    FormError,
    Index,
    html2canvas,
    jsPDF,
    Rechazado
  },
  name: "rrhh_evaluacion",

  data() {
    return {
      loading: false,
      empleado: null,
      empleados: [],
      factores: [],
      respuestas: [],
      puntosTotal: 0,
      observacion: "",
      verObs: false,
      resumen: false,
      calificacion: 0,
      nota: 0,
      estado: null,
      evaluacion: null,
      noBoton: false,
      block: false,

      respuestasEvaluacion: null,
      option: null,
      tipoEvaluacion: null,

      // Modal Documento
      abrirModalDocumento: "modal fade",
      styleObjectDocumento: {},
      modalDocumento: false,
      src: null,

    };
  },

  computed: {
    hora() {
      let hoy = new Date(Date.now());
      let hora = hoy.getHours();
      let min = hoy.getMinutes();
      return hora + ":" + min;
    },

    fecha() {
      let hoy = new Date(Date.now());
      return hoy.toLocaleDateString();
    },
    anio(){
      return new Date().getFullYear();
    },
    nombre() {
      let nombre = this.$store.state.user.nombre;
      let apellido = this.$store.state.user.apellido;
      return nombre + " " + apellido;
    },
  },

  async created() {
    if (window.AdobeDC) this.displayPDF();
    else {
      document.addEventListener("adobe_dc_view_sdk.ready", () => this.displayPDF());
    }
    this.loading = true;
    await this.getEmpleados();
    // await this.getAll();
    this.loading = null;
  },
  mounted() {
    $("body").resize();
  },
  methods: {

    displayPDF() {
      console.log('Lets do some AWESOME PDF stuff!');
    },

    viewFactor(x) {
      // this.verObs=false;
      this.factores.filter((y) =>
        y === x
          ? ((y.active = true), (y.type = "info bold"))
          : ((y.active = false), (y.type = "light"))
      );
    },

    viewSubfactor(array, x) {
      this.verObs = true;
      // array.filter((y) =>
      //   y === x
      //     ? ((y.active = true), (y.type = "info bold"))
      //     : ((y.active = false), (y.type = "light"))
      // );
      array.filter(y => {
        if (y === x) {
          y.active = true;
          y.type = "info bold";
        }else{
          y.active = false;
          y.type = "light";
        }
      });
    },

    async getAll(){
      if (this.empleado !== null) {
        try {
          let r = await this.$store.state.services.evaluacionService.getAll(this.empleado.idempleado);
          this.factores = r.data;
          this.factores.filter(x => {
            x.subfactor.filter(y => {
              y.pregunta.filter(z => {
                z.respuesta.filter(a => {
                  if (a.respuesta_id === 1) { a.color = "azul" }
                  if (a.respuesta_id === 2) { a.color = "verde" }
                  if (a.respuesta_id === 3) { a.color = "amarillo" }
                  if (a.respuesta_id === 4) { a.color = "rojo" }
                  a.ver = false
                });
                z.selecion = null;
                z.punteo = 0;
                z.respuesta_id = 0,
                z.respondida = false;
              });
            });
            x.type = "light"
          });
          console.log('r.data GETALL');
          console.log(r.data);
        } catch (error) {
          this.$toastr.error("Ocurrió un error al obtener los datos de la evaluacion: " + error, "ERROR");
        }
      }else{
        this.$toastr.warning(
          "DEBE DE INGRESAR UN USUARIO",
          "ADVERTENCIA"
        );
      }
    },

    async getEmpleados(){
      try {
        let r = await this.$store.state.services.evaluacionService.getEmpleados();
        r.data.filter(x => {
          x.nombre = x.nombre.trim() + ' '+x.apellido.trim();
          x.nombre = x.nombre.toUpperCase();
        });
        this.empleados = r.data;
        this.empleados.length === 0 ? this.block = true : this.block = false;
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + error, "ERROR");
      }
    },

    select(respuesta, pregunta){
      let data = this.factores;
      pregunta.punteo = parseFloat(respuesta.valor_respuesta);
      pregunta.respondida = true;
      pregunta.respuesta_id = respuesta.respuesta_id
      this.resumen = false
      // respuesta.ver = false;
      if (this.option === 1) {
        this.loading = true;
        this.factores = null;
        pregunta.respuesta.filter(x => {
          x.ver = false;
        });
        respuesta.ver = true;
        setTimeout(() => this.factores = data, 10);
        this.loading = false;
      }else{
        // respuesta.ver = true;
      }


      // this.factores.filter(x => {
      //   x.subfactor.filter(y => {
      //     y.pregunta.filter(z => {
      //       this.puntosTotal = this.puntosTotal + z.punteo;
      //     });
      //   });
      // });
    },

    punteo(pregunta_id){
      let punteo= 0;
      this.respuestas.filter(x => {
        if (x.pregunta_id === pregunta_id) {
          punteo = x.punteo
          return;
        }
      });
      return punteo;
    },

    verResumen(){
      this.nota = 0;
      this.calificacion = 0;
      this.resumen = !this.resumen;
      if (this.resumen === true) {
        this.factores.filter(x => {
          x.subfactor.filter(y => {
            y.pregunta.filter(z => {
              this.nota = this.nota + z.punteo;
              this.calificacion = this.calificacion + parseFloat(z.valor);
              console.group("hola");
              console.log("nota",this.nota);
              console.log("calificacion", this.calificacion);
              console.groupEnd();
            });
          });
        });
      }
    },

    async save(){
      this.resumen = false;
      this.verObs = false;
      this.loading = true;
      if (this.empleado === null) {
        this.loading = false;
        this.$toastr.warning(
          "DEBE DE INGRESAR UN USUARIO",
          "ADVERTENCIA"
        );
      }else {
        try {
          this.factores = [];
          let body = {
            fecha: new Date(),
            evaluacion: this.evaluacion,
            estado: this.estado,
            tipoEvaluacion: this.tipoEvaluacion,
            empleado: this.empleado,
            factores: this.factores,
            observacion: this.observacion,
          }
          console.log('body');
          console.log(body);
          let r = await this.$store.state.services.evaluacionService.save(body);
          this.option = r.data.option;
          if (r.data.option === 0) {
            this.factores = [];
            this.tipoEvaluacion = r.data.tipoEvaluacion;
            this.estado = r.data.estado;
            this.evaluacion = r.data.evaluacion;
            await this.getAll();
          } else {
            this.observacion = "";
            this.factores = [];
            this.tipoEvaluacion = r.data.tipoEvaluacion;
            await this.getAll();
            this.estado = r.data.estado;
            this.evaluacion = r.data.evaluacion;
            console.log('this.evaluacion');
            console.log(this.evaluacion);
            this.observacion = this.evaluacion[0].observaciones;
            this.respuestasEvaluacion = r.data.respuestasEvaluacion;
            this.factores.filter(x => {
              x.subfactor.filter(y => {
                y.pregunta.filter(z => {
                  this.respuestasEvaluacion.filter(a => {
                    if (z.id === a.pregunta_id) {
                      z.respondida = true;
                      z.respuesta_id = a.respuesta_id;
                      z.punteo = parseFloat(a.valor_respuesta_evaluado)
                    }
                  });
                  z.respuesta.filter(b => {
                    if (b.respuesta_id === z.respuesta_id) {
                      b.ver = true;
                    }
                  });
                });
              });
            });
            if (this.estado.id === 4) {
              this.verResumen();
              this.verObs = true;
              this.resumen = true;
            }
          }
          if (r.status === 200) {
            this.$toastr.success("Evaluacion Asignada Exitosamente", "EXITO");
          } else {
            this.$toastr.error(
              "A OCURRIDO UN ERROR AL INTENTAR GUARDAR LA EVALUACION",
              "ERROR"
            );
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$toastr.error(
            "A OCURRIDO UN ERROR AL INTENTAR GUARDAR LA EVALUACION: "+error,
            "ERROR"
          );
        }
      }
    },

    async saveEvaluacion(){
      try {
        let body = {
          fecha: new Date(),
          evaluacion: this.evaluacion,
          estado: this.estado,
          tipoEvaluacion: this.tipoEvaluacion,
          empleado: this.empleado,
          factores: this.factores,
          observacion: this.observacion,
        }
        console.log('body');
        console.log(body);
        let r = await this.$store.state.services.evaluacionService.saveEvaluacion(body);
        if (r.status === 200) {
          this.estado = r.data;
          this.$toastr.success("Evaluacion Guardada Exitosamente", "EXITO");
          // this.factores = [];
          // this.empleado = null;
        } else {
          this.$toastr.error(
            "A OCURRIDO UN ERROR AL INTENTAR GUARDAR LA EVALUACION",
            "ERROR"
          );
        }
      } catch (error) {
        this.$toastr.error(
          "A OCURRIDO UN ERROR AL INTENTAR GUARDAR LA EVALUACION: "+error,
          "ERROR"
        );
      }
    },

    // async generarPDF2(){
    //   try {
    //     this.noBoton = true;
    //     this.resumen = true;
    //     setTimeout(() => {
    //       let DATA = document.getElementById('evaluacion');
    //       if (DATA !== null) {
    //         html2canvas(DATA).then(canvas => {
    //           let imgData = canvas.toDataURL('image/png');
    //           let imgWidth = 210;
    //           let pageHeight = 295;
    //           let imgHeight = canvas.height * imgWidth / canvas.width;
    //           let heightLeft = imgHeight;
    //           let doc = new jsPDF('p', 'mm');
    //           let position = 0;

    //           doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //           heightLeft -= pageHeight;

    //           while (heightLeft >= 0) {
    //             position = heightLeft - imgHeight;
    //             doc.addPage();
    //             doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //             heightLeft -= pageHeight;
    //           }
    //           doc.save( 'file.pdf');
    //         });
    //       }
    //       this.noBoton = false;
    //       this.resumen = false;
    //     }, 5000);
    //   } catch (error) {
    //     this.noBoton = false;
    //     this.loading = false;
    //     this.$toastr.error(
    //       "A OCURRIDO UN ERROR AL INTENTAR GENERAR LA EVALUACION: "+error,
    //       "ERROR"
    //     );
    //   }
    // },

    PDF(){
      let adobeDCView = new AdobeDC.View({clientId: '', divId: "mypdf" });
      adobeDCView.previewFile({
        content:{location: {url: this.src}},
        metaData:{fileName: "Evaluacion.pdf"}
      });
    },

    async generarPDF(){
      try {
        this.loading = true
        console.log('this.evaluacion[0]');
        console.log(this.evaluacion[0]);
        let r = await this.$store.state.services.evaluacionService.generarPDF(this.evaluacion[0].id);
        if (r.status === 200) {
          this.src = r.data;
          // this.PDF();
          this.$toastr.success("Documento Generado Exitosamente", "EXITO");
          this.styleObjectDocumento.display = "block";
          this.abrirModalDocumento = "modal fade in";
          this.modalDocumento = true;
          this.loading = false;
        } else {
          this.loading = false;
          this.$toastr.error(
            "A OCURRIDO UN ERROR AL INTENTAR GENERAR LA EVALUACION",
            "ERROR"
          );
        }
      } catch (error) {
        this.loading = false;
        console.log('error');
        console.log(error);
        this.$toastr.error(
          "A OCURRIDO UN ERROR AL INTENTAR GENERAR LA EVALUACION: "+error,
          "ERROR"
        );
      }
    },

    cancel_showDocumento() {
      this.styleObjectDocumento.display = "";
      this.abrirModalDocumento = "modal fade";
      this.modalDocumento = false;
      this.src = "";
    },

  },
};
</script>
<style lang="scss">
.hr {
  margin: 10px 0px;
}
// Colors
$azul: #3498db;
$verde: #2ecc71;
$amarillo: #f1c40f;
$rojo: #e74c3c;

.html,
.body {
  height: auto;
  width: 100%;
  margin: 0;
}

.body {
  background-color: #fff;
}

td {
  vertical-align: middle;
}

.custom-radios {
  div {
    display: inline-block;
  }

  input[type="radio"] {
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

    &.azul:checked + label span {
      background-color: $azul;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $azul;
    }

    &.azul:hover + label span {
      background-color: $azul;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $azul;
    }

    &.azul + label span {
      background-color: $azul;
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

    &.amarillo:checked + label span {
      background-color: $amarillo;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $amarillo;
    }

    &.amarillo:hover + label span {
      background-color: $amarillo;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $amarillo;
    }

    &.amarillo + label span {
      background-color: $amarillo;
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

    &.azul.check + label span img {
      opacity: 1;
      transform: scale(1.1);
    }
    &.azul.check + label span {
      background-color: $azul;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $azul;
    }

    &.verde.check + label span img {
      opacity: 1;
      transform: scale(1.1);
    }
    &.verde.check + label span {
      background-color: $verde;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $verde;
    }

    &.amarillo.check + label span img {
      opacity: 1;
      transform: scale(1.1);
    }
    &.amarillo.check + label span {
      background-color: $amarillo;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $amarillo;
    }

    &.rojo.check + label span img {
      opacity: 1;
      transform: scale(1.1);
    }
    &.rojo.check + label span {
      background-color: $rojo;
      transform: scale(1.1);
      box-shadow: 0 0 20px 5px $rojo;
    }

    &:checked + label span img {
      opacity: 1;
      transform: scale(1.1);
    }
  }
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
  // overflow: hidden;
  width: auto;
}
.card-body-title {
  height: auto;
  justify-content: center;
  padding: 2.5%;
}

.card-body {
  height: auto;
  justify-content: center;
  padding: 10%;
}

.option-button {
  margin: 5px;
  padding: 5px 10px;
  border-radius: 15px;
  margin-top: 5px;
  border: none;
}

.bold {
  font-weight: bold;
}
</style>
