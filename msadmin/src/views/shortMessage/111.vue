<template>
    <div>
        <el-button size="small" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
            <span>{{$t('sys_q006')}}</span>
        </el-button>
        <div class="continer_main" style="width: 100%;margin-top: 30px;">
            <div class="left_mess">
                <div class="radio_warp">
                    <el-radio-group v-model="task_type" size="small">
                        <el-radio label="1" border>手动上传</el-radio>
                        <el-radio label="2" border>文件导入</el-radio>
                        <el-radio label="3" border>从通讯录</el-radio>
                    </el-radio-group>
                </div>
                <el-row >
                    <el-col :span="24">
                        <el-form size="small" style="width:100%;" :model="quickForm" :rules="quickRules" ref="quickForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="手动上传" prop="reply_name">
                                <el-input type="textarea" clearable v-model="quickForm.reply_name" :placeholder="$t('sys_mat061',{value:$t('sys_s014')})" rows="6" />
                                <p style="margin: 0;color:#99A1B7;line-height: 1;font-size: 14px;margin: 10px 0 5px 0;">手机号以逗号、句号、换行符或制表符分隔，最多100,000个，更多用导入。如：</p>
                                <p style="margin: 0;color:#99A1B7;line-height: 1;font-size: 14px;">177****7466</p>
                            </el-form-item>
                            <el-form-item label="SenderID" prop="sender_id">
                                <el-select v-model="quickForm.sender_id" :placeholder="$t('sys_c052')">
                                    <el-option v-for="item in accountGroupList" :key="item.id" :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('sys_q122')" prop="keep_group_id_b">
                                <el-select v-model="quickForm.keep_group_id_b" :placeholder="$t('sys_c052')">
                                    <el-option v-for="item in accountGroupList" :key="item.id" :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item style="margin-top: 20px;">
                                <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                                <el-button type="primary" :loading="isLoading" @click="submitReply('quickForm')">{{ $t('sys_q120') }}</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="modile_model">
                <div class="model_main">
                    <div class="mobile_cover">
                        <div class="mobile_head">
                            <span class="local_time">12:58</span>
                        </div>
                        <div :class="['mess_content',quickForm.reply_name?'mess_cover':'']">
                            <div class="mess_title" v-if="quickForm.reply_name">
                                <p>信息</p>
                                <p>今天 12:53</p>
                            </div>
                            <transition name="run">
                                <div v-if="quickForm.reply_name" class="talk_dialog">
                                    {{quickForm.reply_name}}
                                    <!-- 习近平在澳门国际机场发表讲话 来源：央视新闻客户端 习近平18日下午乘专机抵达澳门，并在机场发表讲话。 -->
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .continer_main{
        width: 100%;
        padding-right: 30px;
        display: flex;
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
<script>
import { successTips } from '@/utils/index'
import material from '../content/material.vue';
// import { addkeeptask,getkeepgroup } from '@/api/task'
export default {
    components:{material},
    data() {
        return {
            id:"",
            group_id:"",
            source_id:"",
            task_type:"1",
            showMsg:false,
            isLoading:false,
            showSource:false,
            group_type:null,
            childMess:{
                check_len:0,
                check:true,
                is_show:1,
                type:0
            },
            draggedItemIndex:-1,
            accountGroupList:[],
            quickForm:{
                reply_name:"",
                group_id:"",
                group_link:"",
                ad_str:"",
                end_time:"",
                keep_group_id_b:"",
                source_list:[]
            }
        }
    },
    computed:{
        quickRules() {
            return {
                reply_name:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q001')}), trigger: 'change' }],
                group_id:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_q121')}), trigger: 'change' }],
                keep_group_id_b:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_q122')}), trigger: 'change' }],
                group_link:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q117')}), trigger: 'blure' }],
                ad_str:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_rai091')}), trigger: 'blure' }],
                end_time:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_g079')}), trigger: 'change' }],
                source_list:[{ type: 'array', required: true, message: this.$t('sys_c089',{value:this.$t('sys_q005')}), trigger: 'change' }],
            }
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092')]
        }
    },
    created(){
        // this.keepGroupList();
        setTimeout(()=>{
            this.showMsg =true;
        },3000)
    },
    methods:{
        dragStart(index) {
          this.draggedItemIndex = index;
        },
        async keepGroupList(){
            let {data:{list}} = await getkeepgroup();
            this.accountGroupList = list||[];
        },
        async submitReply(formName) {
            this.$refs[formName].validate(async(valid) => {
                if (valid) {
                    let params = {
                        name:this.quickForm.reply_name,
                        keep_group_id:this.quickForm.group_id,
                        group_url_str:this.quickForm.group_link,
                        ad_str:this.quickForm.ad_str,
                        keep_group_id_b:this.quickForm.keep_group_id_b,
                        end_time:this.$baseFun.resetTime(this.quickForm.end_time,3)
                    }
                    this.isLoading = true;
                    let res = await addkeeptask(params);
                    this.isLoading = false;
                    if (res.code !=0) return;
                    successTips(this);
                    this.$router.go(-1)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../content/add.scss';
</style>