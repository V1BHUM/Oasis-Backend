# Oasis-Backend

1. Users who are looking to sell can put in the request to verify their product (books) which can then be sold over the platform.
2. Librarians (verifiers) process the input requests of the users and, after verifying the product's authenticity, approve the ad to be posted.
3. Users looking to buy books can search for them based on title and tags, get connected with the seller, and buy them after reaching an agreement. 
4. Users also have the option to put up their books for exchange, either for a set amount of time or indefinitely.
5. Buyers, after receiving the books, can rate the seller. The Librarian can then use these ratings to find the most reliable sellers and add an ‘Assured’ tag to them.
6. Users can choose to purchase a prime subscription, which assigns more priority to their ads over non-prime members.
7. Users have their own profile pages that show their bio, followers, ratings, and book transactions. Users can chat among themselves and pass on book recommendations.
8. Users can see their buying and selling stats on their dashboards, and admins can see the performance of individual sellers and active users' analytics. This information can then be used to offer the users a discount to buy prime memberships.

# Running The Project

The following must be installed on your system before running the project
- docker
- docker-compose/ docker compose

To run the project on your localhost, run the following in the project directory
```bash
docker-compose up --build
```
Or use the following if using `docker compose`
```bash
docker compose up --build --attach server
```
The first run will take a while to setup the dependencies

The backend will be available on localhost:8080