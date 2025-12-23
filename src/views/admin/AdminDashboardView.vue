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
                <th>Контакты</th>
                <th>Файл/Ссылка</th>
                <th>Статус</th>
                <th>Действия</th>
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
                  <div v-if="req.contact_name"><strong>{{ req.contact_name }}</strong></div>
                  <div v-if="req.contact_phone" class="text-sm text-gray">{{ req.contact_phone }}</div>
                  <div v-if="req.contact_email" class="text-sm text-gray">{{ req.contact_email }}</div>
                </td>
                <td>
                  <div v-if="req.file_name" class="badge-file">{{ req.file_name }}</div>
                  <a v-if="req.model_link" :href="req.model_link" target="_blank" class="link-sm">Ссылка</a>
                </td>
                <td>
                  <select 
                    :value="req.status" 
                    @change="onRequestStatusChange(req.id, $event)"
                    class="status-select"
                    :class="req.status"
                  >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Выполнена</option>
                    <option value="rejected">Отклонена</option>
                  </select>
                </td>
                <td class="actions">
                  <button class="link-sm" @click="startEditRequest(req)">Редактировать</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingRequest" class="admin-card mt-6">
          <h3>Редактировать заявку</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Имя</label>
              <input v-model="editingRequest.name" class="input-std" />
            </div>
            <div class="form-group">
              <label>Учреждение</label>
              <input v-model="editingRequest.orphanage" class="input-std" />
            </div>
            <div class="form-group">
              <label>Что нужно</label>
              <input v-model="editingRequest.wish" class="input-std" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Контактное лицо</label>
              <input v-model="editingRequest.contact_name" class="input-std" />
            </div>
            <div class="form-group">
              <label>Телефон</label>
              <input v-model="editingRequest.contact_phone" class="input-std" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="editingRequest.contact_email" class="input-std" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Комментарий</label>
              <input v-model="editingRequest.comment" class="input-std" />
            </div>
            <div class="form-group">
              <label>Файл (имя)</label>
              <input v-model="editingRequest.file_name" class="input-std" />
            </div>
            <div class="form-group">
              <label>Ссылка на модель</label>
              <input v-model="editingRequest.model_link" class="input-std" />
            </div>
          </div>
          <button class="btn-primary" @click="saveEditRequest">Сохранить</button>
          <button class="link-sm" @click="editingRequest = null">Отмена</button>
        </div>
      </div>

      <!-- Partners Tab -->
      <div v-if="currentTab === 'partners'" class="content-section">
        <div class="section-header">
          <h1>Партнёры</h1>
        </div>
        <div class="admin-card mb-6">
          <h3>Добавить партнёра</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Имя / Организация</label>
              <input v-model="partnerForm.name" class="input-std" />
            </div>
            <div class="form-group">
              <label>Тип</label>
              <input v-model="partnerForm.type" class="input-std" placeholder="мейкер / компания" />
            </div>
            <div class="form-group">
              <label>Город</label>
              <input v-model="partnerForm.city" class="input-std" />
            </div>
            <div class="form-group">
              <label>Контакт</label>
              <input v-model="partnerForm.contact" class="input-std" placeholder="@telegram / email / телефон" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Модель принтера</label>
              <input v-model="partnerForm.printer_model" class="input-std" />
            </div>
            <div class="form-group">
              <label>Материалы (через запятую)</label>
              <input v-model="partnerForm.materialsText" class="input-std" placeholder="PLA, PETG" />
            </div>
          </div>
          <button class="btn-primary" @click="createPartner">Добавить</button>
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
                   <button class="link-sm" @click="startEditPartner(partner)">Редактировать</button>
                   <button class="btn-danger" @click="store.removePartner(partner.id)">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingPartner" class="admin-card mt-6">
          <h3>Редактировать партнёра</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Имя / Организация</label>
              <input v-model="editingPartner.name" class="input-std" />
            </div>
            <div class="form-group">
              <label>Тип</label>
              <input v-model="editingPartner.type" class="input-std" />
            </div>
            <div class="form-group">
              <label>Город</label>
              <input v-model="editingPartner.city" class="input-std" />
            </div>
            <div class="form-group">
              <label>Контакт</label>
              <input v-model="editingPartner.contact" class="input-std" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Модель принтера</label>
              <input v-model="editingPartner.printer_model" class="input-std" />
            </div>
            <div class="form-group">
              <label>Материалы (через запятую)</label>
              <input v-model="editingPartner.materialsText" class="input-std" />
            </div>
          </div>
          <button class="btn-primary" @click="saveEditPartner">Сохранить</button>
          <button class="link-sm" @click="editingPartner = null">Отмена</button>
        </div>
      </div>

      <!-- Fundraising / Campaigns Tab -->
      <div v-if="currentTab === 'fundraising'" class="content-section">
        <div class="section-header">
          <h1>Целевые сборы</h1>
        </div>
        <div class="admin-card mb-6">
          <h3>Создать сбор</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="campaignForm.title" class="input-std" />
            </div>
            <div class="form-group">
              <label>Тип</label>
              <select v-model="campaignForm.type" class="input-std">
                <option value="materials">Материалы</option>
                <option value="money">Деньги</option>
                <option value="volunteers">Волонтёры</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div class="form-group">
              <label>Статус</label>
              <select v-model="campaignForm.status" class="input-std">
                <option value="draft">Черновик</option>
                <option value="published">Опубликован</option>
                <option value="hidden">Скрыт</option>
                <option value="closed">Закрыт</option>
              </select>
            </div>
            <div class="form-group">
              <label>Картинка (URL)</label>
              <input v-model="campaignForm.heroImage" class="input-std" placeholder="https://..." />
            </div>
          </div>
          <div class="form-group">
            <label>Коротко</label>
            <input v-model="campaignForm.shortText" class="input-std" />
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="campaignForm.description" rows="3" class="input-std"></textarea>
          </div>
          <div class="form-group">
            <label>Прогресс, %</label>
            <input type="number" min="0" max="100" v-model.number="campaignForm.progress" class="input-std" />
          </div>
          <button class="btn-primary" @click="createCampaign">Создать</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Картинка</th>
                <th>Прогресс</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="campaign in store.campaigns" :key="campaign.id">
                <td>
                  <div class="font-600">{{ campaign.title }}</div>
                  <div class="text-sm text-gray">{{ campaign.shortText }}</div>
                </td>
                <td>{{ campaign.type }}</td>
                <td>{{ campaign.status }}</td>
                <td>
                  <span v-if="campaign.heroImage" class="badge-file">URL</span>
                </td>
                <td>{{ campaign.progress || 0 }}%</td>
                <td class="actions">
                  <button class="link-sm" @click="startEditCampaign(campaign)">Редактировать</button>
                  <button class="link-sm" @click="store.deleteCampaign(campaign.id)">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingCampaign" class="admin-card mt-6">
          <h3>Редактировать сбор</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="editingCampaign.title" class="input-std" />
            </div>
            <div class="form-group">
              <label>Тип</label>
              <select v-model="editingCampaign.type" class="input-std">
                <option value="materials">Материалы</option>
                <option value="money">Деньги</option>
                <option value="volunteers">Волонтёры</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div class="form-group">
              <label>Статус</label>
              <select v-model="editingCampaign.status" class="input-std">
                <option value="draft">Черновик</option>
                <option value="published">Опубликован</option>
                <option value="hidden">Скрыт</option>
                <option value="closed">Закрыт</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Картинка (URL)</label>
            <input v-model="editingCampaign.heroImage" class="input-std" />
          </div>
          <div class="form-group">
            <label>Коротко</label>
            <input v-model="editingCampaign.shortText" class="input-std" />
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="editingCampaign.description" rows="3" class="input-std"></textarea>
          </div>
          <div class="form-group">
            <label>Прогресс, %</label>
            <input type="number" v-model.number="editingCampaign.progress" class="input-std" />
          </div>
          <button class="btn-primary" @click="saveEditCampaign">Сохранить</button>
          <button class="link-sm" @click="editingCampaign = null">Отмена</button>
        </div>
      </div>

      <!-- Done Works Tab -->
      <div v-if="currentTab === 'done'" class="content-section">
        <div class="section-header">
          <h1>Выполненные работы (галерея)</h1>
        </div>

        <div class="admin-card mb-6">
          <h3>Добавить работу</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="doneForm.title" class="input-std" />
            </div>
            <div class="form-group">
              <label>Картинка (URL)</label>
              <input v-model="doneForm.image" class="input-std" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>Дата</label>
              <input v-model="doneForm.date" type="date" class="input-std" />
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="doneForm.description" rows="3" class="input-std"></textarea>
          </div>
          <button class="btn-primary" @click="createDone">Добавить</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Дата</th>
                <th>Картинка</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="work in store.doneWorks" :key="work.id">
                <td>{{ work.title }}</td>
                <td>{{ work.date }}</td>
                <td><span v-if="work.image" class="badge-file">URL</span></td>
                <td>{{ work.description }}</td>
                <td class="actions">
                  <button class="link-sm" @click="store.deleteDoneWork(work.id)">Удалить</button>
                  <button class="link-sm" @click="startEditDone(work)">Редактировать</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingDone" class="admin-card mt-6">
          <h3>Редактировать работу</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="editingDone.title" class="input-std" />
            </div>
            <div class="form-group">
              <label>Картинка (URL)</label>
              <input v-model="editingDone.image" class="input-std" />
            </div>
            <div class="form-group">
              <label>Дата</label>
              <input v-model="editingDone.date" type="date" class="input-std" />
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="editingDone.description" rows="3" class="input-std"></textarea>
          </div>
          <button class="btn-primary" @click="saveEditDone">Сохранить</button>
          <button class="link-sm" @click="editingDone = null">Отмена</button>
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
                  <button @click="store.deleteResource(res.id)" class="btn-danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Articles Tab -->
      <div v-if="currentTab === 'articles'" class="content-section">
        <div class="section-header">
          <h1>Статьи</h1>
        </div>

        <div class="admin-card mb-6">
          <h3>Добавить статью</h3>
          <div class="form-group">
            <label>Заголовок</label>
            <input v-model="articleForm.title" class="input-std" placeholder="Введите заголовок статьи" />
          </div>
          <div class="form-group">
            <label>Содержание</label>
            <textarea v-model="articleForm.content" class="input-std" rows="10" placeholder="Текст статьи"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Автор</label>
              <input v-model="articleForm.author" class="input-std" placeholder="Имя автора" />
            </div>
            <div class="form-group">
              <label>Категория</label>
              <input v-model="articleForm.category" class="input-std" placeholder="Категория" />
            </div>
          </div>
          <div class="form-group">
            <label>URL изображения</label>
            <input v-model="articleForm.image" class="input-std" placeholder="https://..." />
          </div>
          <button @click="createArticle" class="btn-primary">Добавить статью</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Автор</th>
                <th>Категория</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in store.articles" :key="article.id">
                <td>{{ article.title }}</td>
                <td>{{ article.author }}</td>
                <td>{{ article.category || '-' }}</td>
                <td>{{ new Date(article.date).toLocaleDateString('ru-RU') }}</td>
                <td class="actions">
                  <button @click="startEditArticle(article)" class="link-sm">Редактировать</button>
                  <button @click="deleteArticle(article.id)" class="btn-danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingArticle" class="admin-card mt-6">
          <h3>Редактировать статью</h3>
          <div class="form-group">
            <label>Заголовок</label>
            <input v-model="editingArticle.title" class="input-std" />
          </div>
          <div class="form-group">
            <label>Содержание</label>
            <textarea v-model="editingArticle.content" class="input-std" rows="10"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Автор</label>
              <input v-model="editingArticle.author" class="input-std" />
            </div>
            <div class="form-group">
              <label>Категория</label>
              <input v-model="editingArticle.category" class="input-std" />
            </div>
          </div>
          <div class="form-group">
            <label>URL изображения</label>
            <input v-model="editingArticle.image" class="input-std" />
          </div>
          <button @click="saveEditArticle" class="btn-primary">Сохранить</button>
          <button @click="editingArticle = null" class="link-sm">Отмена</button>
        </div>
      </div>

      <!-- Videos Tab -->
      <div v-if="currentTab === 'videos'" class="content-section">
        <div class="section-header">
          <h1>Видео</h1>
        </div>

        <div class="admin-card mb-6">
          <h3>Добавить видео</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="videoForm.title" class="input-std" placeholder="Название видео" />
            </div>
            <div class="form-group">
              <label>URL видео</label>
              <input v-model="videoForm.url" class="input-std" placeholder="https://youtube.com/..." />
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="videoForm.description" class="input-std" rows="3"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>URL превью</label>
              <input v-model="videoForm.thumbnail" class="input-std" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>Длительность</label>
              <input v-model="videoForm.duration" class="input-std" placeholder="10:30" />
            </div>
          </div>
          <button @click="createVideo" class="btn-primary">Добавить видео</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Длительность</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="video in store.videos" :key="video.id">
                <td>{{ video.title }}</td>
                <td>{{ video.duration || '-' }}</td>
                <td>{{ new Date(video.date).toLocaleDateString('ru-RU') }}</td>
                <td class="actions">
                  <a :href="video.url" target="_blank" class="link-sm">Открыть</a>
                  <button @click="startEditVideo(video)" class="link-sm">Редактировать</button>
                  <button @click="deleteVideo(video.id)" class="btn-danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingVideo" class="admin-card mt-6">
          <h3>Редактировать видео</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="editingVideo.title" class="input-std" />
            </div>
            <div class="form-group">
              <label>URL видео</label>
              <input v-model="editingVideo.url" class="input-std" />
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="editingVideo.description" class="input-std" rows="3"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>URL превью</label>
              <input v-model="editingVideo.thumbnail" class="input-std" />
            </div>
            <div class="form-group">
              <label>Длительность</label>
              <input v-model="editingVideo.duration" class="input-std" />
            </div>
          </div>
          <button @click="saveEditVideo" class="btn-primary">Сохранить</button>
          <button @click="editingVideo = null" class="link-sm">Отмена</button>
        </div>
      </div>

      <!-- Files/Materials Tab -->
      <div v-if="currentTab === 'files'" class="content-section">
        <div class="section-header">
          <h1>Файлы для скачивания</h1>
        </div>

        <div class="admin-card mb-6">
          <h3>Добавить файл</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="materialForm.title" class="input-std" placeholder="Название файла" />
            </div>
            <div class="form-group">
              <label>Тип файла</label>
              <select v-model="materialForm.type" class="input-std">
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
                <option value="ppt">PPT</option>
                <option value="pptx">PPTX</option>
                <option value="zip">ZIP</option>
                <option value="other">Другое</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="materialForm.description" class="input-std" rows="2"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>URL файла</label>
              <input v-model="materialForm.fileUrl" class="input-std" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>Размер файла</label>
              <input v-model="materialForm.size" class="input-std" placeholder="2.5 MB" />
            </div>
          </div>
          <button @click="createMaterial" class="btn-primary">Добавить файл</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Размер</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="material in store.materials" :key="material.id">
                <td>{{ material.title }}</td>
                <td><span class="badge">{{ material.type.toUpperCase() }}</span></td>
                <td>{{ material.size || '-' }}</td>
                <td>{{ new Date(material.date).toLocaleDateString('ru-RU') }}</td>
                <td class="actions">
                  <a :href="material.fileUrl" target="_blank" class="link-sm">Скачать</a>
                  <button @click="startEditMaterial(material)" class="link-sm">Редактировать</button>
                  <button @click="deleteMaterial(material.id)" class="btn-danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingMaterial" class="admin-card mt-6">
          <h3>Редактировать файл</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="editingMaterial.title" class="input-std" />
            </div>
            <div class="form-group">
              <label>Тип файла</label>
              <select v-model="editingMaterial.type" class="input-std">
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
                <option value="ppt">PPT</option>
                <option value="pptx">PPTX</option>
                <option value="zip">ZIP</option>
                <option value="other">Другое</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="editingMaterial.description" class="input-std" rows="2"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>URL файла</label>
              <input v-model="editingMaterial.fileUrl" class="input-std" />
            </div>
            <div class="form-group">
              <label>Размер файла</label>
              <input v-model="editingMaterial.size" class="input-std" />
            </div>
          </div>
          <button @click="saveEditMaterial" class="btn-primary">Сохранить</button>
          <button @click="editingMaterial = null" class="link-sm">Отмена</button>
        </div>
      </div>

      <!-- Models Tab -->
      <div v-if="currentTab === 'models'" class="content-section">
        <div class="section-header">
          <h1>3D Модели</h1>
        </div>

        <div class="admin-card mb-6">
          <h3>Добавить модель</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="modelForm.name" class="input-std" placeholder="Название модели" />
            </div>
            <div class="form-group">
              <label>Категория</label>
              <input v-model="modelForm.category" class="input-std" placeholder="Игрушки, Инструменты, и т.д." />
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="modelForm.description" class="input-std" rows="3"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>URL STL файла</label>
              <input v-model="modelForm.fileUrl" class="input-std" placeholder="https://.../model.stl" />
            </div>
            <div class="form-group">
              <label>URL изображения</label>
              <input v-model="modelForm.imageUrl" class="input-std" placeholder="https://..." />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Время печати</label>
              <input v-model="modelForm.printTime" class="input-std" placeholder="3 часа" />
            </div>
            <div class="form-group">
              <label>Тип материала</label>
              <input v-model="modelForm.materialType" class="input-std" placeholder="PLA, ABS, PETG" />
            </div>
          </div>
          <button @click="createModel" class="btn-primary">Добавить модель</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Категория</th>
                <th>Материал</th>
                <th>Время печати</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="model in store.printModels" :key="model.id">
                <td>{{ model.name }}</td>
                <td>{{ model.category }}</td>
                <td>{{ model.materialType || '-' }}</td>
                <td>{{ model.printTime || '-' }}</td>
                <td>{{ new Date(model.date).toLocaleDateString('ru-RU') }}</td>
                <td class="actions">
                  <a v-if="model.fileUrl" :href="model.fileUrl" target="_blank" class="link-sm">Скачать</a>
                  <button @click="startEditModel(model)" class="link-sm">Редактировать</button>
                  <button @click="deleteModel(model.id)" class="btn-danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingModel" class="admin-card mt-6">
          <h3>Редактировать модель</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название</label>
              <input v-model="editingModel.name" class="input-std" />
            </div>
            <div class="form-group">
              <label>Категория</label>
              <input v-model="editingModel.category" class="input-std" />
            </div>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="editingModel.description" class="input-std" rows="3"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>URL STL файла</label>
              <input v-model="editingModel.fileUrl" class="input-std" />
            </div>
            <div class="form-group">
              <label>URL изображения</label>
              <input v-model="editingModel.imageUrl" class="input-std" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Время печати</label>
              <input v-model="editingModel.printTime" class="input-std" />
            </div>
            <div class="form-group">
              <label>Тип материала</label>
              <input v-model="editingModel.materialType" class="input-std" />
            </div>
          </div>
          <button @click="saveEditModel" class="btn-primary">Сохранить</button>
          <button @click="editingModel = null" class="link-sm">Отмена</button>
        </div>
      </div>

      <!-- Projects Tab -->
      <div v-if="currentTab === 'projects'" class="content-section">
        <div class="section-header">
          <h1>Проекты</h1>
        </div>

        <div class="admin-card mb-6">
          <h3>Добавить проект</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название проекта</label>
              <input v-model="projectForm.title" class="input-std" placeholder="Название проекта" />
            </div>
            <div class="form-group">
              <label>Категория</label>
              <input v-model="projectForm.category" class="input-std" placeholder="Медицина, Образование, и т.д." />
            </div>
          </div>
          <div class="form-group">
            <label>Краткое описание</label>
            <textarea v-model="projectForm.shortDescription" class="input-std" rows="2" placeholder="Краткое описание для карточки проекта"></textarea>
          </div>
          <div class="form-group">
            <label>Полное описание</label>
            <textarea v-model="projectForm.description" class="input-std" rows="4" placeholder="Подробное описание проекта"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Статус</label>
              <select v-model="projectForm.status" class="input-std">
                <option value="planned">Запланирован</option>
                <option value="active">Активен</option>
                <option value="completed">Завершён</option>
              </select>
            </div>
            <div class="form-group">
              <label>URL главного изображения</label>
              <input v-model="projectForm.heroImage" class="input-std" placeholder="https://..." />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Дата начала</label>
              <input v-model="projectForm.startDate" type="date" class="input-std" />
            </div>
            <div class="form-group">
              <label>Дата окончания (опционально)</label>
              <input v-model="projectForm.endDate" type="date" class="input-std" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Бюджет (₽)</label>
              <input v-model.number="projectForm.budget" type="number" class="input-std" placeholder="500000" />
            </div>
            <div class="form-group">
              <label>Собрано (₽)</label>
              <input v-model.number="projectForm.raised" type="number" class="input-std" placeholder="450000" />
            </div>
          </div>
          <div class="form-group">
            <label>Благополучатели</label>
            <textarea v-model="projectForm.beneficiaries" class="input-std" rows="2" placeholder="Кто получил помощь от проекта"></textarea>
          </div>
          <div class="form-group">
            <label>Влияние/Impact</label>
            <textarea v-model="projectForm.impact" class="input-std" rows="2" placeholder="Какое влияние оказал проект"></textarea>
          </div>
          <button @click="createProject" class="btn-primary">Добавить проект</button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Бюджет</th>
                <th>Дата начала</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in store.projects" :key="project.id">
                <td>
                  <div class="font-semibold">{{ project.title }}</div>
                  <div class="text-sm text-gray">{{ project.shortDescription }}</div>
                </td>
                <td><span class="badge">{{ project.category }}</span></td>
                <td>
                  <span 
                    class="badge" 
                    :class="{
                      'badge-success': project.status === 'completed',
                      'badge-info': project.status === 'active',
                      'badge-warning': project.status === 'planned'
                    }"
                  >
                    {{ project.status === 'active' ? 'Активен' : project.status === 'completed' ? 'Завершён' : 'Запланирован' }}
                  </span>
                </td>
                <td>
                  <div v-if="project.budget">
                    {{ project.raised?.toLocaleString('ru-RU') || 0 }} / {{ project.budget.toLocaleString('ru-RU') }} ₽
                  </div>
                  <div v-else>-</div>
                </td>
                <td>{{ new Date(project.startDate).toLocaleDateString('ru-RU') }}</td>
                <td class="actions">
                  <button @click="startEditProject(project)" class="link-sm">Редактировать</button>
                  <button @click="deleteProject(project.id)" class="btn-danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="editingProject" class="admin-card mt-6">
          <h3>Редактировать проект</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Название проекта</label>
              <input v-model="editingProject.title" class="input-std" />
            </div>
            <div class="form-group">
              <label>Категория</label>
              <input v-model="editingProject.category" class="input-std" />
            </div>
          </div>
          <div class="form-group">
            <label>Краткое описание</label>
            <textarea v-model="editingProject.shortDescription" class="input-std" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>Полное описание</label>
            <textarea v-model="editingProject.description" class="input-std" rows="4"></textarea>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Статус</label>
              <select v-model="editingProject.status" class="input-std">
                <option value="planned">Запланирован</option>
                <option value="active">Активен</option>
                <option value="completed">Завершён</option>
              </select>
            </div>
            <div class="form-group">
              <label>URL главного изображения</label>
              <input v-model="editingProject.heroImage" class="input-std" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Дата начала</label>
              <input v-model="editingProject.startDate" type="date" class="input-std" />
            </div>
            <div class="form-group">
              <label>Дата окончания</label>
              <input v-model="editingProject.endDate" type="date" class="input-std" />
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Бюджет (₽)</label>
              <input v-model.number="editingProject.budget" type="number" class="input-std" />
            </div>
            <div class="form-group">
              <label>Собрано (₽)</label>
              <input v-model.number="editingProject.raised" type="number" class="input-std" />
            </div>
          </div>
          <div class="form-group">
            <label>Благополучатели</label>
            <textarea v-model="editingProject.beneficiaries" class="input-std" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>Влияние/Impact</label>
            <textarea v-model="editingProject.impact" class="input-std" rows="2"></textarea>
          </div>
          <button @click="saveEditProject" class="btn-primary">Сохранить</button>
          <button @click="editingProject = null" class="link-sm">Отмена</button>
        </div>
      </div>

      <!-- Content Tab (raw JSON editor) -->
      <div v-if="currentTab === 'content'" class="content-section">
        <div class="section-header">
          <h1>Контент</h1>
        </div>

        <div class="admin-card">
          <h3>Редактор контента (JSON)</h3>
          <p class="text-sm text-gray">
            Этот раздел позволяет управлять всеми списками/контентом через API (без хардкода).
          </p>

          <div class="form-grid">
            <div class="form-group">
              <label>Раздел</label>
              <select v-model="contentKey" class="input-std" @change="loadContent">
                <option value="organizationProjects">Проекты организации (/projects)</option>
                <option value="generalPartners">Партнёры (/partners)</option>
                <option value="employees">Сотрудники</option>
                <option value="supportGoals">Цели поддержки (/support)</option>
                <option value="siteContent.supportSection">Секция “Поддержите наш проект” (лендинг)</option>
                <option value="projects">Charity: проекты</option>
                <option value="partners">Charity: партнёры</option>
                <option value="campaigns">Charity: сборы</option>
                <option value="doneWorks">Charity: галерея</option>
                <option value="articles">Charity: статьи</option>
                <option value="videos">Charity: видео</option>
                <option value="materials">Charity: файлы</option>
                <option value="printModels">Charity: 3D модели</option>
                <option value="resources">Charity: ресурсы</option>
                <option value="fundraisingGoals">Charity: целевые сборы (legacy)</option>
                <option value="donations">Charity: история поступлений</option>
                <option value="materialDonations">Заявки: материалы/техника</option>
                <option value="printRequests">Заявки: печать</option>
                <option value="volunteers">Заявки: волонтёры</option>
              </select>
            </div>

            <div class="form-group">
              <label>Загрузка файла (вернёт URL)</label>
              <input type="file" class="input-std" @change="onFileChange" />
              <div v-if="uploadedUrl" class="text-sm text-gray">URL: {{ uploadedUrl }}</div>
            </div>
          </div>

          <div class="admin-card mt-6" style="padding: 14px">
            <h3 style="margin-bottom: 10px">Формы для заполнения</h3>
            <p class="text-sm text-gray" style="margin-top: -6px; margin-bottom: 12px">
              При выборе раздела показываются доступные поля. Изменения в форме автоматически обновят JSON.
            </p>
            <ContentSchemaEditor
              :schema="contentSchema"
              :value="contentParsed"
              :disabled="contentJsonInvalid"
              @update:value="onContentEditorUpdate"
            />
          </div>

          <div class="form-group mt-6">
            <label style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" v-model="showRawJson" />
              Показать Raw JSON
            </label>
          </div>

          <div v-if="showRawJson || !contentSchema" class="form-group">
            <label>JSON</label>
            <textarea v-model="contentJson" rows="18" class="input-std"></textarea>
            <div v-if="contentJsonInvalid" class="text-sm" style="color: #b91c1c; margin-top: 6px">
              JSON невалидный — форма отключена (исправьте Raw JSON).
            </div>
          </div>

          <button class="btn-primary" @click="saveContent">Сохранить</button>
          <button class="link-sm" @click="loadContent">Перезагрузить</button>
          <div v-if="contentStatus" class="text-sm text-gray" style="margin-top: 10px">
            {{ contentStatus }}
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCharityStore } from '@/stores/charity'
import { trackApiError } from '@/services/api/http'
import ContentSchemaEditor from '@/components/admin/ContentSchemaEditor.vue'
import { CONTENT_SCHEMAS } from '@/components/admin/contentSchemas'

