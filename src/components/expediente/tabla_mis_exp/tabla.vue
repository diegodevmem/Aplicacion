<template>
  <div class="panel-body table-responsive">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
        <label class="pull-left"
          >mostrando:
          <b-form-select :options="pageOptions" v-model="perPage" />
        </label>
      </div>
    </div>
    <div v-if="actuacion" class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <button
          type="button"
          v-tooltip.botton="
            'Al dar click le mostrará el formulario para crear un nuevo expediente'
          "
          class="btn btn-primary btn-lg pull-right"
          @click="crear(expediente_id)"
        >
          <i class="fa fa-folder"></i> Crear nueva actuación
        </button>
      </div>
    </div>
    <div v-if="actuacion" class="row">
      <div class="col-12 text-center">
        <h1>
          Número de Expediente <br />
          <strong>{{ numero_expediente }}</strong>
        </h1>
      </div>
    </div>
    <div v-if="actuacion" class="row"><hr /></div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12">
        <b-table
          ref="selectableTable"
          responsive
          hover
          small
          flex
          :fields="fields"
          :items="items"
          :filter="search"
          :current-page="currentPage"
          :per-page="perPage"
          @filtered="onFiltered"
          select-mode="single"
          selectable
          @row-selected="showOptions"
        >
          <!-- A virtual column -->
          <template slot="estado" slot-scope="data">
            <small>{{ data.item.estado }}</small>
          </template>
          <template slot="opcion" slot-scope="data">
            <div class="btn-group-vertical">
              <a
                class="btn btn-info btn-lg"
                @click="seguimiento(data.item)"
                v-tooltip.botton="
                  'Al dar click verá los seguimientos que pertenecen a la actuación con código ' +
                  data.item.codigo_barra
                "
                ><i class="fa fa-eye"></i
              ></a>
              <a
                class="btn btn-success btn-lg"
                @click="buscar_documento(data.item)"
                v-tooltip.botton="
                  'Al dar click verá los documentos que pertenecen a la actuación con código ' +
                  data.item.codigo_barra
                "
                ><i class="fa fa-file"></i
              ></a>


              <a
                class="btn btn-warning btn-lg"
                @click="editarA(data.item)"
                v-tooltip.botton="
                  'Al dar click el sistema le mostrará la información para editar la actuación con código ' +
                  data.item.codigo_barra
                "
                ><i class="fa fa-pencil"></i
              ></a>
              <a
                class="btn btn-primary btn-lg"
                @click="agregarRequisitos(data.item)"
                v-tooltip.botton="
                  'Al dar click podra completar los requisitos del expediente ' +
                  data.item.codigo_barra
                "
                ><i class="fa fa-upload"></i
              ></a>
              <a
                v-if="data.item.congelado === false"
                class="btn btn-info btn-lg"
                @click="congelar(data.item)"
                v-tooltip.botton="
                  'Al dar click podra congelar el expediente ' +
                  data.item.codigo_barra
                "
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-snow" viewBox="0 0 16 16">
                  <path d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793V8.866l-3.4 1.963-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495L7 8 3.6 6.037l-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 1 1 .966-.258l.495 1.849L7.5 7.134V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 1 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v3.927l3.4-1.963.496-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l3.4 1.963 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-3.4-1.963v3.927l1.353 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5z"/>
                </svg>
              </a>
              <a
                v-if="data.item.congelado === true"
                class="btn btn-danger btn-lg"
                @click="descongelar(data.item.codigo_barra)"
                v-tooltip.botton="
                  'Al dar click podra descongelar el expediente ' +
                  data.item.codigo_barra
                "
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16">
                  <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                </svg>
              </a>
              <a
                v-if="limitar && !data.item.completo"
                :class="
                  data.item.deleted_at
                    ? 'btn btn-lg btn-success'
                    : 'btn btn-lg btn-danger'
                "
                @click="destroy(data.item)"
                v-tooltip.botton="
                  'Al dar click eliminará, desactivará o activara el expediente'
                "
                ><i
                  :class="
                    data.item.deleted_at
                      ? 'fa fa-thumbs-o-up'
                      : 'fa fa-thumbs-o-down'
                  "
                ></i
              ></a>
            </div>
          </template>
        </b-table>
      </div>
      <div class="col-sm-12 col-md-12 col-lg-12">
        <label v-if="totalRows > 0"
          >Total: {{ totalRows }} registros en el sistema.</label
        >
        <div class="text-center">
          <label v-if="totalRows === 0"
            >No hay registros que mostrar</label
          >
        </div>
      </div>
      <div class="col-sm-12 col-md-12 col-lg-12">
        <label class="pull-right"
          ><b-pagination
            :total-rows="totalRows"
            :per-page="perPage"
            v-model="currentPage"
            class="my-0 text-center"
        /></label>
      </div>
    </div>
  </div>
</template>
