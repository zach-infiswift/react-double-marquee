import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import liveServer from 'rollup-plugin-live-server';
import externals from './externals';

const paths = {
  lib: {
    input: 'src/index.jsx',
    outputFile: 'playground/public/static/lib/index.js',
  },
  playground: {
    input: 'playground/src/index.jsx',
    outputFile: 'playground/public/static/index.js',
  },
};

module.exports = [{
  input: paths.lib.input,
  external: externals.keys,
  output: {
    file: paths.lib.outputFile,
    format: 'esm',
    globals: externals.globals,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}, {
  input: paths.playground.input,
  output: {
    name: 'index',
    file: paths.playground.outputFile,
    format: 'umd',
  },
  plugins: [
    resolve({
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: [
        'node_modules/process-es6/**',
      ],
      namedExports: {
        'node_modules/react/index.js': [
          'Component',
          'PureComponent',
          'Fragment',
          'Children',
          'createElement',
        ],
        'node_modules/react-dom/index.js': [
          'render',
        ],
      },
    }),
    replace({
      'process.env.NODE_ENV':
        JSON.stringify('development'),
    }),
    liveServer({
      port: 8001,
      root: 'playground/public',
      file: 'playground/public/index.html',
      watch: 'playground/public',
    }),
  ],
}];
