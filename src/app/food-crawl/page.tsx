import { redirect } from "next/navigation";

/** The hub has no content of its own — the coffee crawl is the default face of it. */
export default function FoodCrawlIndex() {
  redirect("/food-crawl/coffee");
}
