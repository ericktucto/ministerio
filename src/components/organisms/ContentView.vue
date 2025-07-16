<script setup lang="ts">
import { usePages } from '@/stores/pages';
import PageMap from '@/components/pages/PageMap.vue';
const pages = usePages();
</script>
<template>
    <div class="content-view">
        <PageMap v-if="pages.current == 'map'" />
    </div>
</template>
<style>
.content-view {
    height: calc(100dvh - 3.5rem); /* 3.5rem = height of toolbar */
}
</style>
