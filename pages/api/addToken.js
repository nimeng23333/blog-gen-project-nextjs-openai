import stripeInit from "stripe";
import { getSession } from "@auth0/nextjs-auth0";

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const {user} = await getSession(req,res);

    const lineItems = [{
        price: process.env.STRIPE_PRODUCT_PRICE_ID,
        quantity:1
    }]

    const protocol = process.env.NODE_ENV === "development"? "http://" : "https://"; //开发模式的协议是http，反之https
    const host = req.headers.host;

    const checkoutSession = await stripe.checkout.sessions.create({
        line_items:lineItems,
        mode:"payment",
        success_url:`${protocol}${host}/success`,
        payment_intent_data:{metadata:{sub:user.sub}},
        metadata:{sub:user.sub},
    })

    console.log("user:", user)
    /*lineItems：line_items是用户购买的商品列表。每个商品都是一个对象，包含商品的价格、数量等信息。mode: "payment"：这表示结账会话的模式是“payment”，即一次性付款。
    success_url如果付款成功，用户将被重定向到这个URL。
    payment_intent_data: { metadata: { sub: user.sub } }：payment_intent_data是一个对象，它包含了创建PaymentIntent时要使用的参数。
    metadata: { sub: user.sub }：这是结账会话的metadata，它也是一个可以存储额外信息的对象，这些信息会与结账会话一起保存。
    metadata出现了两次，一次在payment_intent_data中，一次在结账会话的顶层。这是因为Stripe允许在两个地方都添加metadata。一个是在PaymentIntent级别（即payment_intent_data.metadata），另一个是在CheckoutSession级别（即metadata）。让两个级别都能访问到这个数据
    */
    res.status(200).json({ session:checkoutSession })
  }
  