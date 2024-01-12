import Link from "next/link"


export const PostList = (props) =>{
    return(
    <div className={(props.active? " border-slate-200 bg-slate-200/20" :" border-slate-700") + " mb-2 border-2 rounded-md w-full px-2 py-1 hover:bg-slate-700/50"} >
        <Link className="hover:underline block truncate" href={`/post/${props.router}`} onClick={props.onClick}>{props.title}</Link>
    </div>)
}