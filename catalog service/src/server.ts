import "dotenv/config";
import expressApp from "./expressApp"

const PORT = process.env.PORT || 8000;

export const StartServer = async() => {

  expressApp.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

process.on("uncaughtException",async(err) => {
    console.log("Uncaught Exception: ", err);
    process.exit(1);

})
}

StartServer().then(() => {
    console.log("Server started successfully");
}).catch((err) => {
    console.log("Error starting server: ", err);
    process.exit(1);
});