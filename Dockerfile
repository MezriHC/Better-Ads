FROM node:20-alpine

WORKDIR /app

# Installer dépendances système minimum
RUN apk add --no-cache libc6-compat

# Copier package.json
COPY package*.json ./
COPY prisma ./prisma/

# Installer SANS rebuild (laisser npm gérer)
RUN npm ci

# Copier code
COPY . .

# Build
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]