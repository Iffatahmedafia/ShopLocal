# Use Node 18 alpine for smaller image
FROM node:18-alpine

WORKDIR /app

# Copy only package files first (for caching)
COPY package.json package-lock.json* ./

RUN npm install

# Copy the rest of the frontend source code
COPY . .

EXPOSE 3001

# Use npm run dev because you use Vite
CMD ["npm", "run", "dev"]
