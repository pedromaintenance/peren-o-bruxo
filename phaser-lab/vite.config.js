// Inclui a galeria visual como segunda entrada estática no mesmo build Phaser.
// Não modifica a rota principal nem os saves do Peren.
import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({
  build:{rollupOptions:{input:{
    game:fileURLToPath(new URL('./index.html',import.meta.url)),
    review:fileURLToPath(new URL('./review.html',import.meta.url)),
    portraitReview:fileURLToPath(new URL('./portrait-review.html',import.meta.url))
  }}}
});
