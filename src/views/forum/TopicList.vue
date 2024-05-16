<script setup>
import LightCard from "@/components/LightCard.vue";
import {
  ArrowRightBold,
  Calendar, CircleCheck,
  Clock,
  CollectionTag,
  Compass,
  Document,
  Edit,
  EditPen, FolderOpened,
  Link,
  Microphone,
  Picture, Star
} from "@element-plus/icons-vue";
import Weather from "@/components/Weather.vue";
import {ElMessage} from "element-plus";
import {reactive, ref, watch, computed} from "vue";
import {get} from "@/api/index.js";
import TopicEditor from "@/components/TopicEditor.vue";
import {useStore} from "@/store/index.js";
import axios from "axios";
import ColorDot from "@/components/ColorDot.vue";
import router from "@/router/index.js";
import TopicTag from "@/components/TopicTag.vue";
import TopicCollectList from "@/components/TopicCollectList.vue";

const store = useStore()
const weather = reactive({
  location: {},
  now: {},
  hourly: [],
  success: false
})
const topics = reactive({
  list: [],
  type: 0,
  page: 0,
  end: false,
  top: []
})

const collects = ref(false)
const editor = ref(false)

watch(() => topics.type, () => {
  resetList()
}, {immediate: true})

function updateList() {
  if(topics.end) {
    return
  }
  get(`/api/forum/list-topic?page=${topics.page}&type=${topics.type}`, data => {
    if (data) {
      data.forEach(d => topics.list.push(d))
      topics.page ++
    }
    if (!data || data.length < 10) {
      topics.end = true
    }
  })
}

function onTopicCreate() {
  editor.value = false
  resetList()
}

function resetList() {
  topics.page = 0
  topics.end = false
  topics.list = []
  updateList()
}

get('/api/forum/top-topic', data => topics.top = data)

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
        <div class="create-topic" @click="editor = true">
          <el-icon><EditPen/></el-icon>发表帖子
        </div>
        <div style="margin-top: 10px;display: flex;gap: 13px;font-size: 18px;color: grey">
          <el-icon><Edit /></el-icon>
          <el-icon><Document /></el-icon>
          <el-icon><Compass /></el-icon>
          <el-icon><Picture /></el-icon>
          <el-icon><Microphone /></el-icon>
        </div>
      </light-card>
      <light-card style="margin-top: 10px;display: flex; flex-direction: column; gap: 10px">
        <div v-for="item in topics.top" class="top-topic" @click="router.push(`/index/topic-detail/${item.id}`)">
          <el-tag type="info" size="small">置顶</el-tag>
          <div>{{item.title}}</div>
          <div>{{new Date(item.time).toLocaleString()}}</div>
        </div>
      </light-card>
      <light-card style="margin-top: 10px;display: flex;gap: 7px">
        <div :class="`type-select-card ${topics.type === item.id ? 'active' : ''}`"
             v-for="item in store.forum.types" @click="topics.type = item.id">
          <color-dot :color="item.color"/>
          <span style="margin-left: 5px">{{item.name}}</span>
        </div>
      </light-card>
      <transition name="el-fade-in" mode="out-in">
        <div v-if="topics.list.length">
          <div style="margin-top: 10px; display: flex; flex-direction: column;gap: 10px" v-infinite-scroll="updateList">
            <light-card v-for="item in topics.list" class="topic-card" @click="router.push(`/index/topic-detail/` + item.id)">
              <div style="display: flex">
                <div>
                  <el-avatar :size="30" :src="`${axios.defaults.baseURL}/image${item.avatar}`"/>
                </div>
                <div style="margin-left: 7px; transform: translateY(-2px)">
                  <div style="font-size: 13px; font-weight: bold">{{item.username}}</div>
                  <div style="font-size: 12px; color: grey">
                    <el-icon><Clock/></el-icon>
                    <div style="margin-left: 2px; display: inline-block; transform: translateY(-2px)">
                      {{new Date(item.time).toLocaleString()}}
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top: 5px">
                <topic-tag :type="item.type"/>
                <span style="font-weight: bold; margin-left: 7px;">{{item.title}}</span>
              </div>
              <div class="topic-content">{{item.text}}</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 10px">
                <el-image class="topic-image" v-for="img in item.images" :src="img" fit="cover"></el-image>
              </div>
              <div style="display: flex;gap: 20px;font-size: 13px;margin-top: 10px;opacity: 0.8">
                <div>
                  <el-icon style="vertical-align: middle"><CircleCheck/></el-icon> {{item.like}}点赞
                </div>
                <div>
                  <el-icon style="vertical-align: middle"><Star/></el-icon> {{item.collect}}收藏
                </div>
              </div>
            </light-card>
          </div>
        </div>
      </transition>
    </div>
    <div style="width: 280px">
      <div style="position: sticky; top: 20px">
        <light-card>
          <div class="collect-list-button" @click="collects = true">
            <span>
              <el-icon><FolderOpened/></el-icon>
              我的帖子收藏
              <el-icon style="transform: translateY(3px)"><ArrowRightBold/></el-icon>
            </span>
          </div>
        </light-card>
        <light-card style="margin-top: 10px">
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
    <topic-editor :show="editor" @success="onTopicCreate" @close="editor=false"/>
    <topic-collect-list :show="collects" @close="collects = false" />
  </div>
</template>

<style lang="less" scoped>
.collect-list-button {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  transition: .3s;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
}

.top-topic {
  display: flex;
  div:first-of-type {
    font-size: 14px;
    margin-left: 10px;
    font-weight: bold;
    opacity: 0.8;
    transition: color .3s;

    &:hover {
      cursor: pointer;
      color: grey;
    }
  }

  div:nth-of-type(2) {
    flex: 1;
    color: grey;
    font-size: 13px;
    text-align: right;
  }

  &.hover {
    cursor: pointer;
  }
}

.type-select-card {
  background-color: #f5f5f5;
  padding: 2px 7px;
  font-size: 14px;
  border-radius: 3px;
  box-sizing: border-box;
  transition: background-color .3s;

  &.active {
    border: solid 1px #ead4c4;
  }

  &:hover {
    cursor: pointer;
    background-color: #dadada;
  }
}

.topic-card {
  padding: 15px;
  transition: scale .3s;

  &:hover {
    scale: 1.01;
    cursor: pointer;
  }

  .topic-content {
    font-size: 13px;
    color: grey;
    margin: 10px 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .topic-image {
    width: 100%;
    height: 100%;
    max-height: 110px;
    border-radius: 5px;
  }
}

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
.dark {
  .create-topic {
    background-color: #232323;
  }

  .type-select-card {
    background-color: #282828;
    &.active {
      border: solid 1px #64594b;
    }

    &:hover {
      background-color: #5e5e5e;
    }
  }
}
</style>