FROM mhart/alpine-node:15.7

ENV NODE_ENV=production
ENV PORT=3003

WORKDIR /app

COPY package*.json ./

RUN npm install --prefer-offline --no-audit --progress=false

COPY . /app

EXPOSE 3003

CMD ["npm", "start"]
