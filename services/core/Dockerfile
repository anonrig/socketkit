FROM mhart/alpine-node:16

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --prefer-offline --no-audit --progress=false --only=production
COPY . .
EXPOSE 3000

CMD ["npm", "start"]
