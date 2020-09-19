# ES2 Easy Secure Storage

A project in which it mainly has 2 apis that allow a user to save data in storage
securely and decrypt it given encryption key and give decryption key to decrypt

## Installation
to be able to install the system and use it please follow the steps below

### Prerequisite

Please make sure you have those dependencies installed to be able to run the system properly.

- node js
- yarn or npm
- docker
- docker-compose

#### installing system dependencies

now make sure your terminal is on the root director of the project
then run

```
yarn 

or 

npm install
```

#### configuring the env file

for the system to get up and work properly you need to create the .`env` file
there is a file called `.env.example` you can copy and rename it to `.env`

then you can fill in the values by your desired values below is an example `.env` to make things easy for you

```
NODE_ENV=development
secretKey=AnySecretKeyUsedInappEncryption

DB_HOST=localhost
DB_NAME=secure-storage-db
DB_USER=postgres
DB_PORT=5432
DB_PASSWORD=testPassword
```

now your environment configs are ready

#### Now getting the database server up

then you may start the database server and the adminer (which is a UI for postgres db something phpmyadmin)

to start the main system depencies run the below commands

```
yarn start-db
or 
npm run start-db
```

after that you can open this link [http://localhost:8080/](http://localhost:8080/) in the browser which will open the adminer.

you can login with the below creds or according to the configs you made in the `.env` file

```
System : PostgreSQL
Server : db-service (this is the name of the db service in the docker-compose file)
Username: postgres
Password: <enter the password in the DB_PASSWORD you entered in the .env file>
```

then click login 
you will see a link to create a database you just need to create a database and
do not forget to name it as you named it in the `.env` file which `DB_NAME`

#### running migration

last step before getting up our server we just need to make our database tables
run this command to migrate

```
yarn migrate
or 
npm run migrate
```

this should work and you can check back in the adminer for the table which will be called `storage`.

#### Running the server 

for running the server you just need to run the below command

```
yarn build:run
or
npm run build:run
```

this will compile the typescript then run the node server you should now see this message

```
Server is running on http://localhost:3000/health
```

#### Running tests 
This will run tests and output the coverage for the project

```
yarn test:coverage
```


