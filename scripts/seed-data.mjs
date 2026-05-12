import { readFileSync } from 'fs'

// Reads credentials from .env.local — never hardcode keys in source files
function readEnv(key) {
  try {
    const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    const match = env.match(new RegExp(`^${key}=(.+)$`, 'm'))
    return match?.[1]?.trim()
  } catch {
    return process.env[key]
  }
}

const SUPABASE_URL = readEnv('NEXT_PUBLIC_SUPABASE_URL')
const SERVICE_KEY  = readEnv('SUPABASE_SERVICE_ROLE_KEY')

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${SERVICE_KEY}`,
  apikey: SERVICE_KEY,
  Prefer: 'return=representation',
}

async function get(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers })
  return res.json()
}

async function post(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  })
  if (!res.ok) { const t = await res.text(); throw new Error(`POST ${path}: ${t}`) }
  return res.json()
}

const menuData = {
  coffee: [
    { name: 'Espresso', description: 'A bold, concentrated shot of coffee with rich crema.', price: 85, customization: { sizes: ['single', 'double'], sugar_levels: ['no sugar', 'less sweet', 'normal'], temperatures: ['hot'] } },
    { name: 'Americano', description: 'Espresso shots diluted with hot water for a smooth, clean finish.', price: 95, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['no sugar', 'less sweet', 'normal'], temperatures: ['hot', 'iced'] } },
    { name: 'Cappuccino', description: 'Espresso with steamed milk and a thick layer of velvety foam.', price: 120, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['less sweet', 'normal', 'extra sweet'], temperatures: ['hot'] } },
    { name: 'Flat White', description: 'Double ristretto with silky microfoam milk — strong and smooth.', price: 130, customization: { sizes: ['small', 'medium'], sugar_levels: ['no sugar', 'less sweet', 'normal'], temperatures: ['hot'] } },
    { name: 'Cafe Latte', description: 'Espresso with generous steamed milk and light foam.', price: 115, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['less sweet', 'normal', 'extra sweet'], temperatures: ['hot', 'iced'] } },
    { name: 'Cold Brew', description: 'Steeped for 18 hours for a smooth, naturally sweet concentrate.', price: 135, customization: { sizes: ['medium', 'large'], sugar_levels: ['no sugar', 'less sweet', 'normal'], temperatures: ['iced'] } },
  ],
  'signature-lattes': [
    { name: 'Brown Sugar Oat Milk Latte', description: 'Rich espresso with caramel-sweet brown sugar and creamy oat milk. Our bestseller.', price: 165, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['less sweet', 'normal', 'extra sweet'], temperatures: ['hot', 'iced'] } },
    { name: 'Matcha Latte', description: 'Ceremonial grade matcha whisked with oat or whole milk. Earthy and smooth.', price: 155, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['less sweet', 'normal', 'extra sweet'], temperatures: ['hot', 'iced'] } },
    { name: 'Lavender Honey Latte', description: 'House-made lavender syrup, local honey, and smooth espresso.', price: 170, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['less sweet', 'normal', 'extra sweet'], temperatures: ['hot', 'iced'] } },
    { name: 'Caramel Macchiato', description: 'Vanilla-scented milk, espresso, and a drizzle of house caramel.', price: 160, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['less sweet', 'normal', 'extra sweet'], temperatures: ['hot', 'iced'] } },
    { name: 'Spanish Latte', description: 'Espresso, condensed milk, and steamed milk — sweet and creamy.', price: 150, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['normal', 'extra sweet'], temperatures: ['hot', 'iced'] } },
    { name: 'Taro Milk Latte', description: 'Creamy taro root blended with espresso and oat milk.', price: 165, is_sold_out: true, customization: { sizes: ['small', 'medium', 'large'], sugar_levels: ['less sweet', 'normal', 'extra sweet'], temperatures: ['hot', 'iced'] } },
  ],
  'rice-meals': [
    { name: 'Garlic Butter Chicken Rice', description: 'Pan-seared chicken thigh glazed with garlic butter, served with steamed rice and salad.', price: 195, customization: { sizes: ['regular', 'large'], sugar_levels: ['normal'], temperatures: ['hot'] } },
    { name: 'Teriyaki Salmon Rice Bowl', description: 'Norwegian salmon fillet with house teriyaki glaze, edamame, and sesame rice.', price: 235, customization: { sizes: ['regular', 'large'], sugar_levels: ['normal'], temperatures: ['hot'] } },
    { name: 'Beef Tapa Silog', description: 'Sweet cured beef tapa with garlic fried rice and a runny sunny-side-up egg.', price: 200, customization: { sizes: ['regular'], sugar_levels: ['normal'], temperatures: ['hot'] } },
    { name: 'Longganisa Silog', description: 'Sweet pork longganisa with garlic fried rice and egg. A Filipino morning classic.', price: 180, customization: { sizes: ['regular'], sugar_levels: ['normal'], temperatures: ['hot'] } },
    { name: 'Mushroom & Tofu Rice Bowl', description: 'Sauteed shiitake and firm tofu in savory soy glaze, served over brown rice.', price: 175, customization: { sizes: ['regular', 'large'], sugar_levels: ['normal'], temperatures: ['hot'] } },
  ],
  'desserts': [
    { name: 'Classic Cheesecake', description: 'New York-style baked cheesecake with a buttery graham crust. Rich and dense.', price: 150, customization: { sizes: ['slice'], sugar_levels: ['normal'], temperatures: ['cold'] } },
    { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten center. Served with vanilla ice cream.', price: 170, customization: { sizes: ['one piece', 'two pieces'], sugar_levels: ['normal'], temperatures: ['warm'] } },
    { name: 'Buko Pandan Parfait', description: 'Layers of buko pandan jelly, cream, coconut strips, and crushed graham crackers.', price: 135, customization: { sizes: ['regular'], sugar_levels: ['normal', 'extra sweet'], temperatures: ['cold'] } },
    { name: 'Tiramisu Cup', description: 'Espresso-soaked ladyfingers layered with mascarpone cream. Dusted with cocoa.', price: 160, customization: { sizes: ['regular'], sugar_levels: ['less sweet', 'normal'], temperatures: ['cold'] } },
    { name: 'Ube Tres Leches', description: 'Filipino ube cake soaked in three milks, topped with ube cream and coconut flakes.', price: 155, customization: { sizes: ['slice'], sugar_levels: ['normal', 'extra sweet'], temperatures: ['cold'] } },
  ],
}

async function main() {
  console.log('Fetching categories...')
  const categories = await get('categories?select=id,slug')
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]))
  console.log('  Found:', Object.keys(catMap).join(', '))

  console.log('\nInserting menu items...')
  let totalItems = 0

  for (const [slug, items] of Object.entries(menuData)) {
    const category_id = catMap[slug]
    if (!category_id) { console.log(`  Skipping: ${slug}`); continue }

    for (const item of items) {
      const { customization, ...itemData } = item
      const [inserted] = await post('menu_items', { ...itemData, category_id, is_available: true, is_sold_out: item.is_sold_out ?? false })
      await post('item_customizations', {
        menu_item_id: inserted.id,
        sizes: customization.sizes,
        sugar_levels: customization.sugar_levels,
        temperatures: customization.temperatures,
      })
      console.log(`  + ${inserted.name} (₱${inserted.price})`)
      totalItems++
    }
  }

  console.log('\nActivating promo banner...')
  await fetch(`${SUPABASE_URL}/rest/v1/promo_banner`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      message: 'Free upsize on all lattes this week!',
      is_active: true,
    }),
  })
  console.log('  Done.')
  console.log(`\nDone — ${totalItems} menu items seeded.`)
}

main().catch(console.error)
