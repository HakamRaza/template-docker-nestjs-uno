# Opionated Docker Template using NestJS (UNO)
An opinionated NestJS development docker kit utilising
- Database  : Postgres
- Backend   : NestJS
- Caching   : Redis
- DB Client : PGAdmin


## Pre Requisite
- Do install Docker Desktop or any Docker client [here](https://www.docker.com/products/docker-desktop/)
- Open terminal point to where docker-compose.yml is located
- Request client installed eg: Postman / Insomnia


## Architecture
This template is used to containerized an sample NestJS app. The directory structure should follow as below

```
/folder
  /app
    /src
    ...
    ... (nestjs files)
    ...
   
  .env.example
  .dockerignore
  Dockerfile.DEV
  docker-compose.yml
```


## Run Full Set Images with Docker Compose
Lets make your life easier and make time for your family. Let run the app with fullset together in single command. 
To do this, fill in custom `.env` file using `.env.example` as the template at the same directory.
</br>

Fill in the following for full feature:

```
SMTP_USER= #registered mailtrap user
SMTP_PASSWORD= #registered mailtrap password

```
</br>

Put here:
```
/folder
  /app
  .env.example
  .env <--- added custom .env using .env.example as template
  ...
```
</br>

Run the following commands to build and run the images:

``` bash
  docker-compose up --detach
```

### What it will do:
1. spawn a `POSTGRES` database bind to localhost:5432 as default defined in .env `DOCKER_POSTGRES_PORT` value
 > username and password will be based on defined .env in this case `postgres : postgres`
 > new database will be created inside with name defined `app_dev`
 > you can use other client such as TablePlus to connect at this port.
 ```
 localhost:5432
 ```
</br>

2. spawn a `REDIS` caching bind to `localhost:6379` as default defined in .env `DOCKER_REDIS_PORT` value
 > password will be as defined in `REDIS_PASSWORD`
 > you will need `redis-cli` to tunnel this port
 ```
 localhost:6379
 ```
</br>

3. spawn a `NESTJS` application bind to `localhost:3000` as default defined in .env `DOCKER_APP_PORT` value
 > will also use other .env variables inside
 ```
 localhost:3000/api
 ```
</br>

4. spawn a `PGADMIN` client bind to `localhost:8080` as default defined in .env `DOCKER_PGADMIN_PORT` value
 > client can be access at `localhost:8080`
 > username and password will be based on defined .env in this case `admin@admin.com : admin`
 ```
 localhost:8080
 ```
## Testing
- schema migration will be done auto when not set `MODE` to `PROD`
- open swagger docs and begin using sample API:

```
localhost:3000/customString123forSecuringSw@ggerD0cs
```