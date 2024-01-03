import { Configuration, OpenAIApi } from "openai"

export default async function handler(req, res) {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    }); 
    const openai = new OpenAIApi(config);
    const {topic , keywords} = req.body;
    const postContentRes = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        temperature: 0, //temperature指的创造力，越高越超越你的prompt
        messages:[{
            role:"system",
            content:"You are a blog post generator",
        },{
            role:"user",
            content:`Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords:${keywords}.
            The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`
        }]
    })

    const postContent = postContentRes.data.choices[0]?.message?.content || "";

    console.log(postContent);

    // const titleRes = await openai.createChatCompletion({
    //     model:"gpt-3.5-turbo",
    //     temperature: 0, 
    //     messages:[{
    //         role:"system",
    //         content:"You are a blog post generator",
    //     },{
    //         role:"user",
    //         content:`Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords:${keywords}.
    //         The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`
    //     },{
    //         role:"assistant",
    //         content: postContent
    //     },{
    //         role:"user",
    //         content:"Generate appropriate title tag text for the above blog post"
    //     }]
    // })

    // const metaDescriptionRes = await openai.createChatCompletion({
    //     model:"gpt-3.5-turbo",
    //     temperature: 0, 
    //     messages:[{
    //         role:"system",
    //         content:"You are a blog post generator",
    //     },{
    //         role:"user",
    //         content:`Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords:${keywords}.
    //         The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`
    //     },{
    //         role:"assistant",
    //         content: postContent
    //     },{
    //         role:"user",
    //         content:"Generate SEO-friendly meta description content for the above blog post."
    //     }]
    // })

    // const title = titleRes.data.choices[0]?.message?.content;
    // const meta = metaDescriptionRes.data.choices[0]?.message?.content;
    res.status(200).json({post:{postContent}})
    // res.status(200).json({ post: {
    //     postContent,
    //     title,
    //     meta,
    // } })
  }