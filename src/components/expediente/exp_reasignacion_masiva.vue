<template>
  <v-app>
    <div>
      <div class="content-wrapper" v-loading="loading">
        <div v-if="isUserAuthorized">
          <div class="p-5">
            <div
              class="v-banner text-center v-sheet theme--light primary"
              style="color: white; letter-spacing: 2px; font-weight: bold; font-size: 1.3rem; border-top-left-radius: 10px; border-top-right-radius: 10px;"
            >
              <div class="v-banner__wrapper">
                <div class="v-banner__content">
                  <div class="v-banner__text">
                    Reasignación Masiva de Expedientes
                  </div>
                </div>
              </div>
            </div>
            <div class="v-card v-sheet theme--light">
              <div class="row" style="padding: 10px;">
                <div class="col-lg-9 col">
                  <span style="padding: 5px;">
                    A Continuación debe marcar las casillas como se muestra en
                    este ejemplo
                    <i
                      aria-hidden="true"
                      class="v-icon notranslate material-icons theme--light"
                      >check_box</i
                    >
                    <strong style="color: red;"
                      >para reasignar el/los expedientes</strong
                    >
                    <i
                      aria-hidden="true"
                      class="v-icon notranslate material-icons theme--light"
                      >info</i
                    >
                  </span>
                </div>
                <div class="d-flex justify-end col">
                  <button
                    type="button"
                    :class="{
                      reassign_button_enabled: !isOptionSelected,
                      reassign_button_disabled: isOptionSelected
                    }"
                    :disabled="isOptionSelected"
                    class="v-btn reassign_button"
                    style="color: white;"
                    @click="openModalForm()"
                  >
                    <span>
                      Reasignar<i
                        aria-hidden="true"
                        class="v-icon material-icons p-2 "
                        style="color:white"
                        >sync_problem</i
                      >
                    </span>
                    <span
                      class="bg-yellow pl-1 pr-1 pt-0 rounded-pill"
                      style=""
                    >
                      {{ selectedItemsCounter }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <v-container>
              <v-divider></v-divider>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
                <button
                  type="button"
                  @click="downloadPdfReport"
                  class="m-2 v-btn v-btn--is-elevated v-btn--fab v-btn--has-bg v-btn--round theme--light v-size--small"
                  style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255);"
                >
                  <span class="v-btn__content"
                    ><i
                      aria-hidden="true"
                      class="v-icon notranslate material-icons theme--light"
                      >picture_as_pdf</i
                    ></span
                  >
                </button>
                <button
                  type="button"
                  @click="downloadExcelReport"
                  class="m-2 v-btn v-btn--is-elevated v-btn--fab v-btn--has-bg v-btn--round theme--light v-size--small"
                  style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255);"
                >
                  <span class="v-btn__content"
                    ><i
                      aria-hidden="true"
                      class="v-icon notranslate material-icons theme--light"
                      >table_chart</i
                    ></span
                  >
                </button>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="expedientes"
                :loading="loading"
                class="elevation-1"
                item-selectable="selectable"
              >
                <template v-slot:item.selected="{ item }">
                  <td>
                    <v-checkbox
                      v-model="item.selected"
                      @click="selectItem(item)"
                    ></v-checkbox>
                  </td>
                </template>
                <template v-slot:header.selected>
                  <th>
                    <v-checkbox
                      v-model="selectAll"
                      @change="selectAllItems"
                    ></v-checkbox>
                  </th>
                </template>
                <template v-slot:item.notificacion_electronica="{ item }">
                  <strong>
                    <p style="text-align: center; justify-content: center;">
                      {{ item.notificacion_electronica === true ? "Si" : "No" }}
                    </p></strong
                  >
                </template>
                <template v-slot:item.congelado="{ item }">
                  <td>
                    <span :class="getStateTagClass(item.congelado)">
                      {{ item.congelado ? "Congelado" : "Activo" }}
                    </span>
                  </td>
                </template>
              </v-data-table>
            </v-container>
          </div>
        </div>
        <div v-else>
          <rechazado></rechazado>
        </div>
      </div>
    </div>
    <v-dialog max-width="50%" v-model="modal_form" @click:outside="closeDialog">
      <v-card class="p-4" height="auto">
        <div class="d-flex align-items-center ">
          <v-card-title class="mr-auto ml-auto mt-4 p-2 text-center">
            <span class="text-h5 text-center"
              >¿Desea reasignar los expedientes seleccionados?</span
            >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">error</v-icon>
              </template>
              <!--<span> tooltip for complaint creation </span>-->
            </v-tooltip>
          </v-card-title>
          <v-btn
            small
            class="btn bg-red btn-circle btn-sm pull-right mr-2 mt-2"
            @click="closeDialog"
          >
            <v-icon>cancel</v-icon>
          </v-btn>
        </div>

        <v-card-text class="text-center">
          <span style="font-weight: bold; font-size: 1rem;">
            A continuación
            <span style="color: red;">
              enviará un correo electrónico y asignará 1 expediente(s)</span
            >
            a la persona seleccionada.</span
          >
        </v-card-text>

        <div class="mt-4">
          <div class="row mr-8 ml-8">
            <v-col>
              <v-select
                :rules="userRules"
                v-model="body_reasignacion.usuario_id"
                label="Usuario a reasignar"
                placeholder="Seleccione el usuario a reasignar"
                :items="users"
                item-text="nombre_completo"
                item-value="id"
              >
              </v-select>
            </v-col>
          </div>
          <div class="row mr-8 ml-8">
            <v-col>
              <v-textarea
                :rules="motiveRules"
                v-model="body_reasignacion.motivo_reasignacion"
                label="Motivo de reasignación"
                placeholder="Escriba el motivo de la reasignación por favor"
                rows="4"
              >
              </v-textarea>
            </v-col>
          </div>
        </div>
        <v-spacer></v-spacer>
        <!-- <v-divider></v-divider> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeDialog">
            Cancelar
          </v-btn>
          <v-btn
            :loading="loading_request"
            color="blue darken-1"
            text
            @click="sendReassignation"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </v-app>
  <!-- <RestrictedView v-else></RestrictedView> -->
