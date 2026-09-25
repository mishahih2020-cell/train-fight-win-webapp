# Marat Fight Club — Telegram Mini App

Telegram-вебап для тренировок с Маратом: онбординг, тренировки, прогресс, питание,
AI-коуч, курсы, личный кабинет и колесо фортуны. Дизайн-система и палитра — в
`../Брендбук Marat Fight Club.html` (открывается в браузере).

**Прод:** https://mishahih2020-cell.github.io/train-fight-win-webapp/
Деплой автоматический — любой пуш в `main` публикует новую версию через
`.github/workflows/deploy.yml` (GitHub Pages).

## Стек

React 19 + TypeScript + Vite + Tailwind CSS v4 + react-router-dom (`BrowserRouter`) +
lucide-react. Роутер — принципиально `BrowserRouter`, а не `HashRouter`: Telegram
сам кладёт служебные данные в хэш URL (`#tgWebAppData=...`), и `HashRouter` с этим
конфликтует (подробности — в истории git, коммит "Fix real black-screen cause").

Все данные пока моковые (`src/data/mock.ts`), backend не требуется — экраны
самодостаточны. Профиль пользователя и попытки колеса сохраняются в
`localStorage` браузера/WebView.

## Команды

```
npm install       # установка зависимостей
npm run dev        # локальная разработка (vite)
npm run build       # прод-сборка в dist/ (+ dist/404.html для GitHub Pages)
npm run lint         # oxlint
npm run preview        # предпросмотр собранного dist/
```

## Структура

```
src/
  pages/         — экраны (по одному на папку)
  components/ui/  — переиспользуемые атомы (Button, Card, Tabs, Modal, Wheel, Chart…)
  components/cards/ — карточки предметной области (WorkoutCard, CourseCard, FoodCard)
  components/navigation/ — BottomNav, Header, TabLayout
  context/        — AppStateContext (профиль, попытки колеса, localStorage)
  data/mock.ts     — все мок-данные одним файлом
  types/           — общие типы + Telegram WebApp typings
  lib/haptics.ts    — тактильный отклик через Telegram.WebApp.HapticFeedback
```

## Фото Марата

Все места, где должно быть фото Марата, сейчас — заглушки с надписью
«ЗДЕСЬ БУДЕТ ФОТО МАРАТА» (компонент `PlaceholderImage`/`Avatar`). Чтобы
подставить реальное фото — положить файл в `public/photos/` с нужным именем
(список и требования к каждому файлу — в `PHOTOS_README.txt` в корне проекта)
и передать в компонент проп `src`. Размеры/пропорции/скругления при этом
не меняются — заглушка и фото занимают ровно одну и ту же область.

## Известные особенности при работе внутри Telegram

- Роутер — `BrowserRouter` с `basename`, не `HashRouter` (см. выше).
- На full-screen экранах используется `position: fixed; inset: 0`, а не
  `min-height: 100dvh`/`100vh` — эти единицы могут временно резолвиться в 0
  в WebView Telegram на старте, схлопывая экран.
- Нижняя навигация всегда видна на «табовых» экранах (Главная, Тренировки,
  Питание, AI Coach, Курсы, Профиль); экраны-«дрилл-ины» (Настройка профиля,
  Прогресс, Создание/Процесс тренировки, Колесо) используют хедер с кнопкой
  «назад», которая также синхронизирована с нативной кнопкой «назад» Telegram.
