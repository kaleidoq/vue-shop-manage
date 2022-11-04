<template>
  <div class="roles">
    <el-card>
      <el-row>
        <el-col>
          <el-button>添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="rolesList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              :class="[
                'expend-item',
                'vcenter',
                'bdbottom',
                i1 === 0 ? 'bdtop' : '',
              ]"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightClose"
    >
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 分配权限的对话框页面
      setRightDialogVisible: false,
      rightList: [],
      //   树形控件的绑定属性
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中的项
      defKeys: [],
      roleId: 1,
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status != 200) return this.$message.error("获取列表失败");
      console.log(res);
      this.rolesList = res.data;
    },
    //根据id删除对应权限
    async removeRightById(role, right) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") return this.$message, error("取消删除！");
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除失败！");
      role.children = res.data;
    },
    //   展示分配角色权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message, error("获取权限列表失败！");
      // 把获取到的权限信息保存到列表
      this.rightList = res.data;
      console.log(role);
      //   调用递归获得三级权限id
      this.getDefaultKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 递归调用获取每一个已经拥有的三级权限
    getDefaultKeys(node, keys) {
      if (!node.children) return keys.push(node.id);
      node.children.forEach((item) => {
        this.getDefaultKeys(item, keys);
      });
    },
    //   关闭对话框前的操作
    setRightClose() {
      // 清除之前打开对话框时保存的keyid
      this.defKeys = [];
    },
    //   确认选择的权限并提交
    async allRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const keystr = keys.join(",");
      console.log(keystr);
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        { rids: keystr }
      );
      if (res.meta.status !== 200)
        return this.$message.error("提交权限列表失败！");
      console.log(res.data);
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.expend-item {
  margin: 0 10px;
  .el-tag {
    margin: 7px;
  }
}
.vcenter {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>