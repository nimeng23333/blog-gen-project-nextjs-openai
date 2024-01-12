import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../lib/mongodb";


export const getCustomProps = async(ctx) =>{
    const {user} = await getSession(ctx.req,ctx.res);
    const client = await clientPromise;
    const db = await client.db("BlogGenerator");
    const userProfile = await db.collection("users").findOne({
        auth0ID:user.sub
    })
    if (!userProfile){
        return{
            availableTokens:0,
            posts:[]
        }
    }

    const posts = await db.collection("posts")
        .find({
            userID : userProfile._id,
        })
        .limit(5)
        .sort({
            createdDate:-1
        })
        .toArray();
    return{
        availableTokens:userProfile.availableTokens,
        posts : posts.map(({createdDate,_id,userID, ...rest}) => ({
            _id:_id.toString(),
            userID:userID.toString(),
            createdDate:createdDate.toString(),
            ...rest,
        })), //特别注意：posts里面包含了日期类型和objectId类型，json没法处理，所以需要用map将他们都用toString映射，...rest用spread将剩下的提取出出来
        postID: ctx.params?.postid || null,
    }
}