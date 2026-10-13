# Laboratório Phaser — isolado da main

Isto **não substitui** `index.html` ou `game.js` do Peren 0.1.2. É um ensaio técnico para caminhar em um bioma com teclado/joystick e física Arcade, com texturas geométricas **temporárias**. Todos os assets finais serão produzidos e registrados separadamente.

Localmente, com Node e npm instalados:

```bash
cd phaser-lab
npm install
npm run dev
# e, para produzir arquivos estáticos:
npm run build
```

Phaser e Vite são dependências de build: a versão publicada será empacotada com a biblioteca local, sem CDN em tempo de execução. Este protótipo **ainda não está integrado ao save nem ao PWA principal** e não deve ser publicado no Pages padrão.

Objetivo deste teste: medir sensação de movimento contínuo, colisão, câmera e toque num celular antes de produzir dezenas de sprites finais.