import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState } from "react";
import { AppLayout } from "../../components/AppLayout";


export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeyWords] = useState("");
    const handleSubmit = async (e) =>{
      e.preventDefault();
      const res = await fetch("/api/generatePost",
      {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({topic,keywords}),
      });
      const data = await res.json();
      // console.log(data);
      // setPostContent(data.post.postContent);
    }
    return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="font-medium text-xl">Generate a blog post on the topic of:</label>
          <textarea className="textarea-control" onChange={e => {setTopic(e.target.value)}} value={topic}></textarea>
        </div>
        <div>
          <label className="font-medium text-xl">Targeting the following keywords:</label>
          <textarea className="textarea-control" onChange={e => {setKeyWords(e.target.value)}} value={keywords}></textarea>
        </div>
        <button className="btn" type="submit">Generate</button>
      </form>
      {/* <div className="max-w-screen-sm p-10" dangerouslySetInnerHTML={{__html:postContent}}></div> */}
    </div>
      )
}

NewPost.getLayout = function getLayout(page, pageProps){
  return(
    <AppLayout {...pageProps}>{page}</AppLayout>
  )
}//在需要layout部件的页面加上getLayout函数

export const getServerSideProps = withPageAuthRequired(() =>{
  return {
    props:{},
  };
});