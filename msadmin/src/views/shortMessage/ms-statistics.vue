<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <div class="detail_card">
      <el-button v-if="isLoading" :loading="true" class="loading_icon" style="margin-top: 10px;" type="primary" />
      <template v-else>
        <template v-if="statisticsList&&statisticsList.length>0">
          <div
            v-for="(item,idx) in statisticsList"
            :key="idx"
            :style="{background:getBgFun().b_g}"
            class="card_item"
            @click="getStatistics"
          >
            <span :style="{color:getBgFun().t_c}" class="channel_name">{{ item.channel_name }}</span>
            <div>
              <span>{{  sendingList[item.send_type].label }}</span>
            </div>
            <div>
              <span>提交总数: {{ item.total_num }}</span>
            </div>
            <div class="card_number">
              <span>成功数: {{ item.sucess_num }} ({{ parseFloat((item.sucess_rate * 100).toFixed(2)) }}%)</span>
              <span>失败数: {{ item.fail_num }}</span>
            </div>
          </div>
        </template>
        <el-button v-else class="loading_icon" style="margin-top: 10px;" type="primary">暂无数据...</el-button>
      </template>
    </div>
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item v-if="task_id">
        <el-button size="small" @click="$router.go(-1)">
          <i class="el-icon-back" />
          <span>{{ $t('sys_q006') }}</span>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="send_type" clearable placeholder="请选择发送方式">
          <el-option v-for="(item,index) in sendingList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="task_time"
          :end-placeholder="$t('sys_c110')"
          :range-separator="$t('sys_c108')"
          :start-placeholder="$t('sys_c109')"
          type="daterange"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="initTaskList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="continer_main">
      <div class="group_continer">
        <el-table
          ref="serveTable"
          v-loading="loading"
          :data="accountDataList"
          :summary-method="getSummaries"
          border
          element-loading-spinner="el-icon-loading"
          height="680"
          row-key="id"
          show-summary
          style="width: 100%;"
          use-virtual
        >
          <el-table-column :label="$t('sys_c134')" prop="statis_time_str" width="120" />
          <el-table-column label="发送方式" min-width="100" prop="send_type" >
            <template slot-scope="scope">
              {{ sendingList[scope.row[scope.column.property]?Number(scope.row[scope.column.property]):0].label || '-' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_s018')" min-width="100" prop="total_num" />
          <el-table-column :label="$t('sys_s019')" min-width="120" prop="sucess_num">
            <template slot-scope="scope">
              {{ scope.row.sucess_num }} ({{ parseFloat((scope.row.sucess_rate * 100).toFixed(2)) }}%)
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_s020')" min-width="100" prop="fail_num" />
        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="page"
            :page-size="limit"
            :page-sizes="pageOption"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeFun"
            @current-change="handlePageFun"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPage } from '@/utils/index'
import { getchannellist } from '@/api/config'
import { getstatislist, gettodaystatisinfo } from '@/api/statistics'

export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      account: '',
      task_id: '',
      goodsList: [],
      pixe_id: [],
      task_time: '',
      channel_id: '',
      send_type: '',// 发送方式
      loading: false,
      isLoading: false,
      sendingList: [
        { label: '全部', value: 0 },
        { label: '方式1', value: 1 },
        { label: '方式2', value: 2 },
        // { label: '方式3', value: 3 },
      ],// 发送方式
      checkIdArry: [],
      checkAccount: [],
      statisticsList: [
        // {
        //     channel_name:"测试001",
        //     total_num:200,
        //     sucess_num:50,
        //     fail_num:10
        // },
        // {
        //     channel_name:"测试001",
        //     total_num:200,
        //     sucess_num:50,
        //     fail_num:10
        // },
        // {
        //     channel_name:"测试001",
        //     total_num:200,
        //     sucess_num:50,
        //     fail_num:10
        // },
        // {
        //     channel_name:"测试001",
        //     total_num:200,
        //     sucess_num:50,
        //     fail_num:10
        // },
        // {
        //     channel_name:"测试001",
        //     total_num:200,
        //     sucess_num:50,
        //     fail_num:10
        // },
        // {
        //     channel_name:"测试001",
        //     total_num:200,
        //     sucess_num:50,
        //     fail_num:10
        // },
        // {
        //     channel_name:"测试001",
        //     total_num:200,
        //     sucess_num:50,
        //     fail_num:10
        // }
      ],
      accountDataList: [],
      pageOption: resetPage(),
      showNum: [2, 3, 4]
    }
  },
  computed: {
    taskOption() {
      return ['', this.$t('sys_m069'), this.$t('sys_m070')]
    },
    cardOption() {
      return [
        {
          b_g: '#fef4e9',
          t_c: '#ff8400'
        },
        {
          b_g: '#dbfeff',
          t_c: '#1dcfdb'
        },
        {
          b_g: '#dbfff1',
          t_c: '#02c97a'
        },
        {
          b_g: '#f9edff',
          t_c: '#b357ff'
        },
        {
          b_g: '#dbfeff',
          t_c: '#1dcfdb'
        },
        {
          b_g: '#fffee6',
          t_c: '#f2bb16'
        },
        {
          b_g: '#ffebeb',
          t_c: '#ff0f0'
        },
        {
          b_g: '#f9edff',
          t_c: '#b357ff'
        },
        {
          b_g: '#fffee6',
          t_c: '#f2bb16'
        },
        {
          b_g: '#dbfeff',
          t_c: '#1dcfdb'
        }
      ]
    }
  },
  watch: {
    closeModel(val) {
      if (val == false) {
        this.blockPramse.offest = 1;
        if (this.$refs.blockTable) {
          this.$refs.blockTable.clearSelection();
        }
      }
    },
    setIpModel(val) {
      if (val == false) {
        this.$refs.ipForm.resetFields();
        this.ipForm.iptype = '';
        this.ipForm.staffCheck = [];
        this.ipForm.group_id = '';
        this.ipForm.use_status = 1;
        this.ipForm.remock_text = '';
      }
    }
  },
  created() {
    this.task_id = this.$route.query.id;
    this.getGoodsList();
    this.initTaskList();
  },
  methods: {
    getStatistics() {
      this.isLoading = true;
      gettodaystatisinfo().then(res => {
        this.statisticsList = res.data.list || [];
        this.isLoading = false;
      })
    },
    getBgFun() {
      const randomIndex = Math.floor(Math.random() * this.cardOption.length);
      return this.cardOption[randomIndex];
    },
    // 获取配置列表
    getGoodsList() {
      getchannellist().then(res => {
        this.goodsList = res.data.list || [];
      })
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => {
        return item.id
      })
      this.checkAccount = row.map(item => {
        return item.account
      })
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.checkIdArry.find(item => item == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    restQueryBtn() {
      this.task_time = '';
      this.channel_id = '';
      this.send_type = '';
      this.checkAccount = [];
      this.initTaskList(1);
    },
    initTaskList(num) {
      this.loading = true;
      this.page = num || this.page;
      const sTime = this.task_time;
      const params = {
        page: this.page,
        limit: this.limit,
        send_type: this.send_type?Number(this.send_type):0,
        start_time: sTime ? this.$baseFun.mexicoTime(sTime[0], 1) : -1,
        end_time: sTime ? this.$baseFun.mexicoTime(sTime[1], 2) : -1
      }
      this.task_id ? params.uid = this.task_id : '';
      this.getStatistics();
      getstatislist(params).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.accountDataList = res.data.list || [];
        this.$nextTick(() => {
          if (this.$refs.serveTable) {
            this.$refs.serveTable.doLayout();
          }
        })
      })
    },
    handleSizeFun(limit) {
      this.limit = limit;
      this.initTaskList(1);
    },
    handlePageFun(page) {
      this.page = page;
      this.initTaskList();
    },
    switchPage({ page, size }) {
      this.loading = true;
      if (this.limit != size) {
        this.page = 1;
      } else {
        this.page = page;
      }
      this.limit = size;
      this.initTaskList();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (index === 0) {
          sums[index] = this.$t('sys_c125');
          return;
        } else if (this.showNum.indexOf(index) > -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
  }
}
</script>

