<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';

type TYPE_BADGE = 'green' | 'gray';
const iconNames = ['Location01Icon', 'CalendarUserIcon', 'Clock01Icon'] as const;
type IconName = (typeof iconNames)[number];
const props = withDefaults(
  defineProps<{ type?: TYPE_BADGE, icon: IconName, text: string }>(),
  { type: 'green' },
)
const classes = computed(() => {
  let c: string[] = ['bg-green-300', 'text-green-600'];
  if (props.type === 'gray') {
    c = ['bg-gray-300', 'text-gray-600'];
  }

  return c;
});

const iconHuge = ref();
async function loadIcon() {
    iconHuge.value = await import('@hugeicons/core-free-icons')
        .then((m) => m[props.icon])
}
onMounted(() => {
    loadIcon();
});
</script>
<template>
  <span
    class="inline-flex gap-1 items-center py-1 px-2 rounded-full text-nowrap"
    :class="classes"
  ><HugeiconsIcon
    v-if="iconHuge"
    :icon="iconHuge"
    :size="16"
    :strokeWidth="1.5"
    /> {{ text }}</span>
</template>
