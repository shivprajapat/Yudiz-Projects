FROM public.ecr.aws/d7h0j7s7/crictracker-website:npmsharp

WORKDIR /app

COPY . /app

ARG NODE_ENV
ARG REACT_APP_API_URL
ARG REACT_APP_INTERNAL_API_URL
ARG REACT_APP_DOMAIN
ARG REACT_APP_SUBSCRIPTION_URL
ARG REACT_APP_S3_PREFIX
ARG REACT_APP_ENV
ARG SENTRY_AUTH_TOKEN

RUN npm install && npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
