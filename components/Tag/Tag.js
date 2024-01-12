import { faCheck, faHashtag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";

export const Tag = (props)=>{
    const [effect, setEffect] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const tagClick = async (e) => {
        setX(e.clientX - e.currentTarget.getBoundingClientRect().x);
        setY(e.clientY - e.currentTarget.getBoundingClientRect().y);
        setEffect(true);
        setTimeout(()=>setEffect(false),400);
        try {
            await navigator.clipboard.writeText(props.tag);
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 500);
          } catch (err) {
            console.log(err);
          }
    }
    return(
        <>
            <button onClick={tagClick} className="relative rounded-3xl bg-cyan-700/80 inline-flex p-2 items-center px-3 my-2 mr-2 overflow-hidden">
            {effect && <span className="rounded-full bg-white absolute h-7 w-7 animate-ripple" style={{top:y,left:x}}></span>}
            <FontAwesomeIcon icon={isCopied? faCheck : faHashtag} className="text-white mr-1" />
            <span className="text-white text-base">{isCopied? "Copied" : props.tag}</span>
            </button>
        </>
    )
}