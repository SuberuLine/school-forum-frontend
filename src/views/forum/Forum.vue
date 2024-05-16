<script setup>
import {get} from "@/api/index.js";
import {useStore} from "@/store/index.js";

const store = useStore()

get('/api/forum/types', data => {
  const array = []
  array.push({name: '全部', id: 0, color: 'linear-gradient(45deg, gold, red, green)'})
  data.forEach(d => array.push(d))
  store.forum.types = array
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="el-fade-in-linear" mode="out-in">
      <keep-alive include="TopicList">
        <component :is="Component" style="height: 100%"></component>
      </keep-alive>
    </transition>
  </router-view>
  <el-backtop target=".main-content-page .el-scrollbar__wrap" :right="20" :bottom="70"/>
</template>

<style scoped>

</style>