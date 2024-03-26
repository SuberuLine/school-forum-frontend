<script setup>
import { reactive } from 'vue';
import { User, Lock, Message, Promotion } from '@element-plus/icons-vue';
import router from '@/router';

const form = reactive({
    username: '',
    password: '',
    password_repeat: '',
    email: '',
    code: ''
});
</script>

<template>
    <div style="text-align: center; margin: 0 20px">
        <div style="margin-top: 100px">
            <div style="font-size: 25px; font-weight: bold;">注册新用户</div>
            <div style="font-size: 14px; color: grey">请输入用户名、邮箱和密码进行注册</div>
        </div>
        <div style="margin-top: 50px">
            <el-form :model="form" :rules="rule">
                <el-form-item prop="username">
                    <el-input v-model="form.username" maxlength="10" type="text" placeholder="用户名">
                        <template #prefix>
                            <el-icon><User/></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="form.email" type="email" placeholder="邮箱">
                        <template #prefix>
                            <el-icon><Message/></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" maxlength="20" type="password" placeholder="密码">
                        <template #prefix>
                            <el-icon><Lock/></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password_repeat">
                    <el-input v-model="form.password_repeat" maxlength="20" type="password" placeholder="确认密码">
                        <template #prefix>
                            <el-icon><Lock/></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="10" style="width: 100%;">
                        <el-col :span="16">
                            <el-input v-model="form.code" maxlenght="6" type="text" placeholder="验证码">
                                <template #prefix>
                                    <el-icon><Promotion/></el-icon>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="success" style="width: 100%">获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-top: 20px;">
            <el-button type="primary" style="width: 270px;" plain>注册</el-button>
        </div>
        
        <div style="margin-top: 20px;">
            <el-button @click="router.push('/')" type="info" style="width: 270px;" plain>已经有账号了？立即登陆</el-button>
        </div>
    </div>
</template>

<style scoped></style>
