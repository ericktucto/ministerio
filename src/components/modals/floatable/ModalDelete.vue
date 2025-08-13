<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { getData, resolveModal, onCloseModal } from '@/modalfloat';

interface DeleteData {
  description?: string;
  title: string;
}

function onDelete() {
  resolveModal({ accept: true });
}
const description = ref('');
const title = ref('');
onMounted(() => {
  const data = getData<DeleteData>('deleteelement');
  description.value = data.description || '¿estas seguro(a)?';
  title.value = data.title;
});
</script>
<template>
  <div class="grid gap-2 text-center px-6 py-2">
    <div class="flex justify-center">
      <span
        class="p-2 rounded-full bg-red-200 border-4 border-red-100 text-red-400"
      >
        <HugeiconsIcon
          :icon="Delete02Icon"
          :size="16"
          :strokeWidth="1.5"
        />
      </span>
    </div>
    <div class="grid items-center justify-evenly">
      <h3>{{ title }}</h3>
      <small>{{ description }}</small>
    </div>
    <div class="flex gap-6 justify-evenly items-center mt-4">
      <button
        type="button"
        class="py-2 px-4 bg-gray-200 rounded-md text-black"
        data-cancel="0"
        @click="onCloseModal"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="py-2 px-4 bg-red-500 rounded-md text-white"
        data-cancel="1"
        @click="onDelete"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>
