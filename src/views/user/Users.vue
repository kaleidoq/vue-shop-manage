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
                @click="(editDialogVisible = true), getUser(scope.row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delectUser(scope.row)"
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
                  @click="setRole(scope.row)"
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
        </div>
      </div>
    </el-card>
    <!-- 对话框，添加 -->
    <el-dialog
      title="添加信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
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
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框，修改 -->
    <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框，分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
      @close="setRoleDialogClosed"
    >
      <div class="role-dialog">
        <p>用户名：{{ this.userInfo.username }}</p>
        <p>角色名：{{ this.userInfo.role_name }}</p>
        <p>
          可分配角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail.test(value)) return cb();
      else cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regEmail =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regEmail.test(value)) return cb();
      else cb(new Error("请输入合法的手机号"));
    };
    return {
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
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改用户信息
      editDialogVisible: false,
      // 分配角色对话框
      setRoleDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectedRoleId: "",
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
    // 查找单个用户信息
    getUser(user) {
      this.addForm = user;
    },
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
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户信息
    addUser() {
      console.log(this.addForm);
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("/users", this.addForm);
        console.log(res);
        if (res.meta.status != 201)
          return this.$message.error("用户添加失败！");
        this.$message.success("用户添加成功！");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 修改用户信息
    editUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const user = this.addForm;
        const { data: res } = await this.$axios.put(`users/${user.id}`, {
          email: user.email,
          mobile: user.mobile,
        });
        console.log(res);
        if (res.meta.status != 200)
          return this.$message.error("更新用户信息失败！");
        this.$message.success("更新用户信息成功！");
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    // 删除用户
    delectUser(user) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(`users/${user.id}`);
          console.log(res);
          this.$message.success("删除成功!");
          this.getUserList();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 分配角色
    async setRole(user) {
      this.userInfo = user;
      this.setRoleDialogVisible = true;
      const { data: res } = await this.$axios.get("/roles");
      if (res.meta.status !== 200) return this.$message.error("请求列表失败！");
      console.log(res);
      this.roleList = res.data;
    },
    // 提交修改的角色分配
    async submitSetRole(role) {
      const { data: res } = await this.$axios.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoleId }
      );
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("提交角色授权失败！");
      this.$message.success("更新角色成功！");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 关闭分配角色的对话框
    setRoleDialogClosed() {
      this.userInfo = {};
      this.selectedRoleId = "";
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
.role-dialog {
  padding: 0 30px;
  p {
    text-align: left;
  }
}
</style>