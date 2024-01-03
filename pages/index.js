import heroImage from "../public/hero.jpg";
import { Logo } from "../components/Logo";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
  <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
    <Image src={heroImage} alt="hero" fill className="absolute w-full h-full" />
    <div className="z-10 text-white px-10 py-5 bg-gradient-to-tr from-zinc-500/50 to-indigo-900/90 w-1/3 min-h-min text-center rounded-md backdrop-blur-sm">
    <Logo></Logo>
    <p className="pb-4">The AI-powered SAAS solution to generate SEO-optimized blog posts in minutes. Get high-quality content, without sacrificing your time.</p>
    <Link href="/post/new" className="btn">Begin</Link>
    </div>

</div>);
}
