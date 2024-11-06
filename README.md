# directus-extension-pdf2img-operation
Directus flows operation extension allowing to convert a PDF downloaded from an URL to images and store them.

Authentication via headers is supported.

## Develop:
```
npm run dev
```
https://docs.directus.io/extensions/creating-extensions.html

## Publish:
```
npm run build && npm publish
```
https://docs.directus.io/extensions/creating-extensions.html

## Install:

Additional requirements:
- graphicsmagick
- ghostscript

```
pnpm install directus-extension-pdf2img-operation
```
https://docs.directus.io/extensions/installing-extensions.html


Full example / for docker:
```
FROM docker.io/directus/directus:RELEASE
USER root
RUN apk add graphicsmagick ghostscript
RUN corepack enable
USER node
RUN pnpm install directus-extension-models directus-extension-api-viewer directus-extension-schema-sync
```
