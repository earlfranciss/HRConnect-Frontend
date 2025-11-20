

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

| Category               | Tools / Libraries              |
| ---------------------- | ------------------------------ |
| **Framework**          | Next.js                        |
| **Language**           | TypeScript                     |
| **UI Library**         | ShadCN UI + TailwindCSS        |
| **Icons**              | Lucide React                   |
| **HTTP Client**        | Fetch                          |
| **Animation**          | Framer Motion                  |
| **Version Control**    | Git + GitHub                   |


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
└── src
    ├── app                                    # Next.js App Router - Main application routes
    │   ├── favicon.ico                        # Browser tab icon
    │   ├── globals.css                        # Global CSS styles and Tailwind imports
    │   ├── layout.tsx                         # Root layout component (wraps all pages)
    │   ├── page.tsx                           # Landing/home page (route: /)
    │   │
    │   ├── chat                               # Chat feature route
    │   │   └── page.tsx                       # Main chat interface page (route: /chat)
    │   │
    │   ├── dashboard                          # Dashboard route
    │   │   └── page.tsx                       # User dashboard page (route: /dashboard)
    │   │
    │   ├── login                              # Authentication route
    │   │   └── page.tsx                       # Login page (route: /login)
    │   │
    │   └── register                           # User registration route
    │       └── page.tsx                       # Registration page (route: /register)
    │
    ├── components                             # Reusable React components
    │   ├── app-sidebar.tsx                    # Main application sidebar navigation
    │   ├── auth-checker.tsx                   # Authentication state checker/guard component
    │   │
    │   ├── chat                               # Chat-related components
    │   │   ├── chat-layout.tsx                # Layout wrapper for chat interface
    │   │   ├── ChatEmptyState.tsx             # Empty state UI when no messages exist
    │   │   ├── ChatInput.tsx                  # Message input field and send button
    │   │   ├── ChatMessage.tsx                # Individual chat message bubble component
    │   │   └── SuggestedPromptFull.tsx        # Full-size suggested prompt cards
    │   │
    │   ├── chatwidget                         # Chat widget components
    │   │   ├── chat-widget.tsx                # Embeddable chat widget component
    │   │   └── SuggestedPrompts.tsx           # Suggested prompt chips/buttons
    │   │
    │   ├── dashboard                          # Dashboard-related components
    │   │   ├── ApplyLeave.tsx                 # Leave application form modal
    │   │   ├── ApprovedRequests.tsx           # List of approved leave requests
    │   │   ├── AttendanceCard.tsx             # Attendance summary card widget
    │   │   ├── dashboard.tsx                  # Main dashboard layout component
    │   │   ├── LeaveBalanceCard.tsx           # Leave balance display card
    │   │   ├── PendingRequest.tsx             # List of pending leave requests
    │   │   ├── RequestCard.tsx                # Individual request item card
    │   │   └── UserHeader.tsx                 # User profile header section
    │   │
    │   ├── landingPage                        # Landing page sections
    │   │   ├── Benefits.tsx                   # Benefits/advantages section
    │   │   ├── CTA.tsx                        # Call-to-action section
    │   │   ├── Features.tsx                   # Features showcase section
    │   │   ├── Footer.tsx                     # Landing page footer
    │   │   ├── Header.tsx                     # Landing page header/navbar
    │   │   ├── Highlight.tsx                  # Highlighted content section
    │   │   └── HowItWorks.tsx                 # How it works/process section
    │   │
    │   ├── logout                             # Logout functionality
    │   │   └── logout.tsx                     # Logout button/handler component
    │   │
    │   └── ui                                 # Shadcn/UI component library
    │       ├── alert-dialog.tsx               # Modal dialog for alerts/confirmations
    │       ├── avatar.tsx                     # User avatar component
    │       ├── badge.tsx                      # Badge/tag component
    │       ├── button.tsx                     # Button component with variants
    │       ├── calendar.tsx                   # Date picker calendar component
    │       ├── card.tsx                       # Card container component
    │       ├── collapsible.tsx                # Collapsible/accordion component
    │       ├── command.tsx                    # Command palette/search component
    │       ├── dialog.tsx                     # Modal dialog component
    │       ├── dropdown-menu.tsx              # Dropdown menu component
    │       ├── input.tsx                      # Text input field component
    │       ├── label.tsx                      # Form label component
    │       ├── popover.tsx                    # Popover/tooltip container
    │       ├── scroll-area.tsx                # Custom scrollable area component
    │       ├── separator.tsx                  # Visual divider/separator line
    │       ├── sheet.tsx                      # Slide-out sheet/panel component
    │       ├── sidebar.tsx                    # Sidebar layout component
    │       ├── skeleton.tsx                   # Loading skeleton placeholder
    │       ├── sonner.tsx                     # Toast notification component
    │       ├── textarea.tsx                   # Multi-line text input component
    │       └── tooltip.tsx                    # Tooltip component
    │
    ├── configs                                # Configuration files
    │   ├── colors.ts                          # Color scheme/theme configuration
    │   └── leaveType.ts                       # Leave type definitions and constants
    │
    ├── hooks                                  # Custom React hooks
    │   ├── use-mobile.ts                      # Hook to detect mobile viewport
    │   └── useChatMessages.ts                 # Hook for managing chat message state
    │
    ├── lib                                    # Utility libraries
    │   └── utils.ts                           # Common utility functions (e.g., cn for className merging)
    │
    ├── services                               # API and external services
    │   └── api.ts                             # HTTP client and API endpoint functions
    │
    └── utils                                  # Utility functions
        ├── chat-storage.ts                    # Local storage utilities for chat data
        └── message-formatter.ts               # Message formatting and parsing utilities

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

