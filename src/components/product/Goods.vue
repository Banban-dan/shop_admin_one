<template>
  <div class="goods">
    <!-- 添加商品 -->
    <el-button @click="addBtn" class="addBtn" plain type="success">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodList">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间">
        <template v-slot:default="{row}">
          {{ row.add_time | time }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
        <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
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
      Pnp: '',
      pagenum: 1,
      pagesize: 5,
      goodList: [],
      total: 0
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    // 获取商品列表
    async getGoodList () {
      try {
        const { meta, data } = await this.$axios.get('goods', {
          params: {
            Php: this.Pnp,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.goodList = data.goods
          this.total = data.total
          console.log(this.goodList)
          console.log(data)
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
      this.pagenum = 1
      this.getGoodList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodList()
    },
    // 处理序号问题
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    // 添加商品
    addBtn () {
      this.$router.push('goods-add')
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods {
    .addBtn {
      margin-bottom: 10px;
    }
  }
</style>
