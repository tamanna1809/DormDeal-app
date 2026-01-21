# 🛒 DormDeal

**DormDeal** is a cross-platform mobile marketplace application built with React Native and Node.js, designed specifically for students living in dorms or on campus. It facilitates the buying and selling of items within the student community, providing a safe and convenient platform for trade.

## ❓ Problem Statement

Students often accumulate items they no longer need (textbooks, furniture, electronics) or look for affordable essentials nearby. General marketplaces can be too broad, lack trust, or require inconvenient travel. **DormDeal** solves this by creating a hyper-local marketplace exclusively for the campus community, making transactions faster, safer, and more relevant.

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **HTTP Client**: Axios
- **Storage**: Expo Secure Store
- **Styling**: React Native Styles

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, cors

## ✨ Features Implemented

*   **Authentication System**: Secure Signup and Login functionality.
*   **Browser Marketplace**: View available items listed by other students.
*   **Product Details**: Detailed view of items including description, price, and seller info.
*   **Create Listing**: Upload and sell your own items.
*   **Manage Listings**: Edit item details, mark items as "Sold", or delete listings.
*   **Notification System**: Receive updates on your listings and interactions.
*   **Profile Management**: View and edit user profile details.
*   **Admin Dashboard**: Admin privileges to view all users/items and moderate content (delete items).

## � Key App Workflows

### 1. User Authentication
*   **Sign Up**: Users must create an account to view full item details and sell products.
*   **Login**: Access your account to manage listings and view notifications.

### 2. Browsing & Buying
*   **Feed**: The **Home** tab displays a feed of recently posted items.
*   **View Item**: Tapping an item opens the **Item Details** screen with full description, price, and condition.
*   **Contact Seller**: If interested, tap **"Contact Seller"**. This will trigger a system alert with the seller's phone number, allowing you to call or message them directly.

### 3. Selling an Item
*   **Post Item**: Navigate to the **"Sell"** tab.
*   **Details**: Upload a photo (or paste a URL), enter title, price, category, and description.
*   **Submit**: Tapping "Post Item" instantly adds it to the marketplace feed and notifies other users.

### 4. Notifications Implementation
The app features a real-time notification system to keep the community engaged.
*   **Triggers**:
    *   **New Item**: When a user posts an item, all other users receive a "New item added" alert.
    *   **Item Sold**: When an item is marked as "Sold" by the seller, users are notified.
*   **Interaction**:
    *   **Deep Linking**: Tapping on a notification in the **"Alerts"** tab automatically navigates the user directly to the specific **Item Details** page.
    *   **Read Status**: Unread notifications are highlighted; clicking them marks them as read.

## �🚀 How to Run the Project Locally

Follow these steps to set up the project on your local machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Expo Go app on your phone OR an Android/iOS emulator

### Step 1: Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd dormdeal/server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the `server` directory and add the following:
    ```env
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  Start the server:
    ```bash
    npm start
    ```
    > The server will run on `http://localhost:8000`

### Step 2: Frontend Setup

1.  Open a new terminal and navigate to the project root (if you are in `server`, go back one level):
    ```bash
    cd ..
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Expo development server:
    ```bash
    npx expo start
    ```

4.  Run the app:
    *   **Physical Device**: Scan the QR code with the **Expo Go** app (Android/iOS).
    *   **Emulator**: Press `a` for Android or `i` for iOS Simulator.

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### Items (Marketplace)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Get all available items |
| `GET` | `/api/items/:id` | Get details of a specific item |
| `POST` | `/api/items` | Create a new item listing (Auth required) |
| `PUT` | `/api/items/:id` | Update an existing item (Auth required) |
| `PATCH` | `/api/items/:id/sold` | Mark an item as sold (Auth required) |
| `DELETE` | `/api/items/:id` | Delete an item (Auth required) |

### User & Profile
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `PUT` | `/api/users/me` | Update current user's profile (Auth required) |

### Notifications
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notifications` | Get user notifications (Auth required) |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read (Auth required) |

### Admin Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/users` | View all registered users (Admin only) |
| `GET` | `/api/admin/items` | View all items including deleted ones (Admin only) |
| `DELETE` | `/api/admin/items/:id` | Force delete an item (Admin only) |

---

With ❤️ for the Student Community.
