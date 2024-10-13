const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: 'dist/types',
          module: 'ESNext',
        },
        include: ['src/**/*'],
        exclude: [
          'src/App.tsx',
          '**/*.test.ts',
          '**/*.test.tsx',
          'node_modules',
          'dist',
          'src/App.tsx',
          'src/App.tsx',
          'src/index.css',
          'src/main.tsx'
        ],
      },
      useTsconfigDeclarationDir: true,
    }),
  ],
  external: ['react', 'react-dom'],
};
