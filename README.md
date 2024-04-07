<h1>irctc-mock-app</h1>

<br>
<div>
<strong>Technologies Used</strong><br>
<ul>
<li>NodeJs</li>
<li>PostgreSQL</li>
</ul>
</div>

<div>
<h2>How to setup and run</h2>
<h3>Local Setup</h3>
<strong>Make sure you have the following installed on your system:</strong>
<ul>
  <li>Node</li>
  <li>Postgres</li>
</ul>
<ol>
  <li>Fork this repo</li>
  <li>Clone this repo</li>
  
  ```bash
  git clone git@github.com:Flanker-shyam/irctc-mock-app.git
  ```
<li>install dependencies</li>

  ```bash
  npm install
  ```
<li>Setup Environment variables: </li>

<ul>
  <li>Create a .env file in the root dir of this project</li>
  <li>Copy content of example.env into this file</li>
  <li>Change dummy values accordingly</li>
</ul>

<li>Setup Database</li>
<ul>
  <li>
    Start local Postgres server<br>
    For MacOS

  ```bash
  brew services start postgresql
  ```

For Linux

 ```bash
 sudo systemctl start postgresql
 ```

  </li>
  <li>
    Create Database: irctc-mock/or choose any db name
  </li>
  <li>
    Run DB migration to push DB schemas to the DB
    
  ```bash
  npm run migrate
  ```
    
  </li>
</ul>
  <li>Run this project</li>
     
  ```bash
  npm run start
  ```
</ol>

</div>

<div>
  <h2>Approach of Implementation</h2>
  ER diagram
  <br>
  <img width="379" alt="image" src="https://github.com/Flanker-shyam/irctc-mock-app/assets/85950516/ea9644e0-0ea3-4095-aa5f-4affaf5b20f5">


## Approach Documentation

#### Functionalities
1. **Register User**: Integrated password hashing!
2. **Login User**: On sucessful login send a Auth token in authorization header for Implementing authorization in the code.
3. **Add a train**: Admin endpoint that is protected and can be accessed using a secret API_KEY for admin, admin can add a new train in DB (Train name, source, destination, number of seats).
4. **Find a Train**: Authentic users can query all the trains between source and destination stations.
5. **Book a Seat**: Authentic users can book a train if seats are available.
6. **Get all bookings**: Authentic users can see all of their bookings.

#### Security Measures
- **Input Validation**: Validate input data before performing database actions to prevent SQL injection attacks.
- **Helmet**: Use Helmet middleware to set various HTTP headers for enhanced security.
- **Rate Limiting**: Implement rate limiting to prevent abuse of the service and mitigate Denial-of-Service attacks.
- **Authentication**: Implement secure user authentication mechanisms to ensure only authenticated users can access to book train, find train and get their bookings.
- **Authorization**: Authorize admin to add new Train using secret admin key.

#### Performance Enhancements
- **DB indexing**: Implemented indexing in trains table for efficient query of trains based on source and destination.
- **ROW Locking and Transactions**: Implemented transactions in the seat booking endpoint to ensure data consistency and concurrency control in database operations, including locking mechanisms and retry mechanisms for improved reliability.

#### Future Enhancements for next versions
- To add Journey data for booking and filtering of trains.
- To add feature for choosing any source and destination stations in the route of train and book ticket.
</div>

