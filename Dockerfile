# 1️⃣ Base image
FROM node:18-alpine

# 2️⃣ Create app directory
WORKDIR /app

# 3️⃣ Copy dependency files
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install --production

# 5️⃣ Copy application code
COPY . .

# 6️⃣ Expose application port
EXPOSE 3000

# 7️⃣ Start application
CMD ["node", "app.js"]