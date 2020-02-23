<template functional>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <p>
      <span>COPYRIGHT &copy;</span>
      <span>{{ new Date().getFullYear() }} </span>
      <a href="https://github.com/sidneypp" target="_blank" rel="nofollow"
        >Sidney Oliveira</a
      >
      <span class="hidden sm:inline-block">, All rights Reserved</span>
    </p>
    <span class="md:flex hidden items-center">
      <span>Feito exclusivamente para Menu</span>
      <feather-icon
        icon="HeartIcon"
        svg-classes="stroke-current text-danger w-6 h-6"
        class="ml-2"
      />
    </span>
  </footer>
</template>

<script>
export default {
  name: "TheFooter",
  props: {
    classes: {
      type: String
    }
  }
};
</script>
