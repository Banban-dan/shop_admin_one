<template>
  <div class="categories">
    <!-- 添加分类 -->
    <el-button type="success" plain class="addBtn" @click="showAddDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table
    v-loading="isloading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    :data="categoryList"
    row-key="cat_id">
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column  prop="cat_level" label="是否有效">
        <template v-slot:default="{ row }">
          {{ row.cat_deleted ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      @close="closeDialog"
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <!-- 添加分类表单 -->
      <el-form :model="addform" :rules="rules" ref="addform" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addform.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
        <el-cascader
        v-model="addform.cat_pid"
        :options="options"
        :props="props"
        clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addDialogVisible: false,
      addform: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      isloading: false
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 获取分类商品列表
    async getCategoryList () {
      try {
        this.isloading = true
        const { meta, data } = await this.$axios.get('categories', {
          params: {
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.categoryList = data.result
          this.total = data.total
          // console.log(data)
          // console.log(this.categoryList)
        } else {
          this.$message.error(meta.msg)
        }
        this.isloading = false
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
    },
    // 显示添加分类对话框
    async showAddDialog () {
      try {
        this.addDialogVisible = true
        const { meta, data } = await this.$axios.get('categories?type=2')
        if (meta.status === 200) {
          this.options = data
          // console.log(this.options)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 添加分类
    async addCategory () {
      try {
        await this.$refs.addform.validate()
        this.addform.cat_level = this.addform.cat_pid.length
        this.addform.cat_pid = this.addform.cat_pid[this.addform.cat_pid.length - 1] || 0
        const { meta } = await this.$axios.post('categories', this.addform)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addDialogVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 清空数据
    closeDialog () {
      this.$refs.addform.resetFields()
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
