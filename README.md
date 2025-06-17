# SlothMQ UI

SlothMQ UI is the frontend interface for managing and monitoring the SlothMQ messaging system. Built with **React**, it provides tools for user management, log visualization, metrics, and real-time queue insights.

## 🌐 Live Features

- ✅ JWT-based authentication with token expiration management
- ✅ User CRUD with server-side pagination, debounced search, and column sorting
- ✅ Secure password update flows
- ✅ Login interface with error feedback and token-based session handling
- ✅ Protected routes using custom React context
- ✅ Real-time log streaming (when paired with backend)
- ✅ Responsive design with collapsible sidebar
- ✅ React Query integration for async data handling
- ✅ Centralized error popup component
- ✅ Modular popup handling for modals
- ✅ Basic RBAC foundation via access groups

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/rafaelingaramo/slothui.git
cd slothui
npm install
```

Running Locally
```bash
Copiar
Editar
npm run dev
```
By default, it expects the backend (slothmq) to be running at http://localhost:8080.

🔐 Authentication
SlothMQ UI uses JWT tokens for session control. Tokens are stored in localStorage and validated before route access. Tokens are issued by the backend at /api/login.

🧪 Roadmap / TODO
This project is currently in alpha. Here’s what’s next:

 ✅ Unit & Integration Tests
 ✅ ESLint with auto-save formatting
 ✅ Full CI/CD pipeline
 ✅ Better Docker containerization
 ✅ JavaScript → TypeScript migration
 ✅ RBAC enhancements
 ✅ Better modularization of context/hooks
 ✅ Test coverage reporting
 ✅ Custom connectors for Java, Node.js, Go
 ✅ Plugin system for extensibility

📜 License
This project is licensed under the MIT License.

SlothMQ is an alpha-stage tool and should not be used in production. The author provides no warranty or guarantee of performance or reliability. The project was named "Sloth" as a playful jab at the stereotype that Java is slow—this project aims to break that myth. 🦥🚀

📬 Connect
Backend Repo: [SlothMQ](https://github.com/rafaelingaramo/slothmq)
Frontend Repo: [SlothUI](https://github.com/rafaelingaramo/slothui)
Author: [Rafael Ingaramo](https://rafaelingaramo.github.io)