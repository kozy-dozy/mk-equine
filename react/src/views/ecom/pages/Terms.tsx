import { COMPANY_CONFIG } from '@/config/company.config'
import {
    LegalEmail,
    LegalLink,
    LegalList,
    LegalNotice,
    LegalPage,
    LegalParagraph,
    LegalSection,
} from '@/views/ecom/components/marketing/LegalPage'
import SEO from '@/views/ecom/components/SEO'

const EMAIL = COMPANY_CONFIG.contact.email

export default function TermsPage() {
    return (
        <>
            <SEO
                noindex
                title={`Terms of Service | ${COMPANY_CONFIG.name}`}
                canonicalPath="/terms"
            />

            <LegalPage title="Terms of Service" updated="June 2026">
                <LegalSection title="1. Acceptance of Terms">
                    <LegalParagraph>
                        By booking or taking lessons with {COMPANY_CONFIG.name},
                        you agree to these Terms of Service. If you do not agree,
                        please do not book lessons or use this website.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="2. Lessons & Booking">
                    <LegalParagraph>
                        Lessons are scheduled by arrangement after you reach out
                        through the contact page. Current rates are $50 per
                        one-hour lesson and $35 per thirty-minute lesson. Pricing
                        and availability may change, and a limited number of
                        work-for-lessons spots are offered at our discretion.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="3. Cancellations, No-Shows & Weather">
                    <LegalParagraph>
                        Please provide as much notice as possible if you need to
                        cancel or reschedule. If weather or conditions make riding
                        unsafe, we will reschedule your lesson for the next
                        available time. Repeated no-shows may affect future
                        scheduling.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="4. Assumption of Risk & Safety">
                    <LegalNotice>
                        <strong>Warning:</strong> Horseback riding and other
                        equine activities are inherently dangerous. Horses can
                        behave unpredictably regardless of training. By
                        participating, you acknowledge and accept the inherent
                        risks of equine activities, including the risk of injury.
                    </LegalNotice>
                    <LegalParagraph>
                        Students must follow all safety instructions at all times.
                        Protective footwear is required, and a properly fitted
                        helmet is strongly recommended for all riding. A separate
                        signed liability release and, for minors, a parent or
                        guardian signature may be required before riding.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="5. Conduct & Safety Rules">
                    <LegalParagraph>
                        For everyone’s safety—and the wellbeing of the horses—the
                        following are expected:
                    </LegalParagraph>
                    <LegalList>
                        <li>Follow the instructor’s directions at all times</li>
                        <li>Wear appropriate clothing and closed-toe boots</li>
                        <li>No rough handling, teasing, or startling the horses</li>
                        <li>
                            No participation under the influence of alcohol or
                            drugs
                        </li>
                    </LegalList>
                </LegalSection>

                <LegalSection title="6. Minors">
                    <LegalParagraph>
                        Lessons for riders under 18 must be arranged by a parent
                        or legal guardian, who is responsible for providing any
                        required consent and for their child’s conduct. A parent
                        or guardian may be asked to remain on-site during lessons.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="7. Photography & Media">
                    <LegalParagraph>
                        We occasionally take photos or video during lessons to
                        share barn life and student progress. If you prefer not to
                        be featured, let us know and we’ll honor your request.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="8. Limitation of Liability">
                    <LegalParagraph>
                        To the fullest extent permitted by law,{' '}
                        {COMPANY_CONFIG.name} is not liable for indirect or
                        consequential damages arising from lessons or use of this
                        website. Nothing in these terms limits liability where it
                        cannot lawfully be limited.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="9. Privacy">
                    <LegalParagraph>
                        Your information is handled in accordance with our{' '}
                        <LegalLink to="/privacy">Privacy Policy</LegalLink>.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="10. Changes to These Terms">
                    <LegalParagraph>
                        We may update these Terms from time to time. Continued use
                        of our lessons or website after changes constitutes
                        acceptance of the updated Terms.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="11. Contact">
                    <LegalParagraph>
                        Questions about these Terms? Email{' '}
                        <LegalEmail href={`mailto:${EMAIL}`}>{EMAIL}</LegalEmail>.
                    </LegalParagraph>
                </LegalSection>
            </LegalPage>
        </>
    )
}
