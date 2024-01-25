#Dockerfile for below image is present in Devops-Dockerfile repo on Github https://github.com/yudiz-solutions/devops-Dockerfiles/blob/main/Fantasy/Dockerfile/README.md
#Image is Pushed on AWS ECR Public Repositories on Yudiz Account

#build
FROM node:18-alpine as build

WORKDIR /app

COPY . /app
 
WORKDIR /app

ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_AXIOS_BASE_URL_DEV
ARG REACT_APP_AXIOS_BASE_URL_STAG
ARG REACT_APP_AXIOS_BASE_URL_PROD

RUN npm install 

RUN npm run build

#stage-2

FROM public.ecr.aws/d7h0j7s7/nginx:stable-alpine

COPY --from=build /app/build/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
