# FROM nginx
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/nginx.conf
# CMD ["nginx", "-g", "daemon off;"]

FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

