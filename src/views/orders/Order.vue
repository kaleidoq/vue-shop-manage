<template>
  <div class="order">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索商品名称"
            v-model="getOrder.query"
            class="input-with-select"
            clearable
            @change="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="orderList" stripe border style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column
            label="订单编号"
            prop="order_number"
          ></el-table-column>
          <el-table-column
            label="订单价格"
            prop="order_price"
          ></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === '1'"
                >已付款</el-tag
              >
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send">
            <template slot-scope="scope">
              <template>
                {{ scope.row.is_send }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">
              {{ scope.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showBox"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-location"
                @click="showProgressBox"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getOrder: {
        query: "", //	查询参数	可以为空
        pagenum: 1, //	当前页码	不能为空
        pagesize: 5, //每页显示条数	不能为空
      },
      orderList: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$axios.get("/orders", {
        params: this.getOrder,
      });
      console.log(res);
      this.orderList = res.data.goods;
    },
    showBox() {},
    showProgressBox() {},
  },
};
</script>

<style>
</style>