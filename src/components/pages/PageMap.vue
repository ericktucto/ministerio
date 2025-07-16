<script setup lang="ts">
import MTitle from '@/components/atoms/MTitle.vue';
import ViewMap from '@/components/atoms/ViewMap.vue';
</script>
<template>
    <div class="grid h-full containermap">
        <MTitle class="p-4">Mapa</MTitle>
        <ViewMap class="h-full" />
    </div>
</template>
<style>
.containermap {
    grid-template-rows: 3.75rem 1fr;
}
</style>
