<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps<{
  modelValue: string,
  options: string[],
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string],
}>()
function scrollToDiv(divElement: HTMLDivElement) {
  const dataValue = (divElement.dataset.value as string);
  divElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  emit('update:modelValue', dataValue);
}
function scrollToCenter(event: Event) {
  scrollToDiv(
    (event.target as HTMLDivElement)
  );
}
const scrollContainer = ref<HTMLDivElement|null>(null);
const items = ref<HTMLDivElement[]>([]);
async function scrollBoot() {
  if (!scrollContainer.value || items.value.length == 0) {
    await nextTick();
    if (!scrollContainer.value || items.value.length == 0) {
      return;
    }
  }
  const divElement = getElementCenter(scrollContainer.value as HTMLDivElement);
  if (divElement) {
    scrollToDiv(divElement);
  }
}

function getElementCenter(container: HTMLDivElement): HTMLDivElement|null {
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
function customScroll(e: Event) {
  const div = (e.target as HTMLDivElement);
  const centerDiv = getElementCenter(div);
  if (centerDiv) {
    const value = (centerDiv.dataset.value as string);
    if (value != props.modelValue) {
      emit('update:modelValue', value);
    }
  }
}
onMounted(() => {
  scrollBoot();
});
</script>
<template>
  <div class="relative">
    <div
      ref="scrollContainer"
      class="picker w-16 overflow-y-scroll snap-y snap-mandatory rounded-[30px] bg-gray-200 rounded-xl scrollbar-hidden"
      @scroll="customScroll"
      :style="`height: ${5 * 40}px`"
    >
      <div
        v-for="_ in 2"
        class="item flex items-center justify-center snap-center text-base pointer-events-none"
        style="height: 40px"></div>
      <div
        ref="items"
        v-for="value in options"
        :key="value"
        class="item flex items-center justify-center snap-center text-base select-none"
        :class="{
          'bg-blue-500 text-white': Number(value) == Number(modelValue)
        }"
        :data-value="value"
        style="height: 40px"
        @click="scrollToCenter"
      >
        {{ value }}
      </div>
      <div
        v-for="_ in 2"
        class="item flex items-center justify-center snap-center text-base pointer-events-none"
        style="height: 40px"></div>
    </div>
    <div
      class="highlight absolute inset-x-0 top-1/2 translate-y-[-50%] w-16 border-t border-b border-gray-300 pointer-events-none"
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
