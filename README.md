# 🌿 Ayurveda Health Journey

A comprehensive **web application built with React.js** that allows users to explore Ayurveda principles, assess their *Prakruti* (constitutional type), track wellness through journaling and meal plans, view personalized reports, and engage in a global community chat.  
The app integrates with a **Node.js/Express backend** for user authentication, data persistence, and API interactions.

---

## 🧘‍♀️ Description

**Ayurveda Health Journey** is a user-friendly platform designed to promote holistic health based on Ayurvedic principles.

### Users can:
- 🪔 Register and log in securely.
- 🔍 Complete detailed Prakruti assessments to determine their dosha (*Vata*, *Pitta*, *Kapha*) balance.
- 🍲 Access personalized meal plans, daily tips, and lifestyle recommendations.
- ✍️ Maintain a wellness journal to track mood, symptoms, and reflections.
- 📊 View historical reports and health scores.
- 💬 Interact in a global community chat for sharing tips and questions.

The app calculates a **dynamic health score** based on:
> Assessment frequency, journal consistency, mood averages, and Prakruti balance.

It's responsive and uses modern UI components for an engaging experience.

---

## ⚙️ Features

- **🔐 User Authentication**  
  Secure registration, login, and profile management (email/password-based).

- **🧬 Prakruti Assessment**  
  Multi-step form for self-assessment of physical, mental, emotional, and environmental traits.  
  Calculates dominant dosha and provides recommendations.

- **📈 Dashboard**  
  Personalized overview with:
  - Health score (0–100%)
  - Prakruti distribution
  - Metrics (energy, sleep, etc.)
  - Recent activities, daily tips, and reminders.

- **🌿 Wellness Hub**  
  Dosha-specific weekly meal plans (Vata, Pitta, Kapha) with generate/preview functionality.  
  Integrated journaling with mood tracking, symptoms, notes, and dosha insights.

- **📜 Reports**  
  View, export (JSON), and compare past assessments in tabular format with trait comparisons and recommendations.

- **👤 Profile Settings**  
  Update email/password and logout.

- **💬 Community Chat**  
  Real-time message board for user discussions (fetches/sends messages via API).

- **📊 Health Score Calculation**  
  Weighted algorithm:  
    40% - Assessments
    30% - Mood Average
    20% - Journal Consistency
    10% - Prakruti Balance


- **📱 Responsive Design**  
Mobile-friendly UI with CSS Modules and Lucide icons.

- **⚠️ Error Handling & Loading States**  
Graceful fallbacks for API failures (e.g., journal endpoint).

---

## 🧩 Tech Stack

### Frontend
- React.js (v18+) — Hooks: `useState`, `useEffect`, `useRef`
- React Router DOM — For navigation
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
   
2. **Install Dependencies**
   ```bash
   npm install
- Installs: `react`, `react-dom`, `react-router-dom`, `axios`, `lucide-react`.

3. **Set Up Backend** (Required for full functionality):
- Clone/start your Node.js backend server.
- Ensure it runs on `http://localhost:5000`.
- Database: MongoDB with collections for `users`, `assessments`, `journal`, `messages`.

4. **Environment Variables**:
- No frontend env vars needed (hardcoded base_url for dev).
- For prod: Update `base_url` to your deployed backend.

5. **Run the App**
   ```bash
   npm start
 - Opens at `http://localhost:3000`.


## Usage
- **Getting Started**:
- Register/Login at `/register` or `/login`.
- Land on `/dashboard` for overview.

- **Key Flows**:
- **Assessment**: Navigate to `/assessment` → Complete 12-step form → View summary with dosha calculation → Saved to backend.
- **Wellness Hub** (`/wellness-hub`): View dosha-based meal plans (preview/full week toggle). Journal entries with auto-insights.
- **Reports** (`/reports`): List of assessments → Click "View Details" for table comparison/export.
- **Community** (`/community`): Post/read messages (requires login).
- **Profile** (`/profile`): Edit details/logout.

- **Sample Data**:
- Meal plans: Pre-defined for Vata/Pitta/Kapha (7 days).
- Tips/Reminders: Dynamic based on data/current date.
- Health Score: Example breakdown shown in dashboard tooltip.

- **Testing**:
- Use browser dev tools for localStorage simulation.
- Mock API responses if backend unavailable (app has fallbacks).

## Project Structure
```bash
src/
├── components/
│   ├── Dashboard.js          
│   ├── WellnessHub.js        
│   ├── Reports.js            
│   ├── Register.js           
│   ├── Profile.js            
│   ├── ObservationForm.js    
│   ├── Login.js              
│   └── Community.js          
├── App.js                    
└── index.js                                                     
