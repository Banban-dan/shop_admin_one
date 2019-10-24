<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt class="img" />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a href="javascript:void(0);" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('亲,你确认要退出系统吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(e => console.log(e)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      height: 60px;
      width: 180px;
      .img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      h1 {
        height: 60px;
        text-align: center;
        line-height: 60px;
        color: #545c64
      }
    }
    .logout {
      height: 40px;
      width: 180px;
      text-align: right;
      line-height: 60px;
      font-weight: bold;
      a{
          color: orange;
          text-decoration: none;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
