import { defineStore } from "pinia";
import axios from "axios";

export const useStore = defineStore('general', {
    state: () => {
        return {
            user: {
                id: -1,
                username: '',
                email: '',
                role: '',
                avatar: null,
                registerTime:null
            },
            forum: {
                types: []
            }
        }
    }, getters: {
        avatarUrl() {
            if (this.user.avatar)
                if (this.user.avatar.startsWith("http")) {
                    return this.user.avatar
                } else {
                    return `${axios.defaults.baseURL}/image${this.user.avatar}`
                }
            else
                return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }
    }, actions: {
        findTypeById(id) {
            for (let types of this.forum.types) {
                if (types.id === id)
                    return types
            }
        },
        avatarUserUrl(avatar) {
            if(avatar)
                if (avatar.startsWith("http")) {
                    return avatar
                } else {
                    return `${axios.defaults.baseURL}/image${avatar}`
                }
            else
                return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }
    }
})