import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";
import { PostList } from "../PostList";
import { useContext, useEffect, useState } from "react";
import PostContext from "../../context/postsContext";

export const AppLayout = ({children,...rest}) =>{
    const {user} = useUser(); //通过useUser调用auth0提供的user信息
    const [loading, setLoading] = useState(false);

    const {setPostsFromSSR, posts, getPosts, noMorePosts} = useContext(PostContext); //通过useContext读取PostContext中的信息，解构setPostFromSSR函数及传递过来的posts

    const pageLoading = () =>{
        setLoading(true);
    }

    useEffect(()=>{
        setPostsFromSSR(rest.posts);
        if(rest.postID){
            const exist = rest.posts.find((p) => p._id === rest.postID);
            if(!exist){
                getPosts({getNewerPosts:true,lastPostDate:rest.createdDate})
            }
        }
        setLoading(false);
    },[rest.posts, setPostsFromSSR,getPosts,rest.postID,rest.createdDate]);//一旦服务器传递的posts及setPostsFromSSR函数改变，就重新调用setPostsFromSSR(rest.posts)

    return(
        <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
            <div className="flex flex-col overflow-hidden text-white">
                <div className="bg-zinc-900 p-2">
                    <div>
                        <Logo />
                    </div>
                    <Link href="/post/new" className="btn" onClick={pageLoading}>New Post</Link>
                    <Link href="/token-topup" className="block text-center py-2" onClick={pageLoading} > 
                    <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-1" />
                    <span className="pl-1 hover:underline">{rest.availableTokens} tokens available</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto bg-gradient-to-b from-zinc-900 to-slate-700 px-2">
                    {posts.map(({_id,title}) => (<PostList onClick={pageLoading} title={title} key={_id} router={_id} active={_id == rest.postID} />))}
                    {!noMorePosts && <div className="text-center cursor-pointer hover:underline text-slate-500" onClick={()=>{getPosts({lastPostDate: posts[posts.length-1].createdDate})}}>Load more posts</div>}
                </div>
                <div className="bg-slate-700 flex items-center gap-3 border-t border-t-black/50 h-20 px-2">
                {!!user ? (<>
                            <div className="min-w-[50px]">
                                <Image src={user.picture.replace('s.gravatar.com', 'cravatar.cn')} alt={user.name} height={50} width={50} className="rounded-full" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium font-heading text-xl">{user.name}</div>
                                <Link href="/api/auth/logout" className="text-sm">Logout</Link>
                            </div>
                        </>):(<Link href="/api/auth/login">Login</Link>)}
                </div>
            </div>
            <div className="flex flex-col items-center py-20 overflow-auto">
                {loading && <div className="fixed flex top-0 left-80">
                    <span className="animate-loading text-4xl text-indigo-600">.</span>
                    <span className="animate-loading text-4xl text-blue-600" style={{"animation-delay":"75ms"}}>.</span>
                    <span className="animate-loading delay-300 text-4xl text-cyan-600"style={{"animation-delay":"150ms"}}>.</span>
                    </div>}
                {children}
                </div>
        </div>
    )
}