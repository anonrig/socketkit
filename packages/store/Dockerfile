FROM mhart/alpine-node:15

ENV NODE_ENV=production
ENV PORT=3003

COPY . /app

WORKDIR /app
RUN npm install --prefer-offline --no-audit --progress=false

EXPOSE 3003

CMD ["npm", "start"]
