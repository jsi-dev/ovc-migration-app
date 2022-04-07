# build environment
FROM node as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

ENV NODE_ENV production

# # ARG REACT_APP_API_HOSTNAME=http://localhost:8000
# ENV REACT_APP_API_HOSTNAME = http://localhost:8000
ENV REACT_APP_API_HOSTNAME='/api/rest'

# # ARG REACT_APP_OPENMRS_HOSTNAME=http://localhost:8080
# ENV REACT_APP_OPENMRS_HOSTNAME=$REACT_APP_OPENMRS_HOSTNAME
ENV REACT_APP_OPENMRS_HOSTNAME='/openmrs/ws/rest/v1'

# # ARG REACT_APP_OPENMRS_USERNAME=admin
# ENV REACT_APP_OPENMRS_USERNAME=$REACT_APP_OPENMRS_USERNAME

# # ARG REACT_APP_OPENMRS_PASSWORD=Admin123
# ENV REACT_APP_OPENMRS_PASSWORD=$REACT_APP_OPENMRS_PASSWORD

COPY package.json ./
COPY package-lock.json ./
RUN npm install -g npm@8.5.1
# RUN npm ci --silent
# RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm install
RUN npm run build

# production environment
FROM nginx:stable-alpine

ENV NODE_ENV production

COPY --from=build /app/build /usr/share/nginx/html/migration

COPY nginx.conf /etc/nginx/conf.d/default.conf

# WORKDIR /usr/share/nginx/html/migration
# COPY ./env.sh ./
# COPY .env ./

# RUN apk add --no-cache bash

# Make our shell script executable
# RUN chmod +x ./env.sh

EXPOSE 8083

# CMD ["/bin/bash", "-c", "/usr/share/nginx/html/migration/env.sh && nginx -g \"daemon off;\""]
# CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/migration/env-config.template.js > /usr/share/nginx/html/migration/env-config.js && exec nginx -g 'daemon off;'"]

CMD ["nginx", "-g", "daemon off;"]
