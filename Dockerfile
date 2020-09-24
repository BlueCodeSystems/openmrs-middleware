#FROM node:14.8.0-stretch
FROM node:10.9-alpine
WORKDIR /src/openmrs-middleware
COPY . .
RUN npm install
RUN npm run build
#COPY . .
#RUN echo y | npm install --save-dev webpack-cli
#RUN ./node_modules/.bin/webpack --mode production
EXPOSE 8086
#ENTRYPOINT ./node_modules/.bin/babel-node ./app.js
CMD [ "npm", "start" ]