<template>
  <div class="ui-table">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="column in columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  data: any[]
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.ui-table {
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: var(--gray-100);

      th {
        padding: var(--spacing-3);
        text-align: left;
        font-weight: 600;
        color: var(--gray-700);
        border-bottom: 2px solid var(--gray-300);
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid var(--gray-200);
        transition: var(--transition-fast);

        &:hover {
          background: var(--gray-50);
        }

        td {
          padding: var(--spacing-3);
        }
      }
    }
  }
}
</style>
