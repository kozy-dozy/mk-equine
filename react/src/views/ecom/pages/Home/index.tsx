import { COMPANY_CONFIG } from '@/config/company.config'
import SEO from '@/views/ecom/components/SEO'
import Hero from '@/views/ecom/components/marketing/sections/Hero'
import LessonOptions from '@/views/ecom/components/marketing/sections/LessonOptions'
import AboutInstructor from '@/views/ecom/components/marketing/sections/AboutInstructor'
import WhatStudentsLearn from '@/views/ecom/components/marketing/sections/WhatStudentsLearn'
import TrainingSales from '@/views/ecom/components/marketing/sections/TrainingSales'
import GalleryPreview from '@/views/ecom/components/marketing/sections/GalleryPreview'
import Testimonials from '@/views/ecom/components/marketing/sections/Testimonials'
import Faq from '@/views/ecom/components/marketing/sections/Faq'
import ContactCta from '@/views/ecom/components/marketing/sections/ContactCta'

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
