<template>
  <div class="roles">
    <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain class="addRole" @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <p v-if="row.children.length === 0">暂无数据</p>
          <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
            <el-col :span="4">
              <el-tag type="primary" closable @close="delRight(row,l1.id)">{{ l1.authName }}</el-tag><i class="el-icon-arrow-right"></i>
              </el-col>
            <el-col :span="20">
              <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
                <el-col :span="4">
                  <el-tag type="success" closable @close="delRight(row,l2.id)">{{ l2.authName }}</el-tag><i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag v-for="l3 in l2.children" :key="l3.id
                  " type="warning" closable class="l3" @close="delRight(row,l3.id)">{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button type="primary" icon="el-icon-edit" plain size="small" @click="showEditDialog(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small" @click="deleteRole(row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="small" @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
      <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      @close="closeDialog"
      width="40%">
      <!-- 添加表单(内容) -->
      <el-form ref="addform" :model="addform" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"  prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="addform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
      <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <!-- 添加表单(内容) -->
      <el-form ref="editform" :model="editform" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="editform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"  prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="editform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
      <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="40%">
      <!-- 分配内容 -->
      <el-tree
      node-key="id"
      ref="tree"
      default-expand-all
      :data="rightList"
      :props="defaultProps"
      show-checkbox>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button @click="assignRole" type="primary">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      addDialogVisible: false,
      addform: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色民称不能为空', trigger: ['blur', 'change'] },
          { min: 0, message: '角色民称不能为空', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] },
          { min: 0, message: '角色民称不能为空', trigger: ['blur', 'change'] }
        ]
      },
      editDialogVisible: false,
      editform: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      assignDialogVisible: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取列表数据
    async getRoleList () {
      try {
        const { data } = await this.$axios.get('roles')
        this.roleList = data
        console.log(this.roleList)
      } catch (e) {
        console.log(e)
      }
    },
    // 删除权限
    async delRight (row, rightId) {
      try {
        console.log(row.id, rightId)
        const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          console.log(data)
          row.children = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示添加对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加角色
    async addRole () {
      try {
        await this.$refs.addform.validate()
        const { meta } = await this.$axios.post('roles', this.addform)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.getRoleList()
          this.addDialogVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭对话框
    closeDialog () {
      this.$refs.addform.resetFields()
    },
    // 删除角色
    async deleteRole (id) {
      try {
        console.log(id)
        await this.$confirm('你确定要删除该角色么', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示编辑对话框
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editform.id = row.id
      this.editform.roleName = row.roleName
      this.editform.roleDesc = row.roleDesc
    },
    // 修改角色
    async editRole () {
      try {
        const { meta } = await this.$axios.put(`roles/${this.editform.id}`, this.editform)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editDialogVisible = false
          this.getRoleList()
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
        this.roleId = row.id
        this.assignDialogVisible = true
        const { meta, data } = await this.$axios.get('rights/tree')
        if (meta.status === 200) {
          this.rightList = data
          console.log(row)
          const rids = []
          row.children.forEach(l1 => {
            l1.children.forEach(l2 => {
              l1.children.forEach(l3 => {
                rids.push(l3.id)
              })
            })
          })
          // console.log(rids)
          this.$refs.tree.setCheckedKeys(rids)
          // console.log(this.rightList)
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
        const rid = this.$refs.tree.getCheckedKeys()
        const halfid = this.$refs.tree.getHalfCheckedKeys()
        const rids = [...rid, ...halfid].join(',')
        // console.log(rids, this.roleId)
        const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.assignDialogVisible = false
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .roles {
    .addRole {
      margin-bottom: 10px;
    }
    .l1 {
      padding: 10px 0;
      border-bottom: 1px dotted #ccc;
    }
    .l2 {
      margin-bottom: 5px;
    }
    .l3 {
      margin-bottom: 5px;
      margin-right: 5px;
    }
  }
</style>
