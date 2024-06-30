[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Y8bW3OQP)
# Exam #1: "Ticketing System"
## Student: s331618 CARCAGNI' ANDREA

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server
- GET `/api/tickets`
  - **Description:** This endpoint retrieves a list of all available tickets. It is accessible to all users.
  - **Authentication Required:** No
  - **Response body:**
    ```json
    [
      {
        "id": 1,
        "title": "Inquiry about product",
        "state": "open",
        "category": "new feature",
        "ownerId": 1,
        "timestamp": "2024-06-12 10:00:00",
        "owner": "Narciso"
      },
      {
        "id": 2,
        "title": "Maintenance request",
        "state": "closed",
        "category": "maintenance",
        "ownerId": 2,
        "timestamp": "2024-06-12 11:00:00",
        "owner": "Andrea"
      }
    ]
    ```
  - **Status code:** `200 OK`, `500 Internal Server Error`  

- GET `/api/tickets:id`
  - **Description:** This endpoint retrieves all blocks related to a specific ticket, identified by its ID. It is available only to logged-in users and requires validation of the ticket ID as a positive integer. Some value as timestamp, authorID are directly managed at this stage.
  - **Authentication Required:** Yes
  - **Parameters**:
    - **id** (required): The id of the ticket. Must be a positive integer.
  - **Request body:**
      ```json
       
        {
          "content": "Can you provide more details about your inquiry?"
        }   
      
      ```
  - **Response body:**
    ```json
    [  
      {
        "content": "I have a question about the product features.",
        "author": "Narciso",
        "timestamp": "2024-06-12 10:00:00"
      },
      {
        "content": "Can you provide more details about your inquiry?",
        "author": "Andrea",
        "timestamp": "2024-06-12 10:05:00"
      },
    ]
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized.
    -  `404 Not Found`: No ticket with the specified ID was found.
    -  `422 Unprocessable Entity`: The validation was failed.
    -  `500 Internal Server Error`  

- POST `/api/tickets`
  - **Description:** This endpoint allows logged-in users to create a new ticket by providing necessary information. The API handles certain values automatically, such as ticket ID, timestamp, user ID, and initial state.
  - **Authentication Required:** Yes
  - **Request body:**
    ```json
      {
        "title": "Night mode"
        "category": "new feature",
        "description": "Please add a night mode to the application."
      }   
    ```
  - **Response body:**
    ```json
    
      {
        "id": 16,
        "title": "Night mode",
        "state": "open",
        "category": "new feature",
        "ownerId": 1,
        "timestamp": "2024-06-30 16:40:29",
        "description": "Please add a night mode to the application."
      }   
    
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized.
    -  `422 Unprocessable Entity`: The validation was failed.
    -  `503 Service Unavailable`  

- PUT `/api/tickets/:id/category`
  - **Description:** This endpoint allows admin users to update the category of an existing ticket. The endpoint enforces user authentication and role verification, ensuring only admins can perform this operation. Other validation on id and category has done.
  - **Authentication Required:** Yes
  - **Access Level:** Admin only
  - **Parameters**:
    - **id** (required): The id of the ticket. Must be a positive integer.
  - **Request body:**
    ```json
      {
        "id" : 3,
        "category": "inquiry"
      }  
    ```
  - **Response body:**
    ```json
      {
        "id": 3,
        "title": "New feature suggestion",
        "state": "open",
        "category": "inquiry",
        "ownerId": 1,
        "timestamp": "2024-06-12 12:00:00",
        "description": "I suggest adding a dark mode to the application."
      }
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized (only admin users are allowed).
    -  `404 Not Found`: No ticket with the specified ID was found.
    -  `422 Unprocessable Entity`: The validation was failed.
    -  `503 Service Unavailable`  
  -  *Note*: always the parameters id is used (taken by the url)

- PUT `/api/tickets/:id/state`
  - **Description:** This endpoint allows the owner of the ticket or an admin user to update the state of an existing ticket. It ensure that the requester has proper authorization and that the input conforms to specified requirements.
  - **Authentication Required:** Yes
  - **Access Level:** Restricted to the ticket owner (if the tickets is open) or admin
  - **Parameters**:
    - **id** (required): The id of the ticket. Must be a positive integer.
  - **Request body:**
    ```json
      {
        "id" : 3,
        "state": "closed"
      }  
    ```
  - **Response body:**
    ```json
      {
        "id": 3,
        "title": "New feature suggestion",
        "state": "closed",
        "category": "inquiry",
        "ownerId": 1,
        "timestamp": "2024-06-12 12:00:00",
        "description": "I suggest adding a dark mode to the application."
      }
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized.
    -  `404 Not Found`: No ticket with the specified ID was found.
    -  `422 Unprocessable Entity`: The validation was failed.
    -  `503 Service Unavailable`  
  -  *Note*: always the parameters id is used (taken by the url)

