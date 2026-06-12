# CDIC Smart Setup

This repository contains the source code for the **CDIC Smart Setup**.

This document describes setup, configuration, authentication, and deployment steps.


---

## 📦 Prerequisites

- Node.js v16 or above
- npm (comes with Node.js)
- Backend Server URL
- Access to deployment server

---

## ⚙️ Runtime Configuration

### 📁 File Location
src/config/appConfig.js

### ✏️ Required Configuration

```js
export const appBaseUrl = "https://YOUR_SERVER_URL/";
export const appApiUrl = "https://YOUR_SERVER_URL/service/api/";
export const basicAuthToken = "Basic YOUR_BASIC_AUTH_KEY";
```

> Replace `YOUR_BASIC_AUTH_KEY` with your **own Base64-encoded key** during development and deployment, or use Basic YWRtaW46VGVzdEAxMjM= (default credentials: admin / Test@123) during development and testing.

---

## 🔐 Basic Authentication Configuration

Basic Authentication requires a Base64-encoded value derived from username and password use below default credentials for same:

```
username:admin
password:Test@123
```

### Example Format (Placeholder Only)

```
Basic YOUR_BASIC_AUTH_KEY
```

⚠️ The above value is a **placeholder** and does NOT represent real credentials.

---

## 🛠 How to Generate Base64 Auth

### JavaScript
```js
const username = "admin";
const password = "Test@123";
const auth = "Basic " + btoa(username + ":" + password);
```

### Java
```java
String username = "admin";
String password = "Test@123";

String auth = "Basic " + Base64.getEncoder()
    .encodeToString((username + ":" + password).getBytes());
```

---

## 📁 Deployment Folder (basename)

The `basename` defines the deployment folder name.

Deployment URL:
```
https://YOUR_SERVER_URL/smartsetupv2
```

## ▶️ Deployment Steps

1. Generate build
```bash
npm run build
```

2. Create folder `smartsetupv2` on server

3. Copy build ZIP into folder

4. Extract ZIP inside `smartsetupv2`

5. Verify URL
```
https://YOUR_SERVER_URL/smartsetupv2
```

---

## ✅ Final Checklist

- appconfig.json updated
- placeholder Base64 key replaced during deployment
- basename matches folder
- media folder created
- CSP updated
- build deployed successfully
