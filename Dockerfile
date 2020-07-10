FROM node:12.18.2-alpine3.12

# set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
RUN npm install
RUN rm -f /app/.npmrc
RUN npm i nodemon@2.0.1

# start app
CMD ["nodemon", "--config nodemon-debug.json"]
