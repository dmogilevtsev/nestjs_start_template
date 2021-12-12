# NestJS start template
Starting template for developing the backend part of the application
### Posibilities:
- Connect to PostgresSQL
- Authentication
  - Email & password
  - Google auth
  - Facebook auth

### Technology stack
<table width="100%">
  <tr>
    <td align="center" valign="middle">
      <a href="https://nestjs.com/">
        <img height="50" alt="NestJS" src="https://hsto.org/getpro/habr/post_images/d11/98b/ac8/d1198bac8e4ced0d89d5e5983061f418.png"/>
      </a>
      <br />
      NestJS
    </td>
    <td align="center" valign="middle">
      <a href="https://www.postgresql.org/">
      <img height="50" alt="PostgresSQL" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/640px-Postgresql_elephant.svg.png"/>
      </a>
      <br />
      PostgresSQL
    </td>
    <td align="center" valign="middle">
      <a href="https://graphql.org/">
      <img height="50" alt="GraphQL" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/1200px-GraphQL_Logo.svg.png"/>
      </a>
      <br />
      GraphQL
    </td>
    <td align="center" valign="middle">
      <a href="https://typeorm.io/">
      <img height="50" alt="TypeORM" src="https://www.zoneofit.com/wp-content/uploads/2021/06/type-orm.png"/>
      </a>
      <br />
      TypeORM
    </td>
    <td align="center" valign="middle">
      <a href="https://www.docker.com/">
      <img height="50" alt="Docker" src="https://d1.awsstatic.com/acs/characters/Logos/Docker-Logo_Horizontel_279x131.b8a5c41e56b77706656d61080f6a0217a3ba356d.png"/>
      </a>
      <br />
      Docker
    </td>
  </tr>
</table>

### Documentation
```shell
yarn doc
# OR
npm run doc
```

### Start app
1) Create `.env` file
```dotenv
API_PORT=5000
API_HOST=http://localhost:

# tyormconfig
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_USERNAME=<database username>
TYPEORM_PASSWORD=<database password>
TYPEORM_DATABASE=<database name>
TYPEORM_PORT=5432
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
TYPEORM_ENTITIES=../**/*.entity{.js,.ts}
TYPEORM_MIGRATIONS=src/migration/*{.js,.ts}
TYPEORM_MIGRATIONS_DIR=src/migration
TYPEORM_MIGRATIONS_RUN=false
TYPEORM_MIGRATIONS_TABLE_NAME=migrations_table

JWT_ACCESS_TOKEN_SECRET=access_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_SECRET=refresh_token_secret
JWT_REFRESH_EXPIRES_IN=14d

GOOGLE_CLIENT_ID=<google id>
GOOGLE_SECRET_KEY=<google id>
GOOGLE_URI_REDIRECT=http://localhost:5000/google/redirect

FACEBOOK_ID=<facebook id>
FACEBOOK_KEY=<facebook key>
FACEBOOK_URI_REDIRECT=http://localhost:5000/facebook/redirect

# Change mail service and credentials <email> and <password> OR change mail parametres
#MAIL_SERVICE=google
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=<your email>
MAIL_PASSWORD=<your password>
```
2) Start database service

_You can run docker container_
```shell
docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=nestjs -d postgres
```
```shell
# with yarn
yarn start

# with npm
npm run start

# with docker
docker build . -t <your username>/nestjs-app
docker run -p 3000:3000 --env-file ./.env -d <your username>/nestjs-app
```
