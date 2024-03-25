<script setup>
import { logout } from '@/api';
import router from '@/router';

function userLogout() {
  logout(() => {
    router.push('/');
  });
}

</script>

<template>
  <div>
    <h1>IndexView</h1>
    <el-button @click="userLogout">退出登录</el-button>
  </div>
</template>

<style scoped>

</style>
