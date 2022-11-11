<template>
  <div class="goods-list">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索商品名称"
            v-model="pageType.query"
            class="input-with-select"
            clearable
            @change="getGoods"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAdd()">添加商品</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="goodsList" stripe border style="width: 100%">
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="80px">
          </el-table-column>
          <el-table-column prop="goods_state" label="商品状态" width="80px">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="80px">
          </el-table-column>
          <el-table-column prop="add_time" label="创造时间" width="100px"
            ><template slot-scope="scope">
              {{ scope.row.add_time | dateFormat }}</template
            >
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="">
              <el-button size="mini" type="primary">编辑</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <!-- 分页  -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageType.pagenum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageType.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   queryGood: "",
      goodsList: [],
      pageType: {
        query: "", //	查询参数	可以为空
        pagenum: 1, //	当前页码	不能为空
        pagesize: 5, //每页显示条数	不能为空
      },
      total: 0,
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    // 获取商品列表
    async getGoods() {
      const { data: res } = await this.$axios.get("/goods", {
        params: this.pageType,
      });
      if (res.meta.status != 200) return this.$message.error("获取列表错误!");
      console.log(res);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },

    //   改变页码大小
    handleSizeChange(newsize) {
      this.pageType.pagesize = newsize;
      this.getGoods();
    },
    // 当前页码改变
    handleCurrentChange(page) {
      this.pageType.pagenum = page;
      this.getGoods();
    },
    toAdd() {
      this.$router.push({ name: "goods/addGoods" });
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 10px;
}
</style>