const store = useCharityStore()

const tabs = [
      { id: 'requests', label: 'Заявки' },
      { id: 'partners', label: 'Партнёры' },
      { id: 'fundraising', label: 'Сборы' },
      { id: 'done', label: 'Галерея' },
      { id: 'projects', label: 'Проекты' },
      { id: 'materials', label: 'Материалы' },
      { id: 'resources', label: 'Ресурсы' },
      { id: 'articles', label: 'Статьи' },
      { id: 'videos', label: 'Видео' },
      { id: 'files', label: 'Файлы' },
      { id: 'models', label: '3D Модели' },
      { id: 'content', label: 'Контент' }
]

const currentTab = ref('requests')
const campaignForm = ref({
  title: '',
  description: '',
  type: 'materials',
  status: 'draft',
  shortText: '',
  heroImage: '',
  progress: 0
})
const partnerForm = ref({
  name: '',
  type: 'мейкер',
  city: '',
  contact: '',
  printer_model: '',
  materialsText: ''
})
const doneForm = ref({
  title: '',
  image: '',
  description: '',
  date: ''
})
const editingRequest = ref<any | null>(null)
const editingPartner = ref<any | null>(null)
const editingCampaign = ref<any | null>(null)
const editingDone = ref<any | null>(null)

// New content forms
const articleForm = ref({
  title: '',
  content: '',
  author: '',
  image: '',
  category: ''
})