<style lang="scss" scoped>
.detail_card {
  width: 100%;
  overflow-y: auto;
  margin-bottom: 10px;
  height: 180px;
  // max-height: 180px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;

  .card_item {
    display: flex;
    gap: 6px;
    height: 90px;
    width: calc((100% - (6 - 1) * 30px) / 6);
    font-size: 14px;
    cursor: pointer;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    border-radius: 6px;
    justify-content: center;

    .channel_name {
      font-size: 18px;
      font-weight: 600;
    }

    .card_num {
      display: flex;
      font-weight: 600;
      font-size: 20px;
      margin-left: 10px;

      em {
        font-style: normal;
      }
    }

    .card_number {
      width: 100%;
      display: flex;
      gap: 10px;
      justify-content: center;
    }
  }

  // .card_item:nth-of-type(5n + 1) {
  //     margin-left: 0;
  // }
}

::v-deep .el-card__body {
  width: 100%;
  height: 118px;
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  & > div {
    flex: 1;
  }

  .refsh_icon {
    cursor: pointer;
    color: #409eff;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .box_card_item {
    display: flex;
    cursor: pointer;
    padding: 6px;
    align-items: center;
    flex-direction: column;

    span {
      font-size: 16px;
    }

    .port_title {
      color: #409eff;
      font-size: 18px;
      margin-bottom: 20px;
    }
  }
}

.level_01 {
  display: flex;
  color: #C0C4CC;
  align-items: center;
  width: max-content;
  padding: 0 15px;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  border: 1px solid #DCDFE6;

  .level_01_1 {
    color: #606266;
    font-size: 13px;
    margin-left: 10px;
  }

  .screen_t_02 {
    width: 20px;
    height: 20px;
    color: #fff;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-left: 5px;
    background-color: #409eff;
  }

  .down_01 {
    width: 500px;
    height: 40px;
    position: absolute;
    top: 40px;
    left: 0;
    border-radius: 4px;
    border: solid 1px #dfe4ed;
    background-color: #FFFFFF;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .down_01_01 {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      top: -12px;
      left: 20%;
      transform: translateX(-50%);
      margin-right: 3px;
      border-bottom-width: 0;
      border-bottom-color: #e6ebf5;
      border-width: 6px;
      -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    }

    .down_01_01::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
    }
  }
}

