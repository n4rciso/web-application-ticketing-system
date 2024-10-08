# Web Application Exam: "Ticketing System"
The project was developed according to the following [specifications](https://docs.google.com/document/d/10BtpwfqA_vozQcmhLNQSK0DmmmAdqYcuIYAwb9cjpqQ/edit).

## Student: CARCAGNI' ANDREA

## React Client Application Routes

- Route `/`: this page manages the display of a list of tickets, manages errors and allows interactions with individual tickets based on authentication, such as: viewing replies to tickets, replying to tickets, changing the status or category through dedicated components.
- Route `/add`: this page allows users to create new tickets. It manages two phases: filling out the form and a confirmation phase where the details entered for final approval are displayed including an estimate obtained through server 2
- Route `/login`: this page manages user login through a form and redirects the user to the homepage on successful login or display an error message on failure. It also offers guest access without login.
- Route `/*`: this page displays a message for invalid routes and offers a button to return to the main page.

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
  - **Description:** Returns an estimation of time required based on the title and category of a ticket. Returns estimation in hours for admin and in days for user.
  - **Request Headers:** JWT token to verify user access.
  - **Request body:**
    ```json
    {
      "title": "Urgent server issue",
      "category": "maintenance"
    }
    ```
  - **Response body:**
    ```json
    {
      "estimation": 173,
    }
    ```
  - **Status code:** `200 OK`,  `401 Unauthorized`, `422 Unprocessable Entity` (like validation)



## Database Tables

- Table `users`: id, username, hashedPassword, salt, role.
- Table `tickets`: id, title, state, category, ownerId, timestamp, description  
  *state*: open/closed  
  *category*: inquiry, maintenance,new feature, administrative, payment  
  *description*: initial block (text)  
- Table `answers`: id, ticketId, content, authorId, timestamp.  
  Each row represents an additional block to a ticket


## Main React Components

- `TableLayout` (in `Layout.jsx`): handles the ticket list fetch
  - `TicketList` (in `TicketLibrary.jsx`): simply a list of `TicketItem`
    - `TicketItem` (in `TicketLibrary.jsx`): this component manages individual tickets. It controls the visibility of ticket details, editing options, and response forms through states and incorporates conditional rendering to adapt to different user roles. Only if the owner is not an admin her a button to change the state from open to close is inserted.
      - `TicketAnswer` (in `TicketDetail.jsx`): designed for users to submit responses to tickets, moreover it ensure that the component response is not empty before submitting. 
      - `TicketDetail`(in `TicketDetail.jsx`): retrieves and displays answer (blocks) for a specific ticket. Once data is available, it displays the ticket answer in a styled list, including the content, author, and timestamp, providing a clean and informative presentation.
      - `TicketEdit`(in `TicketEdit.jsx`): is designed for administrators to modify the state and category of a ticket. 

- `AddLayout` (in `Layout.jsx`):
  - `TicketForm` (in `TicketAdd.jsx`): designed for managing ticket submissions. It checks user inputs like title, category, description. Allow user to create tickets, review their details, and confirm their submissions, with options to edit or cancel as needed. Moreover the component leverages an effect hook to asynchronously calculate estimation times. 




## Screenshot

![Screenshot](./img/ScreenHome.png)  

![Screenshot](./img/ScreenAdd.png)


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

