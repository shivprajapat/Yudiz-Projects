#Dockerfile for below image is present in Devops-Dockerfile repo on Github https://github.com/yudiz-solutions/devops-Dockerfiles/blob/main/Fantasy/Dockerfile/fanstasy-node-phantom-16:latestv2
#Image is Pushed on AWS ECR Public Repositories on Yudiz Account

FROM public.ecr.aws/d7h0j7s7/fanstasy-node-phantom-16:latestv2

WORKDIR /app

COPY package* /app/

COPY . /app

ENV OPENSSL_CONF=/dev/null

ENV NODE_ENV=production 

RUN npm ci --production --legacy-peer-deps
RUN pm2 install pm2-metrics

EXPOSE 1338
EXPOSE 9209
EXPOSE 1339

CMD ["pm2-runtime", "start", "index.js"]
