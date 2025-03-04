# AR Painting with WebSockets

## Overview
This project is a simple AR (Augmented Reality) application that allows users to paint in AR using WebXR. The painted strokes are broadcasted in real-time using WebSockets, allowing multiple users to join and view the painting in a shared AR space.

## Features
- **AR Painting:** Users can paint in AR using a Meta Quest 3 device or a mobile phone.
- **Multi-User Collaboration:** Paint strokes are broadcasted via WebSockets, so other users can see the painting in real-time.
- **WebXR Support:** The app leverages Three.js and WebXR to render AR experiences in the browser.
- **Real-Time Communication:** Uses Socket.io to transmit paint data to all connected clients.

## Technologies Used
- **Three.js** (for 3D rendering)
- **WebXR** (for AR support)
- **Socket.io** (for real-time communication)
- **Express.js** (for the backend server)
- **Node.js** (for server-side JavaScript)
- **Docker & Docker Compose** (for containerized deployment)

## Installation
### Prerequisites
Ensure you have **Node.js** and **Docker** installed on your system.

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/ar-painting.git
   cd ar-painting
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a folder for HTTPS certificates:**
   ```sh
   mkdir https-certificate
   ```

4. **Generate HTTPS Certificates** (Required for WebXR)
   ```sh
   openssl req -x509 -newkey rsa:2048 -keyout https-certificate/key.pem -out https-certificate/cert.pem -days 365 -nodes
   ```
   Follow the prompts to generate the certificates.

5. **Start the Server:**
   ```sh
   npm start
   ```

6. **Open the Application:**
   Open your browser and navigate to `https://localhost:3000/`.

## Running with Docker
Alternatively, you can run the application inside a Docker container.

1. **Build and start the container:**
   ```sh
   docker-compose up --build
   ```

2. **Open the Application:**
   Open your browser and navigate to `https://localhost:8080/`.

## Project Structure
```
├── public/               # Frontend files
│   ├── index.html        # Main webpage
│   ├── app.js            # Three.js AR app
│   ├── libs/             # Three.js & dependencies
├── https-certificate/    # Folder for HTTPS certificates
├── server.js            # Backend server (Node.js & Socket.io)
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # Project dependencies
└── README.md            # Project documentation
```