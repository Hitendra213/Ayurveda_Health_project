
- **📱 Responsive Design**  
Mobile-friendly UI with CSS Modules and Lucide icons.

- **⚠️ Error Handling & Loading States**  
Graceful fallbacks for API failures (e.g., journal endpoint).

---

## 🧩 Tech Stack

### Frontend
- React.js (v18+) — Hooks: `useState`, `useEffect`, `useRef`
- React Router DOM — For navigation
- Axios — For API communication
- Lucide React — Icons
- CSS Modules — Modular styling (e.g., `Dashboard.css`, `WellnessHub.css`)

### Backend Integration
- Node.js/Express server at `http://localhost:5000`
- MongoDB for user auth, assessments, journal, and messages

### Storage
- LocalStorage for session (email/password)  
⚠️ *Insecure for production; use JWT tokens instead.*

### Date Handling
- Native JavaScript `Date` for timestamps and calculations  
*(Current date: Oct 20, 2025)*

### Dependencies
- No external chart libraries (uses progress bars)
- No global state libraries (local state is sufficient)

---

## 🛠️ Installation

1. **Clone the Repository**
 ```bash
 git clone <your-repo-url>
 cd ayurveda-health-journey