.level_01:hover {
  border-color: #C0C4CC;
}

.custom_popover {
  .screen_01 {
    color: #209cdf;
    display: flex;

    .screen_t_01 {
      display: flex;
      opacity: .7;
      align-items: center;
      cursor: pointer;

      i {
        margin-right: 5px;
      }
    }

    .screen_t_01:nth-child(1) {
      margin-right: 20px;
    }

    .screen_t_01:hover {
      opacity: 1;
    }
  }

  .select_02 {
    .el-icon-close {
      font-size: 14px;
      color: #f56c6c;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.level_01_01 {
  width: 100%;
  display: flex;
  font-size: 12px;
  margin-bottom: 10px;

  .level_01_02 {
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 4px;
    width: max-content;
    margin-right: 10px;
    background-color: #ecf5ff;

    .el-icon-error {
      color: #409eff;
      font-size: 17px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}

::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-radio-group {
  margin-top: -2px;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}

.remark_ext {
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select_body {
  .select_ele {
    width: 130px;

    ::v-deep .el-input__inner {
      border-right: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .input_ele {
    width: 202px;

    ::v-deep .el-input__inner {
      border-left: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 1px solid #DCDFE6;
    }
  }
}

.continer_main {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .group_mian_hide {
    display: none;
  }

  .group_continer {
    width: 100%;
    overflow-x: auto;
  }
}

.group_tips {
  display: flex;
  color: #f56c6c;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}

.group_head_warp {
  display: flex;
  width: 220px;
  height: 40px;
  flex-shrink: 0;
  position: relative;
  font-size: 14px;
  color: #606266;
  align-items: center;
  padding: 0 8px 0 15px;
  box-sizing: border-box;
  justify-content: space-between;
  background: #f5f7fa;

  .group_head {
    cursor: pointer;
    display: flex;
    align-items: center;

    .el-icon-d-arrow-left {
      color: #409eff;
      font-size: 18px;
      margin-right: 10px;
    }
  }

  .custom_popover {
    position: absolute;
    top: 280px;
    // position: absolute;
    // top: -80px;
  }

  .el-icon-setting {
    margin-left: 10px;
  }

  .group_icon {
    display: flex;

    i {
      cursor: pointer;
    }
  }
}

.group_warp {
  width: 220px;
  max-height: 550px;
  overflow-y: auto;
  flex-shrink: 0;
  flex-wrap: wrap;

  .group_item {
    display: flex;
    width: 100%;
    flex-shrink: 0;
    height: 36px;
    margin-top: 8px;
    cursor: pointer;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 12px;

    .group_name {
      width: 80%;
      display: flex;
      align-items: center;

      .left_icon {
        margin-right: 6px;
      }

      .group_text {
        max-width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-icon-more,
    .el-icon-delete {
      margin-left: 10px;
      position: relative;

      .del_alert {
        //opacity: 0;
        width: 60px;
        padding: 10px;
        display: flex;
        position: absolute;
        top: 15px;
        left: -22px;
        z-index: 99999;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        // background-color: darkgreen;
        border: 1px solid #ebeef5;;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        .del_arrow {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          margin-right: 3px;
          border-bottom-width: 0;
          border-bottom-color: #ebeef5;
          border-width: 6px;
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
        }
      }
    }
  }

  .group_item:hover {
    background-color: #F5F8FA;
  }

  .group_active {
    background-color: #ebeef5;
  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}

.close_inherit, .add_inherit {
  display: flex;
  width: 100%;
  justify-content: center;

  .close_desc {
    display: flex;
    height: max-content;
    color: #606266;
    line-height: 1.4;
    font-size: 14px;
    padding: 10px;
    margin: 0 10px;
    border-radius: 10px;
    flex-direction: column;
    border: 1px solid #dcdcdc;
  }

  .footer_btn {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
}

.add_inherit {
  justify-content: space-between;

  .table_group {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .table_ele {
    width: 100%;
    height: 100%;
    // display: flex;
    flex-grow: 2;
    flex-direction: column;

    .tab_check_warp {
      margin: 12px 0 20px 10px;
    }
  }
}

.seat_class {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 10px;

  .seat_item {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 5px;
    color: #409eff;
    background: #ecf5ff;
    border-radius: 4px;
    border: 1px solid #b3d8ff;
  }
}

.loading_icon {
  height: 180px;
  align-items: center;
  margin-top: 10px;
}

.loading_icon:hover {
  border: none;
  color: #409eff;
  border-color: transparent;
  background: transparent;
}
</style>
<style lang="scss">
.group_continer {
  .el-pagination {
    text-align: left !important;
  }
}
</style>
