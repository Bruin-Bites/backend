# Bruin Bites Backend


## Development

1. Install dependencies to get all the libraries and necessary developer tools
```
npm install
```
2. Create a .env file. In the project root, create a file named .env:
```
PORT=5050
NODE_ENV=development
```
3. Start the development server
```
npm run dev
```
4. The server will be available at:

http://localhost:5050

## Project Structure
```
backend/
│
├── src/
│   ├── index.js          # main server entry
│   ├── routes/
│   │   ├── index.js
│   │   ├── recipes.js
│   │   ├── community.js
│   │   ├── deals.js
│   │   └── chat.js
│   └── ...
│
├── package.json
├── .env
└── .gitignore
```
