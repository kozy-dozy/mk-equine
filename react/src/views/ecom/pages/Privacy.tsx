import { COMPANY_CONFIG } from '@/config/company.config'
import {
    LegalEmail,
    LegalList,
    LegalPage,
    LegalParagraph,
    LegalSection,
} from '@/views/ecom/components/marketing/LegalPage'
import SEO from '@/views/ecom/components/SEO'

const EMAIL = COMPANY_CONFIG.contact.email

export default function PrivacyPage() {
    return (
        <>
            <SEO
                noindex
                title={`Privacy Policy | ${COMPANY_CONFIG.name}`}
                canonicalPath="/privacy"
            />

            <LegalPage title="Privacy Policy" updated="June 2026">
                <LegalSection title="1. Introduction">
                    <LegalParagraph>
                        {COMPANY_CONFIG.name} respects your privacy. This policy
                        explains what information we collect when you contact us
                        or book lessons, how we use it, and the choices you have.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="2. Information We Collect">
                    <LegalParagraph>
                        We only collect what we need to respond to you and
                        provide lessons:
                    </LegalParagraph>
                    <LegalList>
                        <li>
                            <strong>Contact details:</strong> the name, email,
                            and message you submit through our contact form.
                        </li>
                        <li>
                            <strong>Rider information:</strong> details you choose
                            to share about a student—such as age, experience, and
                            goals—so we can plan appropriate lessons.
                        </li>
                        <li>
                            <strong>Account information:</strong> if you create an
                            account, the name, email, and password you provide.
                        </li>
                        <li>
                            <strong>Usage data:</strong> basic, anonymized
                            analytics about how visitors use the website.
                        </li>
                    </LegalList>
                </LegalSection>

                <LegalSection title="3. How We Use Your Information">
                    <LegalList>
                        <li>To respond to inquiries and schedule lessons</li>
                        <li>To plan lessons suited to a rider’s age and ability</li>
                        <li>To send relevant updates about your bookings</li>
                        <li>To maintain the security of our website and accounts</li>
                    </LegalList>
                </LegalSection>

                <LegalSection title="4. Sharing Your Information">
                    <LegalParagraph>
                        We do not sell or rent your personal information. We may
                        share limited data with trusted service providers who help
                        us operate—such as website hosting, email, and
                        analytics—and only as needed to provide those services.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="5. Children & Minors">
                    <LegalParagraph>
                        Lessons are offered to riders of all ages, including
                        children. Information about a minor should be submitted by
                        a parent or legal guardian, who is responsible for any
                        consent required. We collect only what is necessary to
                        provide safe, age-appropriate instruction.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="6. Your Rights">
                    <LegalParagraph>
                        You may request to access, correct, or delete your
                        personal information at any time. Just email us at{' '}
                        <LegalEmail href={`mailto:${EMAIL}`}>{EMAIL}</LegalEmail>{' '}
                        and we’ll take care of it.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="7. Security">
                    <LegalParagraph>
                        We take reasonable measures to protect your information.
                        Passwords are stored securely and never in plain text. No
                        method of transmission or storage is completely secure, so
                        we encourage you to safeguard your own account details.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="8. Cookies">
                    <LegalParagraph>
                        We use minimal cookies to keep the site working and to
                        understand general usage. You can disable cookies in your
                        browser, though some features may not work as intended.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="9. Updates to This Policy">
                    <LegalParagraph>
                        We may update this policy from time to time. Continued use
                        of the website after changes means you accept the updated
                        policy.
                    </LegalParagraph>
                </LegalSection>

                <LegalSection title="10. Contact">
                    <LegalParagraph>
                        Questions about your privacy? Email{' '}
                        <LegalEmail href={`mailto:${EMAIL}`}>{EMAIL}</LegalEmail>.
                    </LegalParagraph>
                </LegalSection>
            </LegalPage>
        </>
    )
}
