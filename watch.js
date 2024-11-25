// esbuild.mjs
import esbuild from 'esbuild'

const options = {
  entryPoints: ['./src/**/*.ts'],
  bundle: false,
  outdir: './build',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  tsconfig: './tsconfig.json',
  format: 'esm',
}

async function watch() {
  const ctx = await esbuild.context(options)
  await ctx.watch()
  console.log('Watching server...')
}

watch().catch((e) => {
  console.error(e)
  process.exit(1)
})
