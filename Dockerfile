FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p /app/uploads/images /app/uploads/resumes

EXPOSE 4000

CMD ["npm", "start"]
