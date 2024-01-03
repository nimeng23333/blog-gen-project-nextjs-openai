import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopUp() {
    return <div>this is the token top up page</div>;
}

TokenTopUp.getLayout = function getLayout(page, pageProps){
  return(
    <AppLayout {...pageProps}>{page}</AppLayout>
  )
}//在需要layout部件的页面加上getLayout函数

export const getServerSideProps = withPageAuthRequired(() =>{
  return {
    props:{},
  };
});