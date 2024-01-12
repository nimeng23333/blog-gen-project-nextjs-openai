import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import {Card} from "../../components/ContentCard/ContentCard";
import {Tag} from "../../components/Tag/Tag";
import { getCustomProps } from "../../utils/getCustomProps";
import { useState,useContext } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import PostContext from "../../context/postsContext";

export default function Post(props) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const router = useRouter();
    const tags = props.tags.split(",").filter((content)=> content.trim() !== "").map((content)=>content.trim());
    const contentCopy = props.postContent.replace(/<p>|<h2>|<h3>|<h4>|<ul>|<li>|<ol>/g, '').replace(/<\/p>|<\/h2>|<\/h3>|<\/h4>|<\/ul>|<\/li>|<\/ol>/g, '\n');
    
    const {deletePost} = useContext(PostContext);
    
    const handlerDeleteConfirm = async() =>{
      try{
        const res = await fetch("/api/deletePost",{
          method:"POST",
          headers:{
            "content-type":"application/json"
          },
          body:JSON.stringify({postID:props.postID}),
        })
        const data = await res.json();
        if(data.success){
          deletePost(props.postID);
          router.replace("/post/new");
        }
      }catch(e){
        console.log(e);
      }
    }
    return <div className="lg:w-2/3 sm:w-4/5 w-full flex-col px-2 justify-center align-middle">
        <Card title="SEO title and meta description" copy={"Title : " + props.title + "\nMeta description : " +props.metaDescription}>
          <h1 className="mb-3 text-3xl text-teal-700 tracking-tight">{props.title}</h1>
          <p>{props.metaDescription}</p>
        </Card>

        <Card title="Tags" gradient="from-cyan-600/70 to-sky-600/70" copy={props.tags} >
          {tags.slice(0,10).map((tag,idx) => (            
          <Tag key={idx} tag={tag} />
          ))}

        </Card>

        <Card title="Blog Post" gradient="from-sky-600/70 to-purple-900/70" copy={contentCopy}>
          <h1 className="font-heading text-4xl mt-5 mb-10">{props.title}</h1>
          <div className="post-content" dangerouslySetInnerHTML={{__html: props.postContent}}/>
        </Card>

        <Card title="Generation Prompt" copy={"Topic : "+props.topic + "\nKeywords : " + props.keywords}>
          <h1 className="text-xl mb-1 font-heading">Topic:</h1>
          <p className="mb-5 capitalize">{props.topic}</p>
          <h1 className="text-xl mb-1 font-heading">Keywords:</h1>
          <p className="mb-2 capitalize">{props.keywords}</p>
        </Card>
        <div className="w-auto flex">
          <button className={`${confirmDelete? "w-0 opacity-0 -z-10": "w-[268px] opacity-100 px-5"} transition-all whitespace-nowrap bg-red-800 text-white rounded-lg py-1`} onClick={()=>{setConfirmDelete(true)}} disabled={confirmDelete} >Delete Post</button>
          <button className={`${confirmDelete? "w-32 opacity-100": "w-0 opacity-0"} transition-all whitespace-nowrap bg-gray-400 text-white rounded-lg py-1 px-5 mr-3`} onClick={()=>{setConfirmDelete(false)}} >Cancel</button>
          <button className={`${confirmDelete? "w-32 opacity-100": "w-0 opacity-0"} transition-all whitespace-nowrap bg-red-800 text-white rounded-lg py-1 px-5 mr-6`} onClick={handlerDeleteConfirm} >Delete</button>
          <div className={`${confirmDelete? "w-auto opacity-100": "w-0 opacity-0"} transition-all whitespace-nowrap bg-red-700 text-white rounded-lg py-1 px-5`}> 
          <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
          Are you sure you want to delete? Delete action is irreversable.</div>
        </div>
      </div>;
}

Post.getLayout = function getLayout(page, pageProps){
  return(
    <AppLayout {...pageProps}>{page}</AppLayout>
  )
}//在需要layout部件的页面加上getLayout函数

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getCustomProps(ctx);
    const {user} = await getSession(ctx.req,ctx.res);
    const client = await clientPromise;
    const db = await client.db("BlogGenerator");
    const userProfile = await db.collection("users").findOne({
      auth0ID: user.sub,
    })

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postid),
      userID : userProfile._id,
    })

    if(!post){
      return{
        redirect:{
          destination:"/post/new",
          permanent:false,
        }
      }
    }
    return{
      props:{
        title:post.title,
        keywords: post.keywords,
        postContent: post.postContent,
        createdDate: post.createdDate.toString(),
        metaDescription: post.metaDescription,
        tags:post.tags,
        topic:post.topic,
        ...props, //spread operator传递其他props
      }
    }
}
});