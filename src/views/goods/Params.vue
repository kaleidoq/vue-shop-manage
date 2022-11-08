<template>
  <div class="params">
    <el-card>
      <el-row>
        <el-alert
          title="注意：只允许为三级分类设置参数"
          type="warning"
          show-icon
        >
        </el-alert
      ></el-row>
      <el-row
        >选择商品分类：
        <el-cascader
          v-model="seleCate"
          :options="cateList"
          :props="cateProp"
          @change="changeCascader"
          clearable
        ></el-cascader>
      </el-row>
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              size="mini"
              @click="addDialogVisible = true"
              :disabled="isBtnDisable"
              >添加参数</el-button
            >
            <!-- 动态参数表格 -->
            <el-table class="many-table" :data="manyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="item in scope.row.attr_vals" :key="item">{{
                    item
                  }}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="removeParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisable"
              @click="addDialogVisible = true"
              >添加属性
            </el-button>
            <!-- 静态属性表格 -->
            <el-table :data="onlyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand"></el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="属性名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="removeParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择框modle
      seleCate: [],
      cateList: [],
      cateProp: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 被激活的标签页的名字
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      //在每一行显示,在获得参数或属性的地方做数据逻辑
      //   // tag 输入框的显示与否
      //   inputVisible: false,
      //   // 增加新标签的输入框内容
      //   inputValue: "",
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 按钮的禁用与否
    isBtnDisable() {
      if (this.seleCate.length != 0) return false;
      return true;
    },
    // 级联选择框中最后那个选项的id
    cateId() {
      return this.seleCate[this.seleCate.length - 1];
    },
    // 对话框中的标题
    titleText() {
      if (this.activeName === "many") return "动态参数";
      else return "静态属性";
    },
  },
  methods: {
    // 级联列表的数据
    async getCateList() {
      const { data: res } = await this.$axios.get("/categories");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("error!");
      this.cateList = res.data;
    },
    //改变级联选择框时
    async changeCascader() {
      //   console.log(this.seleCate);
      this.getParamsData();
    },
    //点击标签页的切换
    handleClickTab() {
      this.getParamsData();
    },
    // 标签页内的数据 即具体参数数据
    async getParamsData() {
      const { data: res } = await this.$axios.get(
        `/categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("error!");
      res.data.forEach((item) => {
        // item.attr_vals = item.attr_vals.split(" ");
        // 是否有数组,没有就展示空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // 为每一行的tag标签保存input的开关的value值
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res);

      if (this.activeName === "many") this.manyTableData = res.data;
      else this.onlyTableData = res.data;
    },
    //   关闭对话框前的操作
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //   提交添加的数据
    addParams() {
      this.$refs.addFormRef.validate(async (vali) => {
        if (!vali) return;
        const { data: res } = await this.$axios.post(
          `/categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("error!");
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    //   编辑动态参数
    showEditDialog() {},
    //   删除动态参数
    removeParams() {},
    //   tag显示输入框
    showInput(row) {
      row.inputVisible = true;
    },
    //   增加新标签 关闭输入框时调用
    handleInputConfirm() {},
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 10px;
  text-align: left;
}
.many-table {
  .el-tag {
    margin: 0 10px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>