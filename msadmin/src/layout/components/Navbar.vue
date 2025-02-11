<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="change_name" v-if="goods_name">产品: {{goods_name.name}}</div>
    <div class="right-menu">
      <div class="goods_menu">
        <!-- <div class="set_time">
          <span class="time_name">系统时区：</span>
          <el-select size="small" v-model="currentTime" placeholder="请选择" @change="changeTIme" style="width: 160px;">
            <el-option v-for="(item,idx) in timeOption" :key="idx" :label="item.label" :value="item.value" />
          </el-select>
        </div> -->
        <el-button icon="iconfont icon-chanpinyuyue" @click.stop="shwo_goods=!shwo_goods">产品</el-button>
        <transition name="el-zoom-in-top">
          <div class="good_warp" v-if="shwo_goods">
            <div class="head_title">我的产品</div>
            <div class="good_list">
              <!-- ,goods_name.channel_id||''==item.channel_id?'good_active':'' -->
              <div :class="['good_item',goods_name&&goods_name.channel_id==item.channel_id?'good_active':'']" v-for="(item,idx) in goods_list" v-if="item.status==1" @click.stop="changeGood(item,idx)">
                <i class="iconfont icon-ui-checks-grid" />
                <p>{{ item.name }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <error-log class="errLog-container right-menu-item hover-effect" />
      <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <i class="el-icon-user" />
          <span class="user-name">{{ userInfo.account }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <template v-if="userInfo.account_type != 3">
            <router-link to="/change-password">
              <el-dropdown-item>{{ $t('sys_c098') }}</el-dropdown-item>
            </router-link>
          </template>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('sys_l015') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { changechannel,getuidchannel} from "@/api/config"
import { setGoodName,getGoodName,getChannel,removeGoodName,setTimeZone,getTimeZone } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      langeIdx: 0,
      currentTime:"Asia/Shanghai",
      activeIndex:0,
      goods_list:[],
      goods_name:null,
      shwo_goods:false
    }
  },
  computed: {
    ...mapGetters(['sidebar','userInfo']),
    expireTime(){
      let expireTime = this.userInfo;
      let currentTimeStamp = Math.floor(Date.now() / 1000);
      let timeDifference = expireTime.valid_time - currentTimeStamp;
      var hoursDifference = timeDifference / (60 * 60);
      if (hoursDifference <= 24 && expireTime.account!="admin") {
        return true;
      }
      return false;
    },
    timeOption(){
      return [
        {
          label:"中国/北京",
          value:"Asia/Shanghai",
        },
        {
          label:"巴西",
          value:"America/Sao_Paulo",
        },
        {
          label:"阿尔巴尼亚",
          value:"Europe/Tirane",
        },
        {
          label:"尼日尼亚",
          value:"Africa/Lagos",
        }
      ]
    }
  },
  created(){
    this.currentTime = getTimeZone();
    console.log(this.currentTime);
  },
  mounted() {
    this.EventBus.$on('message', (data) => {
      this.shwo_goods = false;
    })
    this.EventBus.$on('channel', (data) => {
      this.goods_list = getChannel();
    })
    this.getUserGood();
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout');
      // this.$router.replace('/login')
      window.location.reload();
    },
    changeTIme(){
      setTimeZone(this.currentTime);
      window.location.reload();
    },
    async getUserGood(){
      this.checkChannel( async(value) => {
        this.goods_list = value;
        let res = await getuidchannel();
        if(res.data&&value.length>0){
          let list = value.filter(item=> item.channel_id==res.data.channel_id&&item.status==1);
          if(list&&list.length>0){
            this.goods_name = list[0];
            setGoodName(list[0]);
          }else{
            this.goods_name = null;
            removeGoodName();
          }
        }
      })
    },
    checkChannel(callback){
      const time = setInterval(() => {
        const list = getChannel();
        if (list&&list.length>0) {
          clearInterval(time);
          callback(list);
        }
      },200);
    },
    jumpServeTg(){
      window.open(process.env.VUE_APP_TG,'_blank');
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async changeGood(row,idx){
      setGoodName(row);
      this.goods_name = row;
      this.$message({message:`切换产品：${row.name}`,type: 'success'});
      await changechannel({channel_id:row.channel_id});
    }
  }
}
</script>
<style>
.expire_tips {
  color: #f56c6c !important;
  animation: blink 1.5s infinite;
  transition: opacity 0.5s ease-in-out;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.el-collapse-item__header {
  display: flex;
  height: 36px;
  padding-left: 10px;
  align-items: center;
  justify-content: center;
  border-bottom: transparent !important;

  .el-collapse-item__arrow {
    margin: 0;
    transform: rotate(180deg);
  }

  .el-collapse-item__arrow.is-active {
    transform: rotate(90deg);
  }
}

.el-collapse-item__wrap {
  display: flex;
  border: none;
  justify-content: center;

  .el-collapse-item__content {
    display: flex;
    width: 100%;
    line-height: 1;
    padding-bottom: 0;
    align-items: center;
    flex-direction: column;
    background-color: aliceblue;

    &>div {
      width: 100%;
      display: flex;
      padding: 8px 0;
      cursor: pointer;
      justify-content: center;
    }

    &>div:hover {
      background-color: #DBEEFF;
    }

    &>div:nth-child(1) {
      border-bottom: 1px solid #fff;
    }
  }
}

.el-dropdown-menu__item--divided {
  margin-top: 0;
}

/* .el-collapse-item__wrap{
    display: flex;
    width: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  } */
</style>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  // overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .change_name{
    display: flex;
    height: 50px;
    float: left;
    font-size: 14px;
    align-items: center;
  }

  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    align-items: center;
    line-height: 50px;
    .set_time{
      display: flex;
      flex-shrink: 0;
      align-items: center;
      margin-right: 20px;
      .time_name{
        display: flex;
        flex-shrink: 0;
      }
    }

    &:focus {
      outline: none;
    }
    .serveic_img{
      display: flex;
      height:100%;
      color: #409eff;
      cursor: pointer;
      font-size: 14px;
      margin-right: 10px;
      align-items: center;
      .icon_img{
        display: flex;
        width: 25px;
        height: 25px;
        flex-shrink: 0;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-right: 2px;
        // background-color: #409eff;
        background: linear-gradient(131.49deg, rgb(0, 174, 232) 0%, rgb(0, 164, 209) 100%);
        img{
          display: flex;
          height: 14px;
          width: 14px;
        }
      }
    }
    .serveic_img:hover{
      color: #409eff;
      text-decoration: underline;
    }

    .sys_use_time {
      color: #5a5e66;
      font-size: 14px;
      font-weight: 700;
      margin-right: 10px;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      cursor: pointer;
      margin-right: 10px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }

    .avatar-container {
      background: transparent;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-user {
          font-size: 18px;
        }

        .user-name {
          margin: 0 6px;
          font-size: 14px;
        }

        .el-icon-arrow-down {
          cursor: pointer;
          font-size: 14px;
        }
      }
    }
  }
  .goods_menu{
    display: flex;
    height: 100%;
    position: relative;
    margin-right: 20px;
    align-items: center;
    .el-button{
      display: flex;
      height: 36px;
      font-size: 16px;
      padding: 0 10px;
      flex-shrink: 0;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      border-color: transparent;
      ::v-deep i{
        font-size: 22px;
        margin-right: 5px;
      }
    }
    .el-button:focus{
      color: #409eff;
      border-color: #409eff;
    }
    .good_warp{
      width: 320px;
      min-height: 230px;
      max-height: 320px;
      top: 50px;
      right: 0;
      padding-bottom: 40px;
      overflow: hidden;
      flex-direction: column;
      border-radius: 6px;
      position: absolute;
      background: #fff;
      box-shadow: 0px 0px 50px 0px rgba(82, 63, 105, .15);
      .head_title{
        display: flex;
        height: 44px;
        font-size: 16px;
        color: #fff;
        align-items: center;
        justify-content: center;
        background: #409eff;
      }
      .good_list{
        width: 100%;
        height: 218px;
        display: flex;
        overflow-x: hidden;
        flex-wrap: wrap;
        overflow-y: auto;
        // box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        // background: darkgreen;
        .good_item{
          display: flex;
          height: 109px;
          padding: 0 20px;
          box-sizing: border-box;
          align-items: center;
          width: 33.33%;
          flex-shrink: 0;
          cursor: pointer;
          justify-content: center;
          flex-direction: column;
          border-bottom: 1px solid #F1F1F4;
          border-right: 1px solid #F1F1F4;
          i{
            color: #99A1B7;
            font-size: 28px;
          }
          p{
            line-height: 1.2;
            margin: 0;
            font-size: 14px;
            color: #99A1B7;
            margin-top: 10px;
          }
        }
        .good_item:hover{
          background: #F9F9F9;
        }
        .good_item:nth-child(3n){
          border-right: transparent;
        }
        .good_active{
          color: #1B84FF;
          background: #E9F3FF;
          p{
            color: #1B84FF;
          }
        }
      }
    }
  }
}
</style>
