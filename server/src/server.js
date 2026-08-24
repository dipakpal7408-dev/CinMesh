require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./sockets/socket");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer, app);

  httpServer.listen(PORT, () => {
    console.log(`[cinmesh] Server running on http://localhost:${PORT}`);
  });
};

start();
