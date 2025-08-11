import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);

    // Actual form submission would go here
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formState),
    // });
    // if (response.ok) {
    //   setIsSubmitting(false);
    //   setIsSubmitted(true);
    //   setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
    // } else {
    //   setIsSubmitting(false);
    //   // Handle error
    // }
  };

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-neutral-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-neutral-800 mb-4">Get in Touch</h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Have questions about our products or services? Our team is here to help you find the perfect solution for your business needs.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-8">
            <h2 className="text-2xl font-medium text-neutral-800 mb-6">Send us a message</h2>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-medium text-neutral-800 mb-2">Message Sent!</h3>
                <p className="text-center text-neutral-600">
                  Thank you for contacting us. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:outline-none transition-all"
                    placeholder="Product inquiry"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:outline-none transition-all"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-medium transition-all
                    ${isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'}
                  `}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-medium text-neutral-800 mb-6">Contact Information</h2>

            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <div className="bg-blue-50 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Office Address</h3>
                  <p className="text-neutral-600">
                    25, Siddhi Vinayak Ind., B/h., Nayara Petrol Pump,<br />
                    Opp. Opera Palace, Laskana - Kholwad Road,<br />
                    Surat - 394190, Gujarat, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-50 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Phone</h3>
                  <p className="text-neutral-600">
                    Sales: <a href="tel:+919876543210" className="text-blue-600 hover:underline">+91 98765 43210</a><br />
                    Support: <a href="tel:+919876543211" className="text-blue-600 hover:underline">+91 98765 43211</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-50 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Email</h3>
                  <p className="text-neutral-600">
                    Sales: <a href="mailto:sales@ambikainternational.com" className="text-blue-600 hover:underline">sales@ambikainternational.com</a><br />
                    Info: <a href="mailto:info@ambikainternational.com" className="text-blue-600 hover:underline">info@ambikainternational.com</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-50 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Business Hours</h3>
                  <p className="text-neutral-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
              <h3 className="font-medium text-neutral-800 mb-3">Bulk Orders & Special Requests</h3>
              <p className="text-neutral-600 mb-4">
                For large wholesale orders or custom product requirements, please contact our dedicated business team.
              </p>
              <a
                href="mailto:wholesale@ambikainternational.com"
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
              >
                Contact Wholesale Team
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-medium text-neutral-800 mb-6 text-center">Find Us</h2>
          <div className="relative overflow-hidden rounded-2xl shadow-sm border border-neutral-200 h-96 md:h-[500px]">
            {/* Updated Google Maps embed URL for Nayara Petrol Pump on Laskana-Kholvad Road */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238.08562927104284!2d72.93299567247027!3d21.264227399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04796e884b3cb%3A0x43a7a434f2ec23d3!2sNayara%20Petrol%20Pump!5e0!3m2!1sen!2sin!4v1691912563175!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ambika International Office Location near Nayara Petrol Pump"
              className="absolute inset-0"
            />
          </div>

         {/* Direction links with minimal modern styling */}
<div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
  <a
    href="https://www.google.com/maps/dir/Surat+Junction,+Railway+Station+Circle,+Railway+Station+Area,+Varachha,+Surat,+Gujarat/Nayara+Petrol+Pump,+Laskana-Kholvad+Rd,+near+Shyam+Vatika+residency,+Bhada,+Gujarat+394190/@21.2641294,72.9330132,21z/data=!4m13!4m12!1m5!1m1!1s0x3be04fb2a64a922f:0xf5c5fbd871f68587!2m2!1d72.8406794!2d21.2050439!1m5!1m1!1s0x3be04796e884b3cb:0x43a7a434f2ec23d3!2m2!1d72.932989!2d21.2642274?entry=ttu"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center px-5 py-2.5 bg-neutral-100 hover:bg-blue-50 border-none rounded-md text-neutral-700 font-medium transition-colors flex-1 sm:flex-initial"
  >
    <MapPin size={16} className="text-blue-600 mr-2" />
    Directions from Surat Junction
  </a>

  <a
    href="https://www.google.com/maps/dir/Surat+International+Airport+(STV),+Surat,+Gujarat/Nayara+Petrol+Pump,+Laskana-Kholvad+Rd,+near+Shyam+Vatika+residency,+Bhada,+Gujarat+394190/@21.2641294,72.9330132,21z"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center px-5 py-2.5 bg-neutral-100 hover:bg-blue-50 border-none rounded-md text-neutral-700 font-medium transition-colors flex-1 sm:flex-initial"
  >
    <MapPin size={16} className="text-blue-600 mr-2" />
    Directions from Surat Airport
  </a>
</div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-50 to-neutral-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-medium text-neutral-800 mb-3">Have More Questions?</h2>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Check our frequently asked questions section to find quick answers about our products, ordering process, and more.
          </p>
          <a
            href="/faq"
            className="inline-flex items-center justify-center py-3 px-6 rounded-lg bg-white border border-neutral-200 text-neutral-800 font-medium hover:bg-neutral-100 transition-all"
          >
            View FAQ
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact