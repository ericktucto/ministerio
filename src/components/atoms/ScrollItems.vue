<script setup lang="ts">
import { debounce } from '@/models/utils';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string,
  options: string[],
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string],
}>()
async function scrollToDiv(divElement: HTMLDivElement) {
  const dataValue = (divElement.dataset.value as string);
  divElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  const waitDivElementIntoCenter = () => new Promise(
    (resolve) => {
      const id = setInterval(() => {
        const centered = getElementCenter();
        if (centered?.dataset?.value == dataValue) {
          clearInterval(id);
          resolve(true);
        }
      }, 100);
    }
  );
  await waitDivElementIntoCenter();
  emit('update:modelValue', dataValue);
}
function onClickItem(event: Event) {
  scrollToDiv(
    (event.target as HTMLDivElement)
  );
}
const scrollContainer = ref<HTMLDivElement|null>(null);
const items = ref<HTMLDivElement[]>([]);
watch(() => props.modelValue, (newValue, oldValue) => {
  if (newValue !== oldValue && scrollContainer.value) {
    const children = Array.from(scrollContainer.value.children) as HTMLDivElement[];
    const divElement = children.find(c => c.dataset.value == newValue);
    if (divElement) {
      scrollToDiv(
        divElement as HTMLDivElement
      )
    }
  }
});
function getElementCenter(): HTMLDivElement|null {
  const container = scrollContainer.value;
  if (!container) {
    return null;
  }
  const containerRect = container.getBoundingClientRect();
  const centerY = containerRect.top + containerRect.height / 2;

  const children = Array.from(container.children) as HTMLDivElement[];

  for (const child of children) {
    const childRect = child.getBoundingClientRect();
    if (childRect.top <= centerY && childRect.bottom >= centerY) {
      return child;
    }
  }
  return null;
}
const customScroll = debounce(() => {
  const centerDiv = getElementCenter();
  if (centerDiv) {
    scrollToDiv(centerDiv);
  }
}, 150);
</script>
<template>
  <div class="relative">
    <div
      ref="scrollContainer"
      class="overflow-y-scroll snap-y snap-mandatory rounded-[30px] bg-gray-200 rounded-xl scrollbar-hidden"
      @scroll="customScroll"
      :style="`height: ${5 * 40}px`"
    >
      <div
        v-for="_ in 2"
        class="px-3 item flex items-center justify-center snap-center text-base pointer-events-none"
        style="height: 40px"></div>
      <div
        ref="items"
        v-for="value in options"
        :key="value"
        class="px-3 item flex items-center justify-center snap-center text-base select-none"
        :class="{
          'bg-blue-500 text-white': value == modelValue,
        }"
        :data-value="value"
        style="height: 40px"
        @click="onClickItem"
      >
        {{ value }}
      </div>
      <div
        v-for="_ in 2"
        class="px-3 item flex items-center justify-center snap-center text-base pointer-events-none"
        style="height: 40px"></div>
    </div>
    <div
      class="highlight absolute inset-x-0 top-1/2 translate-y-[-50%] border-t border-b border-gray-300 pointer-events-none"
      style="height: 40px"
    ></div>
  </div>
</template>
<style scoped>
/* Tailwind no incluye scrollbar-hide por defecto; puedes usar un plugin o CSS global */
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  scrollbar-width: none;
}
</style>
