
import typescript from '@rollup/plugin-typescript';
export default {
  input: './packages/vue/src/index.ts',
  output: [
    // 1.cjs-> commonjs
    // 2.esm
    {
      format: 'cjs',
      file: 'packages/vue/dist/mick-vue.cjs.js'
    },
    {
      format: 'es',
      file: 'packages/vue/dist/mick-vue.esm.js'
    }
  ],
  plugins: [
    typescript()
  ]
}