FROM node:22-alpine

WORKDIR /app

COPY build ./build
COPY resource ./resource

CMD ["node", "./build/index.js"]
