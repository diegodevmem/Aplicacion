<template>
  <div :class="wrapper">
    <!-- <header class="main-header">
        <a href="#" class="logo">
          <span class="logo-mini"><b></b></span> 
        </a> 
        <nav role="navigation" class="navbar navbar-static-top"> 
            <div class="navbar-custom-menu">
              <ul class="nav navbar-nav"></ul>
            </div>
        </nav>
    </header>-->
    <section class="content-header">
      <h1 class="label bg-primary">Perfil del Empleado</h1>
      <ol class="label breadcrumb">
        <li>
          <a href="#/panel" class="btn btn-success" style="color:#fff">
            <i class="fa fa-undo"></i> Volver al Panel
          </a>
        </li>
      </ol>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <div class="row">
        <div class="col-md-3">
          <div class="box box-primary">
            <div class="box-body box-profile">
              <img
                class="profile-user-img img-responsive img-circle"
                v-if="empleado.fotografia == null"
                src="../../assets/logo.png"
                alt="foto perfil"
              />
              <img
                class="profile-user-img img-responsive img-circle"
                v-if="empleado.fotografia != null"
                v-bind:src="empleado.fotografia"
                alt="foto perfil"
              />
              <h3
                class="profile-username text-center"
              >{{ empleado.nombre1 }} {{ empleado.nombre2 }} {{ empleado.nombre3 }} {{ empleado.apellido1 }} {{ empleado.apellido2 }} {{ empleado.apellido3 }}</h3>
              <p class="text-muted text-center">
                Código Laboral
                <br />
                <b>{{ data.codigo_empleado }}</b>
              </p>
              <p class="text-muted text-center">
                Correo Electrónico
                <br />
                <b>{{ data.correo_electronico }}</b>
              </p>
              <ul class="list-group list-group-unbordered">
                <li class="list-group-item">
                  <b>CUI</b>
                  <a class="pull-right">{{ data.cui_empleado }}</a>
                </li>
                <li class="list-group-item">
                  <b>SEXO</b>
                  <a class="pull-right">{{ data.sexo }}</a>
                </li>
                <li class="list-group-item">
                  <b>NIT</b>
                  <a class="pull-right">{{ data.nit_empleado }}</a>
                </li>
                <li class="list-group-item">
                  <b>IGSS</b>
                  <a class="pull-right">{{ data.igss_empleado }}</a>
                </li>
                <li class="list-group-item">
                  <b>PASAPORTE</b>
                  <a class="pull-right">{{ data.pasaporte }}</a>
                </li>
                <li class="list-group-item">
                  <b>NACIMIENTO</b>
                  <a
                    class="pull-right"
                  >{{ data.nacimiento_empleado | moment("dddd DD, MMMM YYYY") }}</a>
                </li>
                <li class="list-group-item">
                  <b>NO. CUENTA</b>
                  <a class="pull-right">{{ data.no_cuenta }}</a>
                </li>
                <li class="list-group-item">
                  <b>NO. MARCAJE</b>
                  <a class="pull-right">{{ data.no_marcaje }}</a>
                </li>
                <li class="list-group-item">
                  <b>CUI EXTENDIDO</b>
                  <a class="pull-right">{{ data.cuiextendido }}</a>
                </li>
              </ul>
              <p class="text-left" style="font-size: 11px; color: black;">
                &nbsp; Fecha de ingreso {{ data.created_at | moment("dddd DD, MMMM YYYY, h:mm:ss a") }}
                <br />
                &nbsp; Fecha de modificación {{ data.updated_at | moment("dddd DD, MMMM YYYY, h:mm:ss a") }}
              </p>
              <br />
              <div class="text-center">
                <span
                  v-bind:class="'label label-'+estado()"
                  style="font-size: 18px;"
                >{{ data.estado }}</span>
              </div>
              <br />
              <div class="text-center">
                <a
                  class="btn btn-success btn-sm"
                  data-toggle="modal"
                  data-target="#cambio_contraseña"
                >Cambiar Contraseña</a>
              </div>

              <br />
            </div>
          </div>

          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Información</h3>
            </div>
            <div class="box-body">
              <strong>
                <i class="fa fa-book margin-r-5"></i> Educación
              </strong>
              <template v-for="value in academicos">
                <p class="text-muted" v-bind:key="value.nombre_academico">
                  {{ value.nombre_academico }}
                  <template
                    v-if="value.necesita_colegiado"
                  >{{ ' - ' + value.pivot.colegiado_empelado }}</template>
                </p>
              </template>
              <hr />
              <strong>
                <i class="fa fa-map-marker margin-r-5"></i> Dirección
              </strong>
              <template v-for="value in residenciales">
                <p class="text-muted" v-bind:key="value.direccion_empleado">
                  {{ value.direccion_empleado }}
                  <template v-if="value.direccion_actual">
                    <span class="label label-success" style="font-size: 18px;">actual</span>
                  </template>
                </p>
              </template>
              <hr />
              <strong>
                <i class="fa fa-commenting-o margin-r-5"></i> Idiomas
              </strong>
              <p>
                <br />
                <template v-for="value in lenguajes">
                  &nbsp;
                  <span
                    class="label label-info"
                    v-bind:key="value.nombre"
                  >{{ value.nombre | capitalize({ onlyFirstLetter: true }) }}</span>
                </template>
              </p>
              <hr />
              <strong>
                <i class="fa fa-info-circle margin-r-5"></i> Etnias
              </strong>
              <p>
                <br />
                <template v-for="value in etnias">
                  &nbsp;
                  <span
                    class="label label-primary"
                    v-bind:key="value.nombre_etnia"
                  >{{ value.nombre_etnia | capitalize({ onlyFirstLetter: true }) }}</span>
                </template>
              </p>
              <hr />
              <strong>
                <i class="fa fa-heartbeat margin-r-5"></i> Sangre
              </strong>
              <p>
                <br />
                <template v-for="value in sangres">
                  &nbsp;
                  <span
                    class="label label-danger"
                    v-bind:key="value.nombre_sangre"
                  >{{ value.nombre_sangre | capitalize({ onlyFirstLetter: true }) }}</span>
                </template>
              </p>
              <hr />
              <strong>
                <i class="fa fa-phone margin-r-5"></i> Teléfonos
              </strong>
              <br />
              <template v-for="value in telefonos">
                {{ value.nombre_telefono }}
                &nbsp;
                <span
                  class="label label-success"
                  v-bind:key="value.pivot.telefono_empleado"
                >{{ value.pivot.telefono_empleado }}</span>
                <br v-bind:key="value.nombre_telefono+'-'+value.pivot.telefono_empleado" />
              </template>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#fotografia" data-toggle="tab">Fotografías</a>
              </li>
              <li>
                <a href="#familia" data-toggle="tab">Información familiar</a>
              </li>
              <li>
                <a href="#laboral" data-toggle="tab">Historial laboral</a>
              </li>
              <li>
                <a href="#email" data-toggle="tab">Correo</a>
              </li>
              <li>
                <a href="#medica" data-toggle="tab">Información médica</a>
              </li>
              <li>
                <a href="#referencia" data-toggle="tab">Referencias</a>
              </li>
              <li>
                <a href="#licencia" data-toggle="tab">Licencias</a>
              </li>
            </ul>
            <div class="tab-content" style="width: 100% !important;">
              <div class="active tab-pane" id="fotografia">
                <template v-for="value in fotografias">
                  <div class="post" v-bind:key="value.id">
                    <div class="user-block">
                      <span class="label label-success" v-if="value.fotografia_activar">Activo</span>
                      <span class="label label-danger" v-if="!value.fotografia_activar">Inactivo</span>
                      <span
                        class="description"
                      >&nbsp; &nbsp; {{ value.created_at | moment("dddd DD, MMMM YYYY, h:mm:ss a") }}</span>
                    </div>

                    <div class="row margin-bottom">
                      <div class="col-sm-12">
                        <img
                          class="img-responsive"
                          style="max-width:100%;width:300px;height:300px; margin: 10px auto 20px; display: block;"
                          v-if="value.fotografia_empleado == '' || value.fotografia_empleado == null"
                          src="../../assets/logo.png"
                          alt="Photo"
                        />
                        <img
                          class="img-responsive"
                          style="max-width:100%;width:300px;height:300px; margin: 10px auto 20px; display: block;"
                          v-if="value.fotografia_empleado != '' || value.fotografia_empleado != null"
                          v-bind:src="value.fotografia_empleado"
                          alt="Photo"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <div class="tab-pane" id="familia">
                <div class="row">
                  <template v-for="value in familias">
                    <div class="col-sm-4" v-bind:key="value.id">
                      <div class="box box-widget widget-user-2">
                        <div class="widget-user-header bg-blue">
                          <div class="widget-user-image">
                            <img class="img-circle" src="../../assets/logo.png" alt="familia" />
                          </div>
                          <h3
                            class="widget-user-username"
                          >{{ value.pivot.nombre1_familia }} {{ value.pivot.nombre2_familia }} {{ value.pivot.nombre3_familia }} {{ value.pivot.apellido1_familia }} {{ value.pivot.apellido2_familia }} {{ value.pivot.apellido3_familia }}</h3>
                          <h5 class="widget-user-desc">{{ value.nombre_familia }}</h5>
                        </div>
                        <div class="box-footer">
                          <ul class="list-group list-group-unbordered">
                            <li class="list-group-item">
                              Teléfono
                              <span
                                class="pull-right badge bg-blue"
                              >{{ value.pivot.telefono_familia }}</span>
                            </li>
                            <li class="list-group-item">
                              Creado
                              <span
                                class="pull-right badge bg-green"
                              >{{ value.pivot.created_at | moment("dddd DD, MMMM YYYY, h:mm:ss a") }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <div class="tab-pane" id="laboral">
                <div class="row">
                  <div class="col-md-12">
                    <ul class="timeline">
                      <template v-for="(item, index) in laborales">
                        <li class="time-label" v-bind:key="index">
                          <span class="bg-red" v-if="!item.activo">INACTIVO</span>
                          <span class="bg-green" v-if="item.activo">ACTIVO</span>
                        </li>

                        <li v-bind:key="item.codigo">
                          <i class="fa fa-registered bg-blue"></i>

                          <div class="timeline-item">
                            <span class="time">
                              Fecha de Inicio -
                              <i class="fa fa-calendar"></i>
                              {{ item.inicio | moment("dddd DD, MMMM YYYY") }}
                            </span>

                            <h3 class="timeline-header">
                              <a href="#">{{ item.codigo }}</a>
                              <a
                                href="#"
                                class="btn btn-xs bg-yellow"
                              >{{ item.modalidad_contrato.nombre_modalidad_contrato }}</a>
                            </h3>

                            <div class="timeline-body">
                              <div class="row">
                                <div class="col-md-4">
                                  <div class="box box-solid" style="text-transform: uppercase;">
                                    <div class="box-header with-border">
                                      <i class="fa fa-info"></i>
                                      <h3 class="box-title">INFORMACIÓN</h3>
                                    </div>
                                    <div class="box-body">
                                      <dl>
                                        <dt>NÚMERO DE CONTRATO</dt>
                                        <dd>{{ item.codigo }}</dd>
                                        <dt>Contrato</dt>
                                        <dd>{{ item.tipo_acronimo.nombre_acronimo }}</dd>
                                        <dt>Tipo de contrato</dt>
                                        <dd>{{ item.tipo_contrato.nombre_contrato }} - {{ item.tipo_contrato.tipo_contrato_numeros_contratos.numero }}</dd>
                                        <dt>Sueldo Base</dt>
                                        <dd>{{ item.sueldo | currency('Q ', 2) }}</dd>
                                        <dt>Sueldo Total</dt>
                                        <dd>{{ item.sueldo_total | currency('Q ', 2) }}</dd>
                                      </dl>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  class="col-md-8"
                                  v-if="Number(item.tipo_contrato.tipo_contrato_numeros_contratos.numero) != 29"
                                >
                                  <div class="box box-solid" style="text-transform: uppercase;">
                                    <div class="box-header with-border">
                                      <i class="fa fa-money"></i>
                                      <h3 class="box-title">Bonificaciones</h3>
                                    </div>
                                    <div class="box-body table-responsive">
                                      <table class="table" style="vertical-align: center;">
                                        <thead style="font-size: 14px; font-weight: bold;">
                                          <tr>
                                            <th style="text-align:center;">#</th>
                                            <th style="text-align:center;">Prestación</th>
                                            <th style="text-align:center;">Monto</th>
                                          </tr>
                                        </thead>
                                        <tbody style="font-size: 14px; text-transform: uppercase;">
                                          <template v-for="(suel, iindex) in item.sueldos">
                                            <tr v-bind:key="iindex">
                                              <td class="text-center">
                                                <b>{{ iindex+1 }}</b>
                                              </td>
                                              <td
                                                class="text-left"
                                              >{{ suel.tipo_desgloce.nombre_desgloce }}</td>
                                              <td
                                                class="text-right"
                                              >{{ suel.monto | currency('Q ', 2) }}</td>
                                            </tr>
                                          </template>
                                          <tr>
                                            <td></td>
                                            <td class="text-right">
                                              <strong>Total Bonificaciones</strong>
                                            </td>
                                            <td class="text-right">
                                              <strong>{{ item.sueldo_total - item.sueldo | currency('Q ', 2) }}</strong>
                                            </td>
                                          </tr>
                                        </tbody>
                                        <br />
                                        <tfoot style="font-size: 16px; text-transform: uppercase;">
                                          <tr>
                                            <td></td>
                                            <td>Sueldo base</td>
                                            <td
                                              class="text-right"
                                            >{{ item.sueldo | currency('Q ', 2) }}</td>
                                          </tr>
                                          <tr>
                                            <td></td>
                                            <td>Total</td>
                                            <td class="text-right" style="font-size: 24px;">
                                              <b>{{ item.sueldo_total | currency('Q ', 2) }}</b>
                                            </td>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    </div>
                                  </div>
                                </div>

                                <div class="col-md-12 table-responsive">
                                  <table class="table" style="vertical-align: center;">
                                    <template v-for="(value,ind) in item.puestos">
                                      <tbody
                                        style="font-size: 12px; text-transform: uppercase;"
                                        v-bind:key="ind"
                                      >
                                        <tr>
                                          <td
                                            colspan="3"
                                            style="text-align:center; font-size: 14px; font-weight: bold;"
                                          >Fecha de Inicio {{ value.inicio | moment("dddd DD, MMMM YYYY") }}</td>
                                        </tr>

                                        <tr v-if="value.inicio_cargo != null">
                                          <td style="text-align:left; font-size: 14px;">
                                            <strong>NÚMERO DE DOCUMENTO</strong>
                                            {{ value.inicio_cargo.codigo }}
                                          </td>
                                          <td></td>
                                          <td style="text-align:left; font-size: 14px;">
                                            <strong>FECHA DEL DOCUMENTO</strong>
                                            {{ value.inicio_cargo.fecha | moment("dddd DD, MMMM YYYY") }}
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>
                                            <tr>
                                              <td>
                                                <strong>ubicación</strong>
                                                {{ value.nominal_direccion.organigrama_departamento_unidad.departamento_unidad_tipos_unidades.nombre_unidad+' '+value.nominal_direccion.organigrama_departamento_unidad.nombre_df+' ('+value.nominal_direccion.organigrama_departamento_unidad.abreviatura_df+')' }}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <strong>Unidad o dirección Nominal</strong>
                                                {{ value.puesto_actual_puesto_nominal.puesto_nominal_organigrama.organigrama_departamento_unidad.departamento_unidad_tipos_unidades.nombre_unidad+' '+value.puesto_actual_puesto_nominal.puesto_nominal_organigrama.organigrama_departamento_unidad.nombre_df+' ('+value.puesto_actual_puesto_nominal.puesto_nominal_organigrama.organigrama_departamento_unidad.abreviatura_df+')' }}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <strong>Puesto Nominal</strong>
                                                {{ value.puesto_actual_puesto_nominal.puesto_nominal_nominal.nombre_nominal }}
                                              </td>
                                            </tr>
                                          </td>
                                          <td></td>
                                          <td>
                                            <tr>
                                              <td>
                                                <strong>Dirección Funcional</strong>
                                                {{ value.funcional_direccion.organigrama_departamento_unidad.departamento_unidad_tipos_unidades.nombre_unidad+' '+value.funcional_direccion.organigrama_departamento_unidad.nombre_df+' ('+value.funcional_direccion.organigrama_departamento_unidad.abreviatura_df+')' }}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <strong>Unidad Funcional</strong>
                                                {{ value.funcional_unidad.organigrama_departamento_unidad.departamento_unidad_tipos_unidades.nombre_unidad+' '+value.funcional_unidad.organigrama_departamento_unidad.nombre_df+' ('+value.funcional_unidad.organigrama_departamento_unidad.abreviatura_df+')' }}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <strong>Puesto Funcional</strong>
                                                {{ value.puesto_actual_puesto_funcional.puesto_funcional_funcional.nombre_funcional }}
                                              </td>
                                            </tr>
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>
                                            <strong>Movimiento</strong>
                                            {{ value.puesto_actual_movimiento_puesto.nombre }}
                                          </td>
                                          <td style="text-align:center;" v-if="value.puesto_actual">
                                            <strong>Puesto</strong>
                                            <span class="btn btn-xs bg-green">ACTIVO</span>
                                          </td>
                                          <td style="text-align:center;" v-else>
                                            <span class="btn btn-xs bg-red">INACTIVO</span>
                                          </td>
                                          <td style="text-align:center;" v-if="value.jefe_actual">
                                            <strong>JEFATURA</strong>
                                            <span class="btn btn-xs bg-green">JEFE</span>
                                          </td>
                                          <td
                                            style="text-align:center;"
                                            v-else-if="value.jefe_temporal"
                                          >
                                            <strong>JEFATURA</strong>
                                            <span class="btn btn-xs bg-blue">Temporal</span>
                                          </td>
                                          <td style="text-align:center;" v-else>
                                            <strong>SIN JEFATURA</strong>
                                          </td>
                                        </tr>
                                      </tbody>
                                      <br v-bind:key="ind+100" />
                                    </template>
                                  </table>
                                </div>
                              </div>
                            </div>

                            <div class="timeline-footer" v-if="item.fin != null">
                              <span class="time">
                                Fecha de Finalización -
                                <i class="fa fa-calendar"></i>
                                {{ item.fin | moment("dddd DD, MMMM YYYY") }}
                              </span>
                            </div>
                          </div>
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="tab-pane" id="email">
                <div class="row">
                  <div class="col-md-12">
                    <ul class="timeline">
                      <template v-for="value in correos">
                        <li class="time-label" v-bind:key="value.id">
                          <span
                            class="bg-blue"
                          >{{ value.created_at | moment("dddd DD, MMMM YYYY") }}</span>
                        </li>
                        <li v-bind:key="value.email_empleado">
                          <i class="fa fa-envelope bg-blue"></i>

                          <div class="timeline-item">
                            <span class="time">
                              <i class="fa fa-clock-o"></i>
                              {{ value.created_at | moment("h:mm:ss a") }}
                            </span>

                            <h3 class="timeline-header" v-if="value.email_notificacion">
                              <span class="label label-success">Notificar</span>
                            </h3>

                            <div class="timeline-body">{{ value.email_empleado }}</div>

                            <div class="timeline-footer">
                              <a
                                class="btn btn-warning btn-xs"
                              >Modificado el {{ value.updated_at | moment("dddd DD, MMMM YYYY h:mm:ss a") }}</a>
                            </div>
                          </div>
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="tab-pane" id="medica">
                <div class="row">
                  <div class="col-md-12">
                    <div class="box box-info">
                      <div class="box-header">
                        <h3 class="box-title">Enfermedades</h3>
                      </div>

                      <div class="box-body no-padding">
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th class="text-center" style="width: 10px; font-size: 13px;">#</th>
                              <th class="text-center" style="width: 20px; font-size: 13px;">Nombre</th>
                              <th
                                class="text-center"
                                style="width: 60px; font-size: 13px;"
                              >Descripción</th>
                              <th class="text-center" style="width: 10px; font-size: 13px;">Creado</th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="(value,index) in enfermedades">
                              <tr v-bind:key="index">
                                <td
                                  class="text-center"
                                  style="vertical-align: middle; font-size: 11px;"
                                >{{ Number(index)+1 }}</td>
                                <td
                                  style="vertical-align: middle; font-size: 11px;"
                                >{{ value.nombre_enfermedad }}</td>
                                <td
                                  style="vertical-align: middle; font-size: 11px;"
                                >{{ value.descripcion_enfermedad }}</td>
                                <td
                                  style="vertical-align: middle; font-size: 11px;"
                                >{{ value.pivot.created_at | moment("dddd DD, MMMM YYYY h:mm:ss a") }}</td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="box box-info">
                      <div class="box-header">
                        <h3 class="box-title">Alergías</h3>
                      </div>

                      <div class="box-body no-padding">
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th class="text-center" style="width: 10px; font-size: 13px;">#</th>
                              <th class="text-center" style="width: 80px; font-size: 13px;">Nombre</th>
                              <th class="text-center" style="width: 10px; font-size: 13px;">Creado</th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="(value,index) in alergias">
                              <tr v-bind:key="index">
                                <td
                                  class="text-center"
                                  style="vertical-align: middle; font-size: 11px;"
                                >{{ Number(index)+1 }}</td>
                                <td
                                  style="vertical-align: middle; font-size: 11px;"
                                >{{ value.nombre_alergia }}</td>
                                <td
                                  style="vertical-align: middle; font-size: 11px;"
                                >{{ value.pivot.created_at | moment("dddd DD, MMMM YYYY h:mm:ss a") }}</td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane" id="referencia">
                <div class="row">
                  <template v-for="value in referencias">
                    <div class="col-sm-4" v-bind:key="value.id">
                      <div class="box box-widget widget-user-2">
                        <div class="widget-user-header bg-green">
                          <div class="widget-user-image">
                            <img class="img-circle" src="../../assets/logo.png" alt="familia" />
                          </div>
                          <h3
                            class="widget-user-username"
                          >{{ value.nombre1_referencia }} {{ value.nombre2_referencia }} {{ value.nombre3_referencia }} {{ value.apellido1_referencia }} {{ value.apellido2_referencia }} {{ value.apellido3_referencia }}</h3>
                          <h5
                            class="widget-user-desc"
                          >{{ value.historial_referencia_tipos_referencias.nombre_referencia }}</h5>
                        </div>
                        <div class="box-footer">
                          <ul class="list-group list-group-unbordered">
                            <li class="list-group-item">
                              {{ value.historial_referencia_tipo_telefono.nombre_telefono }}
                              <span class="pull-right badge bg-blue">{{ value.telefono_referencia }}</span>
                            </li>
                            <li class="list-group-item">
                              Creado
                              <span
                                class="pull-right badge bg-green"
                              >{{ value.created_at | moment("dddd DD, MMMM YYYY, h:mm:ss a") }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <div class="tab-pane" id="licencia">
                <div class="row">
                  <div class="col-md-12">
                    <ul class="timeline">
                      <template v-for="value in licencias">
                        <li class="time-label" v-bind:key="value.pivot.id">
                          <span
                            class="bg-blue"
                          >{{ value.pivot.created_at | moment("dddd DD, MMMM YYYY") }}</span>
                        </li>
                        <li v-bind:key="value.email_empleado">
                          <i class="fa fa-cc-amex bg-blue"></i>

                          <div class="timeline-item">
                            <span class="time">
                              <i class="fa fa-clock-o"></i>
                              {{ value.pivot.created_at | moment("h:mm:ss a") }}
                            </span>

                            <div class="timeline-body">{{ value.letra_licencia }}</div>
                          </div>
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal para mostrar categoria activos-->
    <div class="modal fade" id="cambio_contraseña" data-backdrop="static">
      <div class="modal-dialog modal-xs">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Cambiar Contraseña</h4>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <form>
              <div class="content">
                <b-card
                  border-variant="primary"
                  header="Cambio de Contraseña"
                  header-bg-variant="primary"
                  header-text-variant="white"
                  align="center"
                >
                  <form role="form">
                    <div class="box-body">
                      <form>
                        <div class="row">
                          <div class="form-group col-md-12 col-sm-12 col-lg-12">
                            <label for="password">Contraseña Actual</label>
                            <input
                              v-model="form.old_password"
                              type="password"
                              class="form-control"
                              ref="password"
                              id="password"
                              placeholder="ingrese contraseña anterior"
                              name="constraña_anterior"
                              v-validate="'required|min:6'"
                              :class="{'input':true,'has-errors': errors.has('constraña_anterior')}"
                            />
                            <FormError :attribute_name="'constraña_anterior'" :errors_form="errors"></FormError>
                          </div>
                          <div class="form-group col-md-12 col-sm-12 col-lg-12">
                            <label for="new_password">Nueva Contraseña</label>
                            <input
                              v-model="form.new_password"
                              type="password"
                              class="form-control"
                              ref="new_password"
                              id="new_password"
                              placeholder="ingrese contraseña"
                              name="nueva_contraseña"
                              v-validate="'required|min:6'"
                              :class="{'input':true,'has-errors': errors.has('nueva_contraseña')}"
                            />
                            <FormError :attribute_name="'nueva_contraseña'" :errors_form="errors"></FormError>
                          </div>

                          <div class="form-group col-md-12 col-sm-12 col-lg-12">
                            <label for="contraseña">Confirmar Nueva Contraseña</label>
                            <input
                              v-model="form.password_confirmation"
                              type="password"
                              class="form-control"
                              id="password_confirmation"
                              placeholder="ingrese contraseña"
                              name="password_confirmation"
                              v-validate="'required|confirmed:new_password'"
                              data-vv-as="new_password"
                            />
                            <FormError
                              :attribute_name="'password_confirmation'"
                              :errors_form="errors"
                            ></FormError>
                          </div>
                        </div>
                      </form>
                    </div>
                    <!-- /.box-body -->

                    <div class="box-footer pull-right">
                      <button type="button" class="btn btn-primary btn-xs" @click="beforeChange">
                        <i class="fa fa-save"></i> Cambiar
                      </button>
                      <button type="button" class="btn btn-danger btn-xs" @click="clearData">
                        <i class="fa fa-undo"></i> Cancelar
                      </button>
                    </div>
                  </form>
                </b-card>
              </div>
            </form>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">
              <i class="fa fa-undo"></i> Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import auth
import auth from "../../auth";
import moment from "moment";
import FormError from "../shared/FormError";
import { setInterval, clearInterval } from "timers";
export default {
  name: "Default",
  components: {
    FormError
  },
  data() {
    return {
      is_user_sci: false,
      isEmpleadoInfo: false,
      user: this.$store.state.user,
      empleado_id: this.$store.state.empleado.id,

      //Datos del empleado
      empleado: {},
      data: { estado: "" },
      correos: [],
      laborales: [],
      alergias: [],
      enfermedades: [],
      civiles: [],
      familias: [],
      referencias: [],
      residenciales: [],
      lenguajes: [],
      academicos: [],
      etnias: [],
      licencias: [],
      sangres: [],
      telefonos: [],
      fotografias: [],

      //rol: JSON.parse(localStorage.getItem('rol')),
      date: moment().format(),
      form: {
        empleado_id: null,
        old_password: "",
        new_password: "",
        password_confirmation: ""
      },
      counter: 5
    };
  },

  created() {
    let self = this;
    self.getAll();
    //self.getClient();
  },

  methods: {
    //datos del empleado
    getAll() {
      let self = this;
      self.loading = true;
      self.id = self.$route.params.id;
      self.$store.state.services.empleadoService
        .getEdit(self.empleado_id)
        .then(r => {
          r.data.data.forEach(function(item) {
            self.empleado.nombre1 = item.nombre1_empleado;
            self.empleado.nombre2 = item.nombre2_empleado;
            self.empleado.nombre3 = item.nombre3_empleado;
            self.empleado.apellido1 = item.apellido1_empleado;
            self.empleado.apellido2 = item.apellido2_empleado;
            self.empleado.apellido3 = item.apellido3_empleado;
            self.data.codigo_empleado = item.codigo_empleado;
            self.data.cui_empleado = item.cui_empleado;
            self.data.igss_empleado = item.igss_empleado;
            self.data.nacimiento_empleado = item.nacimiento_empleado;
            self.data.nit_empleado = item.nit_empleado;
            self.data.no_cuenta = item.no_cuenta;
            self.data.no_marcaje = item.no_marcaje;
            self.data.pasaporte = item.pasaporte;
            self.data.created_at = item.created_at;
            self.data.updated_at = item.updated_at;
            self.data.cuiextendido =
              item.empleado_cuiextendido.codigo_cui_extendido +
              " - " +
              item.empleado_cuiextendido.cui_municipio.municipio_departamento
                .nombre_departamento;
            self.data.estado = item.empleado_estado.nombre_estado;
            self.data.sexo = item.empleado_sexo.nombre_sexo;
            self.correos = item.empleado_historial_email;
            self.laborales = item.empleado_historiales_laborales;
            self.alergias = item.empleados_alergias;
            self.enfermedades = item.empleados_enfermedades;
            self.civiles = item.empleados_estados_civiles;
            self.familias = item.empleados_familias;
            self.referencias = item.empleados_historial_referencia;
            self.residenciales = item.empleados_historiales_residencias;
            self.lenguajes = item.empleados_lenguajes;
            self.academicos = item.empleados_niveles_academicos;
            self.etnias = item.empleados_religiones;
            self.licencias = item.empleados_tipos_licencias;
            self.sangres = item.empleados_tipos_sangres;
            self.telefonos = item.empleados_tipos_telefonos;
            self.fotografias = item.empleados_historial_fortografia;

            self.empleado.fotografia = null;
            item.empleados_historial_fortografia.forEach(function(foto) {
              if (foto.fotografia_activar) {
                self.empleado.fotografia = foto.fotografia_empleado;
                return;
              }
            });
          });

          self.loading = false;
        })
        .catch(r => {});
    },

    estado() {
      let self = this;
      let color = "primary";

      if (self.data.estado.toLowerCase() == "activo") color = "success";

      if (self.data.estado.toLowerCase() == "inactivo") color = "danger";

      return color;
    },

    change() {
      let self = this;
      var data = self.form;
      data.user_id = self.user.id;
      self.$store.state.services.userService
        .changePassword(data)
        .then(r => {
          if (r.response) {
            this.$toastr.error(r.response.data.error, "error");
            return;
          }

          $("#cambio_contraseña").modal("hide");
          self.setTimeClose();
        })
        .catch(e => {});
    },

    //funcion, validar si se guarda o actualiza
    beforeChange() {
      this.$validator.validateAll().then(result => {
        if (result) {
          self.change();
        }
      });

      let self = this;
    },

    clearData() {
      let self = this;
      Object.keys(self.form).forEach(function(key, index) {
        if (typeof self.form[key] === "string") self.form[key] = "";
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = false;
      });

      self.$validator.reset();
      self.$validator.reset();
    },

    setTimeClose() {
      let self = this;
      let timerInterval;
      self.$swal.fire({
        title: "Cambio contraseña",
        allowOutsideClick: () => false,
        customClass: "swal-wide",
        html:
          "Su contraseña se ha cambiado correctamente la sessión se cerrará en <strong></strong> segundos.<br/><br/>",
        timer: 5000,
        onBeforeOpen: () => {
          const content = self.$swal.getContent();
          const $ = content.querySelector.bind(content);
          self.$swal.showLoading();

          timerInterval = setInterval(() => {
            self.$swal.getContent().querySelector("strong").textContent = (
              self.$swal.getTimerLeft() / 1000
            ).toFixed(0);
          }, 100);
        },
        onClose: () => {
          clearInterval(timerInterval);
          auth.logout(self);
        }
      });
    }

    /*starCuentaAtras() {
      let self = this
      if(self.counter==0){
          
      }else{
          self.counter-=1;
          setInterval(self.starCuentaAtras,1000);
      }
    }*/
  },

  computed: {
    wrapper() {
      let self = this;
      return _.isEmpty(self.$store.state.sistema)
        ? "hold-transition lockscreen"
        : "content-wrapper";
    }
  },
  mounted() {
    let self = this;
    $("body").resize();
  }
};
</script>