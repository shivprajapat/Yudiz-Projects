require('dotenv').config()
const ENV = process.env.NODE_ENV

const dev = {
  PORT: process.env.PORT || 4005,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-help-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/graphql',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://7585370fc01b452cad1820f4d0569366@o992135.ingest.sentry.io/6725477',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----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-----END RSA PRIVATE KEY-----',
  PUBLIC_KEY: process.env.PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyLJhj3L0BOqiIEjnYLdBgAwf4elZ7lJOqzSsllw9SuNsWv12C8GTVmAlKMbw3YKNcF2+a/DSY22UJQ3gSNT7xWr0rhwHTsltBbyf+Rgd/OmXTxTPFMe8CfcPHk8mq4G/V+kkBINhYXPh1X74v2zKYcKKJE/H4fZxHnnb7K8REUotOk2+1Vu0Fy+cr5obi9RKC9iMrh/gVugE16uQbi6XXKHqo/Jri791PWN/h+wBy/EYh3feD/w5/WahuUlW7HbUmvtmEXwFjaTvf3Oj1BGsdRmYFO2QXh4139MhwE4GBbbeLqagOrplXyrh9AmgOH8nlEYuyJf0gEggQLhdjY9Mo9PS8WQqS/v8pxl1Yd3xAb6jMwjKfVWwsSniEekW+Mgnqss1OkwUTD92a3+QDY9qc/DmdyXayw/t4po0io6AuN/Q5Twqzof4Gvc0Nh9jwH9Ei9ywTruOADtl2TkiyEu00CIpliRSUoaX8NKHCYrCDGh+IX93f1NNgbchSJD8TI2QJl+/64Lw78Mta7KV0yGiajrlhia45HeYtfjv7cnSLpR13KHNSzGHFakgPM4REYVUJUm3rZe9CvEQvZCXEByhaHnZB/YrTAdTGTrI1A7RSCTVjhc5mShrM9iGXcBLULlYU3DVCxfWddzi5QTkeeLDJY5kgGKVxP5OgSXr/gT7zHUCAwEAAQ==-----END PUBLIC KEY-----',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_PROFILE_PATH: process.env.S3_BUCKET_PROFILE_PATH || 'profile-pic/',
  S3_BUCKET_KYC_PATH: process.env.S3_BUCKET_KYC_PATH || 'kyc/pan',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb/',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_ARTICLE_THUMBIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_THUMBIMAGE_PATH || 'media/thumbnailimage',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}
const stag = {
  PORT: process.env.PORT || 4005,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-help-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/graphql',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://7585370fc01b452cad1820f4d0569366@o992135.ingest.sentry.io/6725477',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----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-----END RSA PRIVATE KEY-----',
  PUBLIC_KEY: process.env.PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyLJhj3L0BOqiIEjnYLdBgAwf4elZ7lJOqzSsllw9SuNsWv12C8GTVmAlKMbw3YKNcF2+a/DSY22UJQ3gSNT7xWr0rhwHTsltBbyf+Rgd/OmXTxTPFMe8CfcPHk8mq4G/V+kkBINhYXPh1X74v2zKYcKKJE/H4fZxHnnb7K8REUotOk2+1Vu0Fy+cr5obi9RKC9iMrh/gVugE16uQbi6XXKHqo/Jri791PWN/h+wBy/EYh3feD/w5/WahuUlW7HbUmvtmEXwFjaTvf3Oj1BGsdRmYFO2QXh4139MhwE4GBbbeLqagOrplXyrh9AmgOH8nlEYuyJf0gEggQLhdjY9Mo9PS8WQqS/v8pxl1Yd3xAb6jMwjKfVWwsSniEekW+Mgnqss1OkwUTD92a3+QDY9qc/DmdyXayw/t4po0io6AuN/Q5Twqzof4Gvc0Nh9jwH9Ei9ywTruOADtl2TkiyEu00CIpliRSUoaX8NKHCYrCDGh+IX93f1NNgbchSJD8TI2QJl+/64Lw78Mta7KV0yGiajrlhia45HeYtfjv7cnSLpR13KHNSzGHFakgPM4REYVUJUm3rZe9CvEQvZCXEByhaHnZB/YrTAdTGTrI1A7RSCTVjhc5mShrM9iGXcBLULlYU3DVCxfWddzi5QTkeeLDJY5kgGKVxP5OgSXr/gT7zHUCAwEAAQ==-----END PUBLIC KEY-----',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_PROFILE_PATH: process.env.S3_BUCKET_PROFILE_PATH || 'profile-pic/',
  S3_BUCKET_KYC_PATH: process.env.S3_BUCKET_KYC_PATH || 'kyc/pan',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb/',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_ARTICLE_THUMBIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_THUMBIMAGE_PATH || 'media/thumbnailimage',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}
const prod = {
  PORT: process.env.PORT || 4005,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-help-stag',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://4746eac01d304c58b1d91407a6dd5e6c@o992135.ingest.sentry.io/6725510',
  NODE_ENV: process.env.NODE_ENV || 'prod',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----MIIJKQIBAAKCAgEAyLJhj3L0BOqiIEjnYLdBgAwf4elZ7lJOqzSsllw9SuNsWv12C8GTVmAlKMbw3YKNcF2+a/DSY22UJQ3gSNT7xWr0rhwHTsltBbyf+Rgd/OmXTxTPFMe8CfcPHk8mq4G/V+kkBINhYXPh1X74v2zKYcKKJE/H4fZxHnnb7K8REUotOk2+1Vu0Fy+cr5obi9RKC9iMrh/gVugE16uQbi6XXKHqo/Jri791PWN/h+wBy/EYh3feD/w5/WahuUlW7HbUmvtmEXwFjaTvf3Oj1BGsdRmYFO2QXh4139MhwE4GBbbeLqagOrplXyrh9AmgOH8nlEYuyJf0gEggQLhdjY9Mo9PS8WQqS/v8pxl1Yd3xAb6jMwjKfVWwsSniEekW+Mgnqss1OkwUTD92a3+QDY9qc/DmdyXayw/t4po0io6AuN/Q5Twqzof4Gvc0Nh9jwH9Ei9ywTruOADtl2TkiyEu00CIpliRSUoaX8NKHCYrCDGh+IX93f1NNgbchSJD8TI2QJl+/64Lw78Mta7KV0yGiajrlhia45HeYtfjv7cnSLpR13KHNSzGHFakgPM4REYVUJUm3rZe9CvEQvZCXEByhaHnZB/YrTAdTGTrI1A7RSCTVjhc5mShrM9iGXcBLULlYU3DVCxfWddzi5QTkeeLDJY5kgGKVxP5OgSXr/gT7zHUCAwEAAQKCAgBj6XnsIfwdHnnLvL+DRHfVOTP+EV9153/Gd5ib2huhVoqw2ZGU1K92xrJ5FGEAxWeIUwLjVaZHXVvs/nVzjKQyacaZjtaMgHZH7tls9nanW9q5wdA9thmElHvwSNMlepg5OZV2sbke/MOmt2k6UvyFooWHAjit4zP5Sg0UTSsgAl91sRKZwOdsy4UjXoLsH6klMI8IeFIEsckHXR+v2n373ZekOqETlyLUht4MWo+iacoeVqw0JQrxfdBxH3OokJfS9+ieN7HEDCI2vukGQC4stasicAn48O09GiypQa551cnSS51k3zpsIDsQdGJQ/exEQpQzxIIyArYbwizAtmAeJTkbz7S2vitBSnECmxbwZmQgV/V3LdpZQ6UITgmZnoqHnfmtMj1rJUSILOxNEVATmzS2Yf1GHM3O8ChKRfrTstPA9n7Y3nSTSmGrk/sn9LDa75q51SvYs6SBWALDzqtK15mz4lTpfb13n8hRlEvWJwREq0P2/SYWmGuNacB0xrfeRdnqwyFPLDslNo8zD9wL8n5Jiz2WrxILohDSJ7npLu9dkkqYIKwGFmrejPCHR0EHwA1sdHDoM1/m2ux0d0rzyKb5LYs9t91mdV1XGzTuFGuxnHEOcveEJsrDqiainfXZdmLrcqi6/Gk9DKPCyT+nUnRl7+DPU83mqLQOIQUMAQKCAQEA5Q5r9IQuqK/IiP4/HfLNtEMwAYvKFFzWP1L80RmCSuzMoB6bSY3fWuXA4AEVQkfjAprSIvnByjMnsayGpfeR02NlLeyxGqpxcyZHt2hgemk9H6RUl5fIC4slu1W3lBRoL4Sps6qdyx74IMZMqANsC+f8eYeF+JigoKkLajLVzpAY+XU12AkBdokjBCVScLc84UDI3UXacxuS0dhAKhggRaPNMHY6pKel0wvek3olxDxlLjb6DuTEEa5Z0EVQ4qhx7aobFBQmp4+wjVb2re2G5FhnGJfh6/t/6QrTOYjGKiPiMSJZjqizQO9I1bSQp/oJ8/0W6Z/htOffibD83FRbgQKCAQEA4E332PHgegfXEMDab5Hk5+y9riQ7nfeSTgTT0W9hjbjdoXtgcUgQ8S9Pu9Fd+rTVW6RQM2OJ2DVjf6Eu98PYzlGxoL0DeejCFWU/WnrtpkjE6zvkbBLcNtgKkV6OfEhfQzk5/p+cGtjcV80P1YkkIQ9EBUHzyk6IDq9Ok4JWyTIS6PdL53r81a+ub+pQlW53YrJQRXRXnUEnM1xhZhH2AivuIRGuvdVzPPiZfLYd7TANDrQnmeByp2QRJwkT1FVe6MAaR2q3j7piBIbfvmtxNPzYl2HWlyxvEniGRDQbAkMmuIv+7+NYxD/d3EpTrt0AiCe6CckPJNOZkhpXQgU69QKCAQEApj8XX3romooq1DMkAEqPvjvdheG9o5XV8lP7JpCLHnJL+hL8xh/wcnq6yFpA4cBnJSbVSYlYe7cxIiWD/MV406Iad4CI8j+u49JuztE05OOo92Q/+V6yVJ6DnjoSaal+DK8OtFYq/JfXo4IJdRA2xVV0y4fvVoUAYFsQ691FjQzM85F8qPWwWCYkggfMk/6KczqgDul6KX1jzGZV+7dTBPhkHr5Qxdzf4BOHUiafbpQfI7HHQDQNkn+mtCD7GecD+WkzChmuDIOfspXhqE7zTpxTB2iFEs+RAMVYlTOOEFvG+b5incYXhBOoG2NYcnJp8upITPw7xx9cAQWyIQAhAQKCAQEAt/IYzFfnoAun6nxNZmu9zhjOoO3j2jL6T3MUBlASL3gogVI9kAjqo/AJslwLdxsvUX0ZrFr341A9LaCQdO2ucdx7D/eRzzr7VzJ11wyyschBfSvbsmlxIKThXb+ul+t9/BIFJnPcQAQSBwsK7jIOZ/It9SXV+NWYLHrFtKCR7WNcMKMFI2svx0nQgsUkmrdBvrW+sIathy+0JyGeWmdmWPePzJzEsbdHTvwMW0K6nhXmz2UciMuRGwcsLdf65Amy0Kshoem5aWwPD+lPuchAyZSFRvgcVFNDL2GZsnsMnzlUmslsI2xNEnvRxONLZz6kPgReQ8IX4jqJWVCyuFiztQKCAQBYCfBrzQjxpSw+Cof981HIPjSz479dPvoulobzWqKyyIE/qOsn+WOFvF6PaamiDoFn+JHATuzcSHXCu97A+3AMS5ileqkoSF7ua7dEETGlQCNdn0V2BhAmnmzw8hlo5pS8ljcGSuWWbs/F+BOOfkGyIiVxBHsNm0X5EVFcLskSofcg8ssxMdYlObnAXWN84jnWxfBVnDMOqPyQVh67Taz+Bck1L0ibUx46v+IJACmKljVzWItb0pftBgvKiS441wcGz+tb6h2XMVKYNMjBCiAJwnIacbSCUPq/vlJnoq6zE2zV3kl16lzLeFNX5pbX3xLTncqaOfBp10L7DyEV6PqX-----END RSA PRIVATE KEY-----',
  PUBLIC_KEY: process.env.PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyLJhj3L0BOqiIEjnYLdBgAwf4elZ7lJOqzSsllw9SuNsWv12C8GTVmAlKMbw3YKNcF2+a/DSY22UJQ3gSNT7xWr0rhwHTsltBbyf+Rgd/OmXTxTPFMe8CfcPHk8mq4G/V+kkBINhYXPh1X74v2zKYcKKJE/H4fZxHnnb7K8REUotOk2+1Vu0Fy+cr5obi9RKC9iMrh/gVugE16uQbi6XXKHqo/Jri791PWN/h+wBy/EYh3feD/w5/WahuUlW7HbUmvtmEXwFjaTvf3Oj1BGsdRmYFO2QXh4139MhwE4GBbbeLqagOrplXyrh9AmgOH8nlEYuyJf0gEggQLhdjY9Mo9PS8WQqS/v8pxl1Yd3xAb6jMwjKfVWwsSniEekW+Mgnqss1OkwUTD92a3+QDY9qc/DmdyXayw/t4po0io6AuN/Q5Twqzof4Gvc0Nh9jwH9Ei9ywTruOADtl2TkiyEu00CIpliRSUoaX8NKHCYrCDGh+IX93f1NNgbchSJD8TI2QJl+/64Lw78Mta7KV0yGiajrlhia45HeYtfjv7cnSLpR13KHNSzGHFakgPM4REYVUJUm3rZe9CvEQvZCXEByhaHnZB/YrTAdTGTrI1A7RSCTVjhc5mShrM9iGXcBLULlYU3DVCxfWddzi5QTkeeLDJY5kgGKVxP5OgSXr/gT7zHUCAwEAAQ==-----END PUBLIC KEY-----',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_PROFILE_PATH: process.env.S3_BUCKET_PROFILE_PATH || 'profile-pic/',
  S3_BUCKET_KYC_PATH: process.env.S3_BUCKET_KYC_PATH || 'kyc/pan',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb/',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_ARTICLE_THUMBIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_THUMBIMAGE_PATH || 'media/thumbnailimage',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}
const test = {
  PORT: process.env.PORT || 4005,
  DB_URL: process.env.TEST_DB_URL || 'mongodb://localhost:27017/crictracker-help-test',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://7585370fc01b452cad1820f4d0569366@o992135.ingest.sentry.io/6725477',
  NODE_ENV: process.env.NODE_ENV || 'test',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----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-----END RSA PRIVATE KEY-----',
  PUBLIC_KEY: process.env.PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyLJhj3L0BOqiIEjnYLdBgAwf4elZ7lJOqzSsllw9SuNsWv12C8GTVmAlKMbw3YKNcF2+a/DSY22UJQ3gSNT7xWr0rhwHTsltBbyf+Rgd/OmXTxTPFMe8CfcPHk8mq4G/V+kkBINhYXPh1X74v2zKYcKKJE/H4fZxHnnb7K8REUotOk2+1Vu0Fy+cr5obi9RKC9iMrh/gVugE16uQbi6XXKHqo/Jri791PWN/h+wBy/EYh3feD/w5/WahuUlW7HbUmvtmEXwFjaTvf3Oj1BGsdRmYFO2QXh4139MhwE4GBbbeLqagOrplXyrh9AmgOH8nlEYuyJf0gEggQLhdjY9Mo9PS8WQqS/v8pxl1Yd3xAb6jMwjKfVWwsSniEekW+Mgnqss1OkwUTD92a3+QDY9qc/DmdyXayw/t4po0io6AuN/Q5Twqzof4Gvc0Nh9jwH9Ei9ywTruOADtl2TkiyEu00CIpliRSUoaX8NKHCYrCDGh+IX93f1NNgbchSJD8TI2QJl+/64Lw78Mta7KV0yGiajrlhia45HeYtfjv7cnSLpR13KHNSzGHFakgPM4REYVUJUm3rZe9CvEQvZCXEByhaHnZB/YrTAdTGTrI1A7RSCTVjhc5mShrM9iGXcBLULlYU3DVCxfWddzi5QTkeeLDJY5kgGKVxP5OgSXr/gT7zHUCAwEAAQ==-----END PUBLIC KEY-----',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_PROFILE_PATH: process.env.S3_BUCKET_PROFILE_PATH || 'profile-pic/',
  S3_BUCKET_KYC_PATH: process.env.S3_BUCKET_KYC_PATH || 'kyc/pan',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb/',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_ARTICLE_THUMBIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_THUMBIMAGE_PATH || 'media/thumbnailimage',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

if (ENV === 'prod') {
  module.exports = prod
} else if (ENV === 'test') {
  module.exports = test
} else if (ENV === 'stag') {
  module.exports = stag
} else {
  module.exports = dev
}

console.log(`Server Env is ${ENV}`)
