<template>
  <el-container class="home">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <common-aside @getCollapse="getCollapse"></common-aside>
    </el-aside>

    <el-container style="height: 100%">
      <el-header class="header">
        <span>商店后台</span>
        <el-button class="btn" @click="logout">退出</el-button>
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
export default {
  components: { CommonAside },
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
  justify-content: space-between;
  align-items: center;
}
</style>