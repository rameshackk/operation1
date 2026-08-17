import React, { useRef, useEffect, useState } from 'react';

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write your article content here...',
  minHeight = '320px',
  language = 'ta'
}) {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const isTamil = language === 'ta';

  // Sync initial and external value updates without resetting cursor if focused
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
        updateCounts(editorRef.current.innerText || '');
      }
    }
  }, [value]);

  const updateCounts = (text) => {
    const clean = text.replace(/\s+/g, ' ').trim();
    const chars = text.length;
    const words = clean ? clean.split(/\s+/).length : 0;
    setCharCount(chars);
    setWordCount(words);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || '';
      updateCounts(text);
      if (onChange) {
        onChange(html);
      }
    }
  };

  const execute = (command, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, val);
      handleInput();
    }
  };

  const handleInsertLink = () => {
    const url = prompt(isTamil ? 'இணைப்பு URL உள்ளிடவும் (https://...):' : 'Enter link URL (https://...):');
    if (url) {
      execute('createLink', url);
    }
  };

  const handleInsertImage = () => {
    const url = prompt(isTamil ? 'படத்தின் URL உள்ளிடவும் (https://...):' : 'Enter Image URL (https://...):');
    if (url) {
      execute('insertImage', url);
    }
  };

  const handleFormatBlock = (tag) => {
    execute('formatBlock', tag);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm focus-within:border-amber-500 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs">
        {/* Headings */}
        <button
          type="button"
          onClick={() => handleFormatBlock('<h2>')}
          title="Heading 2"
          className="px-2.5 py-1 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('<h3>')}
          title="Heading 3"
          className="px-2.5 py-1 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('<p>')}
          title="Paragraph"
          className="px-2.5 py-1 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          ¶
        </button>

        <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Text Styles */}
        <button
          type="button"
          onClick={() => execute('bold')}
          title="Bold (Ctrl+B)"
          className="w-7 h-7 font-black rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execute('italic')}
          title="Italic (Ctrl+I)"
          className="w-7 h-7 italic font-serif font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execute('underline')}
          title="Underline (Ctrl+U)"
          className="w-7 h-7 underline font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => execute('strikeThrough')}
          title="Strikethrough"
          className="w-7 h-7 line-through font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center"
        >
          S
        </button>

        <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => execute('insertUnorderedList')}
          title="Bullet List"
          className="px-2 py-1 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execute('insertOrderedList')}
          title="Numbered List"
          className="px-2 py-1 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('<blockquote>')}
          title="Quote Block"
          className="px-2 py-1 font-serif font-black rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          “ Quote
        </button>

        <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Inserts */}
        <button
          type="button"
          onClick={handleInsertLink}
          title="Insert Link"
          className="px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold"
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={handleInsertImage}
          title="Insert Image"
          className="px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
        >
          🖼️ Image
        </button>

        <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Actions */}
        <button
          type="button"
          onClick={() => execute('removeFormat')}
          title="Clear Formatting"
          className="px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 text-[11px]"
        >
          🧹 Clean
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-4 sm:p-6 outline-none prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed overflow-y-auto text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-white empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
      />

      {/* Footer Word & Character Counter */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 font-medium font-mono">
        <span>
          {isTamil ? `${wordCount} சொற்கள்` : `${wordCount} words`} • {charCount} chars
        </span>
        <span>
          ⏱ ~{Math.max(1, Math.ceil(wordCount / (isTamil ? 130 : 180)))} {isTamil ? 'நிமிடம் வாசிக்க' : 'min read'}
        </span>
      </div>
    </div>
  );
}
