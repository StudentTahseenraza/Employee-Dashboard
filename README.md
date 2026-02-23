# 🚀 Employee Dashboard - Advanced React Application

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Framer_Motion-10.16.16-0055FF?style=for-the-badge&logo=framer" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" />
</p>

---

## 📋 Overview

A modern, feature-rich employee management dashboard built with React.js, featuring real-time data visualization, camera integration, voice commands, and an elegant UI with dark/light mode support.

This application demonstrates:

- Advanced React concepts  
- Creative data visualization  
- Exceptional UI/UX design  
- Production-ready architecture  

---

## ✨ Key Features

- 🔐 Secure Authentication with role-based access  
- 📊 Interactive Charts & Graphs for salary analytics  
- 🗺️ City Distribution Map with employee clustering  
- 📸 Camera Integration for employee photo capture  
- 🎤 Voice Commands for hands-free navigation  
- ⌨️ Keyboard Shortcuts for power users  
- 🌓 Dark/Light Theme with smooth transitions  
- 📱 Fully Responsive design  
- 📄 Multi-format Export (CSV, Excel, PDF, JSON)  
- 📇 QR Code Generation for each employee  
- 🔔 Live Activity Feed with real-time updates  
- 🌦️ Weather Integration for employee cities  

------

🛠️ Technology Stack

| Technology       | Version  | Purpose      |
| ---------------- | -------- | ------------ |
| React            | 18.2.0   | UI Framework |
| React Router DOM | 6.21.1   | Navigation   |
| Vite             | 5.0.8    | Build Tool   |
| Tailwind CSS     | 3.4.0    | Styling      |
| Framer Motion    | 10.16.16 | Animations   |


📊 Data Visualization

| Technology        | Version | Purpose         |
| ----------------- | ------- | --------------- |
| Recharts          | 2.10.3  | Charts & Graphs |
| React Simple Maps | 3.0.0   | Geographic Maps |
| React Icons       | 4.12.0  | Icon Library    |


🚀 Additional Features

| Technology     | Version | Purpose            |
| -------------- | ------- | ------------------ |
| Axios          | 1.6.2   | HTTP Requests      |
| jsPDF          | 2.5.1   | PDF Generation     |
| XLSX           | 0.18.5  | Excel Export       |
| QRCode.react   | 3.1.0   | QR Code Generation |
| Web Speech API | —       | Voice Commands     |



----

🚦 Getting Started
Prerequisites

    Node.js (v16 or higher)
    
    npm or yarn

Modern web browser with camera access

Internet connection for API calls

Installation Steps
Clone the repository

    git clone https://github.com/yourusername/employee-dashboard.git
    cd employee-dashboard
    
    Install dependencies
    npm install
    
    Set up environment variables
    cp .env.example .env
    # Edit .env with your configuration
    
    Start development server
    npm run dev
    
    Build for production
    npm run build
    npm run preview
    
    🔑 Credentials
    Role	Username	Password
    Admin	testuser	Test123


🎯 Core Features

----

1. Authentication System
----
Secure login with validation

Session management

Protected routes

Auto-redirect on logout

2. Employee Management
-----
View all employees in grid/list

Search by name, department, city

Filter by city

Detailed employee profiles

QR code generation for each employee

3. Data Visualization
-----
Salary Charts: Bar and pie charts with salary distribution

City Map: Geographic visualization of employee distribution

Statistics Cards: Real-time metrics and KPIs

Comparison Tool: Compare multiple employees

4. Camera Integration
-----
Capture employee photos

Multiple camera support

Preview and retake options

Download captured images

Works on mobile and desktop

5. Export Functionality
-----
CSV Export: Raw data export

Excel Export: Formatted spreadsheets

PDF Export: Professional reports

JSON Export: Raw JSON data

6. Advanced Features
-----
🎤 Voice Commands
"Go to employees" - Navigate to employee list

"Show salary chart" - Open salary analytics

"Show city map" - Open city distribution

"Take photo" - Open camera

"Go back" - Previous page

"Dashboard" - Return to home


⌨️ Keyboard Shortcuts

| Shortcut       | Action             |
| -------------- | ------------------ |
| Ctrl / Cmd + 1 | Open Employee List |
| Ctrl / Cmd + 2 | Open Salary Chart  |
| Ctrl / Cmd + 3 | Open City Map      |
| Ctrl / Cmd + C | Capture Photo      |
| Ctrl / Cmd + E | Export Data        |
| Ctrl / Cmd + ? | Show Help          |
| H              | Go to Home         |
| B              | Go Back            |


🌓 Theme System
-----
Dark/Light mode toggle

System preference detection

Persistent storage

Smooth transitions

Custom color schemes

🔔 Live Activity Feed
----
Real-time updates

Activity filtering

Timestamp tracking

User action logging


Typography
-----
Font Family: Inter, system-ui, sans-serif

Headings: Bold, gradient accents

Body: Regular, high readability

Components
----
Cards: Glass morphism with backdrop blur

Buttons: Gradient with hover effects

Inputs: Clean, focused states

Charts: Interactive with tooltips


🚀 Performance Optimizations
----
✅ Code splitting with lazy loading

✅ Image optimization

✅ Memoized components

✅ Debounced search

✅ Virtual scrolling for large lists

✅ Optimized re-renders

✅ Bundle size optimization

🌐 Browser Support

| Browser       | Support |
| ------------- | ------- |
| Chrome        | ✅ Full  |
| Firefox       | ✅ Full  |
| Safari        | ✅ Full  |
| Edge          | ✅ Full  |
| Opera         | ✅ Full  |
| Mobile Chrome | ✅ Full  |
| Mobile Safari | ✅ Full  |
