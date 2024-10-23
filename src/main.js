// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
import Multiselect from 'vue-multiselect'
import VueFormWizard from 'vue-form-wizard'
import VueTabs from 'vue-nav-tabs'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import Vue2Filters from 'vue2-filters'
import VueHtml2Canvas from 'vue-html2canvas'
import VueI18n from 'vue-i18n' //needed for calendar locale
window.convertir=require('numero-a-letras');

Vue.config.productionTip = false
Vue.config.devtools=false

import VueNumeric from 'vue-numeric'
Vue.use(VueNumeric)

import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/css/index.css';

import VuejsPaginate from 'vuejs-paginate'

Vue.component('paginate', VuejsPaginate)

Vue.use(Tooltip);

Vue.use(VCalendar)

//import 'vue-orgchart/dist/style.css'

import VueApexCharts from 'vue-apexcharts'
Vue.component('apexchart', VueApexCharts)

// register globally
Vue.component('multiselect', Multiselect)


//registrar vueFormWizard
Vue.use(VueFormWizard)
//registrar vue nav tabs
Vue.use(VueTabs)
//registrar autocomplete
Vue.use(Autocomplete)


//bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'

//multiselect
import '../static/vue-multiselect.min.css'

//vue-form-wizard
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
//vue nav tabs
import 'vue-nav-tabs/themes/vue-tabs.css'
//autocomplete
import '@trevoreyre/autocomplete-vue/dist/style.css'

// adminLTE
import './dist/css/skins/_all-skins.min.css'
import './dist/css/AdminLTE.css'
import './dist/js/app.min.js'
import './dist/js/adminlte.min.js'

//font-awesome
import 'font-awesome/css/font-awesome.css'

// App
import App from './App'

// Vue Router
import router from './router'

// Vuex: for services, shared components, etc
import store from './store/index'

// Our Style
import '../static/style.css'
import '../static/cssfile.css'

//import auth
import auth from './auth'

//import toastr
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'

//validators
import VeeValidate from 'vee-validate'

// Element Ui
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/es'
import 'element-ui/lib/theme-chalk/index.css'

//form-select
import { FormSelect } from 'bootstrap-vue/es/components'
import _ from 'lodash'

import "babel-polyfill"
Vue.use(VueHtml2Canvas);

//lodash
Vue.use(_)
// verificamos el estado del usuario
// auth.checkAuth()

Vue.use(Tooltip)
Vue.use(BootstrapVue)
Vue.config.productionTip = false
window.toastr = require('toastr')
Vue.use(VueToastr2,{"closeButton": true,})
Vue.use(Vue2Filters)

// es2015 module
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import VueMask from 'v-mask'
Vue.use(VueMask);
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

const VueValidationEs = require('vee-validate/dist/locale/es');

const config = {
  locale: 'es',
  validity: true,
  dictionary: {
    es: VueValidationEs
  },
  fieldsBagName: 'campos',
  errorBagName: 'errors', // change if property conflicts
};

Vue.use(VeeValidate, config);
Vue.use(FormSelect)

Vue.use(Element, {
  locale
})

import VueSweetalert2 from 'vue-sweetalert2'

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
  confirmButtonText: "Confirmar",
  cancelButtonText: "Cancelar"
}

Vue.use(VueSweetalert2,options)

// MomentJs for Vue
const moment = require('moment')
require('moment-business-days')

Vue.use(require('vue-moment'), {
    moment
})

import VModal from 'vue-js-modal'

Vue.use(VModal)


window.events = new Vue();

Vue.prototype.$eventHub = new Vue(); // Global event bus

export default {
  mixins: [Vue2Filters.mixin],
}

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)


import FullCalendar from 'vue-full-calendar'
Vue.use(FullCalendar)
import 'fullcalendar/dist/fullcalendar.css'

import MonthPicker from 'vue-month-picker'
import MonthPickerInput from 'vue-month-picker'

Vue.use(MonthPicker)
Vue.use(MonthPickerInput)

import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
Vue.component('vue-phone-number-input', VuePhoneNumberInput);

import VueMermaid from 'vue-mermaid'
Vue.use(VueMermaid)

//Gráficas
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
Vue.use(HighchartsVue)
import exportingInit from 'highcharts/modules/exporting'
exportingInit(Highcharts)


import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  template: '<App/>',
  components: {
    App,
   
  }
})
