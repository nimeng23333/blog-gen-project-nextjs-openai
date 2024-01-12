import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getCustomProps } from "../utils/getCustomProps";

export default function TokenTopUp() {
    async function handleClick(){
      const res =  await fetch("/api/addToken",{method:"POST"})
      const data = await res.json();
      window.location.href=data.session.url;
    }
    return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-auto h-auto border-2 border-gray-600 rounded-2xl px-10 py-7 text-center shadow-2xl bg-gradient-to-t from-sky-500/20 to-pink-500/20">
        <h1 className="text-5xl mb-5 text-white drop-shadow-lg font-bold">Token Topup</h1>
        <p className="text-8xl mb-3">$0.99<span className="text-3xl text-gray-600"> / 10 Tokens</span></p>
        <ul>
          <li>10 posts generation</li>
          <li>Phone and email support</li>
          <li>Help center access</li>
        </ul>
        <button className="btn mt-5" onClick={handleClick} >Add Token</button>
      </div>
    </div>);
}

TokenTopUp.getLayout = function getLayout(page, pageProps){
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