<script setup>
import {Check, Document} from "@element-plus/icons-vue";
import {reactive, ref, computed} from "vue";
import {Quill, QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageResize from "quill-image-resize-vue";
import { ImageExtend, QuillWatch } from "quill-image-super-solution-module";
import axios from "axios";
import {accessHeader, post} from "@/api/index.js";
import {ElMessage} from "element-plus";
import ColorDot from "@/components/ColorDot.vue";
import {useStore} from "@/store/index.js";

defineProps({
  show: Boolean
})

const store = useStore()
const emit = defineEmits(['close', 'success'])
const refEditor = ref()

const editor = reactive({
  type: null,
  title: '',
  text: '',
  uploading: false
})

function submitTopic() {
  const text = deltaToText(editor.text)
  if (text.length > 20000) {
    ElMessage.warning('字数超出限制，发布失败')
    return
  }
  if (!editor.title) {
    ElMessage.warning('请填写标题！')
    return
  }
  if (!editor.type) {
    ElMessage.warning('请选择一个帖子类型')
    return
  }
  post('/api/forum/create-topic', {
    type: editor.type.id,
    title: editor.title,
    content: editor.text
  }, () => {
    ElMessage.success('帖子发表成功')
    emit('success')
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}

function initEditor() {
  refEditor.value.setContents('', 'user')
  editor.title = ''
  editor.type = null
}

function deltaToText(delta) {
  if(!delta.ops) return ""
  let str = ""
  for (let op of delta.ops)
    str += op.insert
  return str.replace(/\s/g, "")
}

const contentLength = computed(() => {
  deltaToText(editor.text).length
})

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/ImageExtend', ImageExtend)

const editorOption = {
  modules: {
    toolbar: {
      container: [
        "bold", "italic", "underline", "strike","clean",
        {color: []}, {'background': []},
        {size: ["small", false, "large", "huge"]},
        { header: [1, 2, 3, 4, 5, 6, false] },
        {list: "ordered"}, {list: "bullet"}, {align: []},
        "blockquote", "code-block", "link", "image",
        { indent: '-1' }, { indent: '+1' }
      ],
      handlers: {
        'image': function () {
          QuillWatch.emit(this.quill.id)
        }
      }
    },
    imageResize: {
      modules: [ 'Resize', 'DisplaySize' ]
    },
    ImageExtend: {
      action:  axios.defaults.baseURL + '/api/image/cache',
      name: 'file',
      size: 5,
      loading: true,
      accept: 'image/png, image/jpeg',
      response: (resp) => {
        if(resp.data) {
          return axios.defaults.baseURL + '/image' + resp.data
        } else {
          return null
        }
      },
      methods: 'POST',
      headers: xhr => {
        xhr.setRequestHeader('Authorization', accessHeader().Authorization);
      },
      start: () => editor.uploading = true,
      success: () => {
        ElMessage.success('图片上传成功!')
        editor.uploading = false
      },
      error: () => {
        ElMessage.warning('图片上传失败，请联系管理员!')
        editor.uploading = false
      }
    }
  }
}
</script>

<template>
  <div>
    <el-drawer :model-value="show"
               direction="btt"
               :size="650"
               :close-on-click-modal="false"
               @open="initEditor"
               @close="emit('close')">
      <template #header>
        <div>
          <div style="font-weight: bold;">发表新的帖子</div>
          <div style="font-size: 13px">发一条友善的帖子吧～</div>
        </div>
      </template>
      <div style="display: flex; gap: 10px">
        <div style="width: 150px">
          <el-select v-model="editor.type" placeholder="选择帖子类型" value-key="id" :disabled="!store.forum.types.length">
            <el-option v-for="item in store.forum.types.filter(type => type.id > 0)" :value="item" :label="item.name">
              <div>
                <color-dot :color="item.color"/>
                <span style="margin-left: 10px">{{item.name}}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div style="flex: 1">
          <el-input v-model="editor.title" placeholder="请输入帖子标题" :prefix-icon="Document" maxlength="30" style="height: 100%"/>
        </div>
      </div>
      <div style="margin-top: 5px;font-size: 13px;color: grey">
        <color-dot :color="editor.type ? editor.type.color : '#dedede'"/>
        <span style="margin-left: 5px">{{editor.type ? editor.type.desc : '请在上方选择一个帖子类型'}}</span>
      </div>
      <div style="margin: 15px; height: 460px; overflow: hidden" v-loading="editor.uploading" element-loading-text="正在上传图片中，请稍等。。">
        <quill-editor v-model:content="editor.text"
                      style="height: calc(100% - 45px)"
                      placeholder="今天想分享点什么呢？"
                      content-type="delta"
                      ref="refEditor"
                      :options="editorOption"/>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px">
        <div style="color: grey; font-size: 13px">
          当前字数  {{contentLength}} （还剩余 888 字）
        </div>
        <div>
          <el-button type="success" :icon="Check" @click="submitTopic" plain>立即发表主题</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
:deep(.el-drawer) {
  width: 800px;
  margin: auto;
  border-radius: 10px 10px 0 0;
}
:deep(.el-drawer__header) {
  margin: 0;
}
:deep(.ql-toolbar) {
  border-radius: 5px 5px 0 0;
  border-color: var(--el-border-color);
}
:deep(.ql-container) {
  border-radius: 0 0 5px 5px;
  border-color: var(--el-border-color);
}
:deep(.ql-editor) {
  font-size: 14px;
}
:deep(.ql-editor.ql-blank::before) {
  color: var(--el-text-color-placeholder);
  font-style: normal;
}
</style>