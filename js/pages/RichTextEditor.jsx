import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Robust HTML sanitizer and converter for pasted content from MS Word, Google Docs, and Web Pages.
 * Preserves exact formatting: Headings, Bold, Italic, Underline, Font Sizes, Font Families,
 * Colors, Background Highlights, Alignments, Lists, Tables, and Images.
 */
function cleanPastedWordHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  let html = rawHtml;

  // 1. Remove Office & Word conditional comments and meta tags
  html = html.replace(/<!--\[if[\s\S]*?\]>[\s\S]*?<!\[endif\]-->/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<xml[\s\S]*?<\/xml>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<meta[\s\S]*?>/gi, '');
  html = html.replace(/<link[\s\S]*?>/gi, '');
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');

  // 2. Convert Word headings (e.g. class="MsoHeading1") to standard semantic headings
  html = html.replace(/<p[^>]*class=["']?MsoHeading1["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h1 class="text-2xl sm:text-3xl font-bold my-4">$1</h1>');
  html = html.replace(/<p[^>]*class=["']?MsoHeading2["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h2 class="text-xl sm:text-2xl font-bold my-3">$1</h2>');
  html = html.replace(/<p[^>]*class=["']?MsoHeading3["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h3 class="text-lg sm:text-xl font-bold my-2.5">$1</h3>');
  html = html.replace(/<p[^>]*class=["']?MsoTitle["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h1 class="text-3xl font-extrabold my-4">$1</h1>');
  html = html.replace(/<p[^>]*class=["']?MsoSubtitle["']?[^>]*>([\s\S]*?)<\/p>/gi, '<h4 class="text-base font-semibold text-slate-500 my-2">$1</h4>');

  // 3. Clean MSO-specific attributes while strictly preserving standard inline styles
  html = html.replace(/\s+mso-[^:]+:[^;"]+;?/gi, '');
  html = html.replace(/\s+tab-stops:[^;"]+;?/gi, '');
  html = html.replace(/\s+v:[a-z]+="[^"]*"/gi, '');
  html = html.replace(/\s+o:[a-z]+="[^"]*"/gi, '');
  html = html.replace(/\s+w:[a-z]+="[^"]*"/gi, '');

  // 4. Ensure images are clean and responsive
  html = html.replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
    // Retain src, alt, title, and style
    if (!attrs.includes('class=')) {
      return `<img ${attrs} class="max-w-full h-auto rounded-xl my-4 shadow-md border border-slate-200/80 dark:border-slate-800" loading="lazy" />`;
    }
    return match;
  });

  // 5. Ensure tables have proper responsive styling
  html = html.replace(/<table\b([^>]*)>/gi, (match, attrs) => {
    return `<div class="overflow-x-auto my-4"><table ${attrs} class="w-full border-collapse border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">`;
  });
  html = html.replace(/<\/table>/gi, '</table></div>');

  return html;
}

function RichTextEditor({ value, onChange, placeholder, language = 'ta', minHeight = '380px' }) {
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
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyCustomFontSize = (pxSize) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    if (range.collapsed) {
      exec('fontSize', '3');
      return;
    }

    const span = document.createElement('span');
    span.style.fontSize = `${pxSize}px`;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    
    // Normalize selection
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);

    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyCustomFontFamily = (fontFamily) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    exec('fontName', fontFamily);
  };

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImageAtCursor = (imageUrl) => {
    if (!imageUrl) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const imgHtml = `<p><img src="${imageUrl}" alt="Article Image" class="max-w-full h-auto rounded-2xl my-4 shadow-md border border-slate-200/80 dark:border-slate-800" loading="lazy" /></p><p><br></p>`;
    document.execCommand('insertHTML', false, imgHtml);
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const uploadImageFile = async (file) => {
    if (!file) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result;
        if (!dataUrl) return resolve(null);

        // Attempt server-side upload to Supabase storage if user is authenticated
        try {
          const token = localStorage.getItem('supabase.auth.token') || '';
          const res = await fetch('/api/admin/articles?action=upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              fileData: dataUrl,
              fileName: file.name || `pasted_image_${Date.now()}.png`,
              fileType: file.type || 'image/png',
              folder: 'articles/inline'
            })
          });
          if (res.ok) {
            const json = await res.json();
            if (json?.data?.url) {
              return resolve(json.data.url);
            }
          }
        } catch (uploadErr) {
          console.warn('RichTextEditor inline upload note:', uploadErr);
        }

        // Fallback to embedded high-resolution data URL
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  // ================= 1. ADVANCED CLIPBOARD PASTE HANDLER =================
  const handlePaste = async (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    // A. Check if an image file is in clipboard (e.g. screenshot or copied image file)
    const items = clipboardData.items;
    let foundImage = false;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          foundImage = true;
          const blob = items[i].getAsFile();
          if (blob) {
            const uploadedUrl = await uploadImageFile(blob);
            if (uploadedUrl) {
              insertImageAtCursor(uploadedUrl);
            }
          }
          break;
        }
      }
    }

    if (foundImage) return;

    // B. Check for Rich HTML (from Microsoft Word, Google Docs, Web Pages)
    const htmlData = clipboardData.getData('text/html');
    if (htmlData && htmlData.trim()) {
      e.preventDefault();
      const cleanedHtml = cleanPastedWordHtml(htmlData);
      document.execCommand('insertHTML', false, cleanedHtml);
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      return;
    }

    // C. Fallback: Standard plain text with paragraph structure
    const textData = clipboardData.getData('text/plain');
    if (textData) {
      e.preventDefault();
      const formattedText = textData
        .split(/\r\n|\n\r|\n|\r/)
        .map(line => line.trim() ? `<p>${line}</p>` : '<p><br></p>')
        .join('');
      document.execCommand('insertHTML', false, formattedText);
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  // ================= 2. DRAG AND DROP IMAGE HANDLER =================
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          const url = await uploadImageFile(files[i]);
          if (url) {
            insertImageAtCursor(url);
          }
        }
      }
    }
  };

  const handleLink = () => {
    const url = window.prompt(isTamil ? 'இணைக்கப்பட வேண்டிய URL முகவரியை உள்ளிடவும்:' : 'Enter URL to link:');
    if (url) {
      exec('createLink', url.startsWith('http') ? url : `https://${url}`);
    }
  };

  const handleImagePrompt = () => {
    const choice = window.confirm(
      isTamil
        ? 'இணையதள பட URL உள்ளிட [OK] அழுத்தவும் அல்லது உங்கள் சாதனத்திலிருந்து படத்தை பதிவேற்ற [Cancel] அழுத்தவும்:'
        : 'Click [OK] to enter an Image URL, or [Cancel] to upload from your device:'
    );
    if (choice) {
      const url = window.prompt(isTamil ? 'படத்தின் URL முகவரி:' : 'Enter Image URL:');
      if (url) insertImageAtCursor(url);
    } else {
      if (imageInputRef.current) imageInputRef.current.click();
    }
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageFile(file);
    if (url) {
      insertImageAtCursor(url);
    }
    e.target.value = '';
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <div class="overflow-x-auto my-4">
        <table class="w-full border-collapse border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden my-2">
          <thead>
            <tr class="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
              <th class="border border-slate-300 dark:border-slate-700 p-2.5 text-left">தலைப்பு 1</th>
              <th class="border border-slate-300 dark:border-slate-700 p-2.5 text-left">தலைப்பு 2</th>
              <th class="border border-slate-300 dark:border-slate-700 p-2.5 text-left">தலைப்பு 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-slate-300 dark:border-slate-700 p-2.5">விவரம் 1</td>
              <td class="border border-slate-300 dark:border-slate-700 p-2.5">விவரம் 2</td>
              <td class="border border-slate-300 dark:border-slate-700 p-2.5">விவரம் 3</td>
            </tr>
            <tr>
              <td class="border border-slate-300 dark:border-slate-700 p-2.5">விவரம் 4</td>
              <td class="border border-slate-300 dark:border-slate-700 p-2.5">விவரம் 5</td>
              <td class="border border-slate-300 dark:border-slate-700 p-2.5">விவரம் 6</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, tableHtml);
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
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

      {/* Top Word-Style Toolbar */}
      <div className="p-2 sm:p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 flex flex-wrap items-center gap-1.5 text-xs select-none sticky top-0 z-20 shadow-xs">

        {/* 1. History (Undo / Redo) */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <button
            type="button"
            title={isTamil ? 'செயல்தவிர் (Undo Ctrl+Z)' : 'Undo (Ctrl+Z)'}
            onMouseDown={e => { e.preventDefault(); exec('undo'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ↶
          </button>
          <button
            type="button"
            title={isTamil ? 'மீண்டும் செய் (Redo Ctrl+Y)' : 'Redo (Ctrl+Y)'}
            onMouseDown={e => { e.preventDefault(); exec('redo'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
          >
            ↷
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 hidden sm:block" />

        {/* 2. Font Family Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">Font:</span>
          <select
            onChange={e => applyCustomFontFamily(e.target.value)}
            defaultValue="'Book Antiqua', Palatino, serif"
            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer max-w-[130px]"
            title={isTamil ? 'எழுத்து நடை (Font Family)' : 'Font Family'}
          >
            <option value="'Book Antiqua', Palatino, 'Palatino Linotype', serif">Book Antiqua</option>
            <option value="'Noto Serif Tamil', serif">Tamil Classical</option>
            <option value="'Inter', -apple-system, sans-serif">Inter (Sans)</option>
            <option value="'Georgia', serif">Georgia (Serif)</option>
            <option value="'Arial', sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
            <option value="'Courier New', monospace">Monospace</option>
          </select>
        </div>

        {/* 3. Font Size Picker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">Size:</span>
          <select
            onChange={e => applyCustomFontSize(e.target.value)}
            defaultValue="16"
            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer max-w-[110px]"
            title={isTamil ? 'எழுத்து அளவு (Font Size)' : 'Font Size (px)'}
          >
            <option value="12">12px (Small)</option>
            <option value="14">14px (Regular)</option>
            <option value="16">16px (Standard)</option>
            <option value="18">18px (Medium)</option>
            <option value="20">20px (Lead)</option>
            <option value="24">24px (Heading)</option>
            <option value="28">28px (Title)</option>
            <option value="32">32px (Huge)</option>
            <option value="36">36px (Banner)</option>
          </select>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 4. Headings Quick Selector */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <button
            type="button"
            title="Heading 1 (Main Title)"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h1'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H1
          </button>
          <button
            type="button"
            title="Heading 2 (Section Title)"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H2
          </button>
          <button
            type="button"
            title="Heading 3 (Subsection Title)"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            H3
          </button>
          <button
            type="button"
            title="Paragraph (Body Text)"
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p'); }}
            className="px-2 h-7 rounded text-xs font-black text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            P
          </button>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 5. Basic Typography Formats */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
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

        {/* 6. Text Color & Highlight Marker */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
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
          <label className="relative flex items-center justify-center w-7 h-7 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={isTamil ? 'பின்னணி சிறப்பம்சம் (Highlight Marker)' : 'Highlight Background'}>
            <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              type="color"
              defaultValue="#fef08a"
              onChange={e => exec('hiliteColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />

        {/* 7. Text Alignment */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
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
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
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

        {/* 9. Rich Media, Tables & Publishing Elements */}
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          {/* Table Inserter */}
          <button
            type="button"
            title={isTamil ? 'அட்டவணை சேர் (Insert Table)' : 'Insert Table'}
            onMouseDown={e => { e.preventDefault(); handleInsertTable(); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 3h18v18H3z" />
            </svg>
          </button>

          {/* Blockquote */}
          <button
            type="button"
            title={isTamil ? 'முக்கிய மேற்கோள் பெட்டி (Blockquote)' : 'Blockquote Quote Box'}
            onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'blockquote'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-serif font-black text-sm"
          >
            “
          </button>

          {/* Divider Line */}
          <button
            type="button"
            title={isTamil ? 'பிரிக்கும் கோடு (Divider Line)' : 'Horizontal Divider (<hr />)'}
            onMouseDown={e => { e.preventDefault(); exec('insertHorizontalRule'); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-xs"
          >
            ―
          </button>

          {/* Hyperlink */}
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

          {/* Insert Image (Upload, URL, or Paste) */}
          <button
            type="button"
            title={isTamil ? 'படம் அல்லது விளக்கப்படம் சேர் (Insert Image)' : 'Insert Image (Upload or URL)'}
            onMouseDown={e => { e.preventDefault(); handleImagePrompt(); }}
            className="w-7 h-7 rounded text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>

          {/* Clear Formatting */}
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

      {/* Helpful Word-Compatible Paste Info Banner */}
      <div className="px-4 py-1.5 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>
            {isTamil
              ? 'Word / Google Docs / பிற இணையதளங்களிலிருந்து கட்டுரைகள் அல்லது படங்களை நேரடியாக Copy செய்து இங்கு Paste (Ctrl+V) செய்யலாம் — தலைப்புகள், தடிமன், எழுத்து அளவுகள் மற்றும் படங்கள் அப்படியே பாதுகாக்கப்படும்.'
              : 'Paste directly from Word, Docs, or web pages (Ctrl+V) — headings, bold, font sizes, colors, and pasted images will be preserved exactly.'}
          </span>
        </span>
        <span className="hidden md:inline font-bold text-amber-600 dark:text-amber-400">Word-Grade Engine</span>
      </div>

      {/* Editable Content Area with Direct Paste and Drop Listeners */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="editor-rich-content w-full px-6 py-5 text-base text-slate-900 dark:text-white leading-relaxed outline-none prose dark:prose-invert max-w-none
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400 dark:text-slate-500 [&:empty]:before:pointer-events-none focus:outline-none"
      />
    </div>
  );
}

export default RichTextEditor;
export { RichTextEditor };
