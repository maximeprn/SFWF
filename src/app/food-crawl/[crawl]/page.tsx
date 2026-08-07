import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrawlScreen } from "@/components/sections/crawl/CrawlScreen";
import { CRAWLS, CRAWL_KEYS } from "@/content/crawls";
import type { CrawlKey } from "@/content/types";

const isCrawlKey = (value: string): value is CrawlKey =>
  (CRAWL_KEYS as readonly string[]).includes(value);

export function generateStaticParams() {
  return CRAWL_KEYS.map((crawl) => ({ crawl }));
}

export async function generateMetadata({
  params,
}: PageProps<"/food-crawl/[crawl]">): Promise<Metadata> {
  const { crawl } = await params;
  if (!isCrawlKey(crawl)) return {};
  const c = CRAWLS[crawl];
  return {
    title: c.tab,
    description: c.intro,
    alternates: { canonical: `/food-crawl/${crawl}` },
  };
}

export default async function FoodCrawlPage({ params }: PageProps<"/food-crawl/[crawl]">) {
  const { crawl } = await params;
  if (!isCrawlKey(crawl)) notFound();
  return <CrawlScreen which={crawl} />;
}
