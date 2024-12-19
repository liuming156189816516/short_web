<template>
    <div class="work_continer">
        <div class="index-sales">
            <div class="index-head">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                        <div class="index-head-centent-left">
                            <img src="@/assets/login/avatar.png" style="width: 46px;height: 46px;border-radius: 50%; overflow: hidden; margin-right: 10px;" :size="56">
                            <div class="index-head-centent-left-text">
                                <p>{{$t('sys_m053',{value:userInfo.account})}}</p>
                                <el-button class="blame_num">余额：4522</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                        <template v-if="isLoading">
                            <el-button class="loading_main" :loading="true">加载中</el-button>
                        </template>
                        <template v-else >
                            <div class="carousel_main" v-if="goods_list&&goods_list.length>0">
                                <h3>我的产品</h3>
                                <el-carousel :interval="2000" indicator-position="none" trigger="click" height="150px">
                                    <el-carousel-item v-for="(item,i) in goods_list" :key="i">
                                        <div class="product_list" v-for="(val,idx) in item" :key="idx"> 
                                            <span class="left_icon" :style="{background:idx==0?'#C4CADA':idx==1?'#FFF8DD':idx==2?'#FFEEF3':'#DFFFEA'}">
                                                <i class="iconfont icon-ui-checks-grid" :style="{color:idx==0?'#0b3566':idx==1?'#624d00':idx==2?'#631024':'#094f21'}" />
                                            </span>
                                            <div class="right_desc">
                                                <h4>{{ val.name }}</h4>
                                                <p>spId: {{ val.channel_id }}</p>
                                            </div>
                                        </div>
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                            <div class="loading_main" v-else>暂无数据...</div>
                        </template>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- <div class="index-banner">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-carousel indicator-position="outside" interval="5000" height="480px">
                        <el-carousel-item v-for="item in bannerList" :key="item">
                            <img :src="item" alt="" srcset="">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </div> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getChannel,setChannel } from '@/utils/auth'
import { getchannellist } from "@/api/config"
export default {
    components: {},
    data() {
        return {
            isLoading:false,
            goods_list:[],
            bannerList: [require("../../assets/banner/banner1.jpg"), require("../../assets/banner/banner2.jpg")]
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'goodList'
        ])
    },
    created(){
        this.initChannel();
    },
    methods:{
        async initChannel(){
            this.isLoading = true;
            let {data:{list}} = await getchannellist();
            this.isLoading = false;
            if(list.length>0){
                setChannel(list);
                this.goods_list = this.$baseFun.splitString(list,4);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.work_continer {
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    background: #F5F7F9;
    .index-sales {
        display: flex;
        width: 100%;
        margin-bottom: 20px;
        flex-direction: column;
        justify-content: center;
    }
    .index-head {
        width: 100%;
        // border-bottom: 1px solid #dcdfe6;
        .index-head-title {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            color: #292929;
            margin-bottom: 16px;
        }

        .index-head-centent-left, .carousel_main {
            width: 100%;
            display: flex;
            border-radius: 5px;
            padding: 0 15px 15px 15px;
            box-sizing: border-box;
            // justify-content: flex-start;
            align-items: center;
            background-color: #fff;
        }
        .carousel_main, .loading_main{
            align-items: initial;
            flex-direction: column;
            .el-carousel--horizontal{
                width: 100%;
                .el-carousel__item{
                    display: flex;
                    flex-wrap: wrap; 
                    .product_list{
                        width: 50%;
                        height: 50px;
                        display: flex;
                        flex-shrink: 0;
                        .left_icon{
                            width: 50px;
                            height: 50px;
                            display: flex;
                            border-radius: 10px;
                            align-items: center;
                            justify-content: center;
                            background: darkcyan;
                            i{
                                // color: red;
                                font-size: 32px;
                            }
                        }
                        .right_desc{
                            display: flex;
                            margin-left: 10px;
                            flex-direction: column;
                            h4, p{
                                display: flex;
                                padding: 0;
                                margin: 0;
                            }
                            h4{
                                font-size: 15px;
                                align-self: flex-start; 
                            }
                            p{
                                color: #C4CADA;
                                margin-top: auto;  
                                font-size: 13px;
                            }
                        }
                    }
                    img{
                        width: 100%;
                        height: auto;
                    }
                }
            }
        }
        .loading_main{
            width: 100%;
            height: 224px;
            border: none;
            display: flex;
            font-size: 12px;
            border-radius: 5px;
            align-items: center;
            justify-content: center;
            background: #fff;
        }

        .index-head-centent-left-text {
            display: flex;
            padding: 20px 0;
            flex-direction: column;
            .blame_num{
                display: flex;
                height: 32px;
                padding: 0 10px;
                align-items: center;
                border-radius: 6px;
                width: max-content;
            }
        }
    }
    .el-col {
        border-radius: 4px;
    }
}




</style>