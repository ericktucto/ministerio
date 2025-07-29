<script setup lang="ts">
import { ref } from 'vue';
import { active, onCloseModal } from '@/modalfloat';

const emit = defineEmits<{
  close: [void],
  opened: [void],
}>()
const shown = ref(false);
const toclose = ref(false);
function onContainerAnimationEnd() {
  shown.value = true;
}
function onBackgroundAnimationEnd() {
  if (toclose.value) {
    emit('close')
    onCloseModal();
    toclose.value = false;
    return;
  }
  emit('opened');
  toclose.value = true;
}
const bodyModal = ref<HTMLElement | null>(null);
function onClose(e: Event) {
  if (!bodyModal.value) {
    return;
  }
  if (e.target === bodyModal.value) {
    shown.value = false;
  }
}
</script>
<template>
  <!-- Contenedor del modal -->
  <div
    data-type="container"
    class="fixed w-dvw h-dvh z-2000
      transition-all ease-in-out
    "
    @transitionend="onContainerAnimationEnd"
    :class="{ active, shown }"
  >
    <!-- fondo opaco oscuro -->
    <div
      data-type="background"
      class="w-full h-full absolute bg-black opacity-0
        transition-opacity ease-in-out duration-300
      "
      @transitionend="onBackgroundAnimationEnd"
    ></div>
    <div
      ref="bodyModal"
      data-type="body"
      class="fixed w-dvw h-dvh grid place-items-center
        transition-all ease-in-out duration-300
      "
      @click="onClose"
    >
      <div class="bg-white rounded-2xl p-4 shadow-lg">
        <!-- Aquí irían los controles (omitidos) -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style scoped>
div[data-type="container"] {
  top: 100%;
  transition-duration: 0.001s;
}
div[data-type="container"].active {
  inset: 0;
}
div[data-type="container"] div[data-type="body"] {
  top: 100%;
}
div[data-type="container"].active.shown {
  div[data-type="background"] {
    opacity: 0.5;
  }
  div[data-type="body"] {
    inset: 0;
  }
}
</style>
