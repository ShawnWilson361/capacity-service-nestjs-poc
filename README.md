# Haven Activities Capacity Service

This is the microservice that handles everything to do with how many guests can attend a given timeslot for a given activity on a given park.

## How to start the service

### Docker Startup

1. go to the project folder
1. Run `npm run docker`
1. Open `http://localhost:4003/_health`

### Local Startup

1. go to the project folder
1. start a postgres database (docker preferable `docker compose up -d postgres`)
1. run `yarn setup`
1. run `yarn start:dev`

## So what's what?

### Overview

This repository uses [NestJs](https://docs.nestjs.com/)

### Dependency Injection

### Modules

### Controllers

### Services

### Repositories

### Entities

### Exception Filters

### Interceptors

### Database Migrations

### Database Seeds

## Testing

### Unit Tests

#### Writing Unit Tests

#### Running Unit Tests

### Integration Tests

#### Writing Integration Tests

#### Running Integration Tests
