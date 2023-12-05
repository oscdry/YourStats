FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "prisma:pull" ]
CMD [ "npm", "run", "prisma:generate" ]