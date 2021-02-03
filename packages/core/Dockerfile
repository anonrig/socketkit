FROM mhart/alpine-node:15.7

ENV NODE_ENV=production
ENV PORT=3000

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.6 && \
  wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
  chmod +x /bin/grpc_health_probe

COPY . .
RUN npm ci --prefer-offline --no-audit --progress=false
EXPOSE 3000

CMD ["npm", "start"]
