<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav class="sidebar-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-item', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
      <div class="sidebar-footer">
        <router-link :to="{ name: 'home' }" class="back-link">
          ← На сайт
        </router-link>
      </div>
    </aside>

    <main class="admin-content">
      <!-- Requests Tab -->
      <div v-if="currentTab === 'requests'" class="content-section">
        <div class="section-header">
          <h1>Заявки на печать</h1>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Имя</th>
                <th>Файл/Ссылка</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in store.requests" :key="req.id">
                <td>{{ req.id }}</td>
                <td>{{ req.date }}</td>
                <td>
                  <div>{{ req.name }}</div>
                  <div class="text-sm text-gray">{{ req.orphanage }}</div>
                </td>
                <td>
                  <div v-if="req.file_name" class="badge-file">{{ req.file_name }}</div>
                  <a v-if="req.model_link" :href="req.model_link" target="_blank" class="link-sm">Ссылка</a>
                </td>
                <td>
                  <select 
                    :value="req.status" 
                    @change="e => updateStatus(req.id, (e.target as HTMLSelectElement).value)"
                    class="status-select"
                    :class="req.status"
                  >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Выполнена</option>
                    <option value="rejected">Отклонена</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Partners Tab -->
      <div v-if="currentTab === 'partners'" class="content-section">
        <div class="section-header">
          <h1>Партнёры</h1>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Тип</th>
                <th>Город</th>
                <th>Контакты</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="partner in store.partners" :key="partner.id">
                <td>{{ partner.name }}</td>
                <td>{{ partner.type }}</td>
                <td>{{ partner.city }}</td>
                <td>{{ partner.contact || '-' }}</td>
                <td>
                   <button class="btn-danger" @click="store.removePartner(partner.id)">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fundraising Tab -->
      <div v-if="currentTab === 'fundraising'" class="content-section">
        <div class="section-header">
          <h1>Целевые сборы</h1>
        </div>
        <div class="grid-cards">
          <div v-for="goal in store.fundraisingGoals" :key="goal.id" class="admin-card">
            <h3>{{ goal.title }}</h3>
            <div class="form-group">
              <label>Собрано (₽)</label>
              <input 
                type="number" 
                v-model.number="goal.current_amount" 
                class="input-std"
              />
            </div>
            <div class="form-group">
              <label>Цель (₽)</label>
              <input 
                type="number" 
                v-model.number="goal.target_amount" 
                class="input-std"
              />
            </div>
            <div class="progress-preview">
               Прогресс: {{ Math.round((goal.current_amount / goal.target_amount) * 100) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Materials Tab -->
      <div v-if="currentTab === 'materials'" class="content-section">
        <div class="section-header">
          <h1>Предложения материалов</h1>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Имя</th>
                <th>Тип</th>
                <th>Что предлагают</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in store.materialDonations" :key="item.id">
                <td>{{ item.date }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <span class="badge">{{ item.type }}</span>
                </td>
                <td>{{ item.item }}</td>
                <td>{{ item.comment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Resources Tab -->
      <div v-if="currentTab === 'resources'" class="content-section">
        <div class="section-header">
          <h1>Ресурсы</h1>
        </div>
        <div class="table-container">
           <!-- Resource Table Logic Same as Before -->
           <table class="admin-table">
            <thead>
              <tr>
                <th>Категория</th>
                <th>Название</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in store.resources" :key="res.id">
                <td>{{ res.category }}</td>
                <td><a :href="res.url" target="_blank">{{ res.title }}</a></td>
                <td>
                  <button @click="store.removeResource(res.id)" class="btn-danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCharityStore } from '@/stores/charity'

const store = useCharityStore()

const tabs = [
  { id: 'requests', label: 'Заявки' },
  { id: 'partners', label: 'Партнёры' },
  { id: 'fundraising', label: 'Сборы' },
  { id: 'materials', label: 'Материалы' },
  { id: 'resources', label: 'Ресурсы' }
]

const currentTab = ref('requests')

const updateStatus = (id: number, status: string) => {
  store.updateRequestStatus(id, status)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: $gray-50;
}

.admin-sidebar {
  width: 250px;
  background: $gray-900;
  color: $white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: $spacing-6;
  border-bottom: 1px solid $gray-800;
  
  h2 {
    margin: 0;
    font-size: $text-xl;
    color: $primary-teal;
  }
}

.sidebar-nav {
  padding: $spacing-4;
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  flex-grow: 1;
}

.nav-item {
  text-align: left;
  background: none;
  border: none;
  color: $gray-400;
  padding: $spacing-3 $spacing-4;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  font-size: $text-base;

  &:hover {
    background: rgba($white, 0.1);
    color: $white;
  }

  &.active {
    background: $primary-teal;
    color: $white;
  }
}

.sidebar-footer {
  padding: $spacing-6;
  border-top: 1px solid $gray-800;
}

.back-link {
  color: $gray-400;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: $spacing-2;
  transition: color $transition-fast;

  &:hover {
    color: $white;
  }
}

.admin-content {
  flex-grow: 1;
  padding: $spacing-8;
  overflow-y: auto;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: $spacing-8;
  h1 { font-size: $text-2xl; color: $gray-900; }
}

.table-container {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  th, td {
    padding: $spacing-4;
    text-align: left;
    border-bottom: 1px solid $gray-100;
  }

  th {
    background: $gray-50;
    font-weight: 600;
    color: $gray-700;
    font-size: $text-sm;
    text-transform: uppercase;
  }
}

.badge-file {
  background: $gray-100;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: inline-block;
  margin-bottom: 4px;
}

.badge {
  background: rgba($primary-teal, 0.1);
  color: $primary-teal;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-6;
}

.admin-card {
  background: $white;
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  
  h3 { margin-bottom: $spacing-4; }
}

.form-group {
  margin-bottom: $spacing-4;
  label { display: block; margin-bottom: 4px; font-size: 0.9rem; color: $gray-600; }
}

.input-std {
  width: 100%;
  padding: 8px;
  border: 1px solid $gray-300;
  border-radius: 4px;
}

.status-select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid $gray-300;
  &.new { color: $primary-teal; border-color: $primary-teal; }
  &.in_progress { color: $primary-orange; border-color: $primary-orange; }
  &.completed { color: $primary-mint; border-color: $primary-mint; }
  &.rejected { color: $primary-coral; border-color: $primary-coral; }
}

.btn-danger {
  background: none;
  border: none;
  color: $primary-coral;
  cursor: pointer;
  &:hover { text-decoration: underline; }
}

@media (max-width: $breakpoint-md) {
  .admin-layout { flex-direction: column; }
  .admin-sidebar { width: 100%; }
  .sidebar-nav { flex-direction: row; overflow-x: auto; }
}
</style>
