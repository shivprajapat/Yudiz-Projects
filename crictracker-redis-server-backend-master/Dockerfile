FROM public.ecr.aws/d7h0j7s7/node:16-alpine

WORKDIR /app

COPY . /app

RUN npm ci --production 
RUN npm install --location=global pm2
RUN pm2 install pm2-metrics

ENV NODE_ENV dev

EXPOSE 9209
EXPOSE 4008

CMD ["pm2-runtime", "start", "index.js"]
