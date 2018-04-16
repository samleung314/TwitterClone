# TwitterClone
Twitter Clone course project for CSE 356 Cloud Computing
http://34.237.243.112/

# Authors

Kyeongsoo Kim
Samson Leung
Naim Youssif
Han Zhao


# Setup
We need 4 machines

## Machine1 (130.245.171.91)
NGINX server that reverse proxies to the machines below.

`Server Setup`
- Step 1: [Install NGINX](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)
- Step 2: [Set up NGINX load balancing](https://www.upcloud.com/support/how-to-set-up-load-balancing/)
- Step 3: Use the load-balancer.conf 

## Machine2
Handles USER related requests
    
    /login
    /logout
    /adduser
    /verify
    /user/<username>/follower
    /user/<username>/following

## Machine3
Handles ITEM related requests

    /search
    /additem
    /item</id>
    /item/<id>/like

## Machine4
Handles MEDIA related requests

    /addmedia
    /media/<id>
    
`Database Setup`
- Step 1: Install Cassandra 2.2(22x)
- Step 2: Create “db” keyspace (replication factor 1 with Simple Strategy)
- Step 3: Create a table “media” that includes a id (text) and content (blob) columns
- Step 4: Run app.js
