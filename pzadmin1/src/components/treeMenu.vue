<template>
  <!-- <el-sub-menu index="1">
    <template #title>
      <el-icon><location /></el-icon>
      <span>Navigator One</span>
    </template>
    <el-menu-item-group title="Group One">
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="Group Two">
      <el-menu-item index="1-3">item three</el-menu-item>
    </el-menu-item-group>
    <el-sub-menu index="1-4">
      <template #title>item four</template>
      <el-menu-item index="1-4-1">item one</el-menu-item>
    </el-sub-menu>
  </el-sub-menu>
  <el-menu-item index="2">
    <el-icon><icon-menu /></el-icon>
    <span>Navigator Two</span>
  </el-menu-item>
  <el-menu-item index="3" disabled>
    <el-icon><document /></el-icon>
    <span>Navigator Three</span>
  </el-menu-item> -->

  <!-- 遍历数据和索引 -->

    <template v-for="(item,index) in props.meuData" >
      <el-menu-item
        @click="handleClick(item, `${props.index}-${item.meta.id}`)"
        v-if="!item.children || item.children.length == 0"
        :index="`${props.index}-${item.meta.id}`"
        :key="`${props.index}-${item.meta.id}`"
      >
        <!-- 数据内没有children或者children里面没有内容则没有子菜单，这里做判断，以及确认唯一值 -->

        <!-- 渲染图标和文本 -->
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </el-menu-item>

      <!-- 数据内没有children或者children里面没有内容则没有子菜单，否则则有，这里做判断 -->
      <el-sub-menu
        v-else
        :index="`${props.index}-${item.meta.id}`"
        :key="item.path"
      >
        <template #title>
          <el-icon size="20">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.name }}</span>
        </template>

        <!-- 递归渲染子菜单 -->
        <tree-menu
          :index="`${props.index}-${item.meta.id}`"
          :meuData="item.children"
        ></tree-menu>
      </el-sub-menu>
    </template>

</template>
<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps(["meuData", "index"]); //拿到父组件传递过来数组meuData的数据

//创建router实例
const router = useRouter();
const store = useStore();
//点击菜单
const handleClick = (item, active) => {
  console.log(item);
  store.commit("addMenu", item.meta);
  store.commit("updateMenuActive",active)
  router.push(item.meta.path);
};
</script>
<style scoped>
</style>
