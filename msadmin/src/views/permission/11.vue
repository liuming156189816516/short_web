<template>
    <div>
        <el-form size="small" :inline="true">
            <el-form-item>
                <el-button @click="$router.go(-1)" type="primary" plain
                    icon="el-icon-back">{{ $t('sys_q006') }}</el-button>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="task_time" type="daterange" :range-separator="$t('sys_c108')"
                    :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" style="width: 260px;" />
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="initAccount(1)">{{ $t('sys_c002') }}</el-button>
            </el-form-item>
            <el-form-item class="el-item-right">
                <el-button type="primary" @click="addUser(0, 1)">{{ $t('sys_s045') }}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" height="756" border style="width: 100%;"
            :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }"
            v-loading="loading" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255,1)">
            <el-table-column prop="type" :label="$t('sys_c005')" minWidth="80">
                <template slot="header">
                    <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
                        <span style="color:#909399" :class="[type ? 'dropdown_title' : '']"> {{ $t('sys_s040') }}
                            <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :class="{ 'dropdown_selected': idx == type }"
                                v-for="(item, idx) in statusOption" :key="idx" :command="idx">{{
                                item==''?$t('sys_l053'):item }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template slot-scope="scope">
                    <el-tag size="small" :type="scope.row.type == 1 ? 'success' : 'warning'"> {{ statusOption[scope.row.type]
                        }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="amount" :label="$t('sys_p016')" minWidth="80" />
            <el-table-column prop="before_balance" :label="$t('sys_m082')" minWidth="100" />
            <el-table-column prop="remark" :label="$t('sys_l062')" minWidth="80" show-overflow-tooltip />
            <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="100">
                <template slot-scope="scope">
                    {{ $baseFun.resetTime(scope.row.itime * 1000) }}
                </template>
            </el-table-column>
        </el-table>
        <div class="layui_page">
            <el-pagination background @size-change="setPageSize" @current-change="switchPage" :page-sizes="pageOption"
                :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total" />
        </div>

        <el-dialog :title="$t('sys_s045')" center :visible.sync="userModel" :close-on-click-modal="false" width="500px">
            <el-form size="small" :model="userForm" label-width="90px" :rules="userRules" ref="userForm">
                <el-form-item :label="$t('sys_c009') + ':'" prop="account">
                    <el-input disabled v-model="userForm.account" :placeholder="$t('sys_mat061', { value: $t('sys_c009') })"></el-input>
                </el-form-item>
                <el-form-item :label="$t('sys_s040') + ':'" prop="type">
                    <el-radio-group v-model="userForm.type">
                        <el-radio :label="idx" v-for="(item, idx) in statusOption" :key="idx" v-show="item != ''">{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('sys_s046')" prop="amount">
                    <el-input clearable v-model="userForm.amount" oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" :placeholder="$t('sys_mat061', { value: $t('sys_s046') })" />
                </el-form-item>
                <el-form-item :label="$t('sys_l062')" prop="remark">
                    <el-input clearable v-model="userForm.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" :placeholder="$t('sys_mat061', { value: $t('sys_l062') })" />
                </el-form-item>
                <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
                    <el-button @click="userModel = false">{{ $t('sys_c023') }}</el-button>
                    <el-button :loading="isLoading" type="primary" @click="creatBtn('userForm')">{{ $t('sys_c024')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { resetPage, successTips } from "@/utils/index"
import { getbilldetailstasklist, dobilldetails } from "@/api/bill"
export default {
    data() {
        return {
            limit: 10,
            offest: 1,
            total: 0,
            type: null,
            uuid:null,
            task_time: [],
            userList: [],
            loading: false,
            isLoading: false,
            userModel: false,
            pageOption: resetPage(),
            userForm: {
                account: "",
                type: 1,
                amount: "",
                remark: ""
            }
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
        userRules() {
            return {
                type: [{ required: true, message: this.$t('sys_c029'), trigger: 'change' }],
                account: [{ required: true, message: this.$t('sys_mat061', { value: this.$t('sys_c009') }), trigger: 'blur' }],
                amount: [{ required: true, message: this.$t('sys_mat061', { value: this.$t('sys_s046') }), trigger: 'blur' }],
                remark: [{ required: true, message: this.$t('sys_mat061', { value: this.$t('sys_l062') }), trigger: 'blur' }]
            }
        },
        apiOption() {
            return [this.$t('sys_r014'), this.$t('sys_r013')]
        },
        statusOption() {
            return ["", this.$t('sys_s041'), this.$t('sys_s042'), this.$t('sys_s043')]
        },
        genderOption() {
            return [this.$t('sys_c041'), this.$t('sys_c042'), this.$t('sys_c045')]
        }
    },
    created() {
        this.uuid = this.$route.query._id;
        this.userForm.account =this.$route.query.user;
        this.initAccount()
    },
    methods: {
        handleNewwork(type) {
            this.offest = 1;
            this.type = type;
            this.initAccount(1)
        },
        initAccount(num) {
            this.offest = num ? num : this.offest;
            const sTime = this.task_time;
            let params = {
                uid: this.uuid,
                account_type: 2,
                page: this.offest,
                limit: this.limit,
                type: this.type || -1,
                start_time: sTime ? this.$baseFun.mexicoTime(sTime[0], 1) : -1,
                end_time: sTime ? this.$baseFun.mexicoTime(sTime[1], 2) : -1
            }
            this.loading = true;
            getbilldetailstasklist(params).then(res => {
                this.loading = false;
                this.total = res.data.total;
                this.userList = res.data.list || [];
            })
        },
        addUser(row = {}, idx) {
            this.userModel = true;
            this.$nextTick(() => {
                this.$refs.userForm.resetFields();
            })
        },
        creatBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        uid: this.uuid,
                        type: this.userForm.type,
                        amount: Number(this.userForm.amount),
                        remark: this.userForm.remark
                    }
                    this.isLoading = true;
                    dobilldetails(params).then(res => {
                        this.isLoading = false;
                        if (!res || res.code == 100005) return;
                        successTips(this)
                        this.userModel = false;
                        this.initAccount()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        setPageSize(val) {
            this.limit = val;
            this.initAccount()
        },
        switchPage(val) {
            this.offest = val;
            this.initAccount()
        }
    }
}
</script>