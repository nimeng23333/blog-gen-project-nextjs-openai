import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";


export default withApiAuthRequired(async function handler(req, res){
    try{
        const {user : {sub}} = await getSession(req,res);
        const client = await clientPromise;
        const db = await client.db("BlogGenerator");
        const userProfile = await db.collection("users").findOne({
            auth0ID:sub
        })

        await db.collection("posts").deleteOne({
            userID: userProfile._id,
            _id : new ObjectId (req.body.postID)
        });
        res.status(200).json({success:true});
    }catch(e){
        console.log(e);
    }
})