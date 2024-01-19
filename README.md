
# Google Meet Clone

Experience real-time video calls with peer-to-peer connections and seamless communication!

## Screenshots

![App Screenshot](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/fd178801-c2fd-40ae-b4da-1108310116ea)
![App Screenshot](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/df61a9f9-7adf-4bcb-af86-581a4419bbb9)
![App Screenshot](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/ec71bb97-ab72-4b8f-a077-bf84c93217e6)
![App Screenshot](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/96ea510d-5f9c-41ce-a2db-7e4ac5f7ff0d)
![App Screenshot](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/5d3ea8e3-dcd3-4b21-b145-62745cbf9212)
![App Screenshot](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/44e4b10a-c8d0-481e-84b8-e98bd10724a2)
![App Screenshot](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/5e5050ff-341e-45f1-805f-a1c522ec701e)

## Features:

### &bull;  Peer-to-Peer Video Calls: Connect directly with participants for a smooth experience.

### &bull;  Screen Sharing: Share your screen effortlessly for enhanced collaboration.

![Desktop Screenshare](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/1a14f7b1-1360-4cc1-8cda-a3c9f67760a6)

### &bull;  Chat: Communicate through text while on a call.

![Mobile Chat](https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/assets/123585591/ef413ab2-1916-403e-82eb-00964c2334a4)

### &bull;  Responsive Design: Works seamlessly across devices, from desktop to mobile.

### &bull;  Socket.IO Integration: Enables real-time data synchronization for a fluid experience.


#### Socket Routes
| Route Name      | Purpose                                      | Type        |
|------------------|-------------------------------------------------|-------------|
| new-user-joined | Handles a new user joining a room             | **on**      |
| joining-room    | Broadcasts a user joining a room to other users | **emit**    |
| send            | Sends a chat message to all users in the room   | **emit**    |
| localDescription | Sends a user's local media description to others | **emit**    |
| remoteDescription | Sends a user's remote media description to others | **emit**    |
| iceCandidate    | Sends an ICE candidate to other users           | **emit**    |
| iceCandidateReply | Sends an ICE candidate reply to other users     | **emit**    |
| disconnect      | Handles a user disconnecting from the socket      | **on**      |
### &bull;  Currently supports 2 participants: Stay tuned for expanded capacity in future updates!


## Getting Started:

### Clone the repository:

    git clone https://github.com/rahulrana701/Google-Meet-Clone

### Start the backend:

     cd Backend 
     npm install 
     node app.js

### and Install dependencies:

    cd Google-Meet-Clone
    npm install

### Start the server:

    npm run dev

Access the application:

  Open http://localhost:3000 in your browser.

## Contributing:

  
  &bull; Fork the repository
  
  &bull; Create a branch for your changes
  
  &bull; Commit your changes with clear and concise messages
  
  &bull; Push your changes to your fork
  
  &bull; Create a pull request

## Roadmap:

  &bull; Support for multi-participant calls

  &bull; Enhanced chat features

  &bull; Recording capabilities

  &bull; Performance optimization

## Tech Used:

  &bull; React
    
  &bull; Express Js

  &bull; Javascript

  &bull; Webrtc

  &bull; Websockets

  &bull; 

Stay connected for updates and advancements!

