<template>
  <!-- 面包屑区域 -->
  <div class="bread">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in tags" :key="item.name">{{
        item.name
      }}</el-breadcrumb-item> -->
    </el-breadcrumb>
    <!-- 标签tag -->
    <div class="tag">
      <el-tag size="mini" type="info" effect="plain"> 首页 </el-tag>
      <el-tag
        size="mini"
        v-for="(tag, index) in tags"
        :key="tag.name"
        closable
        type="info"
        effect="plain"
        @close="removeTag(tag, index)"
      >
        {{ tag.name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      //   tags: [{ name: "", path: "" }],
    };
  },
  computed: {
    ...mapState({ tags: (state) => state.users.tagList }),
  },
  methods: {
    removeTag(tag, index) {
      this.$store.commit("removeTag", index);
      const length = this.tags.length - 1;
      if (tag.path == this.$route.path) {
        if (index == length) {
          this.$router.push(this.tags[index - 1].path);
        } else {
          this.$router.push(this.tags[index].path);
        }
      }
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.tag {
  padding: 7px 0;
  display: flex;
  justify-content: left;
  .el-tag {
    margin: 0 5px;
  }
}
</style>