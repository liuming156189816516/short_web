<template>
    <div class="view_warp" ref="heightEle">
      <el-button size="small" @click="$router.go(-1)">
        <i class="el-icon-back"></i>
        <span>{{$t('sys_q006')}}</span>
      </el-button>
      <div class="continer_main" style="width: 100%;margin-top: 30px;">
            <div class="left_mess">
                <div class="radio_warp">
                    <el-radio-group v-model="task_type" size="small" @change="handleTab">
                        <el-radio :label="idx" border v-for="(item,idx) in labelOption" :key="idx">{{ item }}</el-radio>
                    </el-radio-group>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-form size="small" style="width:100%;" :model="taskForm" :rules="taskRules" ref="taskForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item :label="$t('sys_g070')" prop="apply_name">
                                <el-input clearable v-model="taskForm.apply_name" :placeholder="$t('sys_mat061',{value:$t('sys_g070')})"/>
                            </el-form-item>
                            <template v-if="task_type==0">
                                <el-form-item :label="labelOption[task_type]" prop="apply_mobile">
                                    <el-input type="textarea" clearable v-model="taskForm.apply_mobile" :placeholder="$t('sys_mat061',{value:$t('sys_s021')})" rows="6" />
                                    <p style="margin: 0;color:#99A1B7;line-height: 1;font-size: 14px;margin: 10px 0 5px 0;">手机号以换行符分隔，最多100,000个，更多用导入。如：</p>
                                    <p style="margin: 0;color:#99A1B7;line-height: 1;font-size: 14px;">55177****7466</p>
                                </el-form-item>
                            </template>
                            <template v-if="task_type==1">
                                <el-form-item :label="labelOption[task_type]" prop="phone_list">
                                    <div>{{ $t('sys_c114') }}</div>
                                    <div class="submit_btn">
                                        <el-button class="custom_file1" :disabled="stepsHide" :loading="stepsHide" style="margin-top: 0;">{{ stepsHide?$t('sys_q015'):$t('sys_c059') }}
                                            <input type="file" ref='uploadclear' @change="checkDataIsUse" id="uploadFile" />
                                        </el-button>
                                        <span class="export_tips" @click="downLoadTemp">
                                            <i class="el-icon-download" />{{ $t('sys_l066') }}
                                        </span>
                                    </div>
                                    <transition name="el-zoom-in-top">
                                        <div class="mobile_list" v-if="showFile">
                                            <span>有效: <em>{{sucess_num }}</em></span>
                                            <span>错误: <em>{{fail_num }}</em></span>
                                            <span>重复: <em>{{repeat_num }}</em></span>
                                            <span>国家: <em>{{country_num }}</em></span>
                                        </div>
                                    </transition>
                                </el-form-item>
                            </template>
                            <template v-if="task_type==2">
                                <el-form-item :label="labelOption[task_type]" prop="data_pack_id">
                                    <el-select v-model="taskForm.data_pack_id" :placeholder="$t('sys_c052')">
                                        <el-option clearable v-for="item in datapackList" :key="item.id" :label="item.name+'(入库数量：'+item.into_num+'，剩余数量：'+item.residue_num+')'"  :value="item.id" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="$t('sys_s027')" prop="apply_total">
                                    <el-input clearable v-model="taskForm.apply_total" oninput="value=value.replace(/[^\d]/g,'')"  :placeholder="$t('sys_mat061',{value:$t('sys_s027')})"/>
                                </el-form-item>
                            </template>
                            <el-form-item label="SenderId">
                                <el-select v-model="taskForm.sender_id" :placeholder="$t('sys_c052')">
                                    <el-option v-for="item in channelkList" :key="item.id" :label="item.name+' (单价:'+item.price+'; SenderId:'+item.channel_id+')'" :value="item.channel_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="发送话术" prop="apply_say">
                                <el-row style="margin-bottom: 10px;">
                                    <el-button type="primary" plain @click="showShortList">常用短信</el-button>
                                </el-row>
                                <el-input type="textarea" clearable v-model="taskForm.apply_say" :placeholder="$t('sys_mat061',{value:$t('sys_rai091')})" rows="6" />
                            </el-form-item>
                            <el-form-item style="display: flex;justify-content: center;" label-width="0">
                                <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                                <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">提交表单</el-button>
                            </el-form-item>
                            <!-- <el-form-item :label="$t('sys_q131')+'：'" prop="materialData" class="custom_say">
                                <div class="mess_01">
                                    <el-button type="primary" size="mini" v-for="(item,idx) in btnOption" :key="idx" @click="showPropModel(idx)" v-show="item!=''">{{ item }}</el-button>
                                    <el-table :data="taskForm.materialData" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" style="width: 100%">
                                        <el-table-column type="index" :label="$t('sys_g020')"></el-table-column>
                                        <el-table-column prop="type" :label="$t('sys_g091')" minWidth="120">
                                            <template slot-scope="scope">
                                                <span>{{ sourceOption[scope.row.type]}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="content" :label="$t('sys_mat019')" minWidth="100">
                                            <template slot-scope="scope">
                                                <span class="content_01" v-if="scope.row.type==1||scope.row.type==5||scope.row.type==6||scope.row.type==7">{{ scope.row.content }}</span>
                                                <div v-if="scope.row.type==2">
                                                    <img class="content_02" :src="scope.row.content">
                                                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="scope.row.remark" />
                                                </div>
                                                <audio v-if="scope.row.type==3" controls class="audio_src">
                                                    <source :src="scope.row.content" type="audio/mpeg">
                                                </audio>
                                                <video v-if="scope.row.type==4" width="60" height="35" controls>
                                                    <source :src="scope.row.content" type="video/mp4">
                                                </video>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="address" :label="$t('sys_c010')" width="120">
                                            <template slot-scope="scope">
                                                <el-button class="custom_btn" size="mini" v-if="scope.row.type!=5" @click="editScript(scope.row,scope)">
                                                    <i class="el-icon-edit" />
                                                </el-button>
                                                <el-button class="custom_btn" size="mini" @click="delScript(scope)">
                                                    <i class="el-icon-delete-solid" />
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-form-item> -->
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="modile_model">
                <div class="model_main">
                    <div class="mobile_cover">
                        <div class="mobile_head">
                            <span class="local_time">{{ viewTime }}</span>
                        </div>
                        <div :class="['mess_content',taskForm.apply_say?'mess_cover':'']">
                            <div class="mess_title" v-if="taskForm.apply_say">
                                <p>信息</p>
                                <p>今天 {{ viewTime }}</p>
                            </div>
                            <transition name="run">
                                <div v-if="taskForm.apply_say" class="talk_dialog">
                                    {{taskForm.apply_say}}
                                    <!-- 习近平在澳门国际机场发表讲话 来源：央视新闻客户端 习近平18日下午乘专机抵达澳门，并在机场发表讲话。 -->
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="短信列表" center :visible.sync="shortSource" width="800px">
            <el-button type="primary" size="mini" class="fr" style="margin-bottom: 10px;" @click="creatShrtBtn(0,1)">{{ $t('sys_s025') }}</el-button>
            <el-table :data="datashortList" ref="el_table" @row-click="rowSelectChange" border v-loading="isSloading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }"  :close-on-click-modal="false" style="width: 100%;">
                <el-table-column label="#" width="55" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="channel_name" :label="$t('sys_s011')" minWidth="100" />
                <el-table-column prop="channel_id" label="SenderId" width="100" />
                <el-table-column prop="content" show-overflow-tooltip :label="$t('sys_mat019')" minWidth="160" />
                <el-table-column fixed="right" :label="$t('sys_c010')" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" plain @click.stop="creatShrtBtn(scope.row,2)">{{ $t('sys_c027') }}</el-button>
                        <el-popconfirm :confirm-button-text="$t('sys_c024')" @confirm="delGroup(scope.row)" :cancel-button-text="$t('sys_c023')" icon="el-icon-info" icon-color="red" title="容确定删除吗？">
                            <!-- <el-button slot="reference">删除</el-button> -->
                            <el-button slot="reference" type="danger" @click.stop size="mini" plain style="margin-left: 10px;">{{ $t('sys_c028') }}</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-form size="small" style="width:100%;margin-top: 20px;">
                <el-form-item style="display: flex;justify-content: center;">
                    <el-button @click="shortSource=false">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" :disabled="!store_row" @click="submitBtn">{{ $t('sys_c024') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="this.taskForm.ptype==1?'新增短信':'编辑短信'" center :visible.sync="creatSource" :close-on-click-modal="false" width="500px">
            <el-form size="small" style="width:100%;" :model="taskForm" :rules="taskRules" ref="taskForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('sys_s017')" prop="content">
                    <el-input type="textarea" clearable v-model="taskForm.content" :placeholder="$t('sys_mat061',{value:$t('sys_s017')})" rows="4" />
                </el-form-item>
                <el-form-item style="display: flex;justify-content: center;" label-width="0">
                    <el-button @click="creatSource=false">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" :loading="showtloading" @click="createForm('taskForm')">{{ $t('sys_c024') }}</el-button>
                </el-form-item>
            </el-form>
            <!-- <el-table :data="shortList" border v-loading="isSloading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                <el-table-column prop="date" label="ID" minWidth="100" />
                <el-table-column prop="date" label="spid" minWidth="100" />
                <el-table-column prop="date" label="描述" minWidth="160" />
                <el-table-column fixed="right" :label="$t('sys_c010')" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" plain>{{ $t('sys_c027') }}</el-button>
                        <el-button type="primary" size="mini" plain>{{ $t('sys_c028') }}</el-button>
                    </template>
                </el-table-column>
            </el-table> -->
        </el-dialog>
        <el-dialog title="选择素材" center :visible.sync="showSource" :close-on-click-modal="false" width="60%">
            <material :key="source_type==1?Math.floor(new Date().getTime()):''" @changeEle="getChildren" @closeDialog="showSource=false" :message="childMess" />
        </el-dialog>
        <el-dialog title="添加链接" center :visible.sync="showLink" :close-on-click-modal="false" width="560px">
            <el-form size="small" :model="linkForm" :rules="linkRules" ref="linkForm" label-width="100px" class="demo-ruleForm">
                <template v-if="source_type==2">
                    <el-form-item :label="$t('sys_mat096')+':'" prop="link_title">
                        <el-input v-model="linkForm.link_title" :placeholder="$t('sys_mat061',{value:$t('sys_mat019')})" />
                    </el-form-item>
                    <el-form-item :label="$t('sys_mat097')+':'" prop="link_address">
                        <el-input v-model="linkForm.link_address" :placeholder="$t('sys_mat102',{value:$t('sys_mat019')})" />
                    </el-form-item>
                </template>
                <template v-if="source_type==4">
                    <el-form-item :label="$t('sys_mat098')+':'" prop="card_type">
                        <el-radio-group v-model="linkForm.card_type">
                            <el-radio :label="1">{{ $t('sys_mat101') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="card_text" style="margin-bottom: 10px;">
                        <el-input v-model="linkForm.card_text" type="textarea" :rows="8" :placeholder="$t('sys_mat102')" />
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="linkForm.update_text">{{ $t('sys_mat099') }}</el-checkbox>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="showLink=false">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" @click="submitLink('linkForm')">确认</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
  </template>
  
<script>
  import { getGoodName } from '@/utils/auth'
  import { successTips } from '@/utils/index'
  import material from '../content/material.vue';
  import { getdatapacklist } from '@/api/datamanage'
  import { getsmstalklist,dosmstalk,getchannellist,createsmstask,checkfile } from "@/api/config"
  export default {
    components:{material},
    data() {
      return {
        totalNum:0,
        is_index:"",
        source_type:"",
        task_type:0,
        viewTime:null,
        stepsHide:false,
        showFile:false,
        showLink:false,
        isLoading:false,
        showSource:false,
        shortSource:false,
        isSloading:false,
        creatSource:false,
        showtloading:false,
        childMess:{
            check:false,
            is_show:1,
            type:0
        },
        taskForm:{
            id:"",
            ptype:null,
            apply_name:"",
            apply_mobile:"",
            sender_id:"",
            apply_say:"",
            data_pack_id:"",
            content:"",
            apply_total:null,
            phone_list:[],
            materialData:[],
        },
        linkForm:{
            link_title:"",
            link_address:"",
            card_type:1, 
            card_text:"",
            update_text:true
        },
        rowShort:null,
        sucess_num:0, //有效
        fail_num:0,    //错误
        repeat_num:0,  //重复
        country_num:0, //国家
        sure_row:null,
        store_row:null,
        datapackList:[],
        channelkList:[],
        datashortList:[],
        accountGroupList:[],
        marketingList:[],
        embeddedList:[],
        checkIdArry:[]
      }
    },
    computed: {
        labelOption(){
            return ["手动上传","文件导入","从数据包"]
        },
        taskRules() {
            return {
                apply_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_g070')}), trigger: 'blur' }],
                apply_mobile: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_s021')}), trigger: 'blur' }],
                apply_say: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_rai091')}), trigger: 'blur' }],
                sender_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                apply_total:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_s027')}), trigger: 'blur' }],
                data_pack_id: [{required: true, message: this.$t('sys_c089',{value:this.$t('sys_rai090')}), trigger: 'change' }],
                phone_list: [{type: 'array', required: true, message: this.$t('sys_c089',{value:this.$t('sys_s014')}), trigger: 'change' }],
                content: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }],
            }
        },
        linkRules(){
            return {
                link_title: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }],
                link_address: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }],
                card_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
                card_text: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }]
            }
        },
        btnOption(){
            return ["",this.$t('sys_mat093')]
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092')]
        }
    },
    created(){
        this.getChanneList();
        setInterval(this.currentTime,1000);
    },
    methods:{
        currentTime(){
            let time = new Date();
            let Hour = time.getHours();
            let Minute = time.getMinutes();
            if (Hour < 10) {
                Hour = '0' + Hour
            }
            if (Minute < 10) {
                Minute = '0' + Minute
            }
            this.viewTime = Hour+":"+Minute;
        },
        rowSelectChange(row){
            for (let i = 0; i < this.datashortList.length; i++) {
                this.datashortList[i].checked = false;
                if (this.datashortList[i].id == row.id && !row.checked) {
                    let item = this.datashortList[i];
                    this.store_row = item;
                    item.checked = true;
                    this.$set(this.datashortList, i, item);
                }
            }
        },
        submitBtn(){
            this.sure_row = this.store_row;
            this.taskForm.sender_id=this.sure_row.channel_id,
            this.taskForm.apply_say=this.sure_row.content,
            this.shortSource=false;
        },
        handleTab(val){
            this.showFile=false;
            if(val == 2){
                this.getDatalist();
            }
            this.total_num="";
            this.sure_row=null;
            this.store_row=null;
            this.taskForm.apply_name="";
            this.taskForm.apply_mobile="";
            this.taskForm.phone_list="";
            this.taskForm.sender_id="";
            this.taskForm.apply_say="";
            this.taskForm.data_pack_id="";
            this.taskForm.apply_total=null;
            this.$refs.taskForm.resetFields();
        },
        async getChanneList() {
            const { data:{list} } = await getchannellist();
            this.channelkList = list || [];
        },
        async getDatalist() {
            const { data:{list} } = await getdatapacklist();
            this.datapackList = list || [];
        },
        showShortList(){
            this.store_row=null;
            this.getShortlist();
            this.shortSource=true;
        },
        creatShrtBtn(row,idx){
            this.taskForm.ptype=idx;
            this.taskForm.id=row.id||"";
            this.taskForm.content=row.content||"";
            this.creatSource=true;
            if(idx == 1){
                this.$refs.taskForm.resetFields();
                this.taskForm.content="";
            }
        },
        async checkDataIsUse() {
            let formData = new FormData();
            let files = this.$refs.uploadclear.files[0];
            formData.append('file', files);
            this.stepsHide=true;
            this.$refs.taskForm.clearValidate("phone_list");
            const result = await checkfile(formData);
            this.stepsHide=false;
            this.$refs.uploadclear.value = null;
            if (result.code != 0) return;
            let {data:{sucess_num,fail_num,repeat_num,country_num,phone_list}} = result;
            this.sucess_num = sucess_num;
            this.fail_num = fail_num;
            this.repeat_num = repeat_num;
            this.country_num = country_num;
            this.taskForm.phone_list = phone_list;
            this.showFile=true;
        },
        async getShortlist() {
            this.isSloading=true;
            const { data:{list} } = await getsmstalklist();
            this.isSloading=false;
            this.datashortList = list.map(item=>{return {...item,checked:false}}) || [];
            if(this.sure_row){
                for (let i = 0; i < this.datashortList.length; i++) {
                    this.datashortList[i].checked = false;
                    if (this.datashortList[i].id == this.sure_row.id) {
                        let item = this.datashortList[i];
                        this.store_row = item;
                        item.checked = true;
                        this.$set(this.datashortList, i, item);
                    }
                }
            }
        },
        async delGroup(row) {
            this.datashortList = this.datashortList.filter(item=>item.id!==row.id);
            const res = await dosmstalk({ptype:3,del_id:[row.id] });
            if(res.code)return;
            successTips(this)
        },
        createForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        id:this.taskForm.id,
                        ptype:this.taskForm.ptype,
                        total_num:this.taskForm.apply_total,
                        channel_id:getGoodName().channel_id||"",
                        content:this.taskForm.content,
                    }
                    this.showtloading=true;
                    this.taskForm.ptype==1?delete params.id:"";
                    dosmstalk(params).then( res =>{
                        this.showtloading=false;
                        if(res.code)return;
                        this.getShortlist();
                        this.creatSource=false;
                    })
                }
            })      
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let index = this.task_type+1;
                    let params = {
                        ptype:index,
                        name:this.taskForm.apply_name,
                        content:this.taskForm.apply_say,
                        phone_str:this.taskForm.apply_mobile,
                        phone_list:this.taskForm.phone_list,
                        channel_id:this.taskForm.sender_id,
                        total_num:Number(this.taskForm.apply_total),
                        data_pack_id:this.taskForm.data_pack_id
                    }
                    if(index != 1){
                        delete params.phone_str
                    }
                    if(index != 2){
                        delete params.phone_list
                    }
                    if(index != 3){
                        delete params.total_num;
                        delete params.total_num;
                        delete params.data_pack_id;
                    }
                    // console.log(params);
                    this.isLoading=true;
                    createsmstask(params).then(res => {
                        this.isLoading=false;
                        if (res.code != 0) return;
                        this.$router.go(-1);
                        successTips(this)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getChildren(msg){
            this.showSource=false;
            let item = JSON.parse(msg);
            msg.type==2?item.remark="":"";
            if (this.source_id) {
                for (let k = 0; k < this.taskForm.materialData.length; k++) {
                    if (this.taskForm.materialData[k].id == this.source_id) {
                        this.$set(this.taskForm.materialData,k,item)
                    }
                }
            }else{
                this.taskForm.materialData.push(item)
            }
            this.$refs.taskForm.clearValidate('materialData');
        },
        showPropModel(type){
            this.is_index = "";
            this.source_id = "";
            this.source_type = type;
            if (type == 1) {
                this.childMess.type="";
                this.showSource=true;
            }else if(type == 2||type == 4){
                this.showLink=true;
                this.$nextTick(()=>{
                    this.$refs.linkForm.resetFields();
                })
            }else if(type == 3){
                this.taskForm.materialData.push({type:5,content:this.$t('sys_mat091')})
                this.$refs.taskForm.clearValidate('materialData');
            }
        },
        submitLink(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.showLink=false;
                    let index = this.taskForm.materialData[this.is_index];
                    if (index) {
                        for (let k = 0; k < this.taskForm.materialData.length; k++) {
                            if (this.is_index === k) {
                                let item = this.taskForm.materialData[k];
                                item.content=this.linkForm.card_text;
                                this.$set(this.taskForm.materialData,k,item)
                            }
                        }
                    }else{
                        let newObj = {id:"",type:this.source_type==2?5:6,}
                        this.source_type==2?this.linkForm.title=this.linkForm.link_title:"";
                        newObj.content=this.source_type==2?this.linkForm.link_address:this.linkForm.card_text
                        this.taskForm.materialData.push(newObj);
                    }
                    this.$refs.taskForm.clearValidate('materialData');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        editScript(row,idx){
            if (row.type == 6) {
                this.showLink = true;
                this.is_index = idx.$index;
                this.$nextTick(()=>{
                    this.linkForm.card_text = row.content;
                    // this.linkForm.link_title = row.content;
                    // this.linkForm.link_address = row.content; 
                })
            }else{
                this.source_type = 1;
                this.source_id = row.id;
                this.childMess.type=String(row.type);
                this.showSource=true;
            }
        },
        delScript(row){
            for (let k = 0; k < this.taskForm.materialData.length; k++) {
                if (k === row.$index) {
                    this.taskForm.materialData.splice(k,1)
                }
            }
        },
        downLoadTemp(){
            var blob = new Blob(["556920354896\n","556920354898"], { type: 'text/plain' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = "phone.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(a.href);
        }
    }
  }
  </script>
  <style lang="scss" scoped>
  .continer_main{
      width: 100%;
      padding-right: 30px;
      display: flex;
      .mess_title{
        font-weight: 400;
        color: #1f2f3d;
        font-size: 22px;
    }
    .content_01{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .audio_src{
        width: 140px;
        height: 30px;
    }
    .content_02{
        width: 44px;
        height: 28px;
    }
    .custom_btn{
        padding: 0;
        color: #409eff;
        background: transparent;
        border-color: transparent;
        i{
            font-size: 16px;
        }
    }
    ::v-deep .el-alert{
        background: #ecf5ff;
        .el-alert__title{
            color: #409eff;
            font-size: 16px;
        }
    }
    ::v-deep .el-alert__description{
        font-size: 14px;
        line-height: 24px;
    }
    .custom_mess, .custom_say{
        .mess_01{
            width: 100%;
            padding: 10px 16px 10px 16px;
            background-color: #ecf5ff;
            border-radius: 4px;
            position: relative;
            box-sizing: border-box;
        }
    }
    .custom_say{
        .mess_01{
            border-radius: 4px;
            background: transparent;
            border: 1px solid #dcdfe6;
        }
    }
  }
  .left_mess{
      width: 80%;
      padding: 0 5%;
      box-sizing: border-box;
      margin-right: 30px;
      .radio_warp{
          display: flex;
          margin-bottom: 20px;
          justify-content: center;
          .el-radio-group{
              .el-radio{
                  margin-right: 0;
              }
          }
      }
      .mobile_list{
        width: 100%;
        display: flex;
        margin-top: 10px;
        padding: 6px 10px;
        border-radius: 4px;
        box-sizing: border-box;
        background: #FFF8DD;
        span{
            flex: 1;
            color: #624d00;
            display: flex;
            justify-content: center;
            em{
                font-weight: 600;
                font-style: normal;
            }
        }
        span:first-child{
            justify-content: flex-start;
        }
        span:last-child{
            justify-content: flex-end;
        }
      }
    .label_radius_title::after{
        content: "";
        width: 4px;
        height: 4px;
        font-size: 20px;
        border-radius: 50%;
        position: absolute;
        left: -16px;
        top: 50%;
        transform: translateY(-50%);
        background-color: #606266;
    }
  }
  .modile_model{
      display: flex;
      width: 300px;
      height: 600px;
      position: relative;
      flex-shrink: 0;
      margin-top: -30px;
      background: url(../../assets/iphone.png) no-repeat;
      background-size:cover;
      .model_main{
          width: 100%;
          height: 100%;
          padding: 30px 26px;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          .mobile_cover{
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              border-radius: 30px;
              // background: rgba($color:red,$alpha:.5);
              .mobile_head{
                  display: flex;
                  .local_time{
                      width: 80px;
                      height: 30px;
                      font-size: 12px;
                      color: #99A1B7;
                      padding: 10px 0 0 8px;
                      border-radius: 30px 0 0 0;
                      background: #F9F9F9;
                  }
              }
              .mess_content{
                  width: 100%;
                  overflow: hidden;
                  padding: 0 20px;
                  margin-top: 78px;
                  box-sizing: border-box;
                  border-bottom-left-radius: 30px;
                  border-bottom-right-radius: 30px;
                  height: calc(100% - 120px);
                  .mess_title{
                      gap: 5px;
                      display: flex;
                      margin: 10px 0;
                      font-size: 12px;
                      color: #99A1B7;
                      align-items: center;
                      flex-direction: column;
                      p{
                          margin: 0;
                      }
                  }
                  .talk_dialog{
                      position: relative;
                      z-index: 0;
                      color: #fff;
                      padding: 10px;
                      font-size: 12px;
                      line-height: 1.3;
                      border-radius: 10px;
                      background: #1b84ff;
                  }
                  .talk_dialog:after{
                      content: "";
                      position: absolute;
                      left: 0;
                      bottom: 0;
                      width: 10px;
                      height: 10px;
                      margin-left: -5px;
                      color: #1b84ff;
                      border-top: 6px solid;
                      border-top-left-radius: 80%;
                      -ms-transform: skewX(-30deg) scaleY(1.3);
                      transform: skew(-30deg) scaleY(1.3);
                      z-index: -1;
                  }
                  .run-enter-active{
                      animation: bounceInLeft .5s linear 0s;
                  }
                  @-webkit-keyframes bounceIn {
                      0%,20%,40%,60%,80%,to {
                          -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
                          animation-timing-function: cubic-bezier(.215,.61,.355,1)
                      }

                      0% {
                          opacity: 0;
                          -webkit-transform: scale3d(.3,.3,.3);
                          transform: scale3d(.3,.3,.3)
                      }

                      20% {
                          -webkit-transform: scale3d(1.1,1.1,1.1);
                          transform: scale3d(1.1,1.1,1.1)
                      }

                      40% {
                          -webkit-transform: scale3d(.9,.9,.9);
                          transform: scale3d(.9,.9,.9)
                      }

                      60% {
                          opacity: 1;
                          -webkit-transform: scale3d(1.03,1.03,1.03);
                          transform: scale3d(1.03,1.03,1.03)
                      }

                      80% {
                          -webkit-transform: scale3d(.97,.97,.97);
                          transform: scale3d(.97,.97,.97)
                      }

                      to {
                          opacity: 1;
                          -webkit-transform: scale3d(1,1,1);
                          transform: scaleZ(1)
                      }
                  }

                  @keyframes bounceIn {
                      0%,20%,40%,60%,80%,to {
                          -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
                          animation-timing-function: cubic-bezier(.215,.61,.355,1)
                      }

                      0% {
                          opacity: 0;
                          -webkit-transform: scale3d(.3,.3,.3);
                          transform: scale3d(.3,.3,.3)
                      }

                      20% {
                          -webkit-transform: scale3d(1.1,1.1,1.1);
                          transform: scale3d(1.1,1.1,1.1)
                      }

                      40% {
                          -webkit-transform: scale3d(.9,.9,.9);
                          transform: scale3d(.9,.9,.9)
                      }

                      60% {
                          opacity: 1;
                          -webkit-transform: scale3d(1.03,1.03,1.03);
                          transform: scale3d(1.03,1.03,1.03)
                      }

                      80% {
                          -webkit-transform: scale3d(.97,.97,.97);
                          transform: scale3d(.97,.97,.97)
                      }

                      to {
                          opacity: 1;
                          -webkit-transform: scale3d(1,1,1);
                          transform: scaleZ(1)
                      }
                  }

                  .animate__bounceIn {
                      -webkit-animation-duration: .75s;
                      animation-duration: .75s;
                      -webkit-animation-duration: calc(var(--animate-duration) * .75);
                      animation-duration: calc(var(--animate-duration) * .75);
                      -webkit-animation-name: bounceIn;
                      animation-name: bounceIn
                  }

                  @-webkit-keyframes bounceInLeft {
                      0%,60%,75%,90%,to {
                          -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
                          animation-timing-function: cubic-bezier(.215,.61,.355,1)
                      }

                      0% {
                          opacity: 0;
                          -webkit-transform: translate3d(-3000px,0,0) scaleX(1.2);
                          transform: translate3d(-3000px,0,0) scaleX(1.2)
                      }

                      60% {
                          opacity: 1;
                          -webkit-transform: translate3d(25px,0,0) scaleX(1);
                          transform: translate3d(25px,0,0) scaleX(1)
                      }

                      75% {
                          -webkit-transform: translate3d(-10px,0,0) scaleX(.98);
                          transform: translate3d(-10px,0,0) scaleX(.98)
                      }

                      90% {
                          -webkit-transform: translate3d(5px,0,0) scaleX(.995);
                          transform: translate3d(5px,0,0) scaleX(.995)
                      }

                      to {
                          -webkit-transform: translate3d(0,0,0);
                          transform: translateZ(0)
                      }
                  }

                  @keyframes bounceInLeft {
                      0%,60%,75%,90%,to {
                          -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
                          animation-timing-function: cubic-bezier(.215,.61,.355,1)
                      }

                      0% {
                          opacity: 0;
                          -webkit-transform: translate3d(-30px,0,0) scaleX(1.2);
                          transform: translate3d(-30px,0,0) scaleX(1.2)
                      }

                      60% {
                          opacity: 1;
                          -webkit-transform: translate3d(25px,0,0) scaleX(1);
                          transform: translate3d(25px,0,0) scaleX(1)
                      }

                      75% {
                          -webkit-transform: translate3d(-10px,0,0) scaleX(.98);
                          transform: translate3d(-10px,0,0) scaleX(.98)
                      }

                      90% {
                          -webkit-transform: translate3d(5px,0,0) scaleX(.995);
                          transform: translate3d(5px,0,0) scaleX(.995)
                      }

                      to {
                          -webkit-transform: translate3d(0,0,0);
                          transform: translateZ(0)
                      }
                  }

                  .animate__bounceInLeft {
                      -webkit-animation-name: bounceInLeft;
                      animation-name: bounceInLeft;
                  }
              }
              .mess_cover{
                  background: #ffffff;
              }
          }
      }
  }
</style>