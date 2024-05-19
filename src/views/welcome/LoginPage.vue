<script setup>
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import {login} from '@/api';
import router from '@/router';
import axios from "axios";

const formRef = ref();

const form = reactive({
    username: '',
    password: '',
    remember: false
});

const rule = {
    username: [
        { required: true, message: '请输入用户名/邮箱', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
};

function userLogin() {
    formRef.value.validate((valid) => {
        if (valid) {
            login(form.username, form.password, form.remember, () => { router.push('/index') })
        }
    });
}

const loginWithGitHub = () => {
  // window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23li2Loh9VQbAgFej7&redirect_uri=http://localhost:5173/oauth/redirect&scope=read:user%20user:email&state=login';
  window.location.href = axios.defaults.baseURL + '/oauth2/authorization/github'
  // router.push("/oauth/redirect")
};
</script>

<template>
    <div style="text-align: center; margin: 0 20px;">
        <div style="margin-top: 150px;">
            <div style="font-size: 25px; font-weight: bold">登录</div>
            <div style="font-size: 14px; color: grey">
                请输入用户名/邮箱和密码进行登录
            </div>
        </div>
        <div style="margin-top: 50px;">
            <el-form :model="form" :rules="rule" ref="formRef">
                <el-form-item prop="username">
                    <el-input 
                    v-model="form.username"
                    type="text" 
                    placeholder="用户名/邮箱">
                        <template #prefix>
                            <el-icon><User/></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                    v-model="form.password"
                    maxlength="20" 
                    type="password" 
                    placeholder="密码">
                        <template #prefix>
                            <el-icon><Lock/></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12" style="text-align: left;">
                        <el-form-item prop="remember">
                            <el-checkbox v-model="form.remember">记住我</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                        <el-link @click="router.push('/reset')" type="primary">忘记密码</el-link>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="text-align: right">
          <svg-icon iconName="icon-github" isButton="true" @click="loginWithGitHub"></svg-icon>
          <svg-icon iconName="icon-QQ" isButton="true"></svg-icon>
          <svg-icon iconName="icon-weixin" isButton="true"></svg-icon>
        </div>
        <div style="margin-top: 20px;">
            <el-button @click="userLogin" type="primary" style="width: 270px;" plain>登录</el-button>
        </div>
        <el-divider content-position="right" style="margin-top: 40px;">
            还没有账号？<el-button @click="router.push('/register')" type="text" style="color: #409EFF;">立即注册</el-button>
        </el-divider>
    </div>
</template>

<style scoped>

</style>
