import esbuild from 'esbuild';

async function testBundle() {
  const result = await esbuild.build({
    entryPoints: ['js/main.jsx'],
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: 'js/dist',
    minify: true,
    metafile: true,
    target: ['es2020'],
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx'
    }
  });

  console.log('esbuild bundle success!');
  const outputs = Object.keys(result.metafile.outputs);
  let totalBytes = 0;
  outputs.forEach(out => {
    const bytes = result.metafile.outputs[out].bytes;
    totalBytes += bytes;
    console.log(`- ${out}: ${(bytes / 1024).toFixed(2)} KB`);
  });
  console.log(`Total output size: ${(totalBytes / 1024).toFixed(2)} KB`);
}

testBundle().catch(err => {
  console.error('esbuild bundle error:', err);
  process.exit(1);
});
