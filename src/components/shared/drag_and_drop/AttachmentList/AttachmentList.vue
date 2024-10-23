<template>
  <div class="card mt-3" v-if="tempAttachments.length > 0">
    <div>
      <div v-for="tempAttachment in tempAttachments" :key="tempAttachment._id">
        <div style="text-align: right">
          <div class="mt-1">
            <v-icon
              v-tooltip.top="'Presiona el basurero para retirar el archivo'"
              large
              color="gray"
              >help_outline</v-icon
            >
          </div>
        </div>
        <div class="text-center container">
          <img width="100" :src="require('@/assets/logo_circulo.png')" />
        </div>
        <span>{{ tempAttachment.title }}</span>
        <div class="justify-content-end" style="text-align: right">
          <v-icon
            large
            v-tooltip.top="'Retirar Archivo'"
            color="red"
            class="mt-1"
            @click="quitarArchivo()"
            >delete_outline</v-icon
          >
          <v-icon large color="green" style="margin-bottom: 2px" class="mt-1"
            >task_alt</v-icon
          >
        </div>
        <!-- <div class="file-info">
            <span class="uploaded-date"> {{ tempAttachment.size }} bytes </span>
            <span v-if="checkProgress(tempAttachment)" class="upload-prgress">
              {{ `${tempAttachment.progress} %` }}
            </span>
          </div> -->
        <!-- <v-progress-linear v-model="tempAttachment.progress" height="25">
            <strong>{{ Math.ceil(tempAttachment.progress) }}%</strong>
          </v-progress-linear> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AttachmentList",

  methods: {
    checkProgress(attachment) {
      return attachment.progress === null ? false : true;
    },
    quitarArchivo() {
      console.log("cerrando archivo");
      this.$emit("remover_archivo", this.index);
    },
  },
  props: {
    tempAttachments: {
      type: Array,
    },
    attachments: {
      type: Array,
    },
    index: {
      type: Number,
    },
  },
};
</script>


<style >
.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>