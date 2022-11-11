<template>
  <div class="add-goods">
    <el-card>
      <el-row>
        <!-- 步骤条  -->
        <el-steps :active="active - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-row>
      <el-row>
        <div class="tabs">
          <el-form label-width="100px" :model="addForm">
            <el-tabs
              tab-position="left"
              v-model="active"
              :before-leave="clickTabs"
            >
              <el-tab-pane label="基本信息">
                <!-- 输入的表单信息 -->
                <el-form-item label="商品名称：">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="价格：">
                  <el-input v-model="addForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="数量：">
                  <el-input v-model="addForm.goods_number"> </el-input>
                </el-form-item>
                <el-form-item label="重量：">
                  <el-input v-model="addForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="分类："> 这里放级联选择框 </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数">商品参数</el-tab-pane>
              <el-tab-pane label="商品属性">商品属性</el-tab-pane>
              <el-tab-pane label="商品图片">商品图片</el-tab-pane>
              <el-tab-pane label="商品内容">商品内容</el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </el-row>
      <el-row></el-row>
      <el-row></el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      addForm: {
        goods_name: "", //商品名称	不能为空
        goods_cat: "", //以为','分割的分类列表	不能为空
        goods_price: "", //价格	不能为空
        goods_number: "", //数量	不能为空
        goods_weight: "", //重量	不能为空
        goods_introduce: "", //介绍	可以为空
        pics: "", //上传的图片临时路径（对象）	可以为空
        attrs: "", //商品的参数（数组），包含 动态参数 和 静态属性	可以为空
      },
    };
  },

  methods: {
    clickTabs(to, from) {
      console.log(to, from);
    },
  },
};
</script>

<style lang="less" scoped>
.el-tab-pane {
  padding: 10px 20px;
}
.el-form--label-top .el-form-item__label {
  float: left;
}
</style>