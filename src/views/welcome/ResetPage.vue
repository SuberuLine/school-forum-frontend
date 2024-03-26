<script setup>
import { ElSteps, ElMessage } from "element-plus";
import { ref } from "vue";
import { Message, EditPen, Lock } from '@element-plus/icons-vue';
import router from "@/router";
import { get, post } from "@/api";

const isEmailValid = ref(false)
const active = ref(0)
const coldTime = ref(0)
const formRef = ref()
const form = ref({
    email: '',
    code: '',
    password: '',
    password_repeat: ''
})

const onValidate = (prop, isValid) => {
    if(prop === 'email')
        isEmailValid.value = isValid
}

const validatePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== form.value.password) {
        callback(new Error("两次输入的密码不一致"))
    } else {
        callback()
    }
}

const rules = {
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码的长度必须在6-16个字符之间', trigger: ['blur', 'change'] }
    ],
    password_repeat: [
        { validator: validatePassword, trigger: ['blur', 'change'] },
    ],
    email: [
        { required: true, message: '请输入邮件地址', trigger: 'blur' },
        {type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change']}
    ],
    code: [
        { required: true, message: '请输入获取的验证码', trigger: 'blur' },
    ]
}

function askCode() {
    if (isEmailValid.value) {
        coldTime.value = 60;
        console.log(form.value.email);
        get(`/api/auth/request-code?email=${form.value.email}&type=reset`, () => {
            ElMessage.success(`验证码已发送到邮箱: ${form.value.email}，请注意查收`)
            const handle = setInterval(() => {
                coldTime.value--
                if(coldTime.value === 0) {
                    clearInterval(handle)
                }
            }, 1000)}, undefined, (message) => {
                ElMessage.warning(message)
                coldTime.value = 0
        })
    }
}

function confirmReset() {
    formRef.value.validate((valid) => {
        if (valid) {
            post('/api/auth/reset-confirm', {
                email: form.value.email,
                code: form.value.code
            }, () => {
                active.value++
            })
        }
    })
}

function doReset() {
    formRef.value.validate((valid) => {
        if (valid) {
            post('/api/auth/reset-password', {
                email: form.value.email,
                code: form.value.code,
                password: form.value.password
            }, () => {
                ElMessage.success('密码重置成功,请重新登陆')
                router.push('/')
            })
        }
    })
}
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
                <el-form :model="form" :rules="rules" ref="formRef" @validate="onValidate">
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
                                <el-button type="success" @click="askCode"
                                            :disabled="!isEmailValid || coldTime > 0">
                                    {{coldTime > 0 ? '请稍后 ' + coldTime + ' 秒' : '获取验证码'}}
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top: 30px;">
                <el-button style="width: 360px" type="warning" @click="confirmReset" plain>下一步</el-button>
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
                <el-form :model="form" :rules="rules" ref="formRef" @validate="onValidate">
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
                    <el-button @click="doReset" style="width: 360px" type="danger" plain>完成</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
