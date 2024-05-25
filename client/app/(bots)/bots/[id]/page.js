import getBot from "@/lib/request/bots/getBot";
import getSeoData from "@/lib/request/bots/getSeoData";
import Content from "@/app/(bots)/bots/[id]/content";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const bot = await getBot(params.id).catch((error) => error);
  const seo = await getSeoData(params.id).catch((error) => error);
  if (typeof bot === "string") return;

  return {
    title: `Bot ${bot.username}`,
    description: bot.short_description,
    creator: bot.owner.username,
    keywords: seo.props.keywords,
    openGraph: {
      title: `Discord Place - ${bot.username} Bot`,
      description: bot.short_description,
    },
  };
}

export default async function Page({ params }) {
  const bot = await getBot(params.id).catch((error) => error);
  const seo = await getSeoData(params.id).catch((error) => error);
  if (typeof bot === "string")
    return redirect(`/error?message=${encodeURIComponent(bot)}`);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.props.ld) }}
        />
      </Head>
      <Content bot={bot} />
    </>
  );
}
