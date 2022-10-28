<template>
  <div class="login">
    <!-- 登录模块 -->
    <el-card class="login-item" shadow="always">
      <div class="login-check">登录</div>
      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input placeholder="账号" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            show-password
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-sub">
          <el-button
            style="margin-right: 30px"
            round
            @click="submitForm(loginForm)"
            >提交</el-button
          >
          <el-button round @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 用户名校验规则
      rules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "账号不能为空",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "密码不能为空",
          },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 提交登录信息
    submitForm(submitForm) {
      // 验证校验规则
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("login", submitForm);
        if (res.meta.status != 200) {
          this.$message.error(res.meta.msg);
          console.log(res, "res");
          return;
        }
        console.log(res);
        // 传入token
        sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
    // 重置账号信息
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  background-color: #b8d7b2;
  height: 100%;
}
.login-item {
  width: 450px;
  height: 300px;
  border-radius: 7px;
  position: absolute;
  // 居中
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-check {
  padding: 0 30px;
  padding-bottom: 30px;
  font-size: 20px;
}
.login-form {
  width: 250px;
  margin: auto;
  /deep/.el-input__inner {
    border-radius: 35px;
  }
  /deep/.el-input__inner:focus,
  /deep/.el-button:focus,
  .el-button:hover {
    border-color: #b8d7b2;
  }
  /deep/.el-form-item__error {
    padding-left: 15px;
  }
  .btn-sub {
    padding-top: 25px;
    padding-left: 30px;
    /deep/.el-button:focus,
    .el-button:hover {
      color: #3da728;
      background-color: #ecf5eb;
    }
  }
}
</style>