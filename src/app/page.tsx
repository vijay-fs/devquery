import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CapabilityStrip from "@/components/CapabilityStrip";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Engagement from "@/components/Engagement";
import Approach from "@/components/Approach";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Nav />
      <main>
        <Hero />
        <CapabilityStrip />
        <Services />
        <Products />
        <Engagement />
        <Approach />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
