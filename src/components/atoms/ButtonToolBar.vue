<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';

const props = defineProps({
    icon: String,
    label: String,
    active: Boolean,
});
const classActive = computed(() => {
    if (props.active) {
        return ['bg-blue-500', 'text-white', 'font-bold']
    }
    return [];
});
const icon = ref();
async function loadIcon() {
    icon.value = await import('@hugeicons/core-free-icons')
        .then((m) => m[props.icon])
}
onMounted(() => {
    loadIcon();
});
</script>
<template>
    <div
        class="text-center w-[4.5rem] text-xs h-full grid content-center"
        :class="classActive"
    >
        <div v-if="icon" class="grid justify-center mb-1">
            <HugeiconsIcon
                :icon="icon"
                :size="24"
                :strokeWidth="1.5"
            />
        </div>
        <span>{{ label }}</span>
    </div>
</template>
