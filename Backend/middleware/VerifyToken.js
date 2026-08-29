const jwt = require("jsonwebtoken");

const VerifyToken =(req,res,next)=>{
    try {

        const token = req.headers.token
        // console.log(token)
        if(!token){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }
        // console.log(decoded)
        req.token = decoded
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error",success:false, error})
    }
}

module.exports = VerifyToken