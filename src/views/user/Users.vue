<template>
  <div class="users">
    <!-- 卡片内放搜索表格等 -->
    <el-card class="box-card" style="width: 100%; heith: 100%">
      <!-- 搜索添加区域 -->
      <el-row class="select-add" :gutter="20">
        <el-col :span="10" class="select">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="6">
          <el-button class="add-btn" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <div class="user-card">
        <el-table
          :data="tableData"
          style="width: 100%; heith: 100%"
          border
          stripe
        >
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>

          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>

          <el-table-column prop="mg_state" label="状态" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStateChange(scope.row)"
              >
              </el-switch> </template
          ></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUser(scope.row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button
              ></el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div></div
    ></el-card>
    <!-- 对话框，添加 -->
    <el-dialog
      title="添加信息"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: "",
      queryInfo: {
        query: "",
        pagenum: 1, //当前页码
        pagesize: 10, //每页显示条数
      },
      tableData: [],
      total: 100,
      // 控制对话框打开关闭
      addDialogVisible: false,
      // 添加表单
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单信息的规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在3-10之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "用户名长度在6-15之间", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      console.log(this.queryInfo);
      const { data: res } = await this.$axios.get("/users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("用户列表获取失败！");
      this.tableData = res.data.users;
      this.total = res.data.total;
    },
    // 对每页多少条这个数据进行监听
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    // 对修改页码进行监听
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },
    // 修改用户信息
    editUser() {},
    // 修改角色状态
    async userStateChange(userInfo) {
      // userInfo.mg_state = !userInfo.mg_state;
      console.log(userInfo);
      const { data: res } = await this.$axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      this.getUserList();
      this.$message.success("修改状态成功");
    },
    // 关闭对话框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="less" scoped>
.select-add {
  padding-bottom: 15px;
}
.block {
  margin-top: 15px;
}
</style>