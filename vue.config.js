module.exports = {
  devServer: {
    open: true,
    port: 3000
  },
  configureWebpack: {
    // 配置打包的排除项, 从外部引入
    // import Vue from 'vue'
    // import VueRouter from 'vue-router'
    // 当配置了排除项后, 导入时, 就直接找全局的 Vue, VueRouter
    externals: {
      // 包名: 全局变量名
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      moment: 'moment'
    }
  }
}
