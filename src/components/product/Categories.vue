<template>
  <div class="categories">
    <!-- 添加分类 -->
    <el-button type="success" plain class="addBtn">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="categoryList">
      <el-table-column type="expand">
      </el-table-column>
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">是</el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <el-button plain size="mini" icon="el-icon-edit" type="primary"></el-button>
        <el-button plain size="mini" icon="el-icon-delete" type="danger"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      type: 1,
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 获取分类商品列表
    async getCategoryList () {
      try {
        const { meta, data } = await this.$axios.get('categories', {
          params: {
            type: this.type,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.categoryList = data.result
          this.total = data.total
          console.log(data)
          console.log(this.categoryList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分页功能
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoryList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .categories {
    .addBtn {
      margin-bottom: 10px;
    }
  }
</style>
