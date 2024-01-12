import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
    const {user} = await getSession(req,res);
    const client = await clientPromise;
    const db = client.db("BlogGenerator");
    const userProfile = await db.collection("users").findOne({auth0ID:user.sub});
    if(!userProfile?.availableTokens){
        res.status(403);
        return;
    }

    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        basePath:"https://api.openai-proxy.com/v1"
    }); 
    const openai = new OpenAIApi(config);
    const {topic , keywords} = req.body;

    if(!topic || !keywords){
        res.status(422);
        return;
    }
    if(topic.length >200 || keywords.length > 200){
        res.status(422);
        return;
    }

    const postRes = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        temperature: 0, //temperature指的创造力，越高越超越你的prompt
        messages:[{
            role:"system",
            content:"You are a blog post generator",
        },{
            role:"user",
            content:`Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords:${keywords}.
            The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, strong, i, ul, li, ol.
            And then generate some appropriate tags for this blog post, start with "<h6>Tags:</h6>", seperated by comma.
            At last, generate SEO-friendly meta description content for the blog post, start with "<h6>Meta Description:</h6>".`
        }]
    })

    const postUnformatted = postRes.data.choices[0]?.message?.content || "";
    const post = postUnformatted.replace(/\r?\n|\r/g, '');
    const titleRegex = /<h1>(.*?)<\/h1>/;
    const postContentRegex = /<\/h1>(.*?)<h6>Tags:/;
    const tagsRegex = /<h6>Tags:(.*?)<h6>Meta Description:/;
    const metaDescriptionRegex = /<h6>Meta Description:(.*?)$/;
    const pRegex = /<p>(.*?)<\/p>/;
    const title = post.match(titleRegex)[1];
    const postContent = post.match(postContentRegex)[1];
    const tagsRaw = post.match(tagsRegex)[1];
    const tags = tagsRaw.match(pRegex)[1];
    const metaDescriptionRaw = post.match(metaDescriptionRegex)[1];
    const metaDescription = metaDescriptionRaw.match(pRegex)[1];

    await db.collection("users").updateOne({
        auth0ID:user.sub
    },{
        $inc:{
            availableTokens:-1
        }
    });

    const postStored = await db.collection("posts").insertOne({
        userID:userProfile._id,
        postContent:postContent,
        title:title,
        metaDescription:metaDescription,
        tags:tags,
        topic,
        keywords,
        createdDate: new Date()
    })


    res.status(200).json({postID:postStored.insertedId})
    
  })
