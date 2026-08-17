import { execSync } from 'child_process';
import fs from 'fs';

// Extract the original complete bundle from 84732c2
const originalBundle = execSync('git show 84732c2:js/bundle.js', { maxBuffer: 20 * 1024 * 1024 }).toString();

console.log('Original bundle lines:', originalBundle.split('\n').length);

// Let's check if RichTextEditor, ArticlesPage, ArticleDetailPage, AdminArticlesPage, ArticleEditorPage exist
console.log('Has RichTextEditor:', originalBundle.includes('RichTextEditor'));
console.log('Has ArticlesPage / Articles:', originalBundle.includes('function Articles(') || originalBundle.includes('function ArticlesPage('));
console.log('Has ArticleDetailPage / ArticleDetail:', originalBundle.includes('function ArticleDetail(') || originalBundle.includes('function ArticleDetailPage('));
console.log('Has AdminArticlesPage / AdminArticles:', originalBundle.includes('function AdminArticles(') || originalBundle.includes('function AdminArticlesPage('));
console.log('Has ArticleEditorPage / ArticleEditor:', originalBundle.includes('function ArticleEditor(') || originalBundle.includes('function ArticleEditorPage('));

fs.writeFileSync('js/bundle.js', originalBundle, 'utf8');
console.log('Wrote complete bundle to js/bundle.js');