</template>
<script>
import RestrictedView from "../shared/Rechazado";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Rechazado from "../shared/Rechazado";
import { objectFindNestedKey } from "../../utils/json.utils";

export default {
  name: "exp_reasignacion_masiva",
  components: {
    Rechazado
  },
  data: () => ({
    loading: false,
    loading_request: false,
    size: false,
    headers: [
      { text: "", value: "selected", sortable: false },
      { value: "exp_num", text: "Número de Expediente", sortable: true },
      { value: "codigo_barra", text: "Código de barra", sortable: true },
      { value: "congelado", text: "Estado", sortable: true },
      { value: "u_nombre", text: "Usuario Asignado", sortable: true },
      {
        value: "notificacion_electronica",
        text: "Notificación Electrónica"
      },

      {
        value: "nombre_expediente",
        text: "Nombre del Expediente",
        sortable: true
      },
      { value: "ubicacion", text: "Ubicación", sortable: true }
    ],
    search: "",
    expedientes: [],
    selectedItems: [],
    selectAll: false,
    selectedItemsCounter: 0,
    modal_form: false,
    users: [],
    body_reasignacion: {
      usuario_id: null,
      expedientes: [],
      motivo_reasignacion: ""
    },
    userRoles: [],
    isUserAuthorized: false,
    userRules: [v => !!v || "Usuario es requerido"],
    motiveRules: [v => !!v || "Motivo de reasignación es requerido"]
  }),

  async created() {
    await this.getUserRoles();
    await this.getExpedientes();
  },

  watch: {
    selectedItems: {
      handler(newSelectedItems) {
        this.selectedItemsCounter = newSelectedItems.length;
      },
      deep: true
    },
    search(val) {
      console.log(val);
      const filtered = this.allExpedientes.filter(item => {
        // It gotta be able to look in: exp_num, codigo_barra, u_nombre, nombre_expediente, ubicacion
        return (
          this.tableFilter(item, val, [
            "exp_num",
            "codigo_barra",
            "u_nombre",
            "nombre_expediente",
            "ubicacion"
          ])

        ) 
        // return (
        //   item.exp_num.toLowerCase().includes(val) ||
        //   item.codigo_barra.toLowerCase().includes(val) ||
        //   item.u_nombre.toLowerCase().includes(val) ||
        //   item.nombre_expediente.toLowerCase().includes(val)
        //   // || item.ubicacion.toLowerCase().includes(val)
        // );
      });
      this.expedientes = filtered;
      // this.selectedItems = [];
      // this.expedientes = this.expedientes.map(item => ({
      //   ...item,
      //   selected: false
      // }));
    }
  },

  computed: {
    isOptionSelected() {
      return !this.selectedItems.length > 0;
    }
  },
  methods: {
    tableFilter(
      item,
      filter,
      headings
    ) {
      let hasCoincidence = false;
      headings.forEach(heading => {
        if (hasCoincidence) return;
        hasCoincidence = String(objectFindNestedKey(item, heading))
          .toLocaleLowerCase()
          .includes(filter.toLowerCase());
      });
      return hasCoincidence;
    },

    async getUserRoles() {
      try {
        this.loading = true;
        let r = await this.$store.state.services.administracionexpedienteService.getRol();
        if (r.data.length === 0) {
          this.userRoles = [
            { rol_id: 1, rol_nombre: "Adm", sistema_nombre: "EXP" }
          ];
        } else {
          // userRoles get all the roles from the user
          this.userRoles = r.data;
          this.userRoles = r.data.filter(x => x.sistema_nombre === "EXP");
          this.userRoles = this.userRoles.filter(
            x =>
              x.rol_id < 5 || r.rol_id === 14 || x.rol_id == 6 || x.rol_id == 18
          );
          // isUserAuthorized is a boolean that validates if the user has a valid role
          this.isUserAuthorized = this.userRoles.length > 0;
          console.log("User is authorized? " + this.isUserAuthorized);
        }
        this.loading = false;
      } catch (error) {
        this.$toastr.error(
          "Ocurrió un problema al obtener los roles",
          "Mensaje"
        );
      }
    },

    async sendReassignation() {
      this.body_reasignacion.expedientes = this.selectedItems;
      if (
        this.body_reasignacion.motivo_reasignacion.trim() == "" ||
        this.body_reasignacion.usuario_id == null
      ) {
        this.$toastr.warning("Debe ingresar los campos requeridos.");
      } else {
        this.loading_request = true;

        try {
          await this.$store.state.services.reasignacionService
            .postMassiveReasignation(this.body_reasignacion)
            .then(r => {
              this.loading_request = false;
              this.$toastr.success("Expedientes reasignados correctamente");
              //Clean the user select and the motive and the counter
              this.body_reasignacion.usuario_id = null;
              this.body_reasignacion.motivo_reasignacion = "";
              this.selectedItems = [];
              this.getExpedientes();
              this.closeDialog();
            })
            .catch(e => {
              console.log(e);
              this.loading_request = false;
            });
        } catch (error) {
          console.log(error);
          this.loading_request = false;
        }
      }
      this.loading_request = false;
    },

    selectItem(value) {
      console.log(value);
      this.allExpedientes = this.allExpedientes.map(item => {
        if (item.exp_num === value.exp_num) {
          item.selected = value.selected;
        }
        return item;
      });
      this.selectedItems = this.allExpedientes.filter(item => item.selected);
      console.log(this.selectedItems);
    },

    async uploadFile() {},

    async getExpedientes() {
      const r = await this.$store.state.services.reasignacionService.getAllExpedientes();

      this.expedientes = r.data.map(item => ({
        ...item,
        usuario: item.u_nombre + " " + item.u_apellido,
        selected: false
      }));
      this.allExpedientes = this.expedientes;
    },

    getStateTagClass(state) {
      // Customize the CSS class based on the state value
      if (state === false) {
        return "active";
      } else if (state === true) {
        return "frozen";
      }
      // Add more conditions and CSS classes as needed
      return "";
    },

    openModalForm() {
      this.modal_form = true;
      this.getUsers();
    },

    selectAllItems() {
      if (!this.selectAll) {
        this.expedientes.forEach(item => {
          item.selected = false;
          this.selectAll = false;
        });
      } else if (this.selectAll) {
        this.expedientes.forEach(item => {
          item.selected = true;
          this.selectAll = true;
        });
      }

      this.selectedItems = this.expedientes.filter(item => item.selected);
    },

    async getUsers() {
      const r = await this.$store.state.services.reasignacionService.getUsers();
      this.users = r.data.usuarios;
      this.users = this.users.map(item => ({
        ...item,
        nombre_completo: item.nombre + " " + item.apellido
      }));
    },

    closeDialog() {
      this.modal_form = false;
    },

    downloadExcelReport() {
      // Define the desired fields based on the aliases
      const updatedData = this.selectedItems.map(item => {
        const updatedItem = {
          "Numero de expediente": item.exp_num,
          "Nombre de Usuario": item.u_nombre + " " + item.u_apellido,
          "Nombre del creador":
            item.nombre_creador + " " + item.apellido_creador,
          Unidad: item.un_unidad,
          "Código de barra": item.codigo_barra,
          Ubicación: item.ubicacion,
          "Nombre del expediente": item.nombre_expediente,
          Congelado: item.congelado ? "Congelado" : "Activo",
          Usuario: item.usuario
        };
        return updatedItem;
      });

      // Convert the object data to a worksheet
      const worksheet = utils.json_to_sheet(updatedData);

      // Create a new workbook
      const workbook = utils.book_new();

      // Set the header styles
      const headerStyle = {
        font: { bold: true, sz: 48 }
      };

      // Apply styles to the header row
      Object.keys(worksheet).forEach(cell => {
        if (cell.startsWith("A1:")) {
          worksheet[cell].s = headerStyle;
        }
      });

      // Add the worksheet to the workbook
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Generate the Excel file
      const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace hyphens with underscores

      const excelBuffer = writeFile(
        workbook,
        `Expedientes_${dateString}.xlsx`,
        { bookType: "xlsx", type: "buffer" }
      );
    },

    async downloadPdfReport() {
      const doc = new jsPDF({ orientation: "landscape" });
      const title = "REPORTES DE EXPEDIENTES REASIGNADOS";

      //doc.setFontSize(18);
      doc.text(title, 15, 15);

      // Set the table headers
      const headers = [
        "Numero de expediente",
        "Nombre de expediente",
        "Nombre usuario asignado",
        "Estado",
        "Nombre creador",
        "Unidad",
        "Codigo de barra",
        "Ubicacion"
      ];

      // Extract the data from the selectedItems object
      const data = this.selectedItems.map(item => [
        item.exp_num,
        item.nombre_expediente,
        item.u_nombre + " " + item.u_apellido,
        item.congelado ? "Congelado" : "Activo",
        item.nombre_creador + " " + item.apellido_creador,
        item.un_unidad,
        item.codigo_barra,
        item.ubicacion
      ]);

      // Generate the table
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 20
      });

      // Save the PDF file
      doc.save("reporte_exp_reasignaciones.pdf");
    }
  }
};
</script>
<style scoped>
.active {
  background-color: rgb(69, 184, 73);
  color: white;
  padding: 8px;
  border-radius: 15px;
}

.frozen {
  background-color: rgb(15, 166, 197);
  color: white;
  padding: 8px;
  border-radius: 15px;
}

.reassign_button {
  padding: 12px;
  margin: 0px;
  height: 40px;
}

.reassign_button_enabled {
  background-color: rgb(43, 113, 226);
}

.reassign_button_disabled {
  background-color: rgb(219, 219, 219);
}
</style>
