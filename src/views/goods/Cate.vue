<template>
  <div class="cate">
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-row class="row-tab">
        <tree-table
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          boder
          :show-row-hover="false"
        >
          <template slot="isok" slot-scope="scope">
            <i
              class="el-icon-success"
              style="color: #7cd465"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i class="el-icon-error" style="color: red" v-else></i>
          </template>
          <template slot="islevel" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2"
              >三级</el-tag
            >
          </template>
          <template slot="opt">
            <!-- slot-scope="scope" -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </template>
        </tree-table>
      </el-row>

      <!-- 分页按钮 -->
      <el-row>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="getType.pagenum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="getType.pagesize"
            layout="sizes, prev, pager, next"
            :total="cateTotle"
          >
          </el-pagination></div
      ></el-row>
    </el-card>
    <!-- 添加对话框  -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称：">
          <el-cascader
            v-model="seleCate"
            :options="parentCateList"
            :props="parentCateProp"
            @change="changeCascader"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateTotle: 5,
      cateList: [],
      // 表格数据
      columns: [
        {
          prop: "cat_name",
          label: "分类名称",
        },
        {
          // prop:"cat_deleted",
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "islevel",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      //分页数据
      getType: {
        type: [1, 2, 3],
        pagenum: 1, // 当前页码
        pagesize: 5, // 每页显示的条数
      },
      // 添加分类的对话框开关
      addCateDialogVisible: false,
      // 添加分类的表单
      addCateForm: {
        //分类父 ID	不能为空，如果要添加1级分类，则父分类Id应该设置为 0
        cat_pid: 0,
        //分类名称	不能为空
        cat_name: "",
        //分类层级	不能为空，0表示一级分类；1表示二级分类；2表示三级分类
        cat_level: 0,
      },
      // 添加表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 级联列表的数据
      parentCateList: [],
      // 级联列表的prop数据说明
      parentCateProp: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true, //可以只选择前两个级别的分类
      },
      seleCate: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$axios.get("/categories", {
        params: this.getType,
      });
      if (res.meta.status !== 200) return this.$message.error("error!");
      this.cateList = res.data.result;
      this.cateTotle = res.data.total;
    },

    // 修改页码时调用
    handleCurrentChange(cutrrent) {
      this.getType.pagenum = cutrrent;
      this.getCateList();
    },
    // 修改每页显示的页数时调用
    handleSizeChange(pageSize) {
      this.getType.pagesize = pageSize;
      this.getCateList();
    },
    // 添加分类
    showAddCateDialog() {
      this.getCateParentList();
      this.addCateDialogVisible = true;
    },
    // 获得父分类的列表数据
    async getCateParentList() {
      const { data: res } = await this.$axios.get("/categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) return this.$message.error("error!");
      this.parentCateList = res.data;
      console.log(res);
    },
    // 改动cascader时调用
    changeCascader() {
      console.log(this.seleCate);
      const length = this.seleCate.length;
      if (length > 0) {
        // 父级分类的pid
        this.addCateForm.cat_pid = this.seleCate[length - 1];
        // 父级分类的等级
        this.addCateForm.cat_level = length;
      } else {
        // 是一级权限,父级信息全部重置为0
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 关闭添加对话框时调用
    addCateClose() {
      this.$refs.addCateFormRef.resetFields();
      this.seleCate = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 确认添加分类项目
    async addRight() {
      const { data: res } = await this.$axios.post(
        "/categories",
        this.addCateForm
      );
      console.log(res);
      if (res.meta.status !== 201) return this.$message.error("error!");
      this.getCateList();
      this.addCateDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  .el-row {
    text-align: left;
  }
}
.row-tab {
  margin: 13px 0;
}
.el-cascader {
  width: 100%;
}
</style>