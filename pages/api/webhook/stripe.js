import Cors from "micro-cors";
import stripeInit from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
    allowMethods:['POST','HEAD']
});
//用Cors打开端口，允许外部操作

export const config = {
    api:{
        bodyParser: false
    }
}
//打开端口后的config都用这个config，这里的config是让default的不传递，只传递stripe过来的内容

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINTSECRET;

const handler = async(req,res) =>{
    if(req.method === "POST"){
        let event;
        try{
            event = await verifyStripe({
                req,
                stripe,
                endpointSecret
            })
        }catch(e){
            console.log("Error:",e);
        }

        switch(event.type){
            case "payment_intent.succeeded":{
                const client  = await clientPromise;
                const db = client.db("BlogGenerator");
                const paymentIntent = event.data.object;
                const auth0ID = paymentIntent.metadata.sub;
                const userProfile = await db.collection("users").updateOne({
                    auth0ID,
                }, {
                    $inc:{
                        availableTokens:10
                    },
                    $setOnInsert:{
                        auth0ID
                    }
                },{upsert:true})
            }
            default:
                console.log("Unhandled event",event.type);
        }
        res.status(200).json({received:true})
    }
}

export default cors(handler);