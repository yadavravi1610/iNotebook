const multer = require("multer");
const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const upload = require("../middleware/UploadFileUsingMulter");



router.post("/file-upload", upload.array("my-file",5) ,async(req, res)=>{
    try{
        return res.status(200).json({message:"File uploaded successfully", success: true});
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error", success: false});
    }
})

module.exports = router