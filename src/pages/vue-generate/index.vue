<script setup lang="ts">
import ComponentCollection from "./module/ComponentCollection"
import CreateArea from "./module/CreateArea"
import PropertySetting from "./module/PropertySetting"
</script>

<template>
    <main class="vue-generate">
        <section class="aside-left">
            <ComponentCollection />
        </section>
        <section class="middle">
            <CreateArea />
        </section>
        <section class="aside-right">
            <PropertySetting />
        </section>
    </main>
</template>

<style lang="scss" scoped>
.vue-generate {
  display: flex;
  height: 100%;
}

.middle {
    flex: 8 8 auto;
    height: 100%;
    padding: 5px;
    border-right: 1px solid $color-gray;
    border-left: 1px solid $color-gray;
}

.aside-left {
  flex: 1 1 10%;
  height: 100%;
}

.aside-right {
  flex: 1 1 10%;
  height: 100%;
}
</style>
