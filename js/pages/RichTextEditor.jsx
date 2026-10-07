import React, { useState, useEffect, useRef } from 'react';

function RichTextEditor({ value, onChange, placeholder, language = 'ta', minHeight = '360px' }) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const isTamil = language === 'ta';
  const isInitialized = useRef(false);

  // Set initial HTML content once on mount
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, []);

  // Sync external value changes (e.g. after auto-translate or load)
  useEffect(() => {
    if (editorRef.current && isInitialized.current) {
      const current = editorRef.current.innerHTML;
      if (current !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const exec = (cmd, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt(isTamil ? 'இணைக்கப்பட வேண்டிய URL முகவரியை உள்ளிடவும்:' : 'Enter URL to link:');
    if (url) exec('createLink', url.startsWith('http') ? url : `https://${url}`);
  };

  const handleImagePrompt = () => {
    const choice = window.confirm(isTamil ? 'இணையதள பட URL உள்ளிட [OK] அழுத்தவும் அல்லது கணினியிலிருந்து படத்தை பதிவேற்ற [Cancel] அழுத்தவும்:' : 'Click [OK] to enter an Image URL, or [Cancel] to upload from your device:');
    if (choice) {
      const url = window.prompt(isTamil ? 'படத்தின் URL முகவரி:' : 'Enter Image URL:');
      if (url) exec('insertImage', url);
    } else {
      if (imageInputRef.current) imageInputRef.current.click();
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      let insertedUrl = dataUrl;
      try {
        const token = localStorage.getItem('supabase.auth.token') || '';
        const res = await fetch('/api/admin/articles?action=upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileData: dataUrl,
            fileName: file.name,
            fileType: file.type || 'image/jpeg',
            folder: 'articles/inline'
          })
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.url) {
            insertedUrl = json.data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('RichTextEditor inline image upload note:', uploadErr);
      }

      exec('insertImage', insertedUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-950 shadow-sm focus-within:border-amber-500 transition-colors">
      {/* Hidden Image File Uploader */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-wrap items-center gap-1.5 text-xs select-none">

        {/* 1. History (Undo / Redo) */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'செயல்தவிர் (Undo)' : 'Undo'}
            onMouseDown={e => { e.preventDefault(); exec('undo'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ↶
          </button>
          <button
            type="button"
            title={isTamil ? 'மீண்டும் செய் (Redo)' : 'Redo'}
            onMouseDown={e => { e.preventDefault(); exec('redo'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ↷
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 2. Font Family Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-bold hidden sm:inline">Font:</span>
          <select
            onChange={e => exec('fontName', e.target.value)}
            defaultValue="'Book Antiqua', Palatino, serif"
            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer max-w-[120px]"
            title={isTamil ? 'எழுத்து நடை (Font Family)' : 'Font Family'}
          >
            <option value="'Book Antiqua', Palatino, serif">Book Antiqua</option>
            <option value="'Inter', sans-serif">Inter (Sans-Serif)</option>
            <option value="'Noto Serif Tamil', serif">Tamil Classical</option>
            <option value="'Georgia', serif">Georgia (Serif)</option>
            <option value="'Courier New', monospace">Monospace</option>
          </select>
        </div>

        {/* 3. Font Size Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-bold hidden sm:inline">Size:</span>
          <select
            onChange={e => exec('fontSize', e.target.value)}
            defaultValue="3"
            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            title={isTamil ? 'எழுத்து அளவு (Font Size)' : 'Font Size'}
          >
            <option value="1">12px (Small)</option>
            <option value="2">14px (Regular)</option>
            <option value="3">16px (Base Body)</option>
            <option value="4">18px (Medium)</option>
            <option value="5">24px (Large Heading)</option>
            <option value="6">32px (Huge Title)</option>
          </select>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 4. Basic Typography Formats */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onMouseDown={e => { e.preventDefault(); exec('bold'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 font-black transition-colors flex items-center justify-center"
          >
            B
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onMouseDown={e => { e.preventDefault(); exec('italic'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 italic font-bold transition-colors flex items-center justify-center"
          >
            I
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onMouseDown={e => { e.preventDefault(); exec('underline'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 underline font-bold transition-colors flex items-center justify-center"
          >
            U
          </button>
          <button
            type="button"
            title="Strikethrough"
            onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}
            className="w-7 h-7 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 line-through font-bold transition-colors flex items-center justify-center"
          >
            S
          </button>
        </div>

        {/* 5. Colors (Text & Highlight) */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200/80 dark:border-slate-700/80">
          {/* Text Color Picker */}
          <label className="relative flex items-center justify-center w-7 h-7 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={isTamil ? 'எழுத்து நிறம் (Text Color)' : 'Text Color'}>
            <span className="text-xs font-black border-b-2 border-amber-500">A</span>
            <input
              type="color"
              defaultValue="#0f172a"
              onChange={e => exec('foreColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {/* Highlight Color Picker */}
          <label className="relative flex items-center justify-center w-7 h-7 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={isTamil ? 'பின்னணி நிறம் / சிறப்பம்சம் (Highlight Color)' : 'Highlight Background'}>
            <span className="text-xs">🖍️</span>
            <input
              type="color"
              defaultValue="#fef08a"
              onChange={e => exec('hiliteColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 6. Block Structure Formats */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title="Heading 1"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h1'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H1
          </button>
          <button
            type="button"
            title="Heading 2"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H2
          </button>
          <button
            type="button"
            title="Heading 3"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H3
          </button>
          <button
            type="button"
            title="Paragraph Text"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            P
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 7. Text Alignment */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'இடது சீரமைப்பு (Align Left)' : 'Align Left'}
            onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'மைய சீரமைப்பு (Align Center)' : 'Align Center'}
            onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'வலது சீரமைப்பு (Align Right)' : 'Align Right'}
            onMouseDown={e => { e.preventDefault(); exec('justifyRight'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M10 12h10M6 18h14" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'முழு சீரமைப்பு (Justify)' : 'Justify Text'}
            onMouseDown={e => { e.preventDefault(); exec('justifyFull'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 8. Lists & Indentation */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'புல்லட் பட்டியல் (Bullet List)' : 'Bullet List'}
            onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><circle cx="2" cy="4" r="1.5" /><rect x="5" y="3" width="10" height="2" /><circle cx="2" cy="8" r="1.5" /><rect x="5" y="7" width="10" height="2" /><circle cx="2" cy="12" r="1.5" /><rect x="5" y="11" width="10" height="2" /></svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'எண் வரிசைப் பட்டியல் (Numbered List)' : 'Numbered List'}
            onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><text x="0" y="5" fontSize="5" fontFamily="monospace">1.</text><rect x="5" y="3" width="10" height="2" /><text x="0" y="10" fontSize="5" fontFamily="monospace">2.</text><rect x="5" y="7" width="10" height="2" /><text x="0" y="15" fontSize="5" fontFamily="monospace">3.</text><rect x="5" y="11" width="10" height="2" /></svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'உள்தள்ளலை குறைக்கவும் (Outdent)' : 'Decrease Indent'}
            onMouseDown={e => { e.preventDefault(); exec('outdent'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ⇤
          </button>
          <button
            type="button"
            title={isTamil ? 'உள்தள்ளலை அதிகரிக்கவும் (Indent)' : 'Increase Indent'}
            onMouseDown={e => { e.preventDefault(); exec('indent'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ⇥
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 9. Rich Media & Publishing Elements */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            title={isTamil ? 'முக்கிய மேற்கோள் பெட்டி (Blockquote)' : 'Blockquote Quote Box'}
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'blockquote'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-serif font-black text-sm"
          >
            “
          </button>
          <button
            type="button"
            title={isTamil ? 'பிரிக்கும் கோடு (Divider Line)' : 'Horizontal Divider (<hr />)'}
            onMouseDown={e => { e.preventDefault(); exec('insertHorizontalRule'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-xs"
          >
            ―
          </button>
          <button
            type="button"
            title={isTamil ? 'இணைப்புச் சேர் (Insert Link)' : 'Insert Hyperlink'}
            onMouseDown={e => { e.preventDefault(); handleLink(); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'படம் அல்லது விளக்கப்படம் சேர் (Insert Image)' : 'Insert Image / Chart'}
            onMouseDown={e => { e.preventDefault(); handleImagePrompt(); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <button
            type="button"
            title={isTamil ? 'வடிவமைப்பை நீக்கு (Clear All Formatting)' : 'Clear Formatting'}
            onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="editor-rich-content w-full px-6 py-5 text-sm text-slate-900 dark:text-white leading-relaxed outline-none prose dark:prose-invert max-w-none
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-600 dark:text-slate-400 [&:empty]:before:pointer-events-none"
      />
    </div>
  );
}


export default RichTextEditor;
export { RichTextEditor };
