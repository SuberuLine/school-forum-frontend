<template>
  <div v-if="isAuthenticating">Authenticating...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {ref} from "vue";
import {OAuthLogin} from "@/api/index.js";
import router from "@/router/index.js";

onMounted(async () => {
  const route = useRoute();
  const token = route.query.token
  const expire = route.query.expire
  if (expire && token) {
    const access_token = {
      "token": token,
      "expire": expire
    }
    OAuthLogin(access_token)
  }
  await router.push("/index")
});

const isAuthenticating = ref(true)

</script>