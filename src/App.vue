<script setup lang="ts">
import { provide } from 'vue';
import ContentView from '@/components/organisms/ContentView.vue'
import ToolBar from '@/components/organisms/ToolBar.vue'
import ModalResponse from '@/components/organisms/ModalResponse.vue'
import NewRevisita from '@/components/organisms/NewRevisita.vue';
import { idModal, getModal, resolveModal, getData, modalKey } from './modal';
import { idModal as idModalFloat, modalKey as modalKeyFloat, config } from './modalfloat';
import MModalFloat from './components/atoms/MModalFloat.vue';
import ModalClock from './components/modals/floatable/ModalClock.vue';
import ModalDate from './components/modals/floatable/ModalDate.vue';
provide(modalKey, {
    resolveModal,
    getModal,
    getData,
});
provide(modalKeyFloat, config);
</script>
<template>
    <div class="h-screen w-screen">
        <ContentView />
        <ToolBar />
    </div>
    <ModalResponse>
        <NewRevisita v-if="idModal == 'newrevisita'" />
    </ModalResponse>
    <MModalFloat>
      <ModalClock v-if="idModalFloat == 'timeselect'"/>
      <ModalDate v-if="idModalFloat == 'dateselect'"/>
    </MModalFloat>
</template>
