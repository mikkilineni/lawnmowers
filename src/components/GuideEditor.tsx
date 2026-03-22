"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const btn = (active: boolean): React.CSSProperties => ({
  background: active ? "var(--dark, #1c2e0e)" : "transparent",
  color: active ? "white" : "var(--dark, #1c2e0e)",
  border: "1px solid #ddd",
  borderRadius: 5,
  padding: "4px 10px",
  fontSize: "0.78rem",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
});

export function GuideEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your guide content here…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync when value changes externally (switching guides)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", background: "white" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 10px",
        borderBottom: "1px solid #eee", background: "#fafafa",
      }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btn(editor.isActive("bold"))}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btn(editor.isActive("italic"))}><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={btn(editor.isActive("strike"))}><s>S</s></button>
        <div style={{ width: 1, background: "#ddd", margin: "0 4px" }} />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btn(editor.isActive("heading", { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btn(editor.isActive("heading", { level: 3 }))}>H3</button>
        <div style={{ width: 1, background: "#ddd", margin: "0 4px" }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btn(editor.isActive("bulletList"))}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btn(editor.isActive("orderedList"))}>1. List</button>
        <div style={{ width: 1, background: "#ddd", margin: "0 4px" }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btn(editor.isActive("blockquote"))}>❝</button>
        <button type="button" onClick={addLink} style={btn(editor.isActive("link"))}>🔗 Link</button>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} style={btn(false)} title="Remove link">Unlink</button>
        <div style={{ width: 1, background: "#ddd", margin: "0 4px" }} />
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btn(false)}>─ HR</button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} style={btn(false)}>↩</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} style={btn(false)}>↪</button>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{ minHeight: 320, padding: "1rem 1.25rem", fontSize: "0.93rem", lineHeight: 1.75 }}
      />

      <style>{`
        .tiptap { outline: none; }
        .tiptap p { margin: 0 0 0.9rem; }
        .tiptap h2 { font-size: 1.3rem; font-weight: 700; margin: 1.4rem 0 0.6rem; }
        .tiptap h3 { font-size: 1.1rem; font-weight: 700; margin: 1.2rem 0 0.5rem; }
        .tiptap ul, .tiptap ol { padding-left: 1.4rem; margin: 0 0 0.9rem; }
        .tiptap li { margin-bottom: 0.3rem; }
        .tiptap blockquote { border-left: 3px solid #a8d832; padding-left: 1rem; color: #666; margin: 0.9rem 0; }
        .tiptap hr { border: none; border-top: 1px solid #eee; margin: 1.2rem 0; }
        .tiptap a { color: #1a6b2a; text-decoration: underline; }
        .tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #aaa; pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  );
}
