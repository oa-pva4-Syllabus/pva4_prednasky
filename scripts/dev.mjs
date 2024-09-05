import { $, cd, argv } from 'zx'

$.env.FORCE_COLOR = '1'

const [slide] = argv._

if (slide) {
  await cd(`slides/${slide}`)
}

await $`slidev slides.md --log info --open`