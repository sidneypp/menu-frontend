<template>
  <div
    v-if="activeUserInfo.displayName"
    class="the-navbar__user-meta flex items-center"
  >
    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ activeUserInfo.displayName }}</p>
      <small>Disponível</small>
    </div>

    <div class="con-img ml-3">
      <img
        v-if="activeUserInfo.photoURL"
        key="onlineImg"
        :src="activeUserInfo.photoURL"
        alt="user-img"
        width="40"
        height="40"
        class="rounded-full shadow-md block"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    }
  }
};
</script>
