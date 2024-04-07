import dotenv from 'dotenv';
dotenv.config();

const verifyAdminToken = async(req,res,next)=>{
    const adminToken = req?.headers?.api_key;
    if(adminToken === process.env.ADMIN_API_KEY){
        next();
    }
    else{
        res.status(401).send("Unauthorized");
    }
}

module.exports = verifyAdminToken;