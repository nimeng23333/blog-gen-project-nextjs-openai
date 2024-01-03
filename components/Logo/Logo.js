import { faBrain } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Logo = ()=>{
    return(
        <div className="font-heading text-3xl text-center py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-500">BlogGenerator
            <FontAwesomeIcon icon={faBrain} className="text-blue-400/60 ml-2" />
        </div>
    )
}