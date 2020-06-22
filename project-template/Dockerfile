FROM if-harbor.in.za/devops/zati-centos-node:10.16.3-packaged

COPY ./dist/* /home/zaspace/
WORKDIR /home/zaspace

ENV SASS_BINARY_SITE http://172.16.106.20:8081/repository/files/nodejs/node-sass
# # ENV NODE_ENV production
# RUN npm --registry http://172.16.106.20:8081/repository/npm_group/ install --unsafe-perm \
#     && npm run product

RUN npm --registry http://172.16.106.20:8081/repository/npm_group/ install --unsafe-perm && npm --registry http://172.16.106.20:8081/repository/npm_group/ install -g pm2
EXPOSE 8080

CMD ["bash", "./startup.sh"]
# CMD pm2 start pm2.json --no-daemon
# CMD ["node","server.js"]
