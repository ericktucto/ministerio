<script setup lang="ts">
import { provide } from 'vue';
import ContentView from '@/components/organisms/ContentView.vue'
import ToolBar from '@/components/organisms/ToolBar.vue'
import ModalResponse from '@/components/organisms/ModalResponse.vue'
import NewRevisita from '@/components/organisms/NewRevisita.vue';
import { idModal, getModal, resolveModal, getData, modalKey } from './modal';
provide(modalKey, {
    resolveModal,
    getModal,
    getData,
});
</script>
<template>
    <div class="h-screen w-screen">
        <ContentView />
        <ToolBar />
    </div>
    <ModalResponse>
        <NewRevisita v-if="idModal == 'newrevisita'" />
    </ModalResponse>
</template>
