<script setup>

import Card from "@/components/Card.vue";
import {Lock, Setting} from "@element-plus/icons-vue";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {post, get} from "@/api/index.js";

const form = reactive({
  password: '',
  new_password: '',
  new_password_repeat: ''
})

const privacy = reactive({
  phone: false,
  wx: false,
  qq: false,
  email: false,
  gender: false
})
const saving = ref(true)

get('/api/user/privacy', data => {
  privacy.phone = data.phone
  privacy.email = data.email
  privacy.qq = data.qq
  privacy.wx = data.wx
  privacy.gender = data.gender
  saving.value = false
})

function savePrivacy(type, status) {
  saving.value = true
  post('/api/user/save-privacy', {
    type: type,
    status: status
  }, () => {
    ElMessage.success('隐私设置修改成功')
    saving.value = false
  })
}
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.new_password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const rules = {
  password: [
    {required: true, message: '请输入原密码', trigger: 'blur'}
  ],
  new_password: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码的长度必须在6-20个字符间', trigger: 'blur'}
  ],
  new_password_repeat: [
    {required: true, message: '请输入重复密码', trigger: 'blur'},
    {validator: validatePassword, trigger: ['blur', 'change']}
  ]
}

const formRef = ref()
const valid = ref(false)
const onValidate = (prop, isValid) => valid.value = isValid

function resetPassword() {
  console.log(form)
  formRef.value.validate(valid => {
    if (valid) {
      post('/api/user/change-password', form, () => {
        ElMessage.success('修改密码成功')
        formRef.value.resetFields
      })
    }
  })
}

</script>

<template>
  <div style="margin: auto; max-width: 600px;">
    <div style="margin-top: 20px">
      <card :icon="Setting" title="隐私设置" desc="在此处修改隐私方面设置">
        <div class="checkbox-list">
          <el-checkbox @change="savePrivacy('phone', privacy.phone)" v-model="privacy.phone">公开展示我的手机号</el-checkbox>
          <el-checkbox @change="savePrivacy('email', privacy.email)" v-model="privacy.email">公开展示我的邮箱地址</el-checkbox>
          <el-checkbox @change="savePrivacy('wx', privacy.wx)" v-model="privacy.wx">公开展示我的微信</el-checkbox>
          <el-checkbox @change="savePrivacy('qq', privacy.qq)" v-model="privacy.qq">公开展示我的QQ</el-checkbox>
          <el-checkbox @change="savePrivacy('gender', privacy.gender)" v-model="privacy.gender">公开展示我的性别</el-checkbox>
        </div>
      </card>
      <card style="margin: 20px 0" :icon="Setting" title="修改密码" desc="在这里修改密码，请务必牢记">
        <el-form :rules="rules" ref="formRef" @validate="onValidate" label-width="100" style="margin: 20px" :model="form">
          <el-form-item label="当前密码" prop="password">
            <el-input :prefix-icon="Lock" v-model="form.password" placeholder="当前密码" maxlength="20" type="password"/>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input :prefix-icon="Lock" v-model="form.new_password" placeholder="新密码" maxlength="20" type="password"/>
          </el-form-item>
          <el-form-item label="确认新密码" prop="new_password_repeat">
            <el-input :prefix-icon="Lock" v-model="form.new_password_repeat" placeholder="确认新密码" maxlength="20" type="password"/>
          </el-form-item>
          <div style="text-align: center">
            <el-button @click="resetPassword" type="success">立即重置密码</el-button>
          </div>
        </el-form>
      </card>
    </div>
  </div>
</template>

<style scoped>
.checkbox-list {
  margin: 10px 0 0 10px;
  display: flex;
  flex-direction: column;
}
</style>