# 💰 Smart Budget

A full-stack Mern application for collaborative family financial management.  
Built to help users **track income, expenses, financial goals,store important documents, and generate reports** in real time.

---

## 🚀 Features
- 🔑 User Authentication (Login/Register with JWT)
- 📊 Dashboard with income & expense charts
- 💸 Add, update & delete expenses and incomes dynamically
- 🎯 Set and track financial goals
- 📑 Generate financial reports
- 🔔 Budget insights
- 📈 Financial Insights page: savings rate, monthly trends, budget performance, top expenses, and an expense-category breakdown showing each category's amount and percentage
- 👤 Logged-in user's name and email shown in the navigation panel, so it's clear whose account is open
- 📱 Mobile-friendly layout: on phones the sidebar becomes a slide-in menu behind a top bar, charts resize to fit the screen, and wide tables scroll inside their cards
- 🔐 Secure token-based API calls

---

## 🛠️ Tech Stack
**Frontend:** React, Redux Toolkit, Recharts, TailwindCSS, Vite  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (MongoDB Atlas in production)  
**Hosting:** Vercel (frontend and backend as two projects)

---

## 🌐 Live Demo
- **App:** https://smart-budget-six-pi.vercel.app
- **API:** https://smart-budget-api-iota.vercel.app/api/v1

---

## 📂 Project Structure
```
Smart-Budget/
├── backend/            # Node.js + Express API
│   ├── app.js          # Express app (exported for Vercel, listens locally)
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # JWT auth (isAuth.js)
│   ├── model/          # Mongoose models
│   └── routes/         # API routes
├── frontend/           # React + Vite app
│   ├── src/            # Components, services, Redux
│   ├── Templates/      # Dashboard component used at /dashboard
│   └── vercel.json     # SPA rewrites for client-side routes
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer
- A MongoDB database: either a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (recommended, see below) or MongoDB installed locally

### 1. Clone the repo
```bash
git clone https://github.com/Nirbhaygaikwad/Smart-Budget.git
cd Smart-Budget
```

### 2. Configure the backend
Create `backend/.env`:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mern-expense?appName=Cluster0
JWT_SECRET=<long random string>
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string. For a local database use `mongodb://127.0.0.1:27017/mern-expense` |
| `JWT_SECRET` | Yes | Secret used to sign login tokens. The server will not start without it |
| `PORT` | No | Port for the local server (default `8000`) |

Generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> ⚠️ Never commit `.env`. It is already listed in `backend/.gitignore`.

### 3. Start the backend
```bash
cd backend
npm install
npm run dev        # auto-restarts on changes (or: npm start)
```
You should see `MongoDB Connected Successfully` and `Server is running on port 8000`.

### 4. Start the frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open 👉 http://localhost:5173

The frontend calls `http://localhost:8000/api/v1` by default. To point it at a different API, create `frontend/.env.local`:
```env
VITE_API_URL=https://your-api.example.com/api/v1
```

### 5. Lint the frontend
```bash
cd frontend
npm run lint
```
This should finish with no errors or warnings. Keep it that way before pushing.

