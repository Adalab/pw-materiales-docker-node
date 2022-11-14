FROM node:16

# Create app directory
WORKDIR /home/node/app

# Copy files from host
COPY * /home/node/app/

# Run the proyect
CMD [ "npm", "start" ]