import { useState } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Copy = ({ copyText }) => {
    const [isCopied, setIsCopied] = useState(false);
    // onClick handler function for the copy button
    const handleCopyClick = async () => {
      try {
        await navigator.clipboard.writeText(copyText);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 500);
      } catch (err) {
        console.log(err);
      }
    }
  
    return (
      <>
        <button onClick={handleCopyClick}>
          <span className="text-white">{isCopied ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faCopy}/>}</span>
        </button>
      </>
    );
  }