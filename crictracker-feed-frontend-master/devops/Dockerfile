FROM public.ecr.aws/d7h0j7s7/node:16-alpine3.11 as build

WORKDIR /app

COPY . /app


ARG REACT_APP_URL_PREFIX
ARG REACT_APP_ENV

RUN npm install --legacy-peer-deps
 
RUN npm run build

#stage-2

FROM public.ecr.aws/d7h0j7s7/nginx:stable-alpine

COPY --from=build /app/build/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
