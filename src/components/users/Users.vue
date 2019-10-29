<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select" @keyup.enter.native="search">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <!-- 添加用户 -->
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList">
      <el-table-column label="姓名" prop="username" width="180"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="180"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="180"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <!-- {{ obj.row }} -->
          <!-- {{ obj.row.mg_state }} -->
          <el-switch
            @change="changeState(obj.row.id,obj.row.mg_state)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button type="primary" plain size="small" icon="el-icon-edit" @click="showEditDialog(obj.row)"></el-button>
          <el-button type="danger" plain size="small" icon="el-icon-delete"  @click="delUser(obj.row.id)"></el-button>
          <el-button type="success" plain size="small" icon="el-icon-check" @click="showAssignDialog(obj.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close= "closeDialog"
      width="40%">
      <el-form ref="addform" :model="addform" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"  prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机" v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form ref="editform" :model="editform" label-width="80px" :rules="rules">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editform.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机" v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色对话框"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-form ref="assignform" :model="assignform" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ assignform.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <!-- 下拉菜单 -->
          <!--  -->
          <el-select v-model="assignform.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      addDialogVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      editDialogVisible: false,
      editform: {
        id: '',
        email: '',
        mobile: '',
        username: ''
      },
      assignDialogVisible: false,
      assignform: {
        username: '',
        id: '',
        rid: ''
      },
      roleList: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取后台数据列表
    async getUserList () {
      try {
        const { meta, data } = await this.$axios.get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        this.total = data.total
        if (meta.status === 200) {
          this.userList = data.users
          console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分页功能
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    // 修改用户状态
    async changeState (id, state) {
      try {
        const { meta } = await this.$axios.put(`users/${id}/state/${state}`)
        this.$message.success(meta.msg)
      } catch (e) {
        console.log(e)
      }
    },
    // 删除功能
    async delUser (id) {
      try {
        await this.$confirm('你确定要删除么?', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message('取消删除')
      }
    },
    // 搜索功能
    search () {
      this.pagenum = 1
      this.getUserList()
    },
    // 显示添加用户对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加用户
    async addUser () {
      try {
        await this.$refs.addform.validate()
        const { meta } = await this.$axios.post('users', this.addform)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addDialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 清空添加对话框表单
    closeDialog () {
      this.$refs.addform.resetFields()
    },
    // 显示修改对话框
    showEditDialog (row, id) {
      this.editDialogVisible = true
      console.log(id)
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
      this.editform.id = row.id
    },
    // 修改用户
    async editUser () {
      try {
        await this.$refs.editform.validate()
        const { id, email, mobile } = this.editform
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
          this.editDialogVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示分配角色对话框
    async showAssignDialog (row) {
      try {
        // console.log(row)
        this.assignDialogVisible = true
        this.assignform.username = row.username
        this.assignform.id = row.id
        // 获取角色id进行回显
        const res = await this.$axios.get(`users/${row.id}`)
        // console.log(res)
        const rid = res.data.rid
        this.assignform.rid = rid === -1 ? '' : rid
        const { meta, data } = await this.$axios.get('roles')
        if (meta.status === 200) {
          this.roleList = data
          // console.log(this.roleList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分配角色
    async assignRole () {
      try {
        const { id, rid } = this.assignform
        const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.assignDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
  .users {
    .input-with-select {
      width: 300px;
      margin-bottom: 10px;
      margin-right: 20px;
    }
  }
</style>
