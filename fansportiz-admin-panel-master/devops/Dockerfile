#Dockerfile for below image is present in Devops-Dockerfile repo on Github https://github.com/yudiz-solutions/devops-Dockerfiles/blob/main/Fantasy/Dockerfile/README.md
#Image is Pushed on AWS ECR Public Repositories on Yudiz Account

FROM public.ecr.aws/d7h0j7s7/node:14-alpine as build

WORKDIR /app

COPY . /app

ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_AXIOS_BASE_URL_DEV
ARG REACT_APP_AXIOS_BASE_URL_STAG
ARG REACT_APP_AXIOS_BASE_URL_PROD 
ARG REACT_APP_NODE_AXIOS_BASE_URL_DEV
ARG REACT_APP_NODE_AXIOS_BASE_URL_STAG 
ARG REACT_APP_NODE_AXIOS_BASE_URL_PROD 

RUN npm ci

RUN npm run build

#stage-2d

FROM public.ecr.aws/d7h0j7s7/nginx:stable-alpine

COPY --from=build /app/build/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
