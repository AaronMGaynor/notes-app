# Notes-App

Notes-App is a web-based note taking app utilizing a React.js UI and Express services

## Prerequisites

To install and run this app, you will need npm v6.9.0 or greater and node v10.16.3 or greater

## Installation

#### UI

After downloading the notes-app repository, open a terminal and navigate to notes-app/notes-app-ui then run the following:

`npm install`


### Services

After downloading the notes-app repository, open a terminal and navigate to notes-app/notes-app-services then run the following:

`npm install`

## Running

### To Run in Dev Mode:

After going through the Installation steps, open two terminals and do the following:

In the first terminal, navigate to notes-app/notes-app-services and then follow these steps:
  1. Ensure port 3001 is open and available, if it is not, then you may switch the port by changing the port variable in server.js to a desired port value (make note of this port value)
  2. In the terminal, run the following command:
  
    `npm run start`
  3. Wait for the command to output the following:
  
    `App listening on port 3001`
    
In the second terminal, navigate to notes-app/notes-app-ui and then follow these steps:
  1. Ensure port 3000 is open and available
  2. If you edited the port in step 1 of the notes-app-services startup, edit the proxy value in package.json from 'http://localhost:3001' to 'http://localhost:{your port value}'
  3. In the terminal, run the following command:
    
    `npm run start`
  4. This should open 'http://localhost:3000' in your default browser
  
### Important Notes
This app does not support IE
