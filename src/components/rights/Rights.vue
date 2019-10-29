<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightList">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template v-slot:default= "{ row }">
          <p v-if="row.level === '0'">一级</p>
          <p v-if="row.level === '1'">二级</p>
          <p v-if="row.level === '2'">三级</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('rights/list')
    if (meta.status === 200) {
      this.rightList = data
      console.log(this.rightList)
    } else {
      this.$message.error(meta.$message)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
