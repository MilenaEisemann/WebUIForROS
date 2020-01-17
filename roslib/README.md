# docker-lamp

Docker example with Apache, MySql 8.0, PhpMyAdmin and Php

You can use MySql 5.7 if you checkout to the tag `mysql5.7`

I use docker-compose as an orchestrator. To run these containers:

```
docker-compose up -d
```

Open phpmyadmin at [http://localhost:8000](http://localhost:8000)
Open web browser to look at a simple php example at [http://localhost:8001](http://localhost:8001)

Run mysql client:

- `docker-compose exec db mysql -u root -p`

Enjoy !

https://www.arangodb.com/why-arangodb/sql-aql-comparison/
https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/
https://www.arangodb.com/docs/stable/aql/data-queries.html
https://www.arangodb.com/docs/stable/http/document-working-with-documents.html
