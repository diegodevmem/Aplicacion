import Vue from "vue";
import Router from "vue-router";
import auth from "../auth";
import multiguard from "vue-router-multiguard";
import store from "../store/index";

/* SISTEMA SAU */
import Default from "@/components/Default";
import Login from "@/components/login/Login";
import Panel from "@/components/panel/Index";
import Usuario from "@/components/shared/Usuario";
import Roles from "@/components/shared/Roles";
import Rol from "@/components/admin/Rol";
import Sistema from "@/components/admin/Sistema";
import Configuracion from "@/components/admin/ConfiguracionSistema";
import Imagen from "@/components/admin/Imagen";
import Perfil from "@/components/shared/Perfil";
import NetWorkError from "@/components/shared/NetWorkError";
import Ayuda from "@/components/shared/Ayuda";
import Password2 from "@/components/admin/Password2";

//Catalogos
import DefaultCat from "@/components/catalogos/Default";
import CategoriaTramiteCat from "@/components/catalogos/categoria_tramite";
import TramiteCat from "@/components/catalogos/tramite";
import TipoTramiteCat from "@/components/catalogos/tipo_tramite";
import PasoCat from "@/components/catalogos/paso";
import UnidadTramiteCat from "@/components/catalogos/unidad_tramite";
import PrefijoExpedienteCat from "@/components/catalogos/prefijo_expediente";
import TipoCongelacionCat from "@/components/catalogos/tipo_congelacion";
import TipoRequisitoCat from "@/components/catalogos/tipo_requisito";
import FormatoDocumentoCat from "@/components/catalogos/formato_documento";
import RequisitoCat from "@/components/catalogos/requisito";
import TramiteRequisitoCat from "@/components/catalogos/tramite_requisito";
import CongelacionCat from "@/components/catalogos/congelacion";
import UnidadCat from "@/components/catalogos/unidad";
import ReasignacionReporte from "@/components/expediente/exp_reasignacion_reporte.vue";

//Expediente
import DefaultExp from "@/components/expediente/default";
import ExpedienteExp from "@/components/expediente/expediente";
import ReasignacionMasivaExp from "@/components/expediente/exp_reasignacion_masiva";
import CrearExpedienteExp from "@/components/expediente/crearExpediente/crear_expediente.vue";
import ActuacionExp from "@/components/expediente/actuacion";
import SeguimientoExp from "@/components/expediente/seguimiento";
import PersonasExp from "@/components/expediente/personas";
import TelefonoExp from "@/components/expediente/telefono";
import SeguimientoSiguienteExp from "@/components/expediente/seguimiento_siguiente";
import SeguimientoAtrasExp from "@/components/expediente/seguimiento_atras";
import DireccionrsExp from "@/components/expediente/direccionrs";
import CorreoExp from "@/components/expediente/correo";
import MisExpedientes from "@/components/expediente/mis_expediente";
import EstadoActuacion from "@/components/expediente/estado_actuacion";
import ExpedienteDocumento from "@/components/expediente/administracion_documentos/expediente_documento.vue";
import MisSeguimientoExp from "@/components/expediente/mis_expedientes/seguimiento.vue";
import EmpresaExp from "@/components/expediente/empresa";
import UpdateFile from "@/components/expediente/mis_expedientes/seguimiento";
import ExpCerrados from "@/components/expediente/exp_cerrados";
import ExpCongelados from "@/components/expediente/exp_congelados";
import ExpAdminUser from "@/components/expediente/exp_admin_user";
import exp_reasignacion from "@/components/expediente/exp_reasignacion";
import exp_add_docs from "@/components/expediente/exp_add_docs";
import exp_buscar from "@/components/expediente/exp_buscar";
import ActuacionMovimiento from "@/components/expediente/actuacion_movimiento";
import ActuacionFlujo from "@/components/expediente/actuacion_flujo";
import AdhesionUsuario from "@/components/expediente/adhesion_usuario";
import Quejas from "@/components/expediente/quejas.vue";
import FormProvidencia from "@/components/expediente/providencia/form_providencia.vue";

import ReporteSolExtern from "@/components/expediente/reporte_solicitudes_ext.vue";
import ReporteExpedientesTramite from "@/components/expediente/reporte_expedientes_tramite.vue";
import ReporteSolicitudesExpedientes from "@/components/expediente/reporte_sol_exp.vue";

import ReporteNotificaciones from "@/components/dashboard/reportes_usuario/reporte_notificaciones.vue";

import DefaultRpts from "@/components/reportes/default";
import GraficaRpts from "@/components/reportes/grafica";
import RptsEstatusExp from "@/components/reportes/estatus_exp";

