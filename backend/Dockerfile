FROM node:18-alpine

WORKDIR /backend

COPY ./package*.json /backend/

RUN npm install
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
	then npm install; \
	else npm install --only=production; \
	fi
RUN npm install -g -D nodemon

COPY . ./

EXPOSE 3000

RUN chmod +x /backend/node_modules/.bin/nodemon

CMD [ "npm", "run", "start" ]
