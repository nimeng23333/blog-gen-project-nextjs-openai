import React,{useCallback, useReducer, useState} from 'react';

const PostContext = React.createContext({});

export default PostContext;

function postsReducer (state,action){
    switch(action.type){
        case"addPosts":{
            const newPosts = [...state];
            action.posts.forEach(post => {
                const exist = newPosts.find((p) => p._id === post._id);
                if(!exist){
                    newPosts.push(post);
                }
            });
            return newPosts;
        }
        case"deletePosts":{
            const newPosts = [];
            state.forEach((post)=>{
                if(post._id !== action.postID){
                    newPosts.push(post);
                }
            })
            return newPosts;}
        default:
            return state;
    }
}

export const PostProvider = ({children})=>{
    const [posts, dispatch] = useReducer(postsReducer,[]);
    const [noMorePosts, setNoMorePosts] = useState(false);

    const deletePost = useCallback((postID)=>{
        dispatch({
            type:"deletePosts",
            postID
        })
    },[])

    const setPostsFromSSR = useCallback((postsFromSSR=[]) =>{
        if(postsFromSSR.length<5){
            setNoMorePosts(true);
        }
        dispatch({
            type:"addPosts",
            posts:postsFromSSR,
        })
    },[]);

    const getPosts = useCallback(async({lastPostDate,getNewerPosts = false})=>{
        const res = await fetch("/api/getPostsFromDB",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({lastPostDate, getNewerPosts})
        });
        const data = await res.json();
        const postsFromDB = data.posts || [];
        if(postsFromDB.length <5){
            setNoMorePosts(true);
        }
        dispatch({
            type:"addPosts",
            posts:postsFromDB,
        });
    },[])

    return(
        <PostContext.Provider value={{posts, setPostsFromSSR, getPosts, noMorePosts, deletePost}} >
            {children}
        </PostContext.Provider>
    )
}