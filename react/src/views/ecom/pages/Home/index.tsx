import { COMPANY_CONFIG } from '@/config/company.config'
import AboutInstructor from '@/views/ecom/components/marketing/sections/AboutInstructor'
import ContactCta from '@/views/ecom/components/marketing/sections/ContactCta'
import Faq from '@/views/ecom/components/marketing/sections/Faq'
import GalleryPreview from '@/views/ecom/components/marketing/sections/GalleryPreview'
import Hero from '@/views/ecom/components/marketing/sections/Hero'
import LessonOptions from '@/views/ecom/components/marketing/sections/LessonOptions'
import Testimonials from '@/views/ecom/components/marketing/sections/Testimonials'
import TrainingSales from '@/views/ecom/components/marketing/sections/TrainingSales'
import WhatStudentsLearn from '@/views/ecom/components/marketing/sections/WhatStudentsLearn'
import SEO from '@/views/ecom/components/SEO'

export default function Home() {
    return (
        <>
            <SEO
                title={COMPANY_CONFIG.seo.defaultTitle}
                description={COMPANY_CONFIG.seo.defaultDescription}
                canonicalPath="/"
            />
            <Hero />
            <LessonOptions />
            <AboutInstructor />
            <WhatStudentsLearn />
            <TrainingSales />
            <GalleryPreview />
            <Testimonials />
            <Faq />
            <ContactCta />
        </>
    )
}
