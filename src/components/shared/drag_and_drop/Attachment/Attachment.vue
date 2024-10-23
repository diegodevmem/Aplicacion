<template>
  <div class="container text-center">
    <vue-dropzone
      ref="myVueDropzone"
      :include-styling="false"
      :useCustomSlot="true"
      id="dropzone"
      @vdropzone-upload-progress="uploadProgress"
      :options="dropzoneOptions"
      @vdropzone-file-added="fileAdded"
      v-if="tempAttachments.length === 0"
    >
      <div class="dropzone-container">
        <div class="text-center">
        <v-btn :loading="loading" color="#1C658C" class="rounded-pill white-text animated fadeInUp infinite mt-2" v-bind="size">
            <v-icon dark> mdi-cloud-upload </v-icon>
          </v-btn>
          <p class="separator">
            <span>
              <h3>
              Arrastre o Inserte sus archivos aquí 
              </h3></span
            >
          </p>
          <v-btn v-bind="size"  dark color="#1C658C" class="rounded-pill"><h5 class="mt-1 pt-1">Presione Aquí</h5></v-btn>
          </div>
          <br>
      </div>
    </vue-dropzone>
    <AttachmentList
      :tempAttachments="getTempAttachments"
      :attachments="getAttachments"
      :index="index"
      @remover_archivo="remover_archivo"
    />
  </div>
</template>
<script src="./Attachment.js"></script>
<style src="./Attachment.css" scoped></style>
