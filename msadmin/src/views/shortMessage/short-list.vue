<template>
  <div>
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_m114') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="model1.task_name" :placeholder="$t('sys_mat024')" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="model1.channel_id" clearable placeholder="请选择产品">
          <el-option v-for="item in goodsList" :key="item.channel_id" :label="item.name" :value="item.channel_id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="model1.task_time"
          :end-placeholder="$t('sys_c110')"
          :range-separator="$t('sys_c108')"
          :start-placeholder="$t('sys_c109')"
          style="width: 260px;"
          type="daterange"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getTaskList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button :disabled="checkIdArry.length==0" type="danger" @click="handleDel">{{ $t('sys_l048') }}</el-button>
        <!-- <el-button icon="el-icon-refresh-right" @click="resetQuery">{{ $t('sys_c049') }}</el-button> -->
      </el-form-item>

      <!-- <el-form-item>
          <el-dropdown @command="(command)=>{handleCommand(0,command)}" trigger="click" style="margin-left:10px;">
            <el-button type="success"> {{ $t('sys_g018') }}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="checkIdArry.length==0" v-for="(item, idx) in moreOption" :key="idx" :command="{item,idx}">
                  <i :class="'el-icon-' + item.icon"></i>
                  {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item> -->
    </el-form>

    <div class="continer_main">
      <div class="tab_check_warp">
        <i slot="reference" class="el-icon-info" />
        <div v-html="$t('sys_mat007',{value:checkIdArry.length})" />
      </div>
      <el-table
        ref="serveTable"
        v-loading="loading"
        :cell-style="{ textAlign: 'center' }"
        :data="taskDataList"
        :header-cell-style="{ color: '#909399', textAlign: 'center' }"
        :summary-method="getSummaries"
        border
        element-loading-background="rgba(255, 255, 255,1)"
        element-loading-spinner="el-icon-loading"
        height="650"
        show-summary
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('sys_g070')" prop="name" width="120" />
        <el-table-column label="发送方式" prop="send_type" width="120">
          <template slot="header">
            <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,'send_type')">
              <span :class="[model1.send_type?'dropdown_title':'']" style="color:#909399"> 发送方式
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,idx) in sendingList"
                  :key="idx"
                  :class="{'dropdown_selected':item.value==model1.send_type}"
                  :command="idx"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            {{ sendingList[scope.row[scope.column.property]?Number(scope.row[scope.column.property]):0].label || '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('sys_s011')" min-width="130" prop="channel_name" show-overflow-tooltip />
        <el-table-column :label="$t('sys_l059')" prop="status" width="120">
          <template slot="header">
            <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,'status')">
              <span :class="[model1.status?'dropdown_title':'']" style="color:#909399"> {{ $t('sys_l059') }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,idx) in statusOptions"
                  :key="idx"
                  :class="{'dropdown_selected':idx==model1.status}"
                  :command="idx"
                >{{ item == '' ? $t('sys_l053') : item }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status==1?'info':scope.row.status==2?'warning':scope.row.status==4?'success':'danger'"
              size="small"
            > {{ statusOptions[scope.row.status] || '-' }}
            </el-tag>
            <!-- <el-tag size="small" :type="scope.row.status==1?'primary':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('sys_s017')" min-width="150" prop="content" show-overflow-tooltip />
        <el-table-column :label="$t('sys_s027')" min-width="100" prop="total_num" />
        <el-table-column :label="$t('sys_s015')" min-width="100" prop="not_start_num" />
        <el-table-column :label="$t('sys_s019')" min-width="100" prop="sucess_num">
          <template slot-scope="scope">
            <!-- {{ scope.row.sucess_num }} ({{ scope.row.sucess_rate*100 }}%) -->
            {{ scope.row.sucess_num }} ({{ parseFloat((scope.row.sucess_rate * 100).toFixed(2)) }}%)
          </template>
        </el-table-column>
        <el-table-column :label="$t('sys_s020')" min-width="100" prop="fail_num" />
        <el-table-column :label="$t('sys_s033')" min-width="100" prop="unknown_num" />
        <el-table-column :label="$t('sys_s028')" prop="expend" width="100" />
        <el-table-column :label="$t('sys_c008')" min-width="160" prop="itime">
          <template slot-scope="scope">
            {{ $baseFun.resetTime(scope.row.itime * 1000) || '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('sys_c010')" fixed="right" width="200">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" @click="jumpCreatTask(scope.row,1)">{{ $t('sys_c077') }}</el-button> -->
            <el-button
              :disabled="checkIdArry.length>0"
              size="mini"
              type="primary"
              @click.stop="goTaskDetail(scope.row)"
            >{{ $t('sys_m063') }}
            </el-button>
            <!-- <el-button :disabled="checkIdArry.length>0" type="success" plain size="mini" @click.stop="exportText(scope.row)">{{ $t('sys_c080') }}</el-button> -->
            <el-button size="mini" type="text" @click.stop>
              <el-dropdown trigger="click" @command="(command)=>{handleCommand(scope.row,command)}">
                <span class="el-dropdown-link">
                  <el-button :disabled="checkIdArry.length>0" size="mini" type="warning">
                    {{ $t('sys_c080') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,idx) in moreOption" v-show="idx!=0" :key="idx" :command="{item,idx}">
                    <!-- <i :class="'el-icon-' + item.icon"></i> -->
                    {{ item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="layui_page">
        <el-pagination
          :current-page.sync="model1.page"
          :page-size="model1.limit"
          :page-sizes="pageOption"
          :total="model1.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeHandle"
          @current-change="pageHandle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import { getsmstasklist, delsmstasklist, getchannellist, exportsmstaskinfolist } from '@/api/config'

export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 10,
        total: 0,
        status: '',
        task_time: '',
        task_name: '',
        channel_id: '',
        send_type: ''
      },
      loading: false,
      checkIdArry: [],
      goodsList: [],
      pageOption: resetPage(),
      taskDataList: [],
      showNum: [6,7, 8, 9, 10],
      sendingList: [
        { label: '全部', value: 0 },
        { label: '方式1', value: 1 },
        { label: '方式2', value: 2 },
        // { label: '方式3', value: 3 },
      ] // 发送方式
    }
  },
  computed: {
    groupRules() {
      return {
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        plant_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'blure' }],
        set_account: [{
          required: true,
          message: this.$t('sys_mat061', { value: this.$t('sys_mat063') }),
          trigger: 'blure'
        }],
        set_name: [{
          required: true,
          message: this.$t('sys_mat061', { value: this.$t('sys_mat062') }),
          trigger: 'blure'
        }],
        set_pwd: [{ required: true, message: this.$t('sys_mat061', { value: this.$t('sys_g031') }), trigger: 'blure' }]
      }
    },
    statusOptions() {
      return ['', this.$t('sys_s015'), this.$t('sys_s030'), this.$t('sys_c048'), this.$t('sys_mat047')]
    },
    moreOption() {
      return ['', '全部数据', '异常数据']
    }
  },
  created() {
    this.getTaskList();
    this.getGoodsList();
  },
  methods: {
    resetQuery() {
      this.model1.status = '';
      this.model1.task_time = '';
      this.model1.task_name = '';
      this.model1.channel_id = '';
      this.getTaskList(1);
    },
    // 获取配置列表
    getGoodsList() {
      getchannellist().then(res => {
        this.goodsList = res.data.list || [];
      })
    },
    handleNewwork(value,key) {
      if (key === 'send_type') {
        this.model1.send_type = value;
      } else if (key === 'status') {
        this.model1.status = value;
      }
      this.getTaskList(1);
    },
    getTaskList(num) {
      this.loading = true;
      const sTime = this.model1.task_time;
      this.model1.page = num || this.model1.page;
      const params = {
        page: this.model1.page,
        limit: this.model1.limit,
        status: this.model1.status || -1,
        name: this.model1.task_name,
        channel_id: this.model1.channel_id,
        send_type: this.model1.send_type || 0,
        start_time: sTime ? this.$baseFun.mexicoTime(sTime[0], 1) : -1,
        end_time: sTime ? this.$baseFun.mexicoTime(sTime[1], 2) : -1
      }
      getsmstasklist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.taskDataList = res.data.list || [];
        this.$nextTick(() => {
          if (this.$refs.serveTable) {
            this.$refs.serveTable.doLayout();
          }
        })
      })
    },
    goTaskDetail(row) {
      this.$router.push({ path: '/task-tetail', query: { params: row, task_id: row.id }});
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => {
        return item.id
      })
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.checkIdArry.find(item => item === row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    sizeHandle(val) {
      this.model1.limit = val;
      this.getTaskList();
    },
    pageHandle(val) {
      this.model1.page = val;
      this.getTaskList();
    },
    jumpCreatTask(row, idx) {
      if (idx === 0) {
        this.$router.push('/creat-mess')
      } else {
        this.$router.push({ path: '/creat-mess', query: { config: row }})
      }
    },
    handleDel() {
      const that = this;
      that.$confirm(that.$t('sys_c046', { value: that.$t('sys_c028') }), that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            delsmstasklist({ del_id: that.checkIdArry }).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code !== 0) return;
              that.getTaskList(1);
              successTips(that)
              done();
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: that.$t('sys_c048') });
      })
    },
    async handleCommand(row, command) {
      const { data: { url }} = await exportsmstaskinfolist({ task_id: row.id, type: command.idx });
      window.location.href = url;
      successTips(this)
    },
    // handleCommand(row,command) {
    //     let that = this;
    //     that.setIpType = command.idx;
    //     that.setIpName = command.item.label;
    //     if (that.checkIdArry.length==0 && row==0) {
    //       return successTips(that, "error",that.$t('sys_c126'));
    //     }
    //     that.$confirm(that.$t('sys_c046',{value:that.setIpName}),that.$t('sys_l013'), {
    //       type: 'warning',
    //       confirmButtonText: that.$t('sys_c024'),
    //       cancelButtonText: that.$t('sys_c023'),
    //       beforeClose: function (action, instance, done) {
    //           if (action === 'confirm') {
    //             let reqApi = that.setIpType==0?dobatchstopsendmsgtask:that.setIpType==1?dobatchclosesendmsgtask:that.setIpType==2?dobatchdelsendmsgtask:"";
    //             instance.confirmButtonLoading = true;
    //             reqApi({ids:row==0?that.checkIdArry:[row.id]}).then(res=>{
    //               instance.confirmButtonLoading = false;
    //               if (res.code != 0) return;
    //               that.getTaskList();
    //               successTips(that)
    //               done();
    //             })
    //           } else {
    //             done();
    //             instance.confirmButtonLoading = false;
    //           }
    //       }
    //   }).catch(() => {
    //       that.$message({ type: 'info', message: that.$t('sys_c048') });
    //   })
    // },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (index === 0) {
          sums[index] = this.$t('sys_c125');
          return false;
        } else if (this.showNum.indexOf(index) > -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toFixed(3));
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
    exportText(row) {
      // doouttaskexcel({ id: row.id }).then(res => {
      //   if (res.code != 0) return;
      //   // this.getTaskList();
      //   window.location.href = res.data.url
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.continer_main {
  width: 100%;
}
</style>
