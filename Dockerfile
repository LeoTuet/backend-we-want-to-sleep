FROM node:12-alpine

WORKDIR /app

ARG NPM_TOKEN  
COPY .npmrc-docker ./.npmrc

# Add package file
COPY package*.json ./

# Install deps
RUN npm ci

RUN rm -f .npmrc

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN npm run build

# Expose port 3000
EXPOSE 3000

CMD npm run start
