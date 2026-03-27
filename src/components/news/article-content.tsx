"use client";

import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import type { Json } from "@/lib/types/database";

interface ArticleContentProps {
  content: Json;
}

const extensions = [
  StarterKit,
  TiptapLink.configure({ openOnClick: false }),
  TiptapImage,
];

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content || typeof content !== "object") {
    return (
      <p className="text-gray/40">
        [ Contenido del artículo — administrable desde el CMS ]
      </p>
    );
  }

  let html: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html = generateHTML(content as any, extensions);
  } catch {
    return (
      <p className="text-gray/40">
        [ Error al renderizar el contenido ]
      </p>
    );
  }

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-gray prose-a:text-celeste prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-navy"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
