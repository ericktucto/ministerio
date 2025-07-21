<script setup lang="ts">
import { provide, ref } from 'vue';
import ContentView from '@/components/organisms/ContentView.vue'
import ToolBar from '@/components/organisms/ToolBar.vue'
import ModalResponse from '@/components/organisms/ModalResponse.vue'
import NewRevisita from '@/components/organisms/NewRevisita.vue';
import { modalKey, type DataModalType } from './modal';

let _resolve: ((data: any) => void) | null = null;
const _idModal = ref('')
const active = ref(false);
provide(modalKey, {
    resolveModal,
    getModal,
    getData,
});
const dataModal = ref<DataModalType>({});
function getData<T = any>(modal: string): T {
  return dataModal.value[modal] || null;
}
function resolveModal<T = any>(data: T) {
  active.value = false;
  _resolve?.(data);
  _resolve = null;
}
function onCloseModal() {
  _resolve?.({ error: ['User close modal'] });
  _resolve = null;
  active.value = false;
}
function getModal<T = any>(modal: string, data: any): Promise<T> {
  return new Promise<T>((resolve) => {
    active.value = true;
    _idModal.value = modal;
    dataModal.value[modal] = data;
    _resolve = resolve;
  });
}
</script>
<template>
    <div class="h-screen w-screen">
        <ContentView />
        <ToolBar />
    </div>
    <ModalResponse :active="active" @close="onCloseModal">
        <NewRevisita v-if="_idModal == 'newrevisita'" />
    </ModalResponse>
</template>
