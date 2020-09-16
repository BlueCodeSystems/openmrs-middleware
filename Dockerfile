FROM node:10
COPY ./ /src/openmrs-middleware
WORKDIR /src/openmrs-middleware
RUN echo y | npm install --save-dev webpack-cli
RUN ./node_modules/.bin/webpack --mode production
EXPOSE 80
ENTRYPOINT ./node_modules/.bin/babel-node ./app.js