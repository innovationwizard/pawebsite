"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  Minus,
} from "lucide-react";
import type { Json } from "@/lib/types/database";

interface RichTextEditorProps {
  content: Json | null;
  onChange: (content: Json) => void;
  label?: string;
}

export function RichTextEditor({
  content,
  onChange,
  label = "Contenido",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-celeste underline" },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full" },
      }),
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: (content as any) ?? { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Json);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none prose-headings:font-heading prose-headings:text-navy",
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL del enlace:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("URL de la imagen:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      <div className="overflow-hidden rounded-xl border border-gray/20">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-0.5 border-b border-gray/10 bg-off-white p-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            icon={Bold}
            label="Negrita"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            icon={Italic}
            label="Cursiva"
          />
          <div className="mx-1 w-px bg-gray/15" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            label="Título 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            label="Título 3"
          />
          <div className="mx-1 w-px bg-gray/15" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            icon={List}
            label="Lista"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            icon={ListOrdered}
            label="Lista numerada"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            icon={Quote}
            label="Cita"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={Minus}
            label="Línea horizontal"
          />
          <div className="mx-1 w-px bg-gray/15" />
          <ToolbarButton onClick={addLink} icon={LinkIcon} label="Enlace" />
          <ToolbarButton onClick={addImage} icon={ImageIcon} label="Imagen" />
          <div className="mx-1 w-px bg-gray/15" />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            label="Deshacer"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            label="Rehacer"
          />
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-celeste/10 text-celeste"
          : "text-gray hover:bg-gray/10 hover:text-navy"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
