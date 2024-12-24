<!--  -->
<template>
	<div class='container_coat'>
        <div class="condition_warp select_warp">
			<el-form inline>
                <el-form-item>
                    <el-input size="small" v-model="good_name" clearable :placeholder="$t('sys_mat061',{value:$t('sys_s011')})" style="width:230px;"></el-input>
				</el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="getConfigList(1)">{{ $t('sys_c002') }}</el-button>
                    <el-button size="small" icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
				</el-form-item>
                <el-form-item style="float:right;">
                    <el-button size="small" type="primary" @click="addConfigBtn(0,1)">{{ $t('sys_s013',{value:$t('sys_s010')}) }}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="switch_bar">
			<div class="consun_list handel_area">
				<el-table :data="goodsList" border style="width: 100%" height="700" v-loading="loading" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                    <el-table-column prop="name" :label="$t('sys_s011')" minWidth="230" align="center" />
                    <el-table-column prop="channel_id" label="SenderId" minWidth="230" align="center" />
                    <!-- <el-table-column prop="user_account" label="user_account" minWidth="230" align="center" /> -->
                    <!-- <el-table-column prop="user_secret" label="user_secret" minWidth="230" align="center" /> -->
                    <el-table-column prop="price" :label="$t('sys_s026')" minWidth="230" align="center" />
                    <el-table-column width="160" :label="$t('sys_c010')" align="center" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" plain @click="addConfigBtn(scope.row,2)">{{ $t('sys_c027') }}</el-button>
                            <el-button type="danger" size="mini" plain @click="delCardBtn(scope.row)">{{ $t('sys_c028') }}</el-button>
                        </template>
					</el-table-column>
				</el-table>
			</div>
		</div>
        <el-dialog :title="type==1?$t('sys_s013',{value:$t('sys_s010')}):$t('sys_mat016',{value:$t('sys_s010')})" :visible.sync="configModel" :close-on-click-modal="false" width="460px">
			<el-form size="small" :model="configForm" label-width="120px" :rules="configRules" ref="configForm">
                <el-form-item :label="$t('sys_s011')" prop="good_name">
                    <el-input clearable v-model="configForm.good_name" :placeholder="$t('sys_mat061',{value:$t('sys_s011')})" style="width:100%;" />
                </el-form-item>
                <el-form-item label="SenderId" prop="channel_id">
                    <el-input clearable v-model="configForm.channel_id" oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" :placeholder="$t('sys_mat061',{value:'SenderId'})" />
                </el-form-item>
                <!-- <el-form-item label="user_account" prop="good_account">
                    <el-input clearable v-model="configForm.good_account" oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" :placeholder="$t('sys_mat061',{value:'user_account'})" />
                </el-form-item>
                <el-form-item label="user_secret" prop="good_secret">
                    <el-input clearable v-model="configForm.good_secret" oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" :placeholder="$t('sys_mat061',{value:'user_secret'})" />
                </el-form-item> -->
                <el-form-item :label="$t('sys_s026')" prop="good_price">
                    <el-input clearable v-model="configForm.good_price" oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" :placeholder="$t('sys_mat061',{value: $t('sys_s012')})" />
                </el-form-item>
                <el-form-item :label="$t('sys_c005')" prop="status">
                    <el-radio-group v-model="configForm.status" :disabled="type==2">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">备用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label-width="0" style="text-align:center;">
                    <el-button @click="configModel=false">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" @click="submitSendBtn('configForm')" :loading="isLoading">{{ $t('sys_c024') }}</el-button>
                </el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { setChannel,getChannel } from '@/utils/auth'
