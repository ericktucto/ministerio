<script setup>
import ButtonToolBar from '@/components/atoms/ButtonToolBar.vue';
</script>
<template>
    <div class="grid justify-items-center">
        <div class="h-[3.5rem] flex gap-2">
            <ButtonToolBar active icon="Location01Icon" label="Mapa"/>
            <ButtonToolBar icon="UserTime03Icon" label="Revisitas"/>
            <ButtonToolBar icon="Settings02Icon" label="Configurar"/>
        </div>
    </div>
</template>

