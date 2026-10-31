# 🏋️‍♂️ IRONPULSE - Enterprise Commercial Gym Management System

A full-stack, enterprise-grade Gym Management System built with **Java 21, Spring Boot 3, Spring Data JPA, Spring Security, Hibernate, MySQL**, and a modern **React.js** responsive frontend designed with a dark athletic theme with vibrant orange highlights.

---

## 🌟 Key Features

1. **🛡️ Admin Authentication & Security**
   - BCrypt password hashing for credentials.
   - Stateless JWT Bearer token authentication.
   - Protected dashboard routes and automatic expiration handling.
   - Default administrator account: `admin` / `admin123` (or `admin@gym.com` / `admin123`).

2. **📊 Executive Command Dashboard**
   - Real-time KPI summary cards:
     - Total Registered Members & Active Members
     - Expired Subscriptions & Subscriptions Expiring Soon (≤ 7 days)
     - Total Personal Trainers & Active Coaching Sessions
     - Total Gym Equipment Assets & Machines Needing Maintenance
     - Monthly Recurring Revenue
   - Interactive visual charts powered by Chart.js (6-month revenue growth curve & membership distribution doughnut).
   - Recent member registrations and transaction feeds.
   - Urgent 7-day subscription expiration warning table with 1-click renewal shortcuts.

3. **👥 Gym Member Management**
   - Full CRUD operations (Add, View, Edit, Delete with confirmation modal).
   - Real-time instant search by name, phone number, or unique Member Code (e.g., `GYM-1001`).
   - Detailed Member Profile modal displaying age, gender, emergency contacts, physical address, and joining dates.
   - Optional 1-click plan assignment upon initial member registration.

4. **💳 Subscription & Billing Management**
   - 4 pre-configured membership plans:
     - **Monthly Plan**: 1 Month ($49.99)
     - **Quarterly Plan**: 3 Months ($129.99)
     - **Half-Yearly Plan**: 6 Months ($229.99)
     - **Annual Plan**: 12 Months ($399.99)
   - Assign plans to members with automatic start and expiry date calculation.
   - Automated expiration status tracking and date checks.
   - Status filters: All, Active, Expiring Within 7 Days, Expired.
   - Fast subscription renewal modal that extends active plans or restarts expired memberships.

5. **🧾 Payments Ledger & Receipts**
   - Comprehensive payment transaction history.
   - Automated invoice generation (`INV-2026-XXX`).
   - Payment method tracking: Credit/Debit Card, Cash, UPI, Bank Transfer.
   - Printable / Viewable official Gym Invoice Receipt modal.

6. **🥋 Personal Trainers & Coaching Staff**
   - Trainer profiles with high-definition photos, specializations, years of experience, and monthly salaries.
   - Specializations: Strength & Conditioning, CrossFit & HIIT, Bodybuilding & Physique Prep, Yoga & Mobility.
   - Direct link to view sessions scheduled under any specific coach.

7. **📅 Personal Training Sessions with Conflict Guard**
   - Interactive scheduling of 1-on-1 coaching sessions between members and trainers.
   - **Automated Conflict Prevention Guard**: The backend validates start and end times and strictly blocks double-booking or overlapping sessions for the same trainer on the same date.
   - Quick status transitions (`SCHEDULED` ➔ `COMPLETED` / `CANCELLED` / `NO_SHOW`).

8. **⚙️ Gym Equipment & Asset Inventory**
   - Commercial machine and free weight asset catalog:
     - Commercial Treadmills
     - Dumbbells (5kg - 50kg)
     - Competition Barbells & Bumper Plates
     - Olympic Heavy Duty Bench Press
     - 45-Degree Leg Press Machines
     - Dual Adjustable Cable Crossover Pulleys
     - Commercial Spin Studio Bikes
   - Condition indicators: `GOOD`, `NEEDS_REPAIR`, `UNDER_MAINTENANCE`.
   - Capital asset valuation tracking.
   - 1-click **Log Service** shortcut.

9. **🔧 Equipment Maintenance Records**
   - Log service dates, technician/vendor names, costs, description of repairs, and resolution notes.
   - When a maintenance record is saved as `COMPLETED`, the equipment condition status is automatically restored to `GOOD`.

10. **📈 Audited Reports & Analytics**
    - Date-range filtering (Custom From & To dates).
    - Comparative Revenue vs Maintenance Expenditure bar chart.
    - Export / Print capability for management and accounting.

---

## 🏗️ Project Architecture

