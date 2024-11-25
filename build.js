import { build } from 'esbuild'

build({
  entryPoints: ['./src/**/*.ts'],
  bundle: false,
  outdir: './build',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  tsconfig: './tsconfig.json',
  format: 'esm',
}).catch(() => process.exit(1))
