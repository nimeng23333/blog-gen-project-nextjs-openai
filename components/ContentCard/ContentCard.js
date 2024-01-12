import { Copy } from "../../components/ClipboardCopy";

export const Card = (props)=>{
    return(
        <div className={props.gradient?("content-container " + props.gradient ): "content-container from-purple-900/70 to-cyan-600/70"} >
          <div className="section-title">
              {props.title}
              <Copy copyText={props.copy} />
          </div>
          <div className="section-content">
            {props.children}
          </div>
        </div>
    )
}