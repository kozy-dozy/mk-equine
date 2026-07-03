// utils/devProductAutofill.ts
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min
const randPrice = (min: number, max: number) =>
    Math.round((Math.random() * (max - min) + min) * 100) / 100

const adjectives = ['Green', 'Compact', 'Hardy', 'Classic', 'Dwarf', 'Golden']
const plants = [
    'Boxwood',
    'Hydrangea',
    'Azalea',
    'Juniper',
    'Holly',
    'Camellia',
]
const categories = ['shrubs', 'trees', 'perennials', 'soil', 'mulch']
const tagPool = [
    'evergreen',
    'full-sun',
    'shade',
    'native',
    'pollinator',
    'drought-tolerant',
    'deer-resistant',
]

const zipPool = ['27410', '27408', '27358', '27282', '27455']

function slugify(s: string) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export function generateDevProductFixture() {
    const plant = pick(plants)
    const adj = pick(adjectives)
    const name = `${adj} ${plant}`
    const code = `${plant.slice(0, 3).toUpperCase()}-${randInt(100, 999)}`
    const sku = `${code}-${randInt(10, 99)}`
    const category = pick(categories)

    const tags = Array.from(
        new Set(Array.from({ length: randInt(1, 4) }, () => pick(tagPool))),
    )

    const price = randPrice(9.99, 129.99)

    const variants =
        Math.random() < 0.6
            ? [
                  {
                      variantId: sku + '-1G',
                      label: '1-Gallon',
                      sub: 'Small spaces',
                      price: randPrice(14.99, 29.99),
                      inventoryQty: randInt(0, 50),
                  },
                  {
                      variantId: sku + '-3G',
                      label: '3-Gallon',
                      sub: 'Most popular',
                      price: randPrice(29.99, 59.99),
                      inventoryQty: randInt(0, 50),
                  },
                  Math.random() < 0.35
                      ? {
                            variantId: 'bb',
                            label: 'B&B',
                            sub: 'Pickup-only',
                            price: randPrice(79.99, 179.99),
                            pickupOnly: true,
                            inventoryQty: randInt(0, 20),
                        }
                      : {
                            variantId: sku + '-7G',
                            label: '7-Gallon',
                            sub: 'Instant impact',
                            price: randPrice(59.99, 149.99),
                            inventoryQty: randInt(0, 30),
                        },
              ]
            : []

    const specs = {
        matureSize: `${randInt(2, 6)}-${randInt(6, 12)} ft H × ${randInt(2, 6)}-${randInt(6, 12)} ft W`,
        sunlight: pick(['Full Sun', 'Part Shade', 'Full Sun to Part Shade']),
        water: pick(['Low', 'Moderate', 'High']),
        hardiness: pick(['USDA Zone 5-9', 'USDA Zone 6-9', 'USDA Zone 7-10']),
        growthRate: pick(['Slow', 'Moderate', 'Fast']),
    }

    const fulfillment = {
        pickupAvailable: true,
        pickupStore: pick([
            'Main Nursery',
            'Garden Center North',
            'Downtown Pickup',
        ]),
        deliveryAvailable: Math.random() < 0.8,
        deliveryZipList: Array.from({ length: randInt(0, 3) }, () =>
            pick(zipPool),
        ),
        deliveryNotes: pick([
            'Delivery fees apply based on distance.',
            'Large/heavy items may be pickup-only.',
            'Delivery within 10 miles.',
        ]),
    }

    const highlights = Array.from({ length: randInt(0, 3) }, () => ({
        label: pick([
            'Evergreen',
            'Low Maintenance',
            'Fast Growth',
            'Great Hedge',
            'Pollinator Friendly',
        ]),
        value: pick([
            'Year-round color',
            'Easy to prune',
            'Quick to fill space',
            'Great for privacy',
            'Attracts bees',
        ]),
    }))

    return {
        name,
        productCode: code,
        sku,
        inventoryQty: randInt(0, 100),
        slug: slugify(name),
        shortDescription: `${plant} with ${pick(['great structure', 'seasonal color', 'easy care', 'strong privacy'])}.`,
        description: `<p>${name} is a solid choice for ${pick(['borders', 'foundation plantings', 'hedges', 'containers'])}.</p><p>It features ${pick(['lush foliage', 'beautiful blooms', 'year-round interest', 'low maintenance care'])}, making it perfect for both novice and experienced gardeners.</p><ul><li>Easy to grow and maintain</li><li>Attracts local wildlife</li><li>Adaptable to various soil types</li></ul><p>Enhance your landscape with the ${name} today!</p>`,
        category,
        price,
        tags,
        active: Math.random() < 0.9 ? 1 : 0,
        variants,
        specs,
        fulfillment,
        highlights,
        // leave img alone because your form requires actual upload/presign
        // img: ''
    }
}
