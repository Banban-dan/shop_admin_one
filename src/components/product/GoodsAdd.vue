<template>
  <div class="goodsAdd">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs tab-position="left" v-model="activeTab" @tab-click="handleClick">
      <!-- 基本信息 -->
      <el-tab-pane name="0" label="基本信息">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联 -->
            <el-cascader
              :props="props"
              v-model="form.goods_cat"
              :options="options"></el-cascader>
          </el-form-item>
        </el-form>
      <el-button type="primary" @click="goNext">下一步</el-button>
      </el-tab-pane>
      <!-- 商品图片 -->
      <el-tab-pane name="1" label="商品图片">
        <el-upload
          :headers="headers"
          :on-success="handleSuccess"
          multiple
          name="file"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button type="primary" @click="goNext">下一步</el-button>
      </el-tab-pane>
      <!-- 商品内容 -->
      <el-tab-pane name="2" label="商品内容">
        <!-- bidirectional data binding（双向数据绑定） -->
        <quill-editor v-model="form.goods_introduce"></quill-editor>
      <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeTab: '0',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  async created () {
    try {
      const { meta, data } = await this.$axios.get('categories?type=3')
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
  methods: {
    // 同步tab栏和步骤条
    handleClick (tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    // 下一步
    goNext () {
      this.active++
      this.activeTab = this.active + ''
    },
    // 上传文件
    handleSuccess (response) {
      // console.log(response)
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({ pic: data.tmp_path })
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除图片
    handleRemove (file) {
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
      console.log(this.form.pics)
    },
    // 预览图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 添加商品
    async addGood () {
      try {
        this.form.goods_cat = this.form.goods_cat.join(',')
        const { meta } = await this.$axios.post('goods', this.form)
        if (meta.status === 201) {
          this.$router.push('goods')
        } else {
          this.$messsage.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .goodsAdd {
    .quill-editor {
      background-color: #fff;
      ::v-deep .ql-editor {
        min-height: 300px;
      }
    }
  }
</style>
