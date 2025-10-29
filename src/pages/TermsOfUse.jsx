import { CheckCircle, FileText, Scale, Shield, Users } from 'lucide-react';
import { useEffect } from 'react';

const TermsOfUse = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing and using the Ambika International website and services, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'These terms apply to all visitors, users, and others who access or use the service.'
      ]
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: FileText,
      content: [
        'Ambika International provides B2B e-commerce services including hotel amenities, cleaning supplies, kitchen equipment, and safety products.',
        'We offer product catalogs, quotation services, order management, and customer support for business clients.',
        'Services may be modified, suspended, or discontinued at any time without notice.',
        'We reserve the right to refuse service to anyone for any reason at any time.'
      ]
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      icon: Users,
      content: [
        'You must provide accurate, current, and complete information during registration.',
        'You are responsible for safeguarding your account password and all activities under your account.',
        'You must notify us immediately of any unauthorized use of your account.',
        'We reserve the right to terminate accounts that violate these terms or are inactive for extended periods.',
        'Business verification may be required for B2B account features and pricing.'
      ]
    },
    {
      id: 'conduct',
      title: 'Acceptable Use',
      icon: Shield,
      content: [
        'You agree not to use the service for any unlawful purpose or prohibited activity.',
        'You will not transmit any harmful, offensive, or inappropriate content.',
        'Commercial use of content without permission is prohibited.',
        'You will not interfere with or disrupt the service or servers.',
        'Automated data collection or scraping is strictly prohibited without consent.'
      ]
    },
    {
      id: 'orders',
      title: 'Orders and Payments',
      icon: FileText,
      content: [
        'All orders are subject to acceptance and availability.',
        'Prices are subject to change without notice until order confirmation.',
        'Payment terms vary by customer type and order value.',
        'We reserve the right to cancel orders for any reason including pricing errors.',
        'Bulk order discounts and B2B pricing require account verification.'
      ]
    },
    {
      id: 'intellectual',
      title: 'Intellectual Property',
      icon: Scale,
      content: [
        'All content, trademarks, and intellectual property belong to Ambika International.',
        'You may not reproduce, distribute, or create derivative works without permission.',
        'Product images and descriptions are for reference only.',
        'User-generated content may be used for marketing and promotional purposes.'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy and Data Protection',
      icon: Shield,
      content: [
        'Your privacy is important to us. Please review our Privacy Policy.',
        'We collect and use information as described in our Privacy Policy.',
        'Business information may be used for account verification and services.',
        'We implement security measures to protect your personal and business data.'
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: Scale,
      content: [
        'The service is provided "as is" without warranties of any kind.',
        'We are not liable for indirect, incidental, or consequential damages.',
        'Our liability is limited to the amount paid for the specific service.',
        'We do not guarantee uninterrupted or error-free service.',
        'Product specifications and availability are subject to change.'
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: FileText,
      content: [
        'We may terminate or suspend accounts immediately for violations of these terms.',
        'You may terminate your account at any time by contacting customer service.',
        'Upon termination, your right to use the service ceases immediately.',
        'Provisions that should survive termination will remain in effect.'
      ]
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: CheckCircle,
      content: [
        'We reserve the right to modify these terms at any time.',
        'Changes will be posted on this page with an updated effective date.',
        'Continued use after changes constitutes acceptance of new terms.',
        'Material changes may be communicated via email or website notice.'
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Scale size={64} className="mx-auto mb-6 text-blue-100" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Use</h1>
          <p className="text-xl text-blue-100 mb-4">
            Legal terms and conditions for using Ambika International services
          </p>
          <p className="text-blue-200">
            Last updated: October 30, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Welcome to Ambika International</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            These Terms of Use ("Terms") govern your use of the Ambika International website, 
            mobile applications, and related services (collectively, the "Service") operated by 
            Ambika International ("we," "us," or "our").
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Please read these Terms carefully before using our Service. By accessing or using 
            our Service, you agree to be bound by these Terms. If you disagree with any part 
            of these Terms, then you may not access the Service.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white rounded-xl border border-neutral-200 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon size={24} className="text-blue-600" />
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
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-8 mt-12">
          <h3 className="text-xl font-bold text-neutral-900 mb-4">Contact Information</h3>
          <p className="text-neutral-700 mb-4">
            If you have any questions about these Terms of Use, please contact us:
          </p>
          <div className="space-y-2 text-neutral-700">
            <p><strong>Company:</strong> Ambika International</p>
            <p><strong>Email:</strong> ambika.international30@gmail.com</p>
            <p><strong>Phone:</strong> +91-98765 43210</p>
            <p><strong>Address:</strong> 25, Siddhi Vinayak Ind., B/h., Nayara Petrol Pump,
Opp. Opera Palace, Laskana - Kholwad Road,
Surat - 394190, Gujarat, India</p>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-neutral-100 rounded-xl border border-neutral-200 p-6 mt-8">
          <div className="flex items-start gap-3">
            <Scale size={24} className="text-neutral-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">Legal Notice</h4>
              <p className="text-sm text-neutral-700 leading-relaxed">
                These Terms of Use constitute a legally binding agreement between you and 
                Ambika International. The laws of India govern these Terms and any disputes 
                arising from or relating to these Terms or the Service will be subject to 
                the exclusive jurisdiction of the courts in [Your City, State].
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h4 className="text-lg font-semibold text-neutral-900 mb-4">Related Policies</h4>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/privacy-policy"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Shield size={16} />
              Privacy Policy
            </a>
            {/* <a
              href="/refund-policy"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <FileText size={16} />
              Refund Policy
            </a> */}
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

export default TermsOfUse;