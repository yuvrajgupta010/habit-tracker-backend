# Habit Tracker Backend

Track your daily habits, build consistency, and achieve your goals with our Habit Tracker web app. Stay on top of your routines and create lasting changes! 



## Installation
To get started, clone the repository and install the dependencies:

```sh
git clone https://github.com/yuvrajgupta010/habit-tracker-backend.git
cd habit-tracker-backend
yarn install
```

## Setup
Add .env file with own keys:
```bash
SERVER_ENV=""
PORT=3030

# JWT
JWT_SECRET_KEY=""

# MongoDB
MONGO_DB_USERNAME=""
MONGO_DB_PASSWORD=""


## Usage
To start the server in development mode:
```bash
npm run dev
```

To start the server in production mode:
```bash
npm start
```

## Health Check of server
After server start, just to check the start successfully 
Open up your browser and just go on localhost:3030/health-check
