# HuellaGo

HuellaGo is a responsive web application prototype that helps users understand and reduce their carbon footprint through habit tracking, ecological challenges, and personalized sustainability recommendations.

The project focuses on providing an intuitive user experience that guides users from registration to monitoring their environmental impact.

## Technologies

- HTML
- CSS
- JavaScript

## Responsive Design

The entire application is responsive and adapts to different screen sizes, including desktop, tablet, and mobile devices.

## Features

### Landing Page
- Product presentation
- Benefits overview
- Navigation to Login and Register
- Responsive layout

### Authentication
- User registration
- Login
- Password recovery
- Form validation

### Onboarding
After creating an account, users complete an onboarding process that collects the information required to estimate their initial carbon footprint.

The onboarding includes:

- Environmental goals
- Transportation habits
- Energy consumption
- Food habits
- Waste generation

Once completed, the application generates the user's initial environmental impact.

## Dashboard

The dashboard provides a quick overview of the user's environmental performance.

Information displayed includes:

- Carbon footprint summary
- Daily impact
- Eco Points
- Environmental equivalences
- Active challenge
- Carbon footprint evolution
- Main emission source

## My Footprint

This section allows users to:

- View the latest carbon footprint measurement
- Check measurement history
- Review registered habits
- Update environmental information
- Recalculate their footprint

## Challenges

Users can interact with ecological challenges by:

- Browsing available challenges
- Viewing challenge details
- Accepting a challenge
- Tracking progress
- Completing challenges
- Earning Eco Points
- Unlocking badges

## AI Recommendations

Recommendations are generated according to the user's environmental habits.

Users can:

- Browse personalized recommendations
- View recommendation details
- Understand the estimated environmental impact
- Convert recommendations into personal challenges
- Mark recommendations as completed
- Review completed recommendations

## Community Ranking

The ranking section lets users compare their environmental performance with other institutions.

Available views include:

- Weekly ranking
- Monthly ranking
- Yearly ranking
- Current position

## Badges

Users unlock badges as they complete environmental achievements.

The module includes:

- Earned badges
- Locked badges
- Progress tracking

## User Profile

The profile section allows users to:

- View personal information
- Edit profile information
- Configure notifications
- Manage privacy settings
- Log out

## Application Flow

Landing Page
      │
      ▼
Login / Register
      │
      ▼
Onboarding
      │
      ▼
Initial Carbon Footprint
      │
      ▼
Dashboard
      │
      ├── My Footprint
      ├── Challenges
      ├── AI Recommendations
      ├── Community Ranking
      ├── Badges
      └── User Profile

## Project Structure

public/
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── styles/
│   └── scripts/
│   └── components/
├── index.html
├── login.html
├── register.html
├── onboarding.html
├── dashboard.html
├── mi-huella.html
├── actualizar-habitos.html
├── recalcular_huella.html
├── retos.html
├── recomendaciones.html
├── ranking.html
├── insignias.html
├── mi-perfil.html
└── README.md

## Project Overview

HuellaGo is a front-end prototype created to simulate the complete experience of an environmental sustainability platform. The application demonstrates the navigation flow, interface behavior, and interaction between modules without requiring a backend or database.

All screens and interactions are built using HTML, CSS, and JavaScript, allowing the project to showcase the application's functionality through a fully responsive and interactive user interface.