<template>
  <div class="dashboard-container">
   <card></card>
    <Sale></Sale>
    <observe></observe>
  </div>
</template>

<script>
import card from '@/views/dashboard/card'
import Sale from '@/views/dashboard/Sale'
import observe from '@/views/dashboard/observe'

export default {
  name: 'Dashboard',
 components:{card,Sale,observe},
  mounted() {
    this.$store.dispatch('home/getData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
