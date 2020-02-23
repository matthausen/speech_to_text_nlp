FROM node:alpine as builder

WORKDIR "/app"

COPY package.json .

RUN apk add --update \
  git \
  openssh-client \
  && npm install

COPY . .

RUN npm run build
CMD ["npm", "start"]

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html