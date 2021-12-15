FROM node:16

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.6 && \
  wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
  chmod +x /bin/grpc_health_probe

ENV NODE_ENV=production
ENV PORT=3006
ENV TZ=UTC

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

EXPOSE 3006
CMD [ "pnpm", "start" ]
