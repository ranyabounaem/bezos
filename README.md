This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Steps to run the application
### Cloning the project
Clone the project on your device
### Installation
Install all packages using
 ```
 npm install 
# or 
yarn
```
### Database/ORM Setup
1. Create a mongodb and add the connection string as an environment variable with similar key to schema.prisma
2. Run ``` npx prisma db push ```

### Run dev server
``` 
yarn dev 
```
Open[http://localhost:3000/transactions](http://localhost:3000/transactions) with your browser to see the result.
