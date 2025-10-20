# Ayurveda Health Journey

A comprehensive web application built with React.js for users to explore Ayurveda principles, assess their Prakruti (constitutional type), track wellness through journaling and meal plans, view reports, and engage in a community chat. The app integrates with a Node.js/Express backend for user authentication, data persistence, and API interactions.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Setup](#environment-setup)
- [Contributing](#contributing)
- [License](#license)

## Description
Ayurveda Health Journey is a user-friendly platform designed to promote holistic health based on Ayurvedic principles. Users can:
- Register and log in securely.
- Complete detailed Prakruti assessments to determine their dosha (Vata, Pitta, Kapha) balance.
- Access personalized meal plans, daily tips, and recommendations.
- Maintain a wellness journal to track mood, symptoms, and reflections.
- View historical reports and health scores.
- Interact in a global community chat for sharing tips and questions.

The app calculates a dynamic health score based on assessment frequency, journal consistency, mood averages, and Prakruti balance. It's responsive and uses modern UI components for an engaging experience.

## Features
- **User Authentication**: Secure registration, login, and profile management (email/password-based).
- **Prakruti Assessment**: Multi-step form for self-assessment of physical, mental, emotional, and environmental traits. Calculates dominant dosha and provides recommendations.
- **Dashboard**: Personalized overview with health score (0-100%), Prakruti distribution, metrics (energy, sleep, etc.), recent activities, daily tips, and upcoming reminders.
- **Wellness Hub**: Dosha-specific weekly meal plans (Vata, Pitta, Kapha) with generate/preview functionality. Integrated journaling with mood tracking, symptoms, notes, and dosha insights.
- **Reports**: View, export (JSON), and compare past assessments in tabular format with trait comparisons and recommendations.
- **Profile Settings**: Update email/password and logout.
- **Community Chat**: Real-time message board for user discussions (fetches/sends messages via API).
- **Health Score Calculation**: Weighted algorithm (40% assessments, 30% mood avg., 20% journal consistency, 10% Prakruti balance).
- **Responsive Design**: Mobile-friendly UI with CSS modules and Lucide icons.
- **Error Handling & Loading States**: Graceful fallbacks for API failures (e.g., journal endpoint).

## Tech Stack
- **Frontend**:
  - React.js (18+ with Hooks: useState, useEffect, useRef)
  - React Router DOM (for navigation)
  - Axios (for API calls)
  - Lucide React (icons)
  - CSS Modules (for styling: e.g., Dashboard.css, WellnessHub.css)
- **Backend Integration**: Assumes Node.js/Express server at `http://localhost:5000` with MongoDB (user auth, assessments, journal, messages).
- **Storage**: LocalStorage for session (email/password – insecure for prod; use tokens in real apps).
- **Date Handling**: Native JS Date for timestamps and calculations (current date: Oct 20, 2025).
- **No External Dependencies Beyond Listed**: No charts (uses progress bars), no state management libs (local state suffices).

## Installation
1. **Clone the Repository**:
