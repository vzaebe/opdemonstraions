# Документация проекта

Этот файл - единый индекс всех материалов в `docs/`. Ссылки ниже относительные (от корня `docs/`).

## Быстрый старт и обзор
- `README_PROJECT.md` - основной README проекта: описание, стек, quick start, разработка, тесты и деплой.
- `PROJECT_STRUCTURE.md` - структура репозитория, ключевые папки, конфигурация портов и окружения.
- `CHANGES_SUMMARY.md` - список недавних изменений (порты, env, документация).
- `DEPLOYMENT.md` - общий гайд по развертыванию фронтенда и бекенда.

## Админ-панель
- `ADMIN_USER_GUIDE.md` - краткое руководство пользователя админки и основные сценарии.
- `ADMIN_REDESIGN_SUMMARY.md` - итог редизайна админки: UI, inline-редактирование, дашборды.

## Архитектура и аудит
- `architecture/README_ARCHITECTURE.md` - архитектура и масштабирование, целевое устройство и рекомендации.
- `audits/ARCHITECTURE_AUDIT.md` - результаты аудита, риски и улучшения.

## Гайды, контент и UI
- `guides/IMPLEMENTATION_GUIDE.md` - поэтапный план внедрения архитектуры.
- `guides/CHARITY_CONTENT_MANAGEMENT.md` - управление контентом благотворительности (меню, админка, страницы).
- `guides/SAMPLE_CONTENT_GUIDE.md` - примеры контента в БД и как их просматривать/обновлять.
- `src/ui/README.md` - UI kit: принципы и набор компонентов.
- `src/data/README.md` - примерные JSON-данные и правила их обновления.

## Продуктовые требования
- `product/SUPPORT_PAGE.md` - страница поддержки: функционал, структура данных, API.
- `product/MODEL_REQUEST_FEATURE.md` - функция "заказать печать" для 3D моделей.

## Ревью и качество
- `reviews/PROJECT_REVIEW_SUMMARY.md` - итоги комплексного ревью проекта.
- `reviews/CODE_REFACTORING_SUMMARY.md` - результаты рефакторинга ключевых компонентов.
- `reviews/SENIOR_REVIEW.md` - senior-ревью с оценками и рекомендациями.

## Ops и деплой
- `ops/DEPLOY_VPS_UBUNTU.md` - быстрый деплой backend на Ubuntu VPS (git pull + systemd).
- `ops/HOSTING_FTP_AND_BACKEND.md` - привязка фронта на FTP-хостинге к backend URL.

## 3D Print Service (отдельный сервис)

### Общее
- `print-service/README.md` - обзор сервиса, фичи, стек и установка.
- `print-service/ARCHITECTURE.md` - архитектура, модули, user flows и схема БД.
- `print-service/API_SPECIFICATION.md` - спецификация API по модулям.
- `print-service/SLICING_AND_PRICING.md` - план расчета стоимости и интеграции slicing.
- `print-service/UI_KIT_INTEGRATION.md` - интеграция UI kit и 3D-лендинга.
- `print-service/MVP_ROADMAP.md` - границы MVP и Phase 2, флаги и таймлайн.

### Статус и прогресс
- `print-service/IMPLEMENTATION_STATUS.md` - статус реализации и next steps.
- `print-service/FRONTEND_STATUS.md` - состояние фронтенда и план запуска.
- `print-service/PROGRESS_SUMMARY.md` - общий прогресс работ.
- `print-service/FINAL_PROGRESS.md` - финальная сводка: готово/осталось.

### Эксплуатация и интеграции
- `print-service/docs/ARCHITECTURE.md` - краткая архитектура сервиса.
- `print-service/docs/API.md` - API reference с аутентификацией и ошибками.
- `print-service/docs/DEPLOYMENT.md` - гайд по деплою (традиционный/Docker), бэкапы и мониторинг.
- `print-service/docs/INTEGRATIONS_CONFIG.md` - настройки интеграций (оплата, доставка, CuraEngine, SMTP, pricing).
