FROM node:12.18.4-buster-slim
WORKDIR /home

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

CMD ["yarn","build:run"]