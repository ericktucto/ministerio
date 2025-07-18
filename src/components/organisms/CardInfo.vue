<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { User03Icon, Clock01Icon } from '@hugeicons/core-free-icons';
import type Revisita from '@/models/revisita';
import MTitle from '@/components/atoms/MTitle.vue';
import MBadge from '@/components/atoms/MBadge.vue';

defineProps<{revisita: Revisita|null}>()
const emit = defineEmits<{
  trash: [],
}>();
function onShowMap() {
  if (
    document.activeElement
    && document.activeElement instanceof HTMLElement
  ) {
    document.activeElement.blur();
  }
}
function onDelete() {
  emit('trash');
}
</script>
<template>
  <div
    ref="info"
    v-show="revisita"
    class="absolute bottom-0 w-full z-1000 bg-transparent px-4 pb-4 flex items-end"
  >
    <div
      tabindex="0"
      class="flex flex-1 bg-white rounded-xl
        focus:flex-col
        focus:h-[30rem]
        focus-within:flex-col
        focus-within:h-[30rem]
        h-[7.25rem]
      "
    >
      <div
        class="images bg-blue-500 flex justify-center items-center text-white
          w-[6rem] rounded-s-xl
        "
      >
        <HugeiconsIcon
          class="flex-shrink-0"
          :icon="User03Icon"
          :size="24"
          :strokeWidth="1.5"
        />
      </div>
      <div class="grid content-between p-4">
        <div>
          <MTitle size="base">{{ revisita?.getName() }}</MTitle>
          <small
            class="text-gray-500 flex items-center justify-between"
          ><span class="text-xs">{{
              revisita?.getAddress()
          }}</span><span
              class="autohide"
              @click="onShowMap"
            ><MBadge
              text="ver mapa"
              icon="Location01Icon"
            /></span></small>
        </div>
        <div class="datetime text-nowrap">
          <MTitle class="autohide" size="base">Siguiente cita:</MTitle>
          <span class="inline-flex mt-1 items-center gap-1 text-xs">
            <HugeiconsIcon
              :icon="Clock01Icon"
              :size="16"
              :strokeWidth="1.5"
            /><span>Domingo 12 de Agosto, 09:00 AM</span>
          </span>
        </div>
        <div class="autohide mt-4">
          <div>
            <MTitle size="base">Descripcion:</MTitle>
            <p class="text-sm">{{ revisita?.getDescription() }}</p>
          </div>
        </div>
      </div>
      <div class="autohide flex-1"></div>
      <div class="autohide">
        <button
          class="flex-1 py-2 px-4 rounded-bl-xl bg-red-500 text-white"
          @click="onDelete"
        >Eliminar</button>
        <button
          class="flex-1 py-2 px-4 rounded-br-xl bg-blue-500 text-white"
        >Hice una cita</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.absolute:focus-within {
  height: 100%;
}
div[tabindex="0"] .autohide {
  display: none;
}
div[tabindex="0"]:focus-within {
  .autohide {
    display: flex;
  }
  .images {
    width: 100%;
    height: 12rem;
    border-radius: 0.75rem 0.75rem 0 0;
  }
  .datetime {
    margin-top: 0.5rem;
  }
}
</style>
