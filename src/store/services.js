import Axios from "axios";
import VueCookies from "vue-cookies";
import store from "./index";
import auth from "../auth";
import moment from "moment";
import { isNullOrUndefined } from "util";

import AuthService from "../services/login/AuthService";
import UserService from "../services/admin/UserService";
import ImagenService from "../services/admin/ImagenService";

import RolService from "../services/admin/RolService";
import SistemaService from "../services/admin/SistemaService";
import RolSistemaService from "../services/admin/RolSistemaService";
import MenuService from "../services/admin/MenuService";
import SistemaPropietarioService from "../services/admin/PropietarioService";
import router from "../router";

import PasswordService from "../services/admin/PasswordService";

/* ====================================== SERVICIOS PARA CATALOGOS =============================== */
import municipio from "../services/catalogo/municipioService";
import categoria_tramite from "../services/catalogo/categoria_tramiteService";
import tramite from "../services/catalogo/tramiteService";
import tipo_tramite from "../services/catalogo/tipo_tramiteService";
import unidad_tramite from "../services/catalogo/unidad_tramiteService";
import tipo_requisito from "../services/catalogo/tipo_requisitoService";
import tipo_congelacion from "../services/catalogo/tipo_congelacionService";
import congelacion from "../services/catalogo/congelacionService";
import requisito from "../services/catalogo/requisitoService";
import tramite_requisito from "../services/catalogo/tramite_requisitoService";
import formato_documento from "../services/catalogo/formato_documentoService";
import paso from "../services/catalogo/pasoService";
import unidad_paso from "../services/catalogo/unidad_pasoService";
import prefijo_expediente from "../services/catalogo/prefijo_expedienteService";
import unidad_tramite_congelacion from "../services/catalogo/unidad_tramite_congelacionService";
import unidad_paso_rol from "../services/catalogo/unidad_paso_rolService";
import tipo_documento from "../services/catalogo/tipo_documentoService";
import unidad from "../services/catalogo/unidadService";
import unidadpadre from "../services/catalogo/unidadpadreService";
import unidaddireccion from "../services/catalogo/unidaddireccionService";
import congelacionNuevoService from "../services/catalogo/congelacionNuevoService";
import descongelacionNuevoService from "../services/catalogo/descongelacionNuevoService";

/* ====================================== SERVICIOS PARA EXPEDIENTE =============================== */
import adhesion_usuario from "../services/expediente/adhesionService";
import quejas from "../services/expediente/quejasService";
import expediente from "../services/expediente/expedienteService";
import actuacion from "../services/expediente/actuacionService";
import seguimiento_actuacion from "../services/expediente/seguimientoActuacionService";
import documento_actuacion from "../services/expediente/documentoActuacionService";
import personas from "../services/expediente/personasService";
import telefono from "../services/expediente/telefonoService";
import razon_social from "../services/expediente/razonSocialService";
import representacion from "../services/expediente/representacionService";
import direccionrs from "../services/expediente/direccionrsService";
import correo from "../services/expediente/correoService";
import estado_actual from "../services/expediente/estadoActualService";
import caratula_expediente from "../services/expediente/caratulaService";
import administracion_expediente from "../services/expediente/administracionExpedientesService";
import empresa from "../services/expediente/empresaService";
import representante_actuacion from "../services/expediente/representanteActuacionService";
import grafica from "../services/expediente/graficaService";
import requisitospendientes from "../services/expediente/requisitospendientesService";
import userAdmService from "../services/expediente/userAdmService";
import reasignacionService from "../services/expediente/reasignacionService";
import reporteEmailService from "../services/expediente/reporteEmailService";
import buscarExpedienteService from "../services/expediente/buscarExpedienteService";
import reporteSolicitudesService from "../services/expediente/reporteSolicitudesService";

import newExpedienteService from "../services/newExp/newExpedienteService";

/* ====================================== SERVICIOS EXTERNOS =============================== */

