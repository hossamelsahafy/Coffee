import { notFound } from "next/navigation";

import GetDataBySlug from "@/actions/GetDataBySlug";
import SingleNoteClient from "@/components/ui/Notes/Slug/SingleNoteClient";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;

  const note = await GetDataBySlug("Notes", slug, locale);

  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  const isAr = locale === "ar";

  return {
    title: isAr ? note.titleAr : note.title,
    description: isAr ? note.desAr : note.des,
  };
}

export default async function SingleNotePage({ params }) {
  const { slug, locale } = await params;

  const note = await GetDataBySlug("Notes", slug, locale);

  if (!note) {
    notFound();
  }

  return <SingleNoteClient note={note} locale={locale} />;
}
