# for vite app
FROM node:20-slim

# Set the working directory
WORKDIR /usr/

RUN apt-get update && \
    apt-get install -y 

COPY package*.json ./

RUN npm ci

EXPOSE 5173

COPY . .
RUN npm run build

CMD ["npm", "start"]
