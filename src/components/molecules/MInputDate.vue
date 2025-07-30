<script setup lang="ts">
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { inject } from 'vue';
import { modalKey } from '@/modalfloat';

const configes = { locale: es };

const injected = inject(modalKey);
if (!injected) {
    throw new Error('Error inject modal');
}
const { getModal } = injected;

import { computed, ref } from 'vue';

const opened = ref(false);
const props = defineProps<{ modelValue: Date }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: Date): void }>()

// split :
const display = computed(() => {
  const f = props.modelValue.getFullYear() == (new Date()).getFullYear() ?
    "iiii dd 'de' MMMM" : "iiii dd 'de' MMMM, yyyy";
  return format(props.modelValue, f, configes);
});

async function onOpen() {
  const response = await getModal<{ date: Date }>(
    'dateselect', { date: new Date() }
  );
  if ('error' in response) {
    return;
  }
  emit('update:modelValue', response.date);
}
</script>
<template>
  <span
    class="border border-blue-500 flex items-center gap-2 w-full rounded-md px-3 py-2"
    :class="{ opened }"
    @click="onOpen"
  >
    <HugeiconsIcon
      class="text-blue-500"
      :icon="Calendar03Icon"
      :size="16"
      :strokeWidth="2"
    />
    <span>{{ display }}</span>
  </span>
</template>
<style scoped>
span .minputclockmodal {
  transform: translateY(-100vh);
  transition: all 0.001s ease-in-out;
  .backgroundclock {
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
  .modalclock {
    left: 50%;
    transform: translate(-50%, -100%);
    transition: all 0.3s ease-in-out;
  }
}
span.opened .minputclockmodal {
  transform: translateY(0);
}
span.opened .minputclockmodal.startanimation {
  .backgroundclock {
    opacity: 0.5;
  }
  .modalclock {
    transform: translate(-50%, 50%);
  }
}
</style>
