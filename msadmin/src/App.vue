<template>
  <div id="app" @click="closeGoods">
    <!-- <keep-alive> -->
      <router-view />
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  mounted() {
    if (getToken()) {
      this.$store.dispatch('user/getMenuInfo');
    }
  },
  methods:{
    closeGoods(){
      this.EventBus.$emit('message',"ok");
    }
  }
}
</script>
