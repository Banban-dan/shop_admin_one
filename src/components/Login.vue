<template>
  <div class="login">
    <el-form :model="form" label-width="80px" :rules="rules" status-icon ref="form">
      <img src="../assets/login.jpg" alt class="img" />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change '] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change '] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change '] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change '] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            message: '恭喜你，登录成功',
            type: 'success'
          })
          this.$router.push('index')
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    //   this.$refs.form.validate(isvalid => {
    //     if (!isvalid) return
    //     this.$axios.post('login', this.form).then(res => {
    //       const { meta, data } = res
    //       // console.log(data)
      // if (meta.status === 200) {
      //   localStorage.setItem('token', data.token)
      //   this.$message({
      //     message: '恭喜你，登录成功',
      //     type: 'success'
      //   })
      //   this.$router.push('index')
      // } else {
      //   this.$message.error(meta.msg)
      // }
    //     })
    //   }
      // )
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .el-form {
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    margin: 0 auto;
    margin-top: 200px;
    background-color: #fff;
    border-radius: 20px;
    position: relative;

    .img {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -75px;
      border: 5px solid #fff;
    }

    .loginBtn {
      margin-right: 50px;
    }
  }
}
</style>
