<script setup>
import { reactive } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';

const form = reactive({
    username: '',
    password: '',
    remember: false
});
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
            <el-form v-model="form">
                <el-form-item>
                    <el-input 
                    v-model="form.username"
                    maxlength="10" 
                    type="text" 
                    placeholder="用户名/邮箱">
                        <template #prefix>
                            <el-icon><User/></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
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
                        <el-checkbox v-model="form.remember">记住我</el-checkbox>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                        <el-link type="primary">忘记密码</el-link>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="margin-top: 40px;">
            <el-button type="primary" style="width: 270px;" plain>登录</el-button>
        </div>
        <el-divider content-position="left" style="margin-top: 40px;">
            还没有账号？<el-button type="text" style="color: #409EFF;">立即注册</el-button>
        </el-divider>
    </div>
</template>

<style scoped>

</style>
