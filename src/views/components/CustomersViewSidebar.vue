<template>
  <vs-sidebar
    v-model="isSidebarActiveLocal"
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ isANewItem ? "Adicionar Novo" : "Atualizar" }} Cliente</h4>
      <feather-icon
        icon="XIcon"
        class="cursor-pointer"
        @click.stop="closeSidebar"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component
      :is="scrollbarTag"
      :key="$vs.rtl"
      class="scroll-area--data-list-add-new"
      :settings="settings"
    >
      <div class="p-6">
        <!-- FIRST NAME -->
        <vs-input
          v-model="firstName"
          v-validate="'required|alpha_spaces'"
          label="Primeiro nome"
          class="mt-5 w-full"
          name="first_name"
        />
        <span v-show="errors.has('first_name')" class="text-danger text-sm">{{
          errors.first("first_name")
        }}</span>

        <!-- LAST NAME -->
        <vs-input
          v-model="lastName"
          v-validate="'required|alpha_spaces'"
          label="Último nome"
          class="mt-5 w-full"
          name="last_name"
        />
        <span v-show="errors.has('last_name')" class="text-danger text-sm">{{
          errors.first("last_name")
        }}</span>

        <!-- EMAIL -->
        <vs-input
          v-model="email"
          v-validate="'required|email'"
          label="Email"
          class="mt-5 w-full"
          name="email"
        />
        <span v-show="errors.has('email')" class="text-danger text-sm">{{
          errors.first("email")
        }}</span>
      </div>
    </component>

    <div slot="footer" class="flex flex-wrap items-center p-6">
      <vs-button
        id="button-with-loading"
        ref="loadableButton"
        class="mr-6 vs-con-loading__container"
        :disabled="!isFormValid || loading"
        type="relief"
        @click="submitData"
        >Enviar</vs-button
      >
      <vs-button
        type="border"
        color="danger"
        :disabled="loading"
        @click="closeSidebar"
        >Cancelar</vs-button
      >
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { Validator } from "vee-validate";

const dict = {
  custom: {
    first_name: {
      required: "Digite seu primeiro nome",
      alpha_spaces:
        "Seu primeiro nome pode conter apenas caracteres alfabéticos"
    },
    last_name: {
      required: "Digite seu último nome",
      alpha_spaces: "Seu último nome pode conter apenas caracteres alfabéticos"
    },
    email: {
      required: "Digite seu email",
      email: "O campo email deve ser um email válido"
    }
  }
};

Validator.localize("en", dict);

export default {
  components: {
    VuePerfectScrollbar
  },
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isANewItem: Object.entries(this.data).length === 0,
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      loading: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
        }
      }
    },
    isFormValid() {
      return (
        !this.errors.any() && this.firstName && this.lastName && this.email
      );
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    }
  },
  watch: {
    loading(val) {
      if (val) {
        this.$vs.loading({
          background: "primary",
          color: "#FFF",
          container: "#button-with-loading",
          scale: 0.45
        });
      } else {
        this.$vs.loading.close("#button-with-loading > .con-vs-loading");
      }
    },
    isSidebarActive(val) {
      if (!val) return;
      if (Object.entries(this.data).length === 0) {
        this.initValues();
        this.$validator.reset();
      } else {
        const { id, first_name, last_name, email } = JSON.parse(
          JSON.stringify(this.data)
        );
        this.id = id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.email = email;
        this.initValues();
      }
    }
  },
  methods: {
    closeSidebar() {
      if (!this.loading) {
        this.isSidebarActiveLocal = false;
      }
    },
    initValues() {
      if (this.data.id) return;
      this.id = null;
      this.firstName = "";
      this.lastName = "";
      this.email = "";
    },
    submitData() {
      this.$validator.validateAll().then(result => {
        this.loading = true;
        if (result) {
          const obj = {
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email
          };

          let response = null;
          if (this.id !== null && this.id >= 0) {
            response = this.$store.dispatch("customers/updateItem", obj);
          } else {
            delete obj.id;
            response = this.$store.dispatch("customers/addItem", obj);
          }
          response
            .then(() => {
              this.$emit("closeSidebar");
              this.initValues();
              this.$vs.notify({
                color: "success",
                text: this.isANewItem
                  ? "Cliente cadastrado com sucesso"
                  : "Cliente Atualizado com sucesso",
                position: "bottom-center"
              });
            })
            .catch(({ message }) => {
              this.$vs.notify({
                color: "danger",
                text: message,
                position: "bottom-center"
              });
            })
            .finally(() => (this.loading = false));
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>
