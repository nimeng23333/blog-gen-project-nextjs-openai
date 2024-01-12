import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { getCustomProps } from "../../utils/getCustomProps";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeyWords] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch("/api/generatePost",
      {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({topic,keywords}),
      });
      const data = await res.json();
      if(data?.postID){
        router.push(`/post/${data.postID}`)
      }
    }catch(e){
      setLoading(true);
    }
  }
  return (
  <div className="w-2/3 h-full flex-col justify-center items-center flex ">
    {loading && (<div className="text-cyan-600 justify-center flex flex-col animate-pulse">
      <FontAwesomeIcon icon={faBrain} className="text-9xl mb-2" />
      <p className="pl-5 text-2xl">Generating Post...</p>
      </div>)}
    {!loading && (<form onSubmit={handleSubmit} className="border border-gray-200 bg-gray-100 w-5/6 h-auto rounded-lg shadow-xl flex flex-col justify-between p-5">
      <div className="w-full mb-4">
        <label className="text-xl">Generate a blog post on the topic of:</label>
        <textarea className="textarea-control" onChange={e => {setTopic(e.target.value)}} value={topic} maxLength={200}></textarea>
      </div>
      <div className="w-full mb-4">
        <label className="text-xl">Targeting the following keywords:</label>
        <textarea className="textarea-control" onChange={e => {setKeyWords(e.target.value)}} value={keywords} maxLength={200}></textarea>
        <span className="text-sm">Seperated by comma(,)</span>
      </div>
      <button className="btn" type="submit" disabled={!keywords.trim() || !topic.trim()} >Generate</button>
    </form>)}

  </div>
    )
}

NewPost.getLayout = function getLayout(page, pageProps){
  return(
    <AppLayout {...pageProps}>{page}</AppLayout>
  )
}//在需要layout部件的页面加上getLayout函数

export const getServerSideProps = withPageAuthRequired({ //注意这里传参，小括号里跟花括号
  async getServerSideProps(ctx) {
    const props = await getCustomProps(ctx);

    if(!props.availableTokens){
      return{
        redirect:{
          destination:"/token-topup",
          permanent:false,
        }
    }}
    return {
      props
    }
}});