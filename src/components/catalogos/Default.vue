<template>
  <div class="content-wrapper">        
    <section class="content">
        <div class="row">
          <div class="col-md-12">
              <div class="box">
                Default Catalogo
              </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DefaultCat',

  created(){
    let self = this
  },
  mounted(){
    $("body").resize()
  }
}
</script>