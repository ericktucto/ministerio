import { defineStore } from "pinia";
import { ref } from 'vue'

export type PAGE = "map" | "revisitas" | "settings";

export const usePages = defineStore("pages", () => {
    const current = ref<PAGE>("map");
    function changePage(page: PAGE) {
        current.value = page;
    }
    return {
        current,
        changePage,
    };
});