import DefaultDash from "@/components/dashboard/default";
import Dash_view_grafica from "@/components/dashboard/vistas_reportes/dash_view_grafica";
import Reporte_congelados from "@/components/dashboard/reportes_usuario/reporte_datatable_congelados";
import Reporte_activos from "@/components/dashboard/reportes_usuario/reporte_datatable_activos";
import Reporte_exp_usuario from "@/components/dashboard/reportes_usuario/reporte_expedientes_usuario";

import Dash_view_data_table from "@/components/dashboard/vistas_reportes/dash_view_data_table";
//import Dash_grafica_semaforo from '@/components/dashboard/'

import notf_default from "@/components/notificaciones/default";
import notf_create_exp from "@/components/notificaciones/notf_create_exp";
import notf_create_manual from "@/components/notificaciones/notf_create_manual";
import notf_reg from "@/components/notificaciones/notf_reg";

import rrhh_default from "@/components/recursos/default";
import rrhh_evaluacion from "@/components/recursos/evaluacion";
import rrhh_solicitud_trabajo from "@/components/recursos/solicitud_trabajo";
import rrhh_reportes from "@/components/recursos/reportes";

import exp_solicitud_ext from "../components/expediente/externo/solicitud_externa/solicitud_externa.vue";
import cargaMasiva from "../components/expediente/externo/cargarMasiva/carga_masiva.vue";
import exp_solicitud_ver from "../components/expediente/externo/ver_solicitud/ver_solicitud.vue";

/* ================================================================================== */

Vue.use(Router);

//validar authenticacion
const isLoggedIn = (to, from, next) => {
  // console.log(auth.user.authenticated);
  return auth.user.authenticated ? next() : next("/login");
  //return next();
};

const isLoggedOut = (to, from, next) => {
  return auth.user.authenticated ? next("/panel") : next();
};

//proteger rutas admin_user
const isAdmin = (to, from, next) => {
  var user = store.state.user;
  return user.admin ? next() : next("/panel");
};

//proteger rutas de los sistema, verificar si tiene acceso
const permissionValidations = (to, from, next) => {
  var user = store.state.user;

  var sistemaEmpty = _.isEmpty(store.state.sistema); //verifica si estamos dentro de un sistema
  if (sistemaEmpty) {
    return next("/panel");
  } //si el sistema no esta seteado volvemos al panel de selección

  if (user.admin) {
    return next();
  } //validar super usuario
  // console.log("Route", store.state.permisos)
  var permisos = store.state.permisos; //obtener permisos del usuario
  var paths = to.path.split("/"); //obtener ruta base
  paths.shift(); //quitar primer elemento vacio de array
  var parameters = to.params; //obtener parameters

  if (!_.isEmpty(parameters)) {
    //si el objeto de parametros contiene elementos, eliminamos el ultimo elemento del array
    paths.pop();
  }
  var path = paths.join("/"); //crear la path
  var permiso = _.includes(permisos, path); //verificar si permiso existe

  return permiso
    ? next()
    : next(!sistemaEmpty ? store.state.sistema.path : "/panel"); //redireccionamos al home del sistema
};

