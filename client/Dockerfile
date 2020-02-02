FROM node:alpine

WORKDIR "/app"

COPY package.json .

RUN apk add --update \
  git \
  openssh-client \
  && npm install

COPY . .

RUN npm run build
CMD ["npm", "start"]