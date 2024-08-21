#Run as the following lines:
#docker build . -t jason-build
#docker run -p 8080:80 -v ./map/markers.json:/app/map/markers.json --name jason-washington jason-build

FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "start"]