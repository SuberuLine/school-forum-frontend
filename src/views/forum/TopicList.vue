<script setup>
import LightCard from "@/components/LightCard.vue";
import {Calendar, CollectionTag, EditPen, Link} from "@element-plus/icons-vue";
import Weather from "@/components/Weather.vue";
import {computed} from "vue";
import {ElMessage} from "element-plus";
import {reactive} from "vue";
import {get} from "@/api/index.js";

const weather = reactive({
  location: {},
  now: {},
  hourly: [],
  success: false
})

const today = computed(() => {
  const date = new Date()
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
})

navigator.geolocation.getCurrentPosition(position => {
  const longitude = position.coords.longitude
  const latitude = position.coords.latitude;
  get(`/api/forum/weather?longitude=${longitude}&latitude=${latitude}`, data => {
    Object.assign(weather, data)
    weather.success = true
  })
}, error => {
  console.info(error)
  ElMessage.warning('位置信息获取超时，请检测网络设置')
  get(`/api/forum/weather?longitude=116.40529&latitude=39.90499`, data => {
    Object.assign(weather, data)
    weather.success = true
  })
}, {
  timeout: 3000,
  enableHighAccuracy: true
})
</script>

<template>
  <div style="display: flex; margin: 20px auto; gap: 20px; max-width: 900px" >
    <div style="flex: 1">
      <light-card>
        <div class="create-topic">
          <el-icon><EditPen/></el-icon>发表帖子
        </div>
      </light-card>
      <light-card style="margin-top: 10px; height: 30px">

      </light-card>
      <div style="margin-top: 10px; display: flex; flex-direction: column;gap: 10px">
        <light-card style="height: 100px" v-for="item in 10">

        </light-card>
      </div>
    </div>
    <div style="width: 280px">
      <div style="position: sticky; top: 20px">
        <light-card>
          <div style="font-weight: bold">
            <el-icon><CollectionTag/></el-icon>
            论坛公告
          </div>
          <el-divider style="margin: 10px 0"></el-divider>
          <div style="font-size: 14px; margin: 10px; color:grey">
            官网维护工作已结束，欢迎各位小伙伴体验全新版本。
            1. 论坛版块目前正在重新设计中，后续会进行热更新
            2. 面试版块目前正在重新准备更加完善和详细的资料，更多内容将会在下个版本统一上线，敬请期待
            3. 用户头像和背景由于业务调整，已进行重置，请各位小伙伴重新上传
          </div>
        </light-card>
        <light-card style="margin-top: 10px">
          <div style="font-weight: bold">
            <el-icon><Calendar/></el-icon>
            天气信息
          </div>
          <el-divider style="margin: 10px 0"/>
          <Weather :data="weather"/>
        </light-card>
        <light-card style="margin-top: 10px">
          <div class="info-text">
            <div>当前日期</div>
            <div>{{today}}</div>
          </div>
          <div class="info-text">
            <div>当前IP地址</div>
            <div>127.0.0.1</div>
          </div>
        </light-card>
        <div style="font-size: 14px; margin-top: 10px; color: grey">
          <el-icon><Link/></el-icon>
          赞助商
          <el-divider style="margin: 10px 0;"/>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 10px;margin-top: 10px">
          <div class="sponsors-link">
            <el-image style="height: 100%" src="https://element-plus.org/images/js-design-banner.jpg" />
          </div>
          <div class="sponsors-link">
            <el-image style="height: 100%" src="https://element-plus.org/images/sponsors/jnpfsoft.jpg" />
          </div>
          <div class="sponsors-link">
            <el-image style="height: 100%" src="https://element-plus.org/images/sponsors/jnpfsoft.jpg" />
          </div>
          <div class="sponsors-link">
            <el-image style="height: 100%" src="https://element-plus.org/images/js-design-banner.jpg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.info-text {
  display: flex;
  justify-content: space-between;
  color: grey;
  font-size: 14px;
}

.sponsors-link {
  border-radius: 5px;
  overflow: hidden;
}
.create-topic {
  background-color: #efefef;
  border-radius: 5px;
  height: 40px;
  font-size: 14px;
  color: grey;
  line-height: 40px;
  padding: 0 10px;
  &:hover {
    cursor: pointer;
  }
}
</style>