import solicitudService from "../services/externo/solicitudService";

/* ====================================== SERVICIOS PARA NOTIFICACIONES =============================== */
import notificacionesService from "../services/notificaciones/notificacionesService";
import notificacionValidacionService from "../services/notificaciones/notificacionesValidacionService";

// RECURSOS HUMANOS
import evaluacionService from "../services/recursos/evaluacionService";
import reporteListadoService from "../services/recursos/reporteria/reporteListadoService";

import razonSocialNewService from "../services/expediente/razonSocialNewService";

import documentosService from "../services/expediente/documentosService";
import reportesService from "../services/expediente/reportesService";
import reporteNotificacionesService from "../services/notificaciones/reporteNotificacionesService";

let baseUrl = process.env.ROOT_API;
baseUrl = baseUrl.toString();
//base url para desarrollo local
// let baseUrl = 'http://127.0.0.1:8001/serviciosMEM/public/'
// let baseUrl = 'http://172.22.1.34:8001/serviciosMEM/public/'
// base url para servidor prueba piloto
// let baseUrl = 'http://192.168.1.56:8008/'
// let baseUrl = 'http://172.22.1.8:8008/'

let authToken = $cookies.get("token_data");

// Axios Configuration
Axios.defaults.headers.common.Accept = "application/json";
if (authToken !== null) {
  Axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
}

Axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // if to see if the error can catch code: 'ERR_NETWORK'
    if (error.code === "ECONNABORTED") {
      // router.push("/network_error");
      toastr.error("Error de conexión", "Advertencia");
      return;
    } else if (error.response.status === 404) {
      toastr.warning(error.response.data.error, "Advertencia");
      console.log("RETURN 404");
      return;
    } else if (error.response.status === 401) {
      setTimeout(() => {
        auth.noAcceso();
      }, 1000);

      console.log("RETURN 401");
    } else {
      if (typeof error.response.data.error === "object") {
        for (let value of Object.values(error.response.data.error)) {
          toastr.error(value, "Advertencia");
          console.log("RETURN ERROR");
        }
      } else if (
        typeof error.response.data.error !== "object" &&
        error.response.status === 422
      ) {
        toastr.info(error.response.data.error, "Advertencia");
        console.log("RETURN 442");
        return;
      } else if (error.response.status === 403) {
        toastr.error(error.response.data.error, "Advertencia");
        console.log("RETURN PANEL");
        router.push("/panel");
      }
    }
    return error;
  }
);

function preguntarSession() {
  Axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response.status === 401) {
        var token_data = $cookies.get("token_data");
        if (isNullOrUndefined(token_data)) {
          return error;
        }

        var original_request = error.config;
        return refreshToken().then(res => {
          auth.saveToken(res.data);
          original_request.headers["Authorization"] =
            "Bearer " + res.data.access_token;
          return Axios.request(original_request);
        });
      }

      return error;
    }
  );
}

function refreshToken() {
  var data = auth.getRefreshToken();
  return new Promise(function(resolve, reject) {
    instance
      .post(baseUrl + "oauth/token", data)
      .then(r => {
        resolve(r);
      })
      .catch(e => {
        reject(r);
      });
  });
}

export default {
  //admin user
  authService: new AuthService(Axios, baseUrl),
  userService: new UserService(Axios, baseUrl),
  rolService: new RolService(Axios, baseUrl),
  sistemaService: new SistemaService(Axios, baseUrl),
  rolSistemaService: new RolSistemaService(Axios, baseUrl),
  sistemaPropietarioService: new SistemaPropietarioService(Axios, baseUrl),
  menuService: new MenuService(Axios, baseUrl),
  imagenService: new ImagenService(Axios, baseUrl),
  PasswordService: new PasswordService(Axios, baseUrl),

  //catalogo
  municipioService: new municipio(Axios, baseUrl),
  categoriatramiteService: new categoria_tramite(Axios, baseUrl),
  tramiteService: new tramite(Axios, baseUrl),
  tipotramiteService: new tipo_tramite(Axios, baseUrl),
  unidadtramiteService: new unidad_tramite(Axios, baseUrl),
  tiporequisitoService: new tipo_requisito(Axios, baseUrl),
  tipocongelacionService: new tipo_congelacion(Axios, baseUrl),
  congelacionService: new congelacion(Axios, baseUrl),
  requisitoService: new requisito(Axios, baseUrl),
  tramiterequisitoService: new tramite_requisito(Axios, baseUrl),
  formatodocumentoService: new formato_documento(Axios, baseUrl),
  pasoService: new paso(Axios, baseUrl),
  prefijoexpedienteService: new prefijo_expediente(Axios, baseUrl),
  unidadpasoService: new unidad_paso(Axios, baseUrl),
  unidadtramitecongelacionService: new unidad_tramite_congelacion(
    Axios,
    baseUrl
  ),
  unidadpasorolService: new unidad_paso_rol(Axios, baseUrl),
  tipodocumentoService: new tipo_documento(Axios, baseUrl),
  unidadService: new unidad(Axios, baseUrl),
  unidadpadreService: new unidadpadre(Axios, baseUrl),
  unidaddireccionService: new unidaddireccion(Axios, baseUrl),
  congelacionNuevoService: new congelacionNuevoService(Axios, baseUrl),
  descongelacionNuevoService: new descongelacionNuevoService(Axios, baseUrl),

  //expediente
  adhesionService: new adhesion_usuario(Axios, baseUrl),
  quejasService: new quejas(Axios, baseUrl),
  expedienteService: new expediente(Axios, baseUrl),
  actuacionService: new actuacion(Axios, baseUrl),
  seguimientoactuacionService: new seguimiento_actuacion(Axios, baseUrl),
  documentoactuacionService: new documento_actuacion(Axios, baseUrl),
  personasService: new personas(Axios, baseUrl),
  telefonoService: new telefono(Axios, baseUrl),
  razonsocialService: new razon_social(Axios, baseUrl),
  representacionService: new representacion(Axios, baseUrl),
  direccionrsService: new direccionrs(Axios, baseUrl),
  correoService: new correo(Axios, baseUrl),
  estadoactualService: new estado_actual(Axios, baseUrl),
  caratulaexpedienteService: new caratula_expediente(Axios, baseUrl),
  administracionexpedienteService: new administracion_expediente(
    Axios,
    baseUrl
  ),
  empresaService: new empresa(Axios, baseUrl),
  representanteactuacionService: new representante_actuacion(Axios, baseUrl),
  graficaService: new grafica(Axios, baseUrl),
  requisitospendientesService: new requisitospendientes(Axios, baseUrl),
  userAdmService: new userAdmService(Axios, baseUrl),
  reasignacionService: new reasignacionService(Axios, baseUrl),
  reporteEmailService: new reporteEmailService(Axios, baseUrl),
  buscarExpedienteService: new buscarExpedienteService(Axios, baseUrl),
  newExpedienteService: new newExpedienteService(Axios, baseUrl),
  razonSocialNewService: new razonSocialNewService(Axios, baseUrl),
  reporteNotificacionesService: new reporteNotificacionesService(Axios, baseUrl),
  reportesService: new reportesService(Axios, baseUrl),
  reporteSolicitudesService: new reporteSolicitudesService(Axios, baseUrl),
  documentosService: new documentosService(Axios, baseUrl),

  // externo
  solicitudService: new solicitudService(Axios, baseUrl),

  // notificaciones
  notificacionesService: new notificacionesService(Axios, baseUrl),
  notificacionValidacionService: new notificacionValidacionService(
    Axios,
    baseUrl
  ),

  // recursos
  evaluacionService: new evaluacionService(Axios, baseUrl),
  reporteListadoService: new reporteListadoService(Axios, baseUrl)
};
