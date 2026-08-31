require("dotenv").config();

const dbToConnect = require("./db/db");
dbToConnect();


const express = require("express");
const app = express();
const cors = require('cors')
const UserRoute = require("./routes/UserRoute")
const NoteRoute = require("./routes/NoteRoute")
const fileUploadRoute = require("./routes/fileUploadRoute")
// app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(cors({
    origin: [
      "http://localhost:5174",
      "https://magenta-badger-208226.hostingersite.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token"],
    credentials: true
  }));
app.use(express.json())

app.use('/assets/data', express.static('statics'));

app.use("/api/user", UserRoute)
app.use("/api/notes", NoteRoute)
app.use("/api/upload", fileUploadRoute)

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})

