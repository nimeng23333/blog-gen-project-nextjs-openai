import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { AppLayout } from "../components/AppLayout";
import { getCustomProps } from "../utils/getCustomProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Success(props) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-5">
      <div className="flex flex-col items-center w-auto h-auto border-2 border-gray-600 rounded-2xl px-10 py-7 text-center shadow-2xl bg-gradient-to-t from-sky-500/20 to-pink-500/20">
        <h1 className="text-8xl mb-10 mt-5 text-zinc-800 drop-shadow-lg font-bold">Thank you for your purchasing!</h1>
        <p className="text-2xl mb-3 text-zinc-600">{props.availableTokens} Tokens now available, continue to generate post!</p>
        <div className="mt-5 animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center">
          <Link href="/post/new">
            <FontAwesomeIcon icon={faChevronDown} className="text-zinc-700" />
          </Link>
        </div>
      </div>
    </div>)
    ;
}

Success.getLayout = function getLayout(page, pageProps){
  return(
    <AppLayout {...pageProps}>{page}</AppLayout>
  )
}//在需要layout部件的页面加上getLayout函数

export const getServerSideProps = withPageAuthRequired({ //注意这里传参，小括号里跟花括号
  async getServerSideProps(ctx) {
    const props = await getCustomProps(ctx);
    return {
      props
    }
}});