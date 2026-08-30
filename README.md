# FIID Cinema

Лендинг персональных 3D-мультфильмов на React, Vite и TypeScript.

## Запуск

```bash
npm install
npm run dev
```

Production-сборка:

```bash
npm run build
```

Контакты настраиваются централизованно в `src/config/contacts.ts`. Пустые WhatsApp и Telegram не отображаются. Форму перед полноценным запуском нужно подключить к почте, CRM или серверному обработчику.

Исходные ролики уже собраны в облегчённые веб-версии внутри `public/video`. Повторная подготовка медиа доступна командой `npm run media:prepare`; исходники ожидаются в `C:/Users/Administrator/Downloads/Cinema`.
