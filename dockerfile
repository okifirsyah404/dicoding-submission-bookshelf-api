FROM node:18.16.0
RUN npm install
EXPOSE 4000
CMD ["npm", "start"]
