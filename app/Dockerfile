FROM node:current

RUN npm install pm2@latest --global --quiet

# copy local files into container, set working directory and user
RUN mkdir -p /home/app
WORKDIR /home/app
COPY . /home/app

ENV PORT=80

RUN npm install --production --quiet

CMD ["pm2-runtime", "./pm2.json"]
