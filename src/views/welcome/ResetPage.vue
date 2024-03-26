<script setup>
import { ElSteps } from "element-plus";
import { ref } from "vue";
import { Message, EditPen, Lock } from '@element-plus/icons-vue';
import router from "@/router";

const active = ref(0)
const form = ref({
    email: '',
    code: '',
    password: '',
    password_repeat: ''
})
</script>

<template>
    <div>
        <div style="margin-top: 30px;">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="验证电子邮件"></el-step>
                <el-step title="重新设定密码"></el-step>
            </el-steps>
        </div>
        <div style="margin: 0 20px; text-align: center;" v-if="active === 0">
            <div style="margin-top: 80px;">
                <div style="font-size: 25px; font-weight: bold">重置密码</div>
                <div style="font-size: 14px; color: grey">请输入需要重置密码的电子邮件地址</div>
            </div>
            <div style="margin-top: 50px;">
                <el-form :model="form">
                    <el-form-item prop="email">
                        <el-input v-model="form.email" type="text" placeholder="电子邮件">
                            <template #prefix>
                                <el-icon><Message/></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-row :gutter="10" style="width: 100%">
                            <el-col :span="17">
                                <el-input v-model="form.code" :maxlength="6" type="text" placeholder="请输入验证码">
                                    <template #prefix>
                                        <el-icon><EditPen /></el-icon>
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="success">获取验证码</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top: 30px;">
                <el-button style="width: 360px" type="warning" @click="active++" plain>下一步</el-button>
            </div>
            <div style="margin-top: 30px;">
                <el-button style="width: 360px" type="info" @click="router.push('/')" plain>返回</el-button>
            </div>
        </div>
        <div style="margin: 0 20px; text-align: center;" v-if="active === 1">
            <div style="margin-top: 80px;">
                <div style="font-size: 25px; font-weight: bold">重置密码</div>
                <div style="font-size: 14px; color: grey">请输入你的新密码，请牢记你的新密码</div>
            </div>
            <div style="margin-top: 50px;">
                <el-form :model="form">
                    <el-form-item prop="password">
                        <el-input v-model="form.password" type="password" placeholder="密码">
                            <template #prefix>
                                <el-icon><Lock/></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password_repeat">
                        <el-input v-model="form.password_repeat" type="password" placeholder="重复输入你的密码">
                            <template #prefix>
                                <el-icon><Lock/></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div style="margin-top: 30px;">
                    <el-button style="width: 360px" type="warning" @click="active--" plain>上一步</el-button>
                </div>
                <div style="margin-top: 30px;">
                    <el-button style="width: 360px" type="danger" plain>完成</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
