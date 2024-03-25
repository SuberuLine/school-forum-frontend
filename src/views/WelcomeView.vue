<script setup>

</script>

<template>
    <div style="width: 100vw; height: 100vh; overflow:hidden; display: flex">
        <div style="flex: 1;background-color: black">
            <el-image 
                style="width: 100%; height: 100%" 
                src="https://img1.baidu.com/it/u=4097856652,4033702227&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" 
                fit="cover"/>
        </div>
        <div class="welcome-title">
            <h1>欢迎使用</h1>
            <p>这是一个基于Vue3.0 + Vite + Element-Plus的后台管理系统</p>
            <p>后端对接Spring Boot</p>
        </div>
        <div class="right-card">
            <RouterView />
        </div>
    </div>
</template>

<style scoped>
.welcome-title {
    position: absolute;
    bottom: 30px;
    left: 30px;
    color: white;
    text-shadow: 0 0 10px black;
}
.right-card {
    width: 400px;
    z-index: 1;
    background-color: white;
}
</style>
