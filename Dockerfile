# --- Stage 1: Build React App ---
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# --- Stage 2: Serve Using NGINX ---
FROM nginx:stable-alpine

# Copy build files to nginx public folder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
