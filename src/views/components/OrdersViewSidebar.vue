<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4>{{ isANewItem ? "Adicionar Novo" : "Atualizar" }} Pedido</h4>
        <feather-icon icon="XIcon" @click.stop="closeSidebar" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">
        <!-- CUSTOMER -->
        <div class="mt-5 w-full">
          <label for="" class="vs-select--label">Cliente</label>
          <v-select v-model="customerId" :options="customers" :reduce="customer => customer.id" name="customer" :getOptionLabel="getOptionLabel" />
        </div>

        <!-- ORDER STATUS -->
        <div class="mt-5 w-full">
          <label for="" class="vs-select--label">Status do Pedido</label>
          <v-select v-model="status" :options="orderStatusChoices" :reduce="customer => customer.value" label="text" name="status" />
        </div>

        <!-- PRICE -->
        <vs-input
          icon-pack="feather"
          icon="icon-dollar-sign"
          label="Valor do Pedido"
          v-model="price"
          class="mt-5 w-full"
          v-validate="{ required: true, regex: /\d+(\.\d+)?$/ }"
          name="price" />
        <span class="text-danger text-sm" v-show="errors.has('price')">{{ errors.first('price') }}</span>
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
import vSelect from 'vue-select'
import { Validator } from 'vee-validate';

const dict = {
  custom: {
    price: {
      required: 'Digite o valor do pedido'
    }
  }
};

Validator.localize('en', dict);

export default {
  components: {
    VuePerfectScrollbar,
    vSelect
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
      customerId: null,
      status: 'NEW',
      price: '',
      loading: false,
      orderStatusChoices: [
        {text:'Novo', value:'NEW'},
        {text:'Pendente', value:'PENDING'},
        {text:'Entregue', value:'DELIVERED'}
      ],
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
      this.$store.dispatch('customers/fetchDataListItems')
      if (Object.entries(this.data).length === 0) {
        this.initValues()
        this.$validator.reset()
      } else {
        const { id, status, value, customer } = JSON.parse(JSON.stringify(this.data))
        this.id = id
        this.status = status
        this.price = value
        this.customerId = customer.id
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
      return !this.errors.any() && this.customerId && this.status && this.price > 0
    },
    scrollbarTag () { return this.$store.getters.scrollbarTag },
    customers () {
      return this.$store.state.customers.items
    }
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
      this.status = 'NEW'
      this.price = ''
      this.customerId = null
    },
    submitData () {
      this.$validator.validateAll().then(result => {
				this.loading = true;
        if (result) {
          const obj = {
            id: this.id,
            customer_id: this.customerId,
						status: this.status,
						value: this.price,
          }

					let response = null
          if (this.id !== null && this.id >= 0) {
            response = this.$store.dispatch('orders/updateItem', obj)
          } else {
            delete obj.id
            response = this.$store.dispatch('orders/addItem', obj)
					}
					response.then(() => {
						this.$emit('closeSidebar')
						this.initValues()
						this.$vs.notify({
							color: 'success',
							text: this.isANewItem ? 'Pedido cadastrado com sucesso' : 'Pedido Atualizado com sucesso',
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
    },
    getOptionLabel({ first_name, last_name}) {
      return `${first_name} ${last_name}`
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
