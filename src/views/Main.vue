<template>
  <el-container class="home">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <common-aside @getCollapse="getCollapse"></common-aside>
    </el-aside>

    <el-container style="height: 100%">
      <el-header class="header" height="70px">
        <div class="header-title">
          <span>商店后台</span>
          <el-button class="btn" @click="logout">退出</el-button>
        </div>

        <bread-crumb></bread-crumb>
      </el-header>

      <el-main>
        <!-- 路由占用 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "@/components/CommonAside.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  components: { CommonAside, BreadCrumb },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    getCollapse(val) {
      this.isCollapse = val;
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}
.header {
  // background-color: #effaec;
  display: flex;
  flex-direction: column;

  .header-title {
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.el-main {
  padding: 10px 20px;
}
</style>