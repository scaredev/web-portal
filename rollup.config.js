import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtin from 'rollup-plugin-node-builtins';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-fill-html';
import clean from 'rollup-plugin-cleaner';
import strip from 'rollup-plugin-strip';
import sass from 'rollup-plugin-scss';
import imageBase64 from 'rollup-plugin-image-base64';
import copy from 'rollup-plugin-copy';
import es3 from 'rollup-plugin-es3'
import es3ify from './src/libs/rollup-plugin-es3ify/index.js';
import randomstring from 'randomstring';

const production = !process.env.ROLLUP_WATCH && process.env.NODE_ENV == 'production';

console.log('PRODUCTION?', production);

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: `dist/js/bundle-${randomstring.generate()}.js`
  },
  moduleContext: {
    'dom4': 'window',
    'native-promise-only': 'window',
    'typedarray': 'window',
    'node_modules/spin.js/spin.js': 'window'
  },
  plugins: [
    clean({
      targets: ['dist']
    }),
    copy({
      "./src/sounds": "dist/sounds",
      "./src/img": "dist/img",
      "./node_modules/bootstrap/dist/fonts": "dist/fonts",
      verbose: true
    }),
    sass({
      output: `dist/css/000-styles-${randomstring.generate()}.css`
    }),
    imageBase64(),
    builtin(),
    svelte({
      legacy: true, // dont use HTMLElement.dataset
      // opt in to v3 behaviour today
      skipIntroByDefault: true,
      nestedTransitions: true,

      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write(`dist/css/svelte-styles-${randomstring.generate()}.css`);
      }
    }),
    
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true
    }),
    commonjs(),
    babel(),
    es3(),
    es3ify(),
    html({
      template: 'src/index.html',
      filename: 'index.html'
    }),
    // If we're building for production (npm run build
    // instead of npm run dev), transpile and minify
    production && buble({ exclude: 'node_modules/**' }),
    production && strip({
      // set this to `false` if you don't want to
      // remove debugger statements
      debugger: production,

      // defaults to `[ 'console.*', 'assert.*' ]`
      functions: [ 'console.*', 'assert.*', 'debug'],

      // set this to `false` if you're not using sourcemaps –
      // defaults to `true`
      sourceMap: true
    }),
    production && uglify({
      output: {
        keep_quoted_props: true,
        ie8: true
      },
      compress: {
        properties: false
      }
    })
  ]
};

