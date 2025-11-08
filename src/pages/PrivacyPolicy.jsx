import { CheckCircle, Database, Eye, Lock, Shield, UserCheck, Users, Zap } from 'lucide-react';
import { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            id: 'information-collection',
            title: 'Information We Collect',
            icon: Database,
            content: [
                'Personal Information: We collect information you provide directly, such as name, email address, phone number, business details, and billing information when you create an account or make purchases.',
                'Business Information: For B2B accounts, we collect company name, business registration details, GST numbers, and authorized representative information.',
                'Transaction Data: We collect information about your purchases, payment methods, shipping addresses, and order history.',
                'Technical Information: We automatically collect device information, IP addresses, browser type, operating system, and website usage data through cookies and similar technologies.',
                'Communication Data: We store records of communications between you and our customer service team, including emails, chat logs, and support tickets.'
            ]
        },
        {
            id: 'information-use',
            title: 'How We Use Your Information',
            icon: Zap,
            content: [
                'Service Delivery: To process orders, manage your account, provide customer support, and deliver products and services.',
                'Business Operations: To verify business credentials for B2B accounts, process payments, manage inventory, and fulfill contractual obligations.',
                'Communication: To send order confirmations, shipping updates, account notifications, and respond to your inquiries.',
                'Marketing: To send promotional offers, product updates, and newsletters (with your consent, and you may opt-out anytime).',
                'Analytics: To analyze website usage, improve our services, develop new features, and enhance user experience.',
                'Legal Compliance: To comply with applicable laws, regulations, and legal processes.'
            ]
        },
        {
            id: 'information-sharing',
            title: 'Information Sharing and Disclosure',
            icon: Users,
            content: [
                'Service Providers: We share information with trusted third-party service providers who assist in payment processing, shipping, marketing, and technical services.',
                'Business Partners: For B2B services, we may share relevant business information with suppliers, manufacturers, and logistics partners to fulfill orders.',
                'Legal Requirements: We may disclose information when required by law, court order, or government regulation.',
                'Business Transfers: In case of merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction.',
                'Consent: We may share information with your explicit consent for specific purposes not covered in this policy.',
                'We do not sell, rent, or trade your personal information to third parties for their marketing purposes.'
            ]
        },
        {
            id: 'data-security',
            title: 'Data Security',
            icon: Shield,
            content: [
                'Encryption: We use industry-standard SSL/TLS encryption to protect data transmission between your device and our servers.',
                'Access Controls: We implement strict access controls and authentication measures to limit access to personal information.',
                'Regular Audits: We conduct regular security audits and vulnerability assessments to identify and address potential risks.',
                'Employee Training: Our staff receives regular training on data protection and privacy best practices.',
                'Incident Response: We have procedures in place to respond to and notify users of any data security incidents.',
                'While we implement robust security measures, no method of transmission over the internet is 100% secure.'
            ]
        },
        {
            id: 'cookies-tracking',
            title: 'Cookies and Tracking Technologies',
            icon: Eye,
            content: [
                'Essential Cookies: We use necessary cookies to enable basic website functionality, maintain user sessions, and remember your preferences.',
                'Analytics Cookies: We use analytics tools to understand how visitors interact with our website and improve user experience.',
                'Marketing Cookies: With your consent, we use cookies for targeted advertising and marketing campaigns.',
                'Third-Party Cookies: Our website may contain third-party cookies from payment processors, analytics providers, and social media platforms.',
                'Cookie Management: You can control cookie settings through your browser preferences or our cookie consent banner.',
                'Some features may not function properly if you disable certain cookies.'
            ]
        },
        {
            id: 'data-retention',
            title: 'Data Retention',
            icon: Database,
            content: [
                'Account Data: We retain your account information as long as your account is active or as needed to provide services.',
                'Transaction Records: Purchase and transaction data is retained for accounting, tax, and legal compliance purposes, typically for 7 years.',
                'Communication Records: Customer service communications are retained for quality assurance and dispute resolution.',
                'Marketing Data: Marketing preferences and communication history are retained until you opt-out or request deletion.',
                'Legal Requirements: Some data may be retained longer to comply with legal obligations, resolve disputes, or enforce agreements.',
                'Upon account closure, we will delete or anonymize personal information within a reasonable timeframe, subject to legal requirements.'
            ]
        },
        {
            id: 'user-rights',
            title: 'Your Rights and Choices',
            icon: UserCheck,
            content: [
                'Access: You can request access to the personal information we hold about you and receive a copy of your data.',
                'Correction: You can update or correct inaccurate personal information through your account settings or by contacting us.',
                'Deletion: You can request deletion of your personal information, subject to legal and contractual obligations.',
                'Portability: You can request your data in a structured, machine-readable format for transfer to another service.',
                'Marketing Opt-out: You can unsubscribe from marketing communications through email links or account settings.',
                'Cookie Control: You can manage cookie preferences through your browser settings or our consent management tools.',
                'To exercise these rights, please contact us using the information provided at the end of this policy.'
            ]
        },
        {
            id: 'third-party-services',
            title: 'Third-Party Services',
            icon: Users,
            content: [
                'Payment Processors: We use secure third-party payment processors who have their own privacy policies.',
                'Shipping Partners: We share delivery information with courier services and logistics partners for order fulfillment.',
                'Cloud Services: We use cloud hosting and storage services that comply with international data protection standards.',
                'Analytics Tools: We use website analytics tools to understand user behavior and improve our services.',
                'Social Media: Our website may include social media features that are governed by the respective platforms\' privacy policies.',
                'We carefully select service providers who maintain appropriate data protection standards and sign data processing agreements.'
            ]
        },
        {
            id: 'international-transfers',
            title: 'International Data Transfers',
            icon: Shield,
            content: [
                'Our primary data processing occurs within India, but some service providers may be located internationally.',
                'We ensure adequate protection for international transfers through standard contractual clauses or adequacy decisions.',
                'We require all international service providers to maintain appropriate data protection standards.',
                'If you are located outside India, your information may be transferred to and processed in India.'
            ]
        },
        {
            id: 'children-privacy',
            title: 'Children\'s Privacy',
            icon: UserCheck,
            content: [
                'Our services are intended for businesses and individuals aged 18 and above.',
                'We do not knowingly collect personal information from children under 18 years of age.',
                'If we become aware that we have collected information from a child under 18, we will delete such information promptly.',
                'Parents or guardians who believe their child has provided personal information should contact us immediately.'
            ]
        },
        {
            id: 'policy-changes',
            title: 'Changes to This Policy',
            icon: CheckCircle,
            content: [
                'We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.',
                'We will notify users of material changes through email, website notices, or account notifications.',
                'The updated policy will be posted on this page with a revised effective date.',
                'Continued use of our services after policy changes constitutes acceptance of the updated terms.',
                'We encourage you to review this policy regularly to stay informed about how we protect your information.'
            ]
        }
    ];

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Shield size={64} className="mx-auto mb-6 text-green-100" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-xl text-green-100 mb-4">
                        How we collect, use, and protect your personal information
                    </p>
                    <p className="text-green-200">
                        Last updated: October 30, 2025
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Privacy Matters to Us</h2>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                        At Ambika International, we are committed to protecting your privacy and ensuring the
                        security of your personal information. This Privacy Policy explains how we collect, use,
                        disclose, and safeguard your information when you use our website, mobile applications,
                        and related services.
                    </p>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                        This policy applies to all users of our B2B e-commerce platform, including individual
                        customers, business clients, and website visitors. By using our services, you agree to
                        the collection and use of information in accordance with this policy.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Shield size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-green-900 mb-1">Our Commitment</h4>
                                <p className="text-sm text-green-800">
                                    We adhere to applicable data protection laws and industry best practices to ensure
                                    your personal information is handled securely and transparently.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                className="bg-white rounded-xl border border-neutral-200 p-8"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <Icon size={24} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-900">
                                            {index + 1}. {section.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {section.content.map((paragraph, idx) => (
                                        <p key={idx} className="text-neutral-700 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact Information */}
                <div className="bg-green-50 rounded-xl border border-green-200 p-8 mt-12">
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">Contact Us About Privacy</h3>
                    <p className="text-neutral-700 mb-4">
                        If you have any questions, concerns, or requests regarding this Privacy Policy or
                        our data practices, please contact us:
                    </p>
                    <div className="space-y-2 text-neutral-700">
                        <p><strong>Data Protection Officer:</strong> privacy@ambikainternational.com</p>
                        <p><strong>Company:</strong> Ambika International</p>
                        <p><strong>Email:</strong> support@ambikainternational.com</p>
                        <p><strong>Phone:</strong> +91-1234567890</p>
                        <p><strong>Address:</strong> Business Address, City, State, PIN Code</p>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                        <p className="text-sm text-neutral-600">
                            <strong>Response Time:</strong> We will respond to privacy-related inquiries within
                            30 days of receipt. For urgent matters, please call our customer service line.
                        </p>
                    </div>
                </div>

                {/* Rights Summary */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-8 mt-8">
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">Quick Rights Reference</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-blue-600" />
                                <span className="text-sm font-medium">Access your data</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-blue-600" />
                                <span className="text-sm font-medium">Correct inaccuracies</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-blue-600" />
                                <span className="text-sm font-medium">Request deletion</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-blue-600" />
                                <span className="text-sm font-medium">Data portability</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-blue-600" />
                                <span className="text-sm font-medium">Opt-out of marketing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-blue-600" />
                                <span className="text-sm font-medium">Control cookies</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Notice */}
                <div className="bg-neutral-100 rounded-xl border border-neutral-200 p-6 mt-8">
                    <div className="flex items-start gap-3">
                        <Lock size={24} className="text-neutral-600 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-neutral-900 mb-2">Legal Framework</h4>
                            <p className="text-sm text-neutral-700 leading-relaxed">
                                This Privacy Policy is governed by the laws of India, including the Information
                                Technology Act, 2000, and applicable data protection regulations. We may update
                                this policy to comply with evolving legal requirements and industry standards.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-12 text-center">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Related Information</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/terms-of-use"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                            <Shield size={16} />
                            Terms of Use
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                            <Users size={16} />
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;