<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4>{{ isANewItem ? "Adicionar Novo" : "Atualizar" }} Cliente</h4>
        <feather-icon icon="XIcon" @click.stop="closeSidebar" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">
        <!-- FIRST NAME -->
        <vs-input label="Primeiro nome" v-model="firstName" class="mt-5 w-full" name="first_name" v-validate="'required|alpha_spaces'" />
        <span class="text-danger text-sm" v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>

        <!-- LAST NAME -->
        <vs-input label="Último nome" v-model="lastName" class="mt-5 w-full" name="last_name" v-validate="'required|alpha_spaces'" />
        <span class="text-danger text-sm" v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
        
        <!-- EMAIL -->
        <vs-input label="Email" v-model="email" class="mt-5 w-full" name="email" v-validate="'required|email'" />
        <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
      </div>
    </component>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button ref="loadableButton" id="button-with-loading" class="mr-6 vs-con-loading__container" @click="submitData" :disabled="!isFormValid || loading" type="relief">Enviar</vs-button>
      <vs-button type="border" color="danger" @click="closeSidebar" :disabled="loading">Cancelar</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { Validator } from 'vee-validate';

const dict = {
  custom: {
    first_name: {
      required: 'Digite seu primeiro nome',
      alpha_spaces: "Seu primeiro nome pode conter apenas caracteres alfabéticos"
    },
    last_name: {
      required: 'Digite seu último nome',
      alpha_spaces: "Seu último nome pode conter apenas caracteres alfabéticos"
    },
    email: {
        required: 'Digite seu email',
        email: 'O campo email deve ser um email válido'
    }
  }
};

Validator.localize('en', dict);

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
  data () {
    return {
			isANewItem: Object.entries(this.data).length === 0,
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      loading: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: .60
      }
    }
  },
  watch: {
		loading(val) {
			if (val) {
				this.$vs.loading({
						background: 'primary',
						color: '#FFF',
						container: "#button-with-loading",
						scale: 0.45
				})
			} else {
        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
			}
		},
    isSidebarActive (val) {
      if (!val) return
      if (Object.entries(this.data).length === 0) {
        this.initValues()
        this.$validator.reset()
      } else {
        const { id, first_name, last_name, email } = JSON.parse(JSON.stringify(this.data))
        this.id = id
        this.firstName = first_name
        this.lastName = last_name
        this.email = email
        this.initValues()
      }
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get () {
        return this.isSidebarActive
      },
      set (val) {
        if (!val) {
          this.$emit('closeSidebar')
        }
      }
    },
    isFormValid () {
      return !this.errors.any() && this.firstName && this.lastName && this.email
    },
    scrollbarTag () { return this.$store.getters.scrollbarTag }
  },
  methods: {
		closeSidebar() {
			if (!this.loading) {
				this.isSidebarActiveLocal = false
			}
		},
    initValues () {
      if (this.data.id) return
      this.id = null
      this.firstName = ''
      this.lastName = ''
      this.email = ''
    },
    submitData () {
      this.$validator.validateAll().then(result => {
				this.loading = true;
        if (result) {
          const obj = {
            id: this.id,
						first_name: this.firstName,
						last_name: this.lastName,
            email: this.email,
          }

					let response = null
          if (this.id !== null && this.id >= 0) {
            response = this.$store.dispatch('customers/updateItem', obj)
          } else {
            delete obj.id
            response = this.$store.dispatch('customers/addItem', obj)
					}
					response.then(() => {
						this.$emit('closeSidebar')
						this.initValues()
						this.$vs.notify({
							color: 'success',
							text: this.isANewItem ? 'Cliente cadastrado com sucesso' : 'Cliente Atualizado com sucesso',
							position: 'bottom-center'
						})
					}).catch(({ message }) => {
						this.$vs.notify({
							color: 'danger',
							text: message,
							position: 'bottom-center'
						})
					}).finally(() => this.loading = false)
        }
      })
    }
  }
}
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
