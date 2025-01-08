import express from "express";
import { spawn } from "child_process";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/trigger-build", (req, res) => {
    console.log("Build Triggered!");

    const deployProcess = spawn("./deploy-build.sh");

    deployProcess.stdout.on("data", (data) => {
        console.log(`Stdout: ${data}`);
    });

    deployProcess.stderr.on("data", (data) => {
        console.error(`Stderr: ${data}`);
    });

    deployProcess.on("close", (code) => {
        if (code === 0) {
            res.send("Build successful");
        } else {
            res.status(500).send("Build failed");
        }
    });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on http://0.0.0.0:3000");
});
