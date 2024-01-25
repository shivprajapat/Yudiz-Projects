FROM public.ecr.aws/d7h0j7s7/cric-node:16-alpine

WORKDIR /app

COPY . /app

RUN npm ci --production 


ENV NODE_ENV dev

EXPOSE 4005

CMD ["pm2-runtime", "start", "index.js"]
