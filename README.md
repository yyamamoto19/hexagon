# Professional and Creative Portfolio Application

# Problem Statement
Our users need a user-friendly way to search through a creator’s professional experience and art.

This application includes a menu system and interactive visual components that connect to the backend through an API server. The portfolio controller supports CRUD operations and full-text search, leveraging Redis as the database.

The front-end is built with Next.js and uses Tailwind CSS for styling.

**Requirements**
- Design an art and professional portfolio management API.
- Build the API.
- Update the front-end to be interactive and integrate with the server:
  - The portfolio book should display each art or professional work with associated information as a card.
  - Typing in the search bar should dynamically filter the cards to match the search criteria.
  - Clicking on the Add Experience button should toggle the form editor, and clicking on Save should save the new user’s experience.
  - Clicking the Edit button should toggle the form editor, and clicking on Save should update the existing experience.
  - Clicking the Delete button should remove the selected experience.



# Getting Started
## Pre-reqs
You must have docker and docker-compose running on your system, which you can get [here](https://www.docker.com/products/docker-desktop) for windows & mac.

## To run
```sh
docker-compose up
```

Your changes will automatically reflect in both the server and the client.

You can find your client at
http://localhost:3000
and your server at
http://localhost:3001

## To run the server tests
```sh
docker-compose run --rm server npx mocha
```

## To work inside the container
First start the servers with
```sh
docker-compose up
```

then in a new terminal

```sh
docker-compose exec <server | client> /bin/bash
# eg
docker-compose exec server /bin/bash
docker-compose exec client /bin/bash
```

## Additional Notes
- Ensure environment variables are correctly set up for the application to connect to Redis and other required services.
- For any configuration changes, modify the docker-compose.yml file accordingly.
- Keep your dependencies up to date by running npm update inside the container.
