import type { Metadata } from "next";
import OurMissionPage from "@/app/our-mission/page";

export const metadata: Metadata = {
  title: "About | dude.box",
  description:
    "A veteran circular economy built around durable gear, good stories, and measurable impact.",
};

export default function AboutPage() {
  return <OurMissionPage />;
}
