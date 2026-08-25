import sharp from 'sharp'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'public/icon.svg'))

const sizes = [512, 256, 128]

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(root, 'public', `icon-${size}.png`))

  await sharp(svg)
    .resize(size, size)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(join(root, 'public', `icon-${size}.jpg`))
}

await sharp(svg).resize(512, 512).png().toFile(join(root, 'public/icon.png'))
await sharp(svg).resize(512, 512).jpeg({ quality: 92, mozjpeg: true }).toFile(join(root, 'public/icon.jpg'))

console.log('Generated app icons in ui/public/')
