<template>
  <div class="employee-profile">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка профиля...</p>
    </div>

    <div v-else-if="employee.id" class="profile-content">
      <div class="profile-header">
        <div class="profile-photo">
          <img :src="getImagePath(employee.id, 'photo')" :alt="`Фото ${employee.name}`" />
        </div>
        <div class="profile-background">
          <img :src="getImagePath(employee.id, 'background')" alt="Фон" class="background-image" />
        </div>
      </div>

      <div class="profile-info">
        <div class="info-left">
          <h2 class="employee-name">{{ employee.name }}</h2>
          <h4 class="employee-role">{{ employee.role }}</h4>
          <ul class="employee-details">
            <li v-for="(item, index) in employee.details" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="info-right">
          <p class="employee-description">{{ employee.bio }}</p>
        </div>
      </div>

      <div class="colleagues-section">
        <h5>Коллеги</h5>
        <div class="colleagues">
          <div
            class="colleague-card"
            v-for="colleague in colleagues"
            :key="colleague.id"
            @click="selectColleague(colleague.id)"
            :class="{ active: colleague.id === employee.id }"
          >
            <img :src="getImagePath(colleague.id, 'photo')" :alt="`Фото ${colleague.name}`" />
            <p class="colleague-name">{{ colleague.name }}</p>
            <p class="colleague-role">{{ colleague.role }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Не удалось загрузить данные сотрудников</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import employeeData from '@/data/employees.json'
// Импортируем изображения напрямую
import komarovPhoto from '@/assets/png/face/komarov pic.png'
import ivanovaPhoto from '@/assets/png/face/ivanova pic.png'
import mironovaPhoto from '@/assets/png/face/mironova pic.png'

interface Employee {
  id: string;
  name: string;
  role: string;
  photo: string;
  background: string;
  bio: string;
  details: string[];
}

const employee = ref<Employee>({} as Employee)
const colleagues = ref<Employee[]>([])
const isLoading = ref(true)

// Объект с правильными путями к изображениям
const imageMap = {
  'dmitriy': {
    photo: komarovPhoto,
    background: komarovPhoto
  },
  'olga': {
    photo: ivanovaPhoto,
    background: ivanovaPhoto
  },
  'sofia': {
    photo: mironovaPhoto,
    background: mironovaPhoto
  }
}

// Функция для получения правильного пути к изображению
function getImagePath(employeeId: string, type: 'photo' | 'background'): string {
  return imageMap[employeeId as keyof typeof imageMap]?.[type] || ''
}

function selectColleague(id: string) {
  const selected = employeeData.find((e: Employee) => e.id === id)
  if (selected) {
    employee.value = selected
    // Обновляем список коллег
    colleagues.value = employeeData.filter((e: Employee) => e.id !== employee.value.id)
  }
}

onMounted(() => {
  try {
    // По умолчанию показывает Ольга Иванова
    employee.value = employeeData.find((e: Employee) => e.id === 'olga') || employeeData[0]
    // Фильтрует коллег (исключает текущего)
    colleagues.value = employeeData.filter((e: Employee) => e.id !== employee.value.id)
  } catch (error) {
    console.error('Ошибка загрузки данных сотрудников:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.employee-profile {
  font-family: 'Inter', sans-serif;
  max-width: 900px;
  margin: auto;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.profile-header {
  position: relative;
  height: 200px;
  background: #f1f5f9;
}

.profile-background .background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  object-fit: cover;
  z-index: 0;
}

.profile-photo {
  position: absolute;
  top: 130px;
  left: 2rem;
  z-index: 2;
}

.profile-photo img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #2eacb4;
  box-shadow: 0 4px 12px rgba(46, 172, 180, 0.3);
  object-fit: cover;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1de9b6;
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(29, 233, 182, 0.4);
  }
}

.profile-info {
  display: flex;
  padding: 3rem 2rem 2rem;
  gap: 2rem;
}

.info-left {
  flex: 1;
  padding-right: 2rem;
}

.employee-name {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 700;
}

.employee-role {
  color: #2eacb4;
  margin-bottom: 1rem;
  font-weight: 500;
}

.employee-details {
  padding-left: 1rem;
  color: #334155;
  line-height: 1.6;
  margin: 0;
}

.employee-details li {
  margin-bottom: 0.5rem;
  position: relative;
}

.employee-details li::before {
  content: '•';
  color: #2eacb4;
  font-weight: bold;
  position: absolute;
  left: -1rem;
}

.info-right {
  flex: 2;
  color: #1e293b;
  line-height: 1.6;
}

.employee-description {
  margin: 0;
  font-size: 1rem;
}

.colleagues-section {
  padding: 2rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.colleagues-section h5 {
  margin: 0 0 1rem 0;
  color: #0f172a;
  font-size: 1.125rem;
  font-weight: 600;
}

.colleagues {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.colleague-card {
  flex: 1 0 21%;
  background: white;
  border-radius: 12px;
  text-align: center;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: #2eacb4;
  }

  &.active {
    border-color: #2eacb4;
    background: #f0fdfa;
  }
}

.colleague-card img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  object-fit: cover;
  border: 2px solid #2eacb4;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1de9b6;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(29, 233, 182, 0.2);
  }
}

.colleague-name {
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  font-size: 0.875rem;
}

.colleague-role {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    gap: 1rem;
  }

  .info-left {
    padding-right: 0;
  }

  .colleagues {
    gap: 0.5rem;
  }

  .colleague-card {
    flex: 1 0 45%;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #2eacb4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #ef4444;
}

.profile-content {
  width: 100%;
}
</style>
