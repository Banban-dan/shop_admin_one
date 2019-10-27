<template>
  <div class="roles">
    <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain class="addRole">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
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
        <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
        <el-button type="success" icon="el-icon-check" plain size="small">分配权限</el-button>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: []
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
