import '../env'

import mongoose from 'mongoose'

import { Horse } from '../modules/horses/horses.model'

const img = (id: string) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=900`

// The original sample listings from when the page was first built.
// Edit/replace these anytime via Admin → Horses For Sale.
const HORSES = [
    {
        name: 'Cisco',
        breed: 'Quarter Horse',
        sex: 'Gelding',
        age: 8,
        discipline: 'Ranch & Trail',
        price: 6500,
        status: 'available',
        description:
            'Gentle, well-broke, and unflappable on the trail. A confidence-builder for any rider.',
        imageUrl: img('1534773728080-33d31da27ae5'),
        sortOrder: 0,
    },
    {
        name: 'Dakota',
        breed: 'Paint',
        sex: 'Mare',
        age: 6,
        discipline: 'Barrel Prospect',
        price: 8200,
        status: 'available',
        description:
            'Athletic and willing with a great mind. Started on the pattern and ready to advance.',
        imageUrl: img('1591382386627-349b692688ff'),
        sortOrder: 1,
    },
    {
        name: 'Willow',
        breed: 'Appaloosa',
        sex: 'Mare',
        age: 10,
        discipline: 'Beginner Safe',
        price: 5000,
        status: 'pending',
        description:
            'Patient and steady—an ideal first horse for a kid or beginning adult rider.',
        imageUrl: img('1559666126-84f389727b9a'),
        sortOrder: 2,
    },
    {
        name: 'Ranger',
        breed: 'Bay',
        sex: 'Gelding',
        age: 5,
        discipline: 'Started Under Saddle',
        price: 7000,
        status: 'available',
        description:
            'Smart and personable with a solid foundation. Ready to grow with the right rider.',
        imageUrl: img('1486365227551-f3f90034a57c'),
        sortOrder: 3,
    },
]

async function run() {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is not set')

    await mongoose.connect(uri)
    console.log('Connected to', mongoose.connection.name)

    let created = 0
    for (const h of HORSES) {
        // Upsert by name so re-running doesn't create duplicates.
        const res = await Horse.updateOne(
            { name: h.name },
            { $setOnInsert: h },
            { upsert: true },
        )
        if (res.upsertedCount) created++
    }

    const total = await Horse.countDocuments()
    console.log(`Inserted ${created} new horse(s); ${total} total in collection.`)

    await mongoose.disconnect()
    process.exit(0)
}

run().catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
})
