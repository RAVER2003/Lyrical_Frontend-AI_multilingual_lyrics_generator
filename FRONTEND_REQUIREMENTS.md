# Frontend Requirements Document

## Project Overview

This document defines the current frontend requirements for the Lyrical web application.

At present, the frontend scope is intentionally small. The application is expected to contain two main user-facing areas:

1. Authentication pages
2. Protected in-app pages shown only after successful login

The initial release should prioritize a clean, professional, and easy-to-use authentication experience, with the login screen acting as the default entry point.

## Current Scope

The frontend is currently planned around:

- one primary authentication route
- one protected post-login home page
- login and signup states within the authentication experience
- light and dark theme support
- a responsive top-right utility area for theme toggle and about access

This scope is intentionally limited because the app is not expected to be very large in the current phase.

## Information Architecture

### Public Area

The public area is visible to users who are not authenticated.

It includes:

- Login view
- Signup view

### Protected Area

The protected area is visible only to authenticated users.

It includes:

- Home page after login
- Any future authenticated routes

Users who are not logged in must not be able to access protected pages directly. If they attempt to do so, they should be redirected to the login page.

## Authentication Experience

### Default Entry Behavior

- When the website opens, the login view must be shown by default.
- Users must be able to switch between login and signup without leaving the authentication page flow.
- The authentication UI should be centered and visually prominent.
- The authentication experience should present the product in a welcoming and professional way.

### Login Requirements

The login screen should contain a centered authentication card or block with:

- email field
- password field
- primary login action
- secondary prompt guiding new users to sign up

The login card should also include a welcome-oriented heading above the form, such as:

- app name
- welcome back message
- short product-oriented supporting text

#### Login Behavior

- User enters email and password
- Frontend validates required fields before submission
- On successful login, user is redirected to the home page
- If login fails, the UI must show a clear and user-friendly error message

### Signup Requirements

The signup view should contain:

- name field
- email field
- password field
- primary signup action
- prompt allowing existing users to switch back to login

#### Signup Validation

The frontend must perform standard validation checks before signup submission:

- name must not be empty
- email must follow valid email structure
- password must meet minimum length requirements
- password must include a mix of character types

Recommended password rules for the current version:

- minimum 8 characters
- at least one uppercase letter
- at least one lowercase letter
- at least one number
- at least one special character

#### Signup Business Checks

The signup flow must support checking whether the email already exists in the database.

Expected behavior:

- if the email already exists, show a clear validation or submission error
- if signup succeeds, show a success message and prompt the user to log in again
- after successful signup, the user should be redirected to or switched back to the login state

## Home Page Requirements

After successful login, the user must be taken to the home page.

For the current phase, the home page requirements are minimal:

- it must be a protected route
- it must confirm successful entry into the authenticated part of the app
- it should be ready for future feature expansion

## Header and Top-Right Actions

The application should include utility actions aligned to the top-right area.

### Large Screen Behavior

On larger screens, show:

- light/dark mode toggle
- about option

### Small Screen Behavior

On smaller screens:

- keep the light/dark mode toggle available
- hide the about option

## Responsive Design Requirements

The frontend should be responsive and usable across common desktop and mobile screen sizes.

Key requirements:

- authentication card should remain visually centered
- spacing and typography should scale appropriately
- forms should remain easy to read and interact with on smaller screens
- important actions must remain visible without clutter
- the about option should be hidden on small screens as noted above

## UI and UX Expectations

The frontend should present a professional and polished experience.

Design expectations:

- clean and modern visual design
- clear visual hierarchy
- welcoming login copy
- consistent spacing, typography, and component styling
- accessible labels and readable contrast in both light and dark themes
- intuitive toggle between login and signup

## Validation and Feedback Requirements

The frontend must provide clear feedback for all important user actions.

This includes:

- inline validation for incorrect or missing form input
- clear error messages for failed login
- clear error messages for duplicate email during signup
- success confirmation after successful signup
- loading or disabled states during auth submission

## Routing Requirements

The routing behavior should follow these rules:

- default application entry should lead to login
- signup should be accessible from the auth flow without a separate disconnected experience
- protected routes must require authentication
- unauthenticated users attempting protected routes must be redirected to login
- successful login must redirect to home
- successful signup must return the user to login

## Backend Integration Expectations

The frontend auth flow will depend on backend services for production behavior.

Expected backend-dependent checks include:

- login credential verification
- duplicate email detection during signup
- account creation
- authenticated session or token handling

Until backend integration is completed, the frontend may use mock or placeholder behavior, but the UI should be structured to support real API integration later.

## Non-Functional Requirements

- The frontend should be maintainable and easy to extend.
- Components should be reusable where practical.
- Auth flows should be designed with future API integration in mind.
- Theme switching should be smooth and consistent across screens.
- Protected route handling should be implemented in a way that scales to future pages.

## Assumptions for Current Version

The following assumptions are included for the current draft and can be revised later:

- login is the primary default auth view
- signup does not automatically log the user in
- successful signup returns the user to the login experience
- there is one protected home page for now
- about is a lightweight informational action, not a major standalone flow

## Future Revisions

This document captures the current agreed frontend direction only. It should be updated when any of the following change:

- number of application pages
- auth flow behavior
- validation policy
- protected route logic
- header/navigation requirements
- backend integration details

## Summary

The current frontend should deliver a compact, professional authentication-first experience with:

- login as the default entry
- toggle between login and signup
- centered auth UI
- validation for signup inputs
- duplicate email checking
- redirect to home after login
- redirect back to login after signup
- protected post-login routes
- theme toggle on all screen sizes
- about action only on larger screens

This version should serve as the baseline frontend requirements document until the team decides on further expansion.
