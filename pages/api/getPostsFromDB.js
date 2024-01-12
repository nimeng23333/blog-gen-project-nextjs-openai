import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req,res){
    try{
        const {user:{sub}} = await getSession(req,res);
        const client = await clientPromise;
        const db = await client.db("BlogGenerator");
        const userProfile = await db.collection("users").findOne({
            auth0ID:sub,
        })
        const {lastPostDate, getNewerPosts} = req.body;
        const posts = await db.collection("posts").find({
            userID:userProfile._id,
            createdDate:{[ getNewerPosts ? "$gt": "$lt"]: new Date(lastPostDate)}
        }).limit(getNewerPosts? 0 : 5)
        .sort({createdDate:-1})
        .toArray();

        res.status(200).json({posts});
        return;
    }catch(error){
        console.log(error);
    }

})