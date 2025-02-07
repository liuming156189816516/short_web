<template>
  <div>
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
          <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_m114') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="model1.task_name" :placeholder="$t('sys_mat024')"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="model1.channel_id" clearable placeholder="请选择产品">
            <el-option v-for="item in goodsList" :key="item.channel_id" :label="item.name" :value="item.channel_id" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-date-picker v-model="model1.task_time" type="daterange" :range-separator="$t('sys_c108')" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" style="width: 260px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getTaskList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button type="danger" :disabled="checkIdArry.length==0" @click="handleDel">{{ $t('sys_l048') }}</el-button>
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
      <!-- 分组管理 -->
      <div class="continer_main">
        <div class="tab_check_warp">
          <i slot="reference" class="el-icon-info"></i>
          <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
        </div>
        <el-table :data="taskDataList" border height="760" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" ref="serveTable" @selection-change="handleSelectionChange" @row-click="rowSelectChange" :summary-method="getSummaries" show-summary>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" :label="$t('sys_g070')" width="120" />
            <!-- <el-table-column prop="channel_name" show-overflow-tooltip :label="$t('sys_s011')" minWidth="130" /> -->
            <el-table-column prop="status" :label="$t('sys_l059')" width="120">
              <template slot="header">
                <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
                  <span style="color:#909399" :class="[model1.status?'dropdown_title':'']"> {{ $t('sys_l059') }}
                      <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :class="{'dropdown_selected':idx==model1.status}" v-for="(item,idx) in statusOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                  </el-dropdown-menu>
                  </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.status==1?'info':scope.row.status==2?'warning':scope.row.status==4?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag>
                <!-- <el-tag size="small" :type="scope.row.status==1?'primary':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag> -->
              </template>
            </el-table-column>
            <el-table-column prop="content" show-overflow-tooltip :label="$t('sys_s017')" minWidth="150" />
            <el-table-column prop="data_pack_name" :label="$t('sys_rai090')" minWidth="120">
                <template slot-scope="scope">
                  {{scope.row.data_pack_name||"-" }}
                </template>
            </el-table-column>
            <el-table-column prop="total_num" :label="$t('sys_s027')" minWidth="100" />
            <el-table-column prop="not_start_num" :label="$t('sys_s015')" minWidth="100" />
            <el-table-column prop="sucess_num" :label="$t('sys_s019')" minWidth="100">
                <template slot-scope="scope">
                  <!-- {{ scope.row.sucess_num }} ({{ scope.row.sucess_rate*100 }}%) -->
                  {{ scope.row.sucess_num }} ({{ parseFloat((scope.row.sucess_rate*100).toFixed(2))}}%)
                </template>
            </el-table-column>
            <el-table-column prop="fail_num" :label="$t('sys_s020')" minWidth="100" />
            <el-table-column prop="expend_num" :label="$t('sys_s032')" minWidth="100" />
            <el-table-column prop="unknown_num" :label="$t('sys_s033')" minWidth="100" />
            <el-table-column prop="expend" :label="$t('sys_s028')" width="100" />
            <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="160">
                <template slot-scope="scope">
                  {{$baseFun.resetTime(scope.row.itime*1000)||"-" }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('sys_c010')" width="200">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" size="small" @click="jumpCreatTask(scope.row,1)">{{ $t('sys_c077') }}</el-button> -->
                    <el-button :disabled="checkIdArry.length>0" type="primary" size="mini" @click.stop="goTaskDetail(scope.row)">{{ $t('sys_m063') }}</el-button>
                    <!-- <el-button :disabled="checkIdArry.length>0" type="success" plain size="mini" @click.stop="exportText(scope.row)">{{ $t('sys_c080') }}</el-button> -->
                    <el-button @click.stop type="text" size="mini">
                        <el-dropdown @command="(command)=>{handleCommand(scope.row,command)}" trigger="click">
                            <span class="el-dropdown-link">
                              <el-button type="warning" size="mini" :disabled="checkIdArry.length>0">
                                {{ $t('sys_c080') }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                              </el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(item,idx) in moreOption" :key="idx" :command="{item,idx}" v-show="idx!=0">
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
            <el-pagination background @size-change="sizeHandle" @current-change="pageHandle"
                :page-sizes="pageOption" :current-page.sync="model1.page" :page-size="model1.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="model1.total">
            </el-pagination>
        </div>
      </div>
  </div>
</template>
<script>
import { successTips, resetPage } from '@/utils/index'
import { getsmstasklist,delsmstasklist,getchannellist,exportsmstaskinfolist} from "@/api/rcs"
export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 10,
        total: 0,
        status:"",
        task_time: "",
        task_name: "",
        channel_id:""
      },
      loading:false,
      checkIdArry:[],
      goodsList:[],
      pageOption: resetPage(),
      taskDataList:[],
      showNum: [8,9,10,11,12]
    }
  },
  computed: {
    groupRules() {
      return {
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        plant_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'blure' }],
        set_account: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat063')}), trigger: 'blure' }],
        set_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat062')}), trigger: 'blure' }],
        set_pwd: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_g031')}), trigger: 'blure' }]
      }
    },
    statusOptions(){
      return ["",this.$t('sys_s015'),this.$t('sys_s030'),this.$t('sys_c048'),this.$t('sys_mat047')]
    },
    moreOption(){
      return  ["","全部数据","异常数据"]
    }
  },
  created() {
    this.getTaskList();
    this.getGoodsList();
  },
  methods: {
      resetQuery(){
        this.model1.status="";
        this.model1.task_time="";
        this.model1.task_name="";
        this.model1.channel_id="";
        this.getTaskList(1);
      },
      //获取配置列表
      getGoodsList(){
        getchannellist().then(res =>{
          this.goodsList = res.data.list || [];
        })
      },
      handleNewwork(status) {
        this.model1.status = status;
        this.getTaskList(1);
      },
      getTaskList(num){
        this.loading=true;
        const sTime = this.model1.task_time;
        this.model1.page=num?num:this.model1.page;
        let params = {
          page:this.model1.page,
          limit:this.model1.limit,
          status:this.model1.status||-1,
          name:this.model1.task_name,
          channel_id:this.model1.channel_id,
          start_time: sTime ? this.$baseFun.mexicoTime(sTime[0], 1) : -1,
          end_time: sTime ? this.$baseFun.mexicoTime(sTime[1], 2) : -1
        }
        getsmstasklist(params).then(res=>{
          this.loading=false;
          this.model1.total = res.data.total;
          this.taskDataList = res.data.list||[];
          this.$nextTick(()=>{
            if (this.$refs.serveTable) {
                this.$refs.serveTable.doLayout(); 
            }
          })
        })
      },
      goTaskDetail(row){
        this.$router.push({path:'/rcs-tetail',query:{params:row,task_id:row.id}});
      },
      handleSelectionChange(row) {
        this.checkIdArry = row.map(item => { return item.id })
      },
      rowSelectChange(row, column, event) {
        let refsElTable = this.$refs.serveTable;
        let findRow = this.checkIdArry.find(item => item == row.id);
        if (findRow) {
            refsElTable.toggleRowSelection(row, false);
            return;
        }
        refsElTable.toggleRowSelection(row,true);
      },
      sizeHandle(val){
        this.model1.limit=val;
        this.getTaskList();
      },
      pageHandle(val){
        this.model1.page=val;
        this.getTaskList();
      },
      jumpCreatTask(row,idx){
        if (idx == 0) {
          this.$router.push("/creat-rcs")
        }else{
          this.$router.push({path:"/creat-rcs",query:{config:row}})
        }
      },
      handleDel(){
          let that = this;
          that.$confirm(that.$t('sys_c046',{value:that.$t('sys_c028')}), that.$t('sys_l013'), {
              type: 'warning',
              confirmButtonText: that.$t('sys_c024'),
              cancelButtonText: that.$t('sys_c023'),
              beforeClose: function (action, instance, done) {
                  if (action === 'confirm') {
                      instance.confirmButtonLoading = true;
                      delsmstasklist({del_id:that.checkIdArry}).then(res => {
                          instance.confirmButtonLoading = false;
                          if (res.code != 0) return;
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
      async handleCommand(row,command){
        const {data:{url}} = await exportsmstaskinfolist({task_id:row.id,type:command.idx});
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
            return;
          }else if(this.showNum.indexOf(index) > -1){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return parseFloat((prev+curr).toFixed(3));
              } else {
                console.log("011");
                return prev;
              }
            },0);
          }else{
            sums[index] = '--';	
          }
        });
        return sums;
      },
      exportText(row){
        doouttaskexcel({id:row.id}).then(res=>{
          if (res.code != 0) return;
            // this.getTaskList();
            window.location.href = res.data.url
        })
      }
  }
}
</script>
<style scoped lang="scss">
.continer_main {
  width: 100%;
}
</style>
  