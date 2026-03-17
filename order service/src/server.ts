import "dotenv/config";
import expressApp from "./expressApp";
import logger from "./utils/logger";

const PORT = process.env.APP_PORT || 9000;

export const StartServer = async () => {
    process.on("uncaughtException", (err) => {
        logger.error("Uncaught Exception", { err });
        process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
        logger.error("Unhandled Rejection", { reason });
        process.exit(1);
    });

  expressApp.listen(PORT, () => {
        logger.info(`App is running on port ${PORT}`);
    });
};

StartServer().then(() => {
        logger.info("Server started successfully");
}).catch((err) => {
        logger.error("Error starting server", { err });
    process.exit(1);
});