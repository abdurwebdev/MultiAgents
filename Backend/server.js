import 'dotenv/config'
import app from "./src/app.js";
import http from 'http';
import { initSocket } from "./src/config/connectSocket.js";
import logger from './src/config/logger.js';

const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.listen(3000,()=>{
  logger.info("Server running on port 3000");
})