import { successTips } from '@/utils/index'
import { getchannellist,dochannel } from "@/api/config"
export default {
	data() {
		return {
            type:null,
            good_name:"",
            loading:false,
            goodsList:[],
            isLoading:false,
            configModel:false,
            configForm:{
				id:"",
                status:1,
                good_name:"",
                good_spid:"",
                channel_id:"",
                good_account:"",
                good_secret:"",
                good_price:""
            }
		}
	},
    computed: {
        configRules(){
            return{
                good_name: [{ required: true, message:this.$t('sys_mat061',{value:this.$t('sys_s011')}), trigger: 'blur' }],
				channel_id: [{ required: true, message:this.$t('sys_mat061',{value:'spid'}), trigger: 'blur' }],
				good_account: [{ required: true, message:this.$t('sys_mat061',{value:'user_account'}), trigger: 'blur' }],
                good_secret: [{ required: true, message:this.$t('sys_mat061',{value:'user_secret'}), trigger: 'blur' }],
                good_price: [{ required: true, message:this.$t('sys_mat061',{value:this.$t('sys_s012')}), trigger: 'blur' }],
                status: [{ required: true, message: this.$t('sys_c089',{value:'SenderId'}), trigger: 'change' }]
            }
        }
    },
	mounted() {
        this.getConfigList();
	},
	methods: {
        restQueryBtn(){
            this.good_name="";
            this.getConfigList(1);
            // this.$refs.serveTable.clearSelection();
        },
		//获取配置列表
		getConfigList(){
            this.loading =true;
			getchannellist({name:this.good_name}).then(res =>{
                this.loading = false;
				this.goodsList = res.data.list || [];
                setChannel(this.goodsList);
                this.EventBus.$emit('channel',"ok");
			})
		},
        addConfigBtn(val,type){
            this.type = type;
            this.configForm.status=val.status||1;
            this.configForm.id=val.channel_id;
            this.configForm.id=val.channel_id;
            this.configForm.good_name=val.name;
            this.configForm.channel_id=val.channel_id;
            this.configForm.good_price=val.price;
            this.configModel=true;
        },
        //提交
        submitSendBtn(formName){
            console.log(this.configForm.status);
            this.$refs[formName].validate((valid) => {
                if (valid) {
					let data = {
						ptype:this.type,
                        status:this.configForm.status,
                        name:this.configForm.good_name,
                        channel_id:this.configForm.channel_id,
                        price:Number(this.configForm.good_price)
					}
					this.type==2?data.channel_id=this.configForm.id:'',
                    this.isLoading = true;
					dochannel(data).then(res =>{
                        this.isLoading = false;
						this.getConfigList()
						this.configModel = false;
                        // this.$store.dispatch('user/initGoodsList');
					})
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        //删除
		delCardBtn(val,type){
			let that = this;
			that.$confirm(this.$t('sys_rai046',{value:this.$t('sys_c028')}),this.$t('sys_c028'), {
                type: 'warning',
                confirmButtonText:this.$t('sys_c024'),
                cancelButtonText:this.$t('sys_c023'),
                beforeClose: function (action, instance,done) {
                    if(action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        dochannel({ptype:3,del_id:[val.channel_id]}).then(res =>{
                            instance.confirmButtonLoading = false;
                            if (res.code !=0) return;
                            successTips(that)
							that.getConfigList()
							done();
						})
                    }else{
                        done();
                    }
                }}).catch(() => {
                that.$message({type: 'info',message: '已取消'});          
            })
        }
	},
    watch:{
        configModel(val){
            if(!val){
                this.$refs.configForm.resetFields();
                this.configForm.id="";
                this.configForm.type=1;
                this.configForm.good_name="";
                this.configForm.channel_id="";
                this.configForm.good_price="";
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .view_img{
        width: 60px;
        height: 60px;
        display: flex;
        cursor: pointer;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .cover_bg{
            opacity: 0;
            width: 100%;
            height: 100%;
            display: flex;
            gap: 8px;
            position: absolute;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, .7);
            transition: all .5s;
            i{
                font-size: 16px;
            }
            .el-icon-view{
                color: #409eff;
            }
            .el-icon-delete{
                color: #f56c6c;
            }
        }
    }
    .view_img:hover .cover_bg{
        opacity: 1;
    }
</style>