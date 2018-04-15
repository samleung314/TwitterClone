# TwitterClone
Twitter Clone course project for CSE 356 Cloud Computing
http://34.237.243.112/

# Authors

Kyeongsoo Kim
Samson Leung
Naim Youssif



# Setup
We need 4 machines

## Machine1
NGINX

## Machine2
To handle user

## Machine3
To handle item

## Machine4
To handle media

    /addmedia
    /media/<id>
    
`Database Setup`
- Step 1: Install Cassandra 2.2(22x)
- Step 2: Create “db” keyspace (replication factor 1 with Simple Strategy)
- Step 3: Create a table “media” that includes a id (text) and content (blob) columns
- Step 4: Run app.js