Components validate their props with [prop-types](https://www.npmjs.com/package/prop-types), and the `react/prop-types` lint rule is on. When you add or change a component's props, declare them on the component:
```jsx
import PropTypes from 'prop-types';

const AlertMessage = ({ message }) => <div className="alert">{message}</div>;

AlertMessage.propTypes = {
  message: PropTypes.node.isRequired,
};
```
Lint flags any prop a component uses without declaring it. The declarations are checked by lint only: this project uses React 19, which no longer validates `propTypes` in the browser, so a prop of the wrong type won't produce a console warning.

---

## 🍃 Setting Up MongoDB Atlas
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register) and create a **free (M0)** cluster.
2. **Security → Database Access → Add New Database User.** Use a password with only letters and numbers. Symbols such as `@ : / ? #` must be URL-encoded in the connection string (`@` becomes `%40`).
3. **Security → Network Access → Add IP Address.** Enter `0.0.0.0/0` (needed because Vercel's IP addresses change).
4. **Clusters → Connect → Drivers** and copy the connection string.
5. Replace `<db_username>` and `<db_password>` with your user's details (remove the `< >`), and add the database name before the `?`:
   ```
   mongodb+srv://myuser:MyPass123@cluster0.abcd123.mongodb.net/mern-expense?appName=Cluster0
   ```

---

## 🚀 Deploying to Vercel
The app is deployed as **two Vercel projects** from this one repository: one for `backend`, one for `frontend`.

### 1. Backend (API)
1. In Vercel, click **Add New → Project** and import this GitHub repo.
2. Set **Root Directory** to `backend`. Vercel detects Express automatically.
3. Add **Environment Variables**:
   - `MONGODB_URI`: your Atlas connection string
   - `JWT_SECRET`: a new random secret (don't reuse your local one)
4. Click **Deploy** and note the URL, e.g. `https://your-api.vercel.app`.
5. Check it: opening `https://your-api.vercel.app/api/v1/transactions` should return `{"status":"error","message":"Not authorized - No token"}`.

### 2. Frontend
1. Import the same repo again as a second project.
2. Set **Root Directory** to `frontend`. Vercel detects Vite automatically.
3. Add the environment variable:
   - `VITE_API_URL`: `https://your-api.vercel.app/api/v1`
4. Click **Deploy**.

> `VITE_API_URL` is built into the frontend at build time. If you change it, redeploy the frontend.

### Using the Vercel CLI instead
```bash
npm i -g vercel
vercel login

cd backend
vercel link
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel --prod

cd ../frontend
vercel link
vercel env add VITE_API_URL production
vercel --prod
```
Once a project's **Root Directory** is set in the dashboard, deploy through Git instead of running `vercel --prod` from inside its folder.

### 🔄 Automatic Deploys
Both projects are connected to GitHub:
- **Push to `main`:** deploys to production automatically.
- **Push to another branch or open a pull request:** creates a preview URL without touching production.

```bash
git add .
git commit -m "Describe your change"
git push
```
Progress is shown under **Deployments** in each Vercel project.

---

## 📡 API Overview
Base URL: `/api/v1`. Every route except register and login needs an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Create an account, returns a token |
| POST | `/users/login` | Log in, returns a token |
| GET | `/users/profile` | Get the current user |
| GET / POST | `/transactions` | List (with totals) or create transactions |
| PUT / DELETE | `/transactions/:id` | Update or delete a transaction |
| GET / POST | `/budgets` | List or create monthly budget goals |
| PUT / DELETE | `/budgets/:id` | Update or delete a budget goal |
| GET / POST | `/goals` | List or create savings goals |
| PUT / DELETE | `/goals/:id` | Update or delete a savings goal |
| GET / POST | `/documents` | List (without file contents) or upload documents |
| GET / PUT / DELETE | `/documents/:id` | Download, rename or delete a document |

Documents are stored in MongoDB as base64 data URLs, with a limit of **3 MB per file** because Vercel caps request bodies at 4.5 MB.

---

## 🧯 Troubleshooting
| Problem | Fix |
|---|---|
| `npm run dev` fails in the project root | Run it inside `backend/` or `frontend/`. The root has no `package.json` |
| `JWT_SECRET environment variable is not set` | Add `JWT_SECRET` to `backend/.env` (locally) or to the Vercel project's environment variables |
| `bad auth : authentication failed` | Wrong Atlas username or password. Reset the password under **Database Access** |
| `URI must include hostname, domain name, and tld` | Your password contains `@` or another special character. URL-encode it or pick a letters-and-numbers password |
| `querySrv ENOTFOUND` or connection timeout | Check **Network Access** includes `0.0.0.0/0`, or try another network |
| `EADDRINUSE: address already in use :::8000` | Another server is using port 8000. Stop it or set a different `PORT` in `.env` |
| Frontend shows no data in production | Make sure `VITE_API_URL` is set on the frontend project and ends in `/api/v1`, then redeploy |
