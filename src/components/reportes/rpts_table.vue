<template>
  <div class="panel-body table-responsive" id="listadoregistros">
    <template>
      <div class="col-sm-12" v-if="gridMode">

        <div class="raw">
          <div class="col-md-12">
            <hr />
          </div>
        </div>

        <b-row>
          <b-col md="4" class="my-1 form-inline">
            <label>Mostrando: </label>
            <b-form-select
              :options="pageOptions"
              :class="'form-control'"
              v-model="perPage"
            />
            <label>entradas </label>
          </b-col>

          <b-col class="my-1 form-group pull-right">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Buscar" />
            </b-input-group>
          </b-col>
        </b-row>
        <b-table
          responsive
          hover
          small
          flex
          :fields="fields"
          :items="items"
          :filter="filter"
          :current-page="currentPage"
          :per-page="perPage"
          :bordered="isBordered"
          @filtered="onFiltered"
        >
          <!-- A virtual column -->
          <template slot="id" slot-scope="data">
            {{ data.item.id }}
          </template>
          <template slot="cui" slot-scope="data">
            {{ data.item.dpi }}
          </template>
          <template slot="empleado" slot-scope="data">
            {{ data.item.nombre + " " + data.item.apellido }}
          </template>
          <template slot="nombre_completo" slot-scope="data">
            {{ data.item.unidad.nombre }}
          </template>
          <template slot="direccion" slot-scope="data">
            {{ data.item.pertenece.nombre }}
          </template>
          <template slot="informacion" slot-scope="data">
            <ul>
              <li>
                <small
                  >Fecha creación: {{ data.item.created_at }}
                </small>
              </li>
              <li>
                <small
                  >Fecha modifación: {{ data.item.updated_at }}
                </small>
              </li>
              <li>
                <small
                  >Fecha inactivo: {{ data.item.deleted_at }}
                </small>
              </li>
            </ul>
          </template>
        </div>
      </template>
  </div>
</template>

<script>
export default {
  name: "rpts_table",
  props: ['unidad'],
  data(){
    return {
      // Variables de la tabla
      gridMode: true,
      filter: null,
      fields: [
        { key: "id", label: "#", sortable: true },
        { key: "cui", label: "CUI", sortable: true },
        { key: "empleado", label: "Empleado", sortable: true },
        {
          key: "nombre_completo",
          label: "Unidad / Departamento",
          sortable: true,
        },
        { key: "direccion", label: "Dirección", sortable: true },
        { key: "informacion", label: "Información", sortable: true },
        { key: "option", label: "Opciones", sortable: false },
      ],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [5, 10, 25],
      showStringEmpty: "no hay registros que mostrar",
    }
  },
  methods: {
    //obtener todos los items
    getAll() {
      let self = this;
      self.loading_user = true;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDash(this.unidad)
        .then((r) => {
          console.log(r.data);
          self.loading_user = false;
          self.items = r.data.data;
          self.unidades = r.data.unidades;
          self.items = self.items.filter((x) => !x.admin);
          self.totalRows = self.items.length;
          self.clearDataU();
        })
        .catch((r) => {});
    },
  }
}
</script>

<style>

</style>