const videoForm = ref({
  title: '',
  url: '',
  description: '',
  thumbnail: '',
  duration: ''
})

const materialForm = ref({
  title: '',
  type: 'pdf',
  fileUrl: '',
  description: '',
  size: ''
})

const modelForm = ref({
  name: '',
  description: '',
  category: '',
  fileUrl: '',
  imageUrl: '',
  printTime: '',
  materialType: ''
})

const projectForm = ref({
  title: '',
  description: '',
  shortDescription: '',
  status: 'active',
  category: '',
  heroImage: '',
  startDate: '',
  endDate: '',
  beneficiaries: '',
  impact: '',
  budget: 0,
  raised: 0
})

const editingArticle = ref<any | null>(null)
const editingVideo = ref<any | null>(null)
const editingMaterial = ref<any | null>(null)
const editingModel = ref<any | null>(null)
const editingProject = ref<any | null>(null)

// Content editor (raw JSON)
const contentKey = ref<
  | 'organizationProjects'
  | 'generalPartners'
  | 'employees'
  | 'supportGoals'
  | 'resources'
  | 'fundraisingGoals'
  | 'projects'
  | 'partners'
  | 'campaigns'
  | 'doneWorks'
  | 'articles'
  | 'videos'
  | 'materials'
  | 'printModels'
  | 'materialDonations'
  | 'printRequests'
  | 'volunteers'
  | 'donations'
  | 'siteContent.supportSection'
