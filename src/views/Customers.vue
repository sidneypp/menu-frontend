<template>
  <div id="data-list-list-view" class="data-list-container">
    <customers-view-sidebar
      :is-sidebar-active="addNewDataSidebar"
      :data="sidebarData"
      @closeSidebar="toggleDataSidebar"
    />

    <vs-table
      ref="table"
      v-model="selected"
      pagination
      :max-items="itemsPerPage"
      search
      :data="customers"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center flex-grow justify-between"
      >
        <div
          class="flex flex-wrap-reverse items-center data-list-btn-container"
        >
          <!-- ADD NEW -->
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addNewData"
          >
            <feather-icon icon="PlusIcon" svg-classes="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Adicionar Novo</span>
          </div>
        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown
          vs-trigger-click
          class="cursor-pointer mb-4 mr-4 items-per-page-handler"
        >
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span class="mr-2"
              >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
                customers.length - currentPage * itemsPerPage > 0
                  ? currentPage * itemsPerPage
                  : customers.length
              }}
              of {{ queriedItems }}</span
            >
            <feather-icon icon="ChevronDownIcon" svg-classes="h-4 w-4" />
          </div>
          <vs-dropdown-menu>
            <vs-dropdown-item @click="itemsPerPage = 10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 20">
              <span>20</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 30">
              <span>30</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 50">
              <span>50</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th sort-key="first_name">Nome</vs-th>
        <vs-th sort-key="email">Email</vs-th>
        <vs-th sort-key="created_at">Data de Criação</vs-th>
        <vs-th>Ação</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr v-for="(tr, indextr) in data" :key="indextr" :data="tr">
            <vs-td>
              <p class="customer-name font-medium truncate">
                {{ `${tr.first_name} ${tr.last_name}` }}
              </p>
            </vs-td>

            <vs-td>
              <p class="customer-email">{{ tr.email }}</p>
            </vs-td>

            <vs-td>
              <p class="customer-created-at">{{ formatDate(tr.created_at) }}</p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="EditIcon"
                svg-classes="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="editData(tr)"
              />
              <feather-icon
                icon="TrashIcon"
                svg-classes="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="deleteDialog(tr.id)"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import { parse, format } from "date-fns";
import CustomersViewSidebar from "./components/CustomersViewSidebar";

export default {
  components: {
    CustomersViewSidebar
  },
  data() {
    return {
      loading: false,
      loadingIndex: -1,
      selected: [],
      itemsPerPage: 10,
      isMounted: false,
      addNewDataSidebar: false,
      sidebarData: {}
    };
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    customers() {
      return this.$store.state.customers.items;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.customers.length;
    }
  },
  created() {
    this.$store.dispatch("customers/fetchDataListItems");
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    formatDate(date) {
      const parseDate = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
      return format(parseDate, "dd/MM/yyyy - HH:mm");
    },
    addNewData() {
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    deleteDialog(id) {
      if (!this.loading && this.loadingIndex !== id) {
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirmação`,
          text:
            "Essa ação não poderá ser desfeita, tem certeza que deseja deletar o cliente?",
          acceptText: "Deletar",
          cancelText: "Cancelar",
          accept: () => this.deleteData(id)
        });
      }
    },
    deleteData(id) {
      this.loading = true;
      this.loadingIndex = id;
      this.$store
        .dispatch("customers/removeItem", id)
        .then(({ data }) => {
          this.$vs.notify({
            color: "success",
            text: data.message,
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
    },
    editData(data) {
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    }
  }
};
</script>

<style lang="scss">
#data-list-list-view {
  .vs-con-table {
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .customer-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
