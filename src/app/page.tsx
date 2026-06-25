import { Hero } from "@/components/home/Hero";
import { FeaturedRail } from "@/components/home/FeaturedRail";
import { CategoryBento } from "@/components/home/CategoryBento";
import { CraftEditorial } from "@/components/home/CraftEditorial";
import { BestSellers } from "@/components/home/BestSellers";
import { MembershipBanner } from "@/components/home/MembershipBanner";
import { Marquee } from "@/components/ui/Marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee
        items={[
          "Free 48-hour shipping",
          "Authenticity guaranteed",
          "30-day returns",
          "Carbon-neutral delivery",
          "Members-only drops",
        ]}
      />
      <FeaturedRail />
      <CategoryBento />
      <CraftEditorial />
      <BestSellers />
      <MembershipBanner />
    </>
  );
}
