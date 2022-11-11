# Build Stage 1
# This build created a staging docker image 
#
ARG REGISTRY_BASE=public.ecr.aws/docker/library/node

FROM ${REGISTRY_BASE}:16-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
COPY .npmrc ./
COPY tsconfig.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Build Stage 2
# This build takes the production build from staging build
#
FROM ${REGISTRY_BASE}:16-alpine
RUN apk --no-cache add bash
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
USER node
EXPOSE 4003
CMD [ "npm", "start" ]