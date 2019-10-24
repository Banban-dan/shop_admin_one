<template>
  <div class="users">
    <el-table :data="userList">
      <el-table-column label="姓名" prop="username"  width="180"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="180"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="180"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <!-- {{ obj.row }} -->
          <!-- {{ obj.row.mg_state }} -->
          <el-switch
          v-model="obj.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="small" icon="el-icon-edit"></el-button>
        <el-button type="danger" plain size="small" icon="el-icon-delete"></el-button>
        <el-button type="success" plain size="small" icon="el-icon-check">分配角色</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 4
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      const token = localStorage.getItem('token')
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: { Authorization: token }
      }).then(res => {
        const { meta, data } = res.data
        if (meta.status === 200) {
          this.userList = data.users
          console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  }
}
</script>

<style>

</style>
