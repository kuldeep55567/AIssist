import Hero from "../demo/hero";
import VideoIntro from "../demo/video-intro";
import Feature from "../demo/feature";
import MobileConvenience from "../demo/mobile-convenience";
// import { Footer } from "@/components";
import Testimonials from "../demo/testimonials";
import Faqs from "../demo/faqs";
export default function Home() {
  return (
<div>
<>
      <Hero />
      <VideoIntro />
      <Feature />
      <MobileConvenience />
      <Testimonials />
      <Faqs />
      {/* <Footer/> */}
    </>
</div>
  );
}
