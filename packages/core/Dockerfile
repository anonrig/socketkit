FROM mhart/alpine-node:15.12

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false
COPY . .
EXPOSE 3000

CMD ["npm", "start"]