```
gym/
├── backend/                               # Java Spring Boot REST API
│   ├── src/main/java/com/gym/
│   │   ├── GymManagementApplication.java  # Main Application Runner
│   │   ├── config/                        # SecurityConfig, JwtUtils, DataInitializer
│   │   ├── controller/                    # 10 REST Controllers
│   │   ├── dto/                           # Request / Response DTOs
│   │   ├── entity/                        # 9 Normalized JPA Entities
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   └── service/                       # Business Logic & Validation
│   ├── src/main/resources/
│   │   ├── application.properties         # Master configuration
│   │   ├── application-dev.properties     # Persistent embedded DB (Zero-setup)
│   │   ├── application-mysql.properties   # Native MySQL Server (localhost:3306)
│   │   └── schema.sql                     # Full MySQL DDL Schema
│   └── pom.xml
├── frontend/                              # React.js SPA (Vite)
│   ├── src/
│   │   ├── api/apiClient.js               # REST client with JWT header handling
│   │   ├── components/                    # Sidebar, Navbar, Toast, ConfirmModal, Badge
│   │   ├── pages/                         # Dashboard, Members, Subscriptions, Payments,
│   │   │                                  # Trainers, Sessions, Equipment, Maintenance, Reports, Login
│   │   ├── App.jsx                        # React Router & Protected Routes
│   │   ├── index.css                      # Premium Dark/Orange Gym Theme
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🚀 Running the Project Locally

### Prerequisites
- **Java 17 or Java 21** installed (`java -version`)
- **Node.js 18+** and **npm** installed (`node -v`)
- *(Optional)* **MySQL Server** (if connecting to local MySQL)

---

### Step 1: Start the Java Spring Boot Backend

The backend is pre-compiled and packaged into an executable JAR.

#### Option A: Instant Out-of-the-Box Mode (Default `dev` profile)
Runs with persistent disk database in MySQL-compatibility mode (`./data/gym_db`):
```bash
cd backend
java -jar target/gym-management-backend-1.0.0.jar
```
*The backend starts at `http://localhost:8080`, automatically creates all tables, and seeds demo members, trainers, equipment, subscriptions, and admin credentials.*

#### Option B: Connecting to Native MySQL Server
1. Ensure your local MySQL server is running on port `3306`.
2. Open MySQL Workbench, phpMyAdmin, or command-line and run:
   ```sql
   CREATE DATABASE IF NOT EXISTS gym_management;
   ```
   *(You can also execute `backend/src/main/resources/schema.sql` if you prefer manual DDL).*
3. Verify or adjust username/password in `backend/src/main/resources/application-mysql.properties` (default is `root` / `root`).
4. Run with the `mysql` profile:
   ```bash
   cd backend
   java -jar target/gym-management-backend-1.0.0.jar --spring.profiles.active=mysql
   ```

---

### Step 2: Start the React Frontend

Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:5173/login`**

---

## 🔑 Login Credentials

| Role | Username / Email | Password | Access |
|---|---|---|---|
| **Chief Gym Director / Administrator** | `admin` (or `admin@gym.com`) | `admin123` | Full Dashboard & Management Access |

*(You can also click the "Auto-Fill Admin Credentials" button on the login screen).*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin authentication & JWT token generation |
| `GET` | `/api/dashboard/stats` | Aggregated KPI stats, 6-month trends & distributions |
| `GET` | `/api/members` | Get all members (supports `?query=` live search) |
| `POST` | `/api/members` | Register new gym member with auto-generated Member Code |
| `PUT` | `/api/members/{id}` | Update member profile |
| `DELETE` | `/api/members/{id}` | Delete member and related sessions |
| `GET` | `/api/subscriptions` | Get all subscriptions (supports `?status=` filter) |
| `GET` | `/api/subscriptions/plans` | Get all 4 membership tiers |
| `GET` | `/api/subscriptions/expiring-soon`| Get subscriptions expiring within 7 days |
| `POST` | `/api/subscriptions/assign` | Assign membership plan to member |
| `PUT` | `/api/subscriptions/{id}/renew` | Renew existing membership plan |
| `GET` | `/api/trainers` | Get personal coaching staff |
| `POST` | `/api/trainers` | Onboard new trainer |
| `GET` | `/api/sessions` | Get training sessions (supports `?trainerId=`) |
| `POST` | `/api/sessions` | Schedule session with **conflict detection** |
| `PUT` | `/api/sessions/{id}` | Update session time / status |
| `GET` | `/api/equipment` | Get equipment inventory (supports `?condition=`) |
| `POST` | `/api/equipment` | Add new machine or free weight set |
| `GET` | `/api/maintenance` | Get maintenance and repair logs |
| `POST` | `/api/maintenance` | Log maintenance service and restore equipment condition |
| `GET` | `/api/payments` | Get payment receipts and transaction records |
| `GET` | `/api/reports` | Date-filtered analytics report (`?startDate=&endDate=`) |

---

## 🛡️ Conflict Prevention Logic

When scheduling a personal training session via `/api/sessions`:
```sql
SELECT s FROM TrainingSession s WHERE s.trainer.id = :trainerId 
AND s.trainingDate = :date 
AND s.sessionStatus != 'CANCELLED' 
AND (s.startTime < :endTime AND s.endTime > :startTime) 
AND (:sessionId IS NULL OR s.id != :sessionId)
```
If an overlap is detected, the API rejects the booking with an HTTP 400 error message:
`"Conflict: Trainer [Name] already has an active session from [Start] to [End] on [Date]"` and displays a toast alert to the administrator.

---

## 🎨 Theme & UI Highlights
- **Dominant Colors**: Obsidian Dark `#0B0E14`, Graphite Cards `#141923`, Neon Orange `#FF6B00`, Crisp White `#F8FAFC`.
- **Typography**: Google Fonts *Outfit* (bold athletic headers) & *Plus Jakarta Sans* (refined data interface).
- **Feedback**: Non-blocking toast notifications and explicit confirmation modals for deletions.
