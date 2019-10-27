<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  * {
    padding: 0;
    margin: 0;
  }
  body,html,#app {
    height: 100%;
  }
  #app {
    .el-breadcrumb {
      height: 40px;
      line-height: 40px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
    }
  }
</style>
