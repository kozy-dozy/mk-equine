import '../env'

import mongoose from 'mongoose'

// One-off migration to standardize collection names to snake_case.
// Renames the old collection to the new name, carrying data over.
const RENAMES: Array<[string, string]> = [
    ['featureFlags', 'feature_flags'],
    ['siteContent', 'site_content'],
]

async function run() {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is not set')

    await mongoose.connect(uri)
    const db = mongoose.connection.db
    if (!db) throw new Error('No database handle')

    const names = () =>
        db.listCollections().toArray().then((c) => c.map((x) => x.name).sort())

    console.log('Before:', (await names()).join(', '))

    for (const [oldName, newName] of RENAMES) {
        const existing = await names()
        if (!existing.includes(oldName)) {
            console.log(`skip: '${oldName}' not present`)
            continue
        }
        const oldCount = await db.collection(oldName).countDocuments()
        // dropTarget removes any auto-created (default) collection at the new name
        await db.renameCollection(oldName, newName, { dropTarget: true })
        console.log(`renamed '${oldName}' -> '${newName}' (${oldCount} doc(s))`)
    }

    console.log('After: ', (await names()).join(', '))
    await mongoose.disconnect()
    process.exit(0)
}

run().catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
})
