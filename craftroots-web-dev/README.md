This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
<br>
<br>
<br>
# PR rules

## Dev branch

1. Review internally before merging any PR to dev
2. Add Reviewers in each PR

## Stage - dev > stage

1. Follow deployment title convention - check previous stage PRs
2. Add "Stage deploy" label to PR
3. Before merge make a build and test everything in local
4. Check any ENV changes

## Production PR rules - stage > pre-main

### 1. DO NOT MERGE DIRECTLY TO MAIN BRANCH
### 2. Merge stage branch to pre-main branch first
### 3. Test thoroughly by building project not just development server
### 4. Once everything is working then create a PR pre-main > main
### 5. Check any ENV changes