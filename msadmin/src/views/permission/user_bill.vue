<template>
  <div v-if="$route.name=='user_bill'">
    <billPage :key="$route.name" />
  </div>
</template>

<script>
import billPage from '../billManage/billDetail.vue'
export default {
  name: 'user_bill',
  components: {billPage}
}
</script>

<style scoped lang="scss"></style>
