require("dotenv").config();

const dbToConnect = require("./db/db");
dbToConnect();

const { getSmtpConfig } = require("./services/Nodemailer");
const smtpConfig = getSmtpConfig();
if (!smtpConfig) {
  console.warn(
    "WARNING: SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). OTP emails will not be sent.",
  );
} else {
  console.log(`SMTP configured for ${smtpConfig.user} via ${smtpConfig.host}:${smtpConfig.port}`);
}


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

