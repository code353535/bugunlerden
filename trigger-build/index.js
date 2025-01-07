import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.post("/trigger-build", (req, res) => {
    console.log("Build Triggered!");
    exec('node triggered-script.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Script error: ${stderr}`);
            res.status(500).send('Error running script');
            return;
        }
        console.log(`Script output: ${stdout}`);
        res.send('Script executed successfully');
    });
});

app.listen(3000, () => {
    console.log("Build trigger server is running on port 3000");
});
