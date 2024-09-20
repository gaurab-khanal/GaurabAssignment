import app from "./app.js";
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 5000;


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT: ${process.env.PORT || 8000}`);
    });
})
    .catch((error) => {
        console.log("Error connecting to database", error);
    }
    );