- POST `/api/tickets/:id/answer`
  - **Description:** This endpoint allows all authenticated users to add a new answer to an open ticket. It checks that the ticket is open before allowing the submission of the answer and automatically inserts some values such as timestamp and author ID.
  - **Authentication Required:** Yes
  - **Parameters**:
    - **id** (required): The id of the ticket. Must be a positive integer.
  - **Request body:**
    ```json
      {
        "content": "Your point is right! We will add this feature in the next release."
      }   
    ```
  - **Response body:**
    ```json
    [  
      {
        "content": "Sure, I would like to know if the product supports multiple languages.",
        "author": "Narciso",
        "timestamp": "2024-06-12 10:10:00"
      },
       {
        "content": "Your point is right! We will add this feature in the next release.",
        "author": "Narciso",
        "timestamp": "2024-06-30 16:40:29"
      }
    ]
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized.
    -  `404 Not Found`: No ticket with the specified ID was found.
    -  `422 Unprocessable Entity`: The validation was failed.
    -  `503 Service Unavailable`  
  -  *Note*: always the parameters id is used (taken by the url)
  

- POST `/api/session`
  - **Description:** This endpoint is used for performing user login. It authenticates the user credentials against the stored data and, if successful, establishes a login session.
  - **Authentication Required:** No
  - **Parameters**:
    - **id** (required): The id of the ticket. Must be a positive integer.
  - **Request body:**
    ```json
      {
        "username": "Narciso",
        "password": "PaSs1234"
      }
    ```
  - **Response body:**
    ```json
      {
        "id": 1,
        "username": "Narciso",
        "role": "admin"
      }
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized.

- GET `/api/session/current`
  - **Description:** This endpoint checks if the user is currently authenticated. If the user is authenticated, it returns the user's details; if not, it returns an error indicating that the user is not authenticated.

  - **Authentication Required:** Yes
  - **Response body:**
    ```json
      {
        "id": 1,
        "username": "Narciso",
        "role": "admin"
      }
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized.

- DELETE `/api/session/current`
  - **Description:** This endpoint is used to log out the current user session. It effectively terminates the session by calling the logout method.
  - **Authentication Required:** Yes
  - **Response body:**
    ```json
    [  
      {}
    ]
    ```
  - **Status code:**
    -  `200 OK`,

- GET `/api/auth-token'`
  - **Description:** This endpoint generates a JSON Web Token (JWT) for authenticated users based on their role and ID. The token is signed and includes an expiration time, allowing secure and time-limited access to resources.
  - **Authentication Required:** Yes
  - **Response body:**
    ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJhZG1pbiIsImF1dGhJZCI6IjEyMzQ1NiIsImlhdCI6MTYxMjM0MDQwMCwiZXhwIjoxNjEyMzQ0MDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJzQYBQ3H0gmlj1wVndH0",
        "authLevel": "admin"
      } 
    ```
  - **Status code:**
    -  `200 OK`,
    -  `401 Unauthorized`: The user is not authorized.



## API Server2

- POST `/api/ticket/estimation`: 
  - **Description:** Returns an estimation of time required based on the title and category of a ticket.
  - **Request Headers:** JWT token to verify user access.
  - **Request body:**
    ```json
    {
      "title": "Urgent server issue",
      "category": "Technical Support"
    }
    ```
  - **Response body:**
    ```json
    {
      "estimation": 173,
    }
    ```
  - **Status code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`  



## Database Tables

- Table `users`: id, username, hashedPassword, salt, role.
- Table `tickets`: id, title, state, category, ownerId, timestamp, description  
  *state*: open/closed  
  *category*: inquiry, maintenance,new feature, administrative, payment  
  *description*: initial block (text)  
- Table `answers`: id, ticketId, content, authorId, timestamp.  
  Each row represents an additional block to a ticket


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

|Username|Password|Role|
|--------|----|------|
|Narciso|PaSs1234|admin|
|Andrea|SeCr3t89|basic|
|Ermes|QwErTy12|basic|
|Dagale|ZxCvBn56|basic|
|TheHero|HeRo4567|basic|
|Enrico|Masala123|admin|
|Ire|Principessina|basic|

