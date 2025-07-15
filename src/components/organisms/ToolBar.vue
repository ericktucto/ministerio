<script setup lang="ts">
import { computed } from 'vue';
import ButtonToolBar from '@/components/atoms/ButtonToolBar.vue';
import { usePages, type PAGE } from '@/stores/pages';

const pages = usePages();
const currentPage = computed(() => pages.current);
function onClick(page: PAGE) {
    pages.changePage(page);
}
</script>
<template>
    <div class="grid justify-items-center">
        <div class="h-[3.5rem] flex gap-2">
            <ButtonToolBar @click="onClick('map')" :active="currentPage == 'map'" icon="Location01Icon" label="Mapa"/>
            <ButtonToolBar @click="onClick('revisitas')" :active="currentPage == 'revisitas'" icon="UserTime03Icon" label="Revisitas"/>
            <ButtonToolBar @click="onClick('settings')" :active="currentPage == 'settings'" icon="Settings02Icon" label="Configurar"/>
        </div>
    </div>
</template>

