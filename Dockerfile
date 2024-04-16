FROM node:latest as build

WORKDIR /app

COPY package*.json ./

RUN npm install as build

COPY . .

RUN npm run test

RUN npm run build

FROM node:latest as production

WORKDIR /app

COPY --from=build /app/dist /app/dist

COPY --from=build /app/package*.json /app/

RUN npm install --only=production

CMD ["node", "dist/main.js"]

