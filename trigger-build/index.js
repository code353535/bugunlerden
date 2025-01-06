import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.post("/trigger-build", (req, res) => {
    console.log("Build Triggered!");
    exec("npm run build", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send("Build failed");
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send("Build failed");
        }
        console.log(`Stdout: ${stdout}`);
        res.send("Build successful");
    });
});

app.listen(4000, () => {
    console.log("Build trigger server is running on port 3000");
});