>('organizationProjects')

const contentJson = ref('')
const contentStatus = ref<string | null>(null)
const uploadedUrl = ref<string | null>(null)
const showRawJson = ref(false)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const contentSchema = computed(() => CONTENT_SCHEMAS[String(contentKey.value)] || null)

const contentJsonInvalid = computed(() => {
  try {
    JSON.parse(contentJson.value || 'null')
    return false
  } catch {
    return true
  }
})

const contentParsed = computed(() => {
  try {
    return JSON.parse(contentJson.value || 'null')
  } catch {
    return null
  }
})

function onContentEditorUpdate(v: unknown) {
  contentJson.value = JSON.stringify(v, null, 2)
  contentStatus.value = 'Изменено (через форму) — не забудьте нажать “Сохранить”'
}

async function loadContent() {
  contentStatus.value = null
  uploadedUrl.value = null
  try {
    if (contentKey.value === 'donations') {
      const data = await store.fetchDonations().then(() => store.donations)
      contentJson.value = JSON.stringify(data, null, 2)
      contentStatus.value = 'Загружено (donations)'
      return
    }

    if (contentKey.value === 'siteContent.supportSection') {
      // pull via direct fetch to keep this file simple
      const res = await fetch(`${API_BASE_URL}/admin/site-content/supportSection`, {
        method: 'GET',
        credentials: 'include'
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Failed to load')
      contentJson.value = JSON.stringify(json, null, 2)
      contentStatus.value = 'Загружено (siteContent.supportSection)'
      return
    }

    const res = await fetch(`${API_BASE_URL}/admin/collections/${contentKey.value}`, {
      method: 'GET',
      credentials: 'include'
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message || 'Failed to load')
    contentJson.value = JSON.stringify(json, null, 2)
    contentStatus.value = `Загружено (${contentKey.value})`
  } catch (error) {
    trackApiError(error, 'AdminDashboardView.loadContent')
    contentStatus.value = 'Ошибка загрузки'
  }
}

async function saveContent() {
  contentStatus.value = null
  try {
    const parsed = JSON.parse(contentJson.value || 'null')

    if (contentKey.value === 'donations') {
      const res = await fetch(`${API_BASE_URL}/admin/donations`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Failed to save')
      await store.fetchDonations()
      contentStatus.value = 'Сохранено (donations)'
      return
    }

    if (contentKey.value === 'siteContent.supportSection') {
      const res = await fetch(`${API_BASE_URL}/admin/site-content/supportSection`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Failed to save')
      contentStatus.value = 'Сохранено (siteContent.supportSection)'
      return
    }

    const res = await fetch(`${API_BASE_URL}/admin/collections/${contentKey.value}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed)
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message || 'Failed to save')
    contentStatus.value = `Сохранено (${contentKey.value})`
  } catch (error) {
    trackApiError(error, 'AdminDashboardView.saveContent')
    contentStatus.value = 'Ошибка сохранения (проверь JSON)'
  }
}

async function uploadFile(file: File) {
  uploadedUrl.value = null
  contentStatus.value = null
  try {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      credentials: 'include',
      body: form
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error?.message || 'Upload failed')
    uploadedUrl.value = json.url
    contentStatus.value = 'Файл загружен — вставьте URL в JSON'
  } catch (error) {
    trackApiError(error, 'AdminDashboardView.uploadFile')
    contentStatus.value = 'Ошибка загрузки файла'
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadFile(file)
  input.value = ''
}

const updateStatus = (id: string, status: string) => {
  store.updateRequestStatus(id, status)
}

const onRequestStatusChange = (id: string, e: Event) => {
  const target = e.target as HTMLSelectElement | null
  updateStatus(id, target?.value || 'new')
}

onMounted(async () => {
  await store.fetchRequests()
  await store.fetchPartners()
  await store.fetchCampaigns(true)
  await store.fetchDoneWorks()
  await store.fetchResources()
  await store.fetchDonations()
  await store.fetchFundraisingGoals()
  await store.fetchMaterialDonations(true)
  await store.fetchArticles()
  await store.fetchVideos()
  await store.fetchMaterials()
  await store.fetchPrintModels()
  await store.fetchProjects()
  await loadContent()
})

const createCampaign = async () => {
  if (!campaignForm.value.title) {
    alert('Укажите название')
    return
  }
  await store.createCampaign({ ...campaignForm.value, needs: [] })
  campaignForm.value.title = ''
  campaignForm.value.description = ''
  campaignForm.value.shortText = ''
  campaignForm.value.heroImage = ''
  campaignForm.value.progress = 0
  campaignForm.value.status = 'draft'
  campaignForm.value.type = 'materials'
}

const createPartner = () => {
  if (!partnerForm.value.name) {
    alert('Укажите имя/организацию')
    return
  }
  store.addPartner({
    name: partnerForm.value.name,
    type: partnerForm.value.type,
    city: partnerForm.value.city,
    printer_model: partnerForm.value.printer_model,
    materials: partnerForm.value.materialsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    about: '',
    contact: partnerForm.value.contact
  })
  partnerForm.value.name = ''
  partnerForm.value.city = ''
  partnerForm.value.contact = ''
  partnerForm.value.printer_model = ''
  partnerForm.value.materialsText = ''
  partnerForm.value.type = 'мейкер'
}

const startEditRequest = (req: any) => {
  editingRequest.value = { ...req }
}

const saveEditRequest = async () => {
  if (!editingRequest.value) return
  await store.updateRequest(editingRequest.value.id, editingRequest.value)
  editingRequest.value = null
}

const startEditPartner = (partner: any) => {
  editingPartner.value = { 
    ...partner, 
    materialsText: (partner.materials || []).join(', ') 
  }
}

const saveEditPartner = async () => {
  if (!editingPartner.value) return
  const payload = {
    ...editingPartner.value,
    materials: editingPartner.value.materialsText
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
  }
  await store.updatePartner(editingPartner.value.id, payload)
  editingPartner.value = null
}

const startEditCampaign = (campaign: any) => {
  editingCampaign.value = { ...campaign }
}

const saveEditCampaign = async () => {
  if (!editingCampaign.value) return
  await store.updateCampaign(editingCampaign.value.id, editingCampaign.value)
  editingCampaign.value = null
}

const startEditDone = (work: any) => {
  editingDone.value = { ...work }
}

const saveEditDone = async () => {
  if (!editingDone.value) return
  await store.updateDoneWork(editingDone.value.id, {
    title: editingDone.value.title,
    image: editingDone.value.image,
    description: editingDone.value.description,
    date: editingDone.value.date
  })
  editingDone.value = null
}

const createDone = async () => {
  if (!doneForm.value.title || !doneForm.value.image) {
    alert('Укажите название и ссылку на картинку')
    return
  }
  await store.createDoneWork({
    title: doneForm.value.title,
    image: doneForm.value.image,
    description: doneForm.value.description,
    date: doneForm.value.date || new Date().toISOString().slice(0, 10)
  })
  doneForm.value.title = ''
  doneForm.value.image = ''
  doneForm.value.description = ''
  doneForm.value.date = ''
}

// Articles functions
const createArticle = async () => {
  if (!articleForm.value.title || !articleForm.value.content) {
    alert('Укажите название и содержание статьи')
    return
  }
  await store.createArticle({
    title: articleForm.value.title,
    content: articleForm.value.content,
    author: articleForm.value.author || 'Редакция',
    image: articleForm.value.image,
    category: articleForm.value.category
  })
  articleForm.value = { title: '', content: '', author: '', image: '', category: '' }
}

const startEditArticle = (article: any) => {
  editingArticle.value = { ...article }
}

const saveEditArticle = async () => {
  if (!editingArticle.value) return
  await store.updateArticle(editingArticle.value.id, editingArticle.value)
  editingArticle.value = null
}

const deleteArticle = async (id: string) => {
  if (confirm('Удалить статью?')) {
    await store.deleteArticle(id)
  }
}

// Videos functions
const createVideo = async () => {
  if (!videoForm.value.title || !videoForm.value.url) {
    alert('Укажите название и URL видео')
    return
  }
  await store.createVideo({
    title: videoForm.value.title,
    url: videoForm.value.url,
    description: videoForm.value.description,
    thumbnail: videoForm.value.thumbnail,
    duration: videoForm.value.duration
  })
  videoForm.value = { title: '', url: '', description: '', thumbnail: '', duration: '' }
}

const startEditVideo = (video: any) => {
  editingVideo.value = { ...video }
}

const saveEditVideo = async () => {
  if (!editingVideo.value) return
  await store.updateVideo(editingVideo.value.id, editingVideo.value)
  editingVideo.value = null
}

const deleteVideo = async (id: string) => {
  if (confirm('Удалить видео?')) {
    await store.deleteVideo(id)
  }
}

// Materials functions
const createMaterial = async () => {
  if (!materialForm.value.title || !materialForm.value.fileUrl) {
    alert('Укажите название и URL файла')
    return
  }
  await store.createMaterial({
    title: materialForm.value.title,
    type: materialForm.value.type,
    fileUrl: materialForm.value.fileUrl,
    description: materialForm.value.description,
    size: materialForm.value.size
  })
  materialForm.value = { title: '', type: 'pdf', fileUrl: '', description: '', size: '' }
}

const startEditMaterial = (material: any) => {
  editingMaterial.value = { ...material }
}

const saveEditMaterial = async () => {
  if (!editingMaterial.value) return
  await store.updateMaterial(editingMaterial.value.id, editingMaterial.value)
  editingMaterial.value = null
}

const deleteMaterial = async (id: string) => {
  if (confirm('Удалить материал?')) {
    await store.deleteMaterial(id)
  }
}

// Models functions
const createModel = async () => {
  if (!modelForm.value.name || !modelForm.value.category) {
    alert('Укажите название и категорию модели')
    return
  }
  await store.createPrintModel({
    name: modelForm.value.name,
    description: modelForm.value.description,
    category: modelForm.value.category,
    fileUrl: modelForm.value.fileUrl,
    imageUrl: modelForm.value.imageUrl,
    printTime: modelForm.value.printTime,
    materialType: modelForm.value.materialType
  })
  modelForm.value = { name: '', description: '', category: '', fileUrl: '', imageUrl: '', printTime: '', materialType: '' }
}

const startEditModel = (model: any) => {
  editingModel.value = { ...model }
}

const saveEditModel = async () => {
  if (!editingModel.value) return
  await store.updatePrintModel(editingModel.value.id, editingModel.value)
  editingModel.value = null
}

const deleteModel = async (id: string) => {
  if (confirm('Удалить модель?')) {
    await store.deletePrintModel(id)
  }
}

// Projects functions
const createProject = async () => {
  if (!projectForm.value.title || !projectForm.value.category) {
    alert('Укажите название и категорию проекта')
    return
  }
  await store.createProject({
    title: projectForm.value.title,
    description: projectForm.value.description,
    shortDescription: projectForm.value.shortDescription,
    status: projectForm.value.status as 'active' | 'completed' | 'planned',
    category: projectForm.value.category,
    heroImage: projectForm.value.heroImage,
    startDate: projectForm.value.startDate,
    endDate: projectForm.value.endDate || undefined,
    beneficiaries: projectForm.value.beneficiaries || undefined,
    impact: projectForm.value.impact || undefined,
    budget: projectForm.value.budget || undefined,
    raised: projectForm.value.raised || undefined,
    photos: [],
    videos: [],
    reports: [],
    videoReports: [],
    mediaLinks: []
  })
  projectForm.value = {
    title: '',
    description: '',
    shortDescription: '',
    status: 'active',
    category: '',
    heroImage: '',
    startDate: '',
    endDate: '',
    beneficiaries: '',
    impact: '',
    budget: 0,
    raised: 0
  }
}

const startEditProject = (project: any) => {
  editingProject.value = { ...project }
}

const saveEditProject = async () => {
  if (!editingProject.value) return
  await store.updateProject(editingProject.value.id, editingProject.value)
  editingProject.value = null
}

const deleteProject = async (id: string) => {
  if (confirm('Удалить проект?')) {
    await store.deleteProject(id)
  }
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
  font-family: inherit;
  font-size: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 3px rgba($primary-teal, 0.1);
  }
}

textarea.input-std {
  min-height: 80px;
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
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover { 
    text-decoration: underline;
    background: rgba($primary-coral, 0.1);
  }
}

.btn-primary {
  background: $primary-teal;
  color: $white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-right: 8px;

  &:hover {
    background: $primary-mint;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($primary-teal, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary {
  background: $primary-teal;
  color: $white;
  border: none;
  padding: $spacing-3 $spacing-5;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-weight: 600;
  transition: background $transition-fast;

  &:hover {
    background: darken($primary-teal, 5%);
  }
}

@media (max-width: $breakpoint-md) {
  .admin-layout { flex-direction: column; }
  .admin-sidebar { width: 100%; }
  .sidebar-nav { flex-direction: row; overflow-x: auto; }
}
</style>
