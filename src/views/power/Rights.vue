<template>
  <div class="rights">
    <el-card>
      <el-table :data="rightsList" border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'"> 一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级 </el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级 </el-tag>
          </template>
        </el-table-column>
      </el-table></el-card
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$axios.get("rights/list");
      if (res.meta.status != 200) return this.$message.error("获取列表失败");
      console.log(res);
      this.rightsList = res.data;
    },
  },
};
</script>

<style>
</style>