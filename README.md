

# HRConnect Frontend

This is the **frontend application** for HRConnect, an AI-powered HR assistant platform. The frontend is built using **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. It provides an interactive chat interface for employees to interact with Aiva, the AI assistant.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Components](#components)
- [Local Storage & Chat Persistence](#local-storage--chat-persistence)
- [Development Notes](#development-notes)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- Interactive AI chat widget with suggestions
- Fullscreen chat mode
- Persistent chat using `localStorage`
- Auto-scroll to latest messages
- Responsive design for mobile and desktop
- Animated message transitions with Framer Motion
- Upload attachments
- Action buttons for AI responses (like/dislike)
- Timestamp display for each message

---

## Tech Stack

- **Next.js 16** – React framework with Turbopack
- **TypeScript** – Static typing
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Animations
- **Lucide Icons** – Icon library

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 9.x or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/earlfranciss/HRConnect-Frontend.git

# Navigate into project
cd HRConnect-Frontend

# Install dependencies
npm install
# or
yarn install
````

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the frontend.

---

## Project Structure

```
HRConnect_Frontend/
├── public/                  # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── img/                 # Images used in the app
│       ├── chat-icon.png
│       ├── login.jpg
│       └── workflow.png
│
└── src/
    ├── app/                 # Next.js routes, pages, layout
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── chat/            # Chat route and layout
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   └── login/           # Login page route
    │       └── page.tsx
    │
    ├── components/          # Reusable UI components
    │   ├── app-sidebar.tsx
    │   ├── chat/
    │   │   ├── chat-layout.tsx
    │   │   └── chat.tsx
    │   ├── chatwidget/
    │   │   └── chat-widget.tsx
    │   ├── logout/
    │   │   └── logout.tsx
    │   └── ui/               # Generic UI elements
    │       ├── avatar.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── collapsible.tsx
    │       ├── dropdown-menu.tsx
    │       ├── input.tsx
    │       ├── popover.tsx
    │       ├── scroll-area.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── textarea.tsx
    │       └── tooltip.tsx
    │
    ├── hooks/               # Custom React hooks
    │   └── use-mobile.ts
    │
    └── lib/                 # Utility functions and helpers
        └── utils.ts

```

---

## Components

### ChatWidget

* Floating chat widget
* Expand to fullscreen
* Handles user input and suggestions

### ChatFullScreen

* Fullscreen chat interface
* Auto-scrolls to latest messages
* Like/Dislike buttons for AI messages
* Editable user messages 
* Persistent chat storage with `localStorage`

---

## Local Storage & Chat Persistence

* All chat messages are stored in `localStorage` under the key `"chatMessages"`.
* Messages persist across page reloads.
* New messages automatically scroll to the bottom of the chat.

---

## Development Notes

* **Auto-scroll issues:** Ensure `ref` is applied to the correct scroll container. Use `useEffect` to scroll on `messages` change.
* **Responsive layout:** Flex-wrap is used for suggestion buttons; avoid CSS grid to allow wrapping on narrow screens.
* **Animations:** Framer Motion is used for message transitions. Use `AnimatePresence` for smooth exit animations.

---

## Future Enhancements

* Integrate with backend API for real-time AI responses
* Add authentication and employee profile data
* Add file upload handling for attachments
* Add dark mode support
* Improve accessibility (ARIA roles, keyboard navigation)

---