var routes = [
  { path: "*", redirect: "/panel" },

  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: multiguard([isLoggedOut]),
  },
  {
    path: "/network_error",
    name: "NetWorkError",
    component: NetWorkError,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/ayuda",
    name: "Ayuda",
    component: Ayuda,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/panel",
    name: "Panel",
    component: Panel,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/password",
    name: "Password2",
    component: Password2,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/perfil/",
    name: "Perfil",
    component: Perfil,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/",
    name: "Default",
    component: Default,
    beforeEnter: multiguard([isLoggedIn, isAdmin]),
  },
  {
    path: "/sau_imagen",
    name: "Imagen",
    component: Imagen,
    beforeEnter: multiguard([isLoggedIn, isAdmin]),
  },
  {
    path: "/sau_rol",
    name: "Rol",
    component: Rol,
    beforeEnter: multiguard([isLoggedIn, isAdmin]),
  },
  {
    path: "/sau_sistema",
    name: "Sistema",
    component: Sistema,
    beforeEnter: multiguard([isLoggedIn, isAdmin]),
  },
  {
    path: "/sau_configuracion_sistema/:id",
    name: "Configuracion",
    component: Configuracion,
    beforeEnter: multiguard([isLoggedIn, isAdmin]),
  },

  {
    path: "/usuario",
    name: "Usuario",
    component: Usuario,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/roles",
    name: "Roles",
    component: Roles,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },

  //Catalogos
  {
    path: "/cat_default",
    name: "DefaultCat",
    component: DefaultCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_categoria_tramite",
    name: "CategoriaTramiteCat",
    component: CategoriaTramiteCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_tramite",
    name: "TramiteCat",
    component: TramiteCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_tipo_tramite",
    name: "TipoTramiteCat",
    component: TipoTramiteCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_paso",
    name: "PasoCat",
    component: PasoCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_unidad_tramite/:tramite",
    name: "UnidadTramiteCat",
    component: UnidadTramiteCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  // { path: '/cat_unidad_tramite/:tramite/:nombre', name: 'UnidadTramiteCat', component: UnidadTramiteCat, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
  {
    path: "/cat_prefijo_expediente",
    name: "PrefijoExpedienteCat",
    component: PrefijoExpedienteCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_tipo_congelacion",
    name: "TipoCongelacionCat",
    component: TipoCongelacionCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_tipo_requisito",
    name: "TipoRequisitoCat",
    component: TipoRequisitoCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_formato_documento",
    name: "FormatoDocumentoCat",
    component: FormatoDocumentoCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_requisito",
    name: "RequisitoCat",
    component: RequisitoCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  // { path: '/cat_tramite_requisito/:tramite/:nombre', name: 'TramiteRequisitoCat', component: TramiteRequisitoCat, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
  {
    path: "/cat_tramite_requisito/:tramite",
    name: "TramiteRequisitoCat",
    component: TramiteRequisitoCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/cat_congelacion",
    name: "CongelacionCat",
    component: CongelacionCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },

  {
    path: "/cat_unidad",
    name: "UnidadCat",
    component: UnidadCat,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },

  //Expediente
  {
    path: "/exp_default",
    name: "DefaultExp",
    component: DefaultExp,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_expediente",
    name: "ExpedienteExp",
    component: ExpedienteExp,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_reasignacion_masiva",
    name: "ReasignacionMasivaExp",
    component: ReasignacionMasivaExp,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_reporte_reasignacion",
    name: "ReasignacionReporte",
    component: ReasignacionReporte,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  // { path: '/crear/:pantalla/:numero_expediente/:tipo_tramite/:categoria/:expediente_id', name: 'CrearExpedienteExp', component: CrearExpedienteExp, beforeEnter: multiguard([isLoggedIn]) },
  {
    path: "/exp_crear_expediente",
    name: "CrearExpedienteExp",
    component: CrearExpedienteExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_actuaciones/:tipo_tramite/:numero_expediente/:expediente_id",
    name: "ActuacionExp",
    component: ActuacionExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/adhesion_usuario",
    name: "AdhesionUsuario",
    component: AdhesionUsuario,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_quejas",
    name: "Quejas",
    component: Quejas,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_providencia",
    name: "FormProvidencia",
    component: FormProvidencia,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/reporte_expedientes_tramite",
    name: "ReporteExpedientesTramite",
    component: ReporteExpedientesTramite,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/reporte_solicitudes_externas_expediente",
    name: "ReporteSolicitudesExpedientes",
    component: ReporteSolicitudesExpedientes,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/reporte_solicitudes_externas",
    name: "ReporteSolExtern",
    component: ReporteSolExtern,
    beforeEnter: multiguard([isLoggedIn]),
  },

  // { path: '/exp_seguimiento/:tipo_tramite/:numero_expediente/:codigo_barra/:actuacion_id/:expediente_id', name: 'SeguimientoExp', component: SeguimientoExp, beforeEnter: multiguard([isLoggedIn]) },
  {
    path: "/exp_personas",
    name: "PersonasExp",
    component: PersonasExp,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_telefono/:razon_social_id/:razon_social",
    name: "TelefonoExp",
    component: TelefonoExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path:
      "/exp_seguimiento_siguiente/:paso/:unidad/:siguiente_paso/:codigo_barra/:actuacion/:unidad_paso/:tipo_tramite_id/:numero_expediente/:expediente_id/:adjuntar",
    name: "SeguimientoSiguienteExp",
    component: SeguimientoSiguienteExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path:
      "/exp_seguimiento_atras/:paso/:unidad/:siguiente_paso/:codigo_barra/:actuacion/:unidad_paso/:tipo_tramite_id/:numero_expediente/:expediente_id/:adjuntar",
    name: "SeguimientoAtrasExp",
    component: SeguimientoAtrasExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_direccionrs/:razon_social_id/:razon_social",
    name: "DireccionrsExp",
    component: DireccionrsExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_correo/:razon_social_id/:razon_social",
    name: "CorreoExp",
    component: CorreoExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_mis_expedientes",
    name: "MisExpedientes",
    component: MisExpedientes,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_estado_expediente",
    name: "EstadoActuacion",
    component: EstadoActuacion,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_expediente_documento",
    name: "ExpedienteDocumento",
    component: ExpedienteDocumento,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_mis_seguimiento/:codigo_barra/:actuacion_id/:expediente_id",
    name: "MisSeguimientoExp",
    component: MisSeguimientoExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_empresa",
    name: "EmpresaExp",
    component: EmpresaExp,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_cerrados",
    name: "ExpCerrados",
    component: ExpCerrados,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_congelados",
    name: "ExpCongelados",
    component: ExpCongelados,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_admin_user",
    name: "ExpAdminUser",
    component: ExpAdminUser,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_reasignacion",
    name: "exp_reasignacion",
    component: exp_reasignacion,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_add_docs",
    name: "exp_add_docs",
    component: exp_add_docs,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/exp_buscar",
    name: "exp_buscar",
    component: exp_buscar,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },

  // { path: '/exp_actuacion_movimiento', name: 'actuacion_movimiento', component: ActuacionMovimiento, beforeEnter: multiguard([isLoggedIn, permissionValidations]) },
  {
    path: "/exp_actuacion_movimiento/:exp",
    name: "actuacion_movimiento",
    component: ActuacionMovimiento,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/exp_actuacion_flujo/:codigo",
    name: "actuacion_flujo",
    component: ActuacionFlujo,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/exp_solicitud_ext",
    name: "exp_solicitud_ext",
    component: exp_solicitud_ext,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  { path: "/cargaMasiva", name: "cargaMasiva", component: cargaMasiva },
  {
    path: "/exp_solicitud_ver/:datos_solicitud",
    name: "exp_solicitud_ver",
    component: exp_solicitud_ver,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/rpts_default",
    name: "DefaultRpts",
    component: DefaultRpts,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/rpts_grafica",
    name: "GraficaRpts",
    component: GraficaRpts,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/rpts_estatus_expediente",
    name: "RptsEstatusExp",
    component: RptsEstatusExp,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/rpts_exp_congelados",
    name: "dash_view_data_table",
    component: Reporte_congelados,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/rpts_exp_activos",
    name: "dash_view_data_table",
    component: Reporte_activos,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/rpts_exp_usuario",
    name: "ReporteExpUsuario",
    component: Reporte_exp_usuario,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path: "/reporte_notificaciones",
    name: "ReporteNotificaciones",
    component: ReporteNotificaciones,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/dash_default",
    name: "DefaultDash",
    component: DefaultDash,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/dash_dashboard",
    name: "DefaultDash",
    component: DefaultDash,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/dash_grafica",
    name: "GraficaRpts",
    component: GraficaRpts,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/dash_estatus_expediente",
    name: "RptsEstatusExp",
    component: RptsEstatusExp,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  //reportes del dashboard utlizadas como vistas
  {
    path:
      "/dash_view_grafica/:tipo/:unidad/:consolidado/:reporte/:abreviatura/:fechaInicial/:fechaFinal/:tipo_reporte",
    name: "dash_view_grafica",
    component: Dash_view_grafica,
    beforeEnter: multiguard([isLoggedIn]),
  },
  {
    path:
      "/dash_view_datatable/:reporte/:pertenece/:fields/:tipo/:unidad/:consolidado/:abreviatura/:fechaInicial/:fechaFinal/:tipo_reporte",
    name: "dash_view_data_table",
    component: Dash_view_data_table,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/notf_default",
    name: "notf_default",
    component: notf_default,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/notf_create_exp",
    name: "notf_create_exp",
    component: notf_create_exp,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/notf_create_manual",
    name: "notf_create_manual",
    component: notf_create_manual,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/notf_reg",
    name: "notf_reg",
    component: notf_reg,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/notf_docs",
    name: "ExpedienteDocumento",
    component: ExpedienteDocumento,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },

  {
    path: "/update_file/:razon_social_id/:razon_social",
    name: "UpdateFile",
    component: UpdateFile,
    beforeEnter: multiguard([isLoggedIn]),
  },

  {
    path: "/rrhh_default",
    name: "rrhh_default",
    component: rrhh_default,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/rrhh_evaluacion",
    name: "rrhh_jefe",
    component: rrhh_evaluacion,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/rrhh_solicitud_trabajo",
    name: "rrhh_a1",
    component: rrhh_solicitud_trabajo,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
  {
    path: "/rrhh_reportes",
    name: "rrhh_reportes",
    component: rrhh_reportes,
    beforeEnter: multiguard([isLoggedIn, permissionValidations]),
  },
];

const router = new Router({ routes });

export default router;
