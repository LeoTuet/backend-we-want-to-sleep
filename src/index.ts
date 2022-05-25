import logger from "jet-logger";
import app from "./app";
import { connectToDB } from "./repositories/connectToDB";

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  logger.info("Express server started on port: " + port);
});

connectToDB();
