import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Users, 
  Globe, 
  Target, 
  Heart, 
  Truck, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [counters, setCounters] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Company stats
  const stats = [
    { number: '12+', label: 'Years of Excellence', icon: Calendar, value: 12 },
    { number: '1000+', label: 'Happy Clients', icon: Users, value: 1000 },
    { number: '100,000+', label: 'Products Delivered', icon: Truck, value: 100000 },
    { number: '99.9%', label: 'Client Satisfaction', icon: Star, value: 99.9 }
  ];

  // Animation function for counting numbers
  const animateCounter = (targetValue, index, suffix = '') => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }
      
      setCounters(prev => ({
        ...prev,
        [index]: current
      }));
    }, duration / steps);
  };

  // Intersection Observer to trigger animation when stats come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Start animations for each stat
          stats.forEach((stat, index) => {
            setTimeout(() => {
              animateCounter(stat.value, index);
            }, index * 200); // Stagger animations
          });
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  // Format number for display
  const formatNumber = (value, index) => {
    const roundedValue = Math.floor(value);
    
    switch (index) {
      case 0: // Years
        return `${roundedValue}+`;
      case 1: // Clients  
        return roundedValue >= 1000 ? `${Math.floor(roundedValue / 1000)}k+` : `${roundedValue}+`;
      case 2: // Products
        return roundedValue >= 100000 ? `${Math.floor(roundedValue / 1000)}k+` : `${roundedValue.toLocaleString()}+`;
      case 3: // Satisfaction
        return `${value.toFixed(1)}%`;
      default:
        return roundedValue.toString();
    }
  };

  // Core values
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make starts with understanding and prioritizing our customers\' needs.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We maintain the highest standards in product quality and service delivery.'
    },
    {
      icon: Globe,
      title: 'Innovation',
      description: 'Continuously evolving to bring the latest solutions to the hospitality industry.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Striving for excellence in every interaction, product, and service we provide.'
    }
  ];

  // Team members
  const team = [
    {
      name: 'Haresh Vaghasiya',
      position: 'Founder & CEO',
      image: '/team-member-1.jpg',
      description: 'With over 12 years in the hospitality supply industry, Haresh Vaghasiya founded Ambika International with a vision to revolutionize hotel amenity supply chains.'
    },
    {
      name: 'Vishal Vaghasiya',
      position: 'Operations Director',
      image: '/team-member-2.jpg',
      description: 'Vishal Vaghasiya oversees our day-to-day operations, ensuring seamless delivery and maintaining our high service standards across all client relationships.'
    },
    {
      name: 'Rinkesh Vaghasiya',
      position: 'Quality Manager',
      image: '/team-member-3.jpg',
      description: 'Riknesh Vaghasiya leads our quality assurance team, implementing rigorous testing protocols to ensure every product meets our exacting standards.'
    }
  ];

  // Milestones
  const milestones = [
    {
      year: '2013',
      title: 'Company Founded',
      description: 'Started as a small family business with a passion for quality hospitality supplies.'
    },
    {
      year: '2015',
      title: 'First Major Partnership',
      description: 'Secured our first major hotel chain partnership, establishing our reputation in the industry.'
    },
    {
      year: '2020',
      title: 'Product Line Expansion',
      description: 'Expanded our product range to include comprehensive cleaning and security solutions.'
    },
    {
      year: '2025',
      title: 'Digital Transformation',
      description: 'Launched our online platform and modernized our supply chain management systems.'
    },
    // {
    //   year: '2023',
    //   title: 'Sustainability Initiative',
    //   description: 'Introduced eco-friendly product lines and sustainable packaging solutions.'
    // }
  ];

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-neutral-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-neutral-800 mb-6">
              About Ambika International
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              For over 15 years, we've been the trusted partner for hotels and businesses across India, 
              providing premium quality amenities and exceptional service that defines hospitality excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 hover:scale-110">
                    <IconComponent className="text-blue-600" size={28} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
                    {formatNumber(counters[index] || 0, index)}
                  </div>
                  <div className="text-neutral-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values Section */}
      <div className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-neutral-800 mb-4">Our Foundation</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Built on strong values and a clear vision for the future of hospitality supply chains.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 border-b border-neutral-200">
            {[
              { id: 'mission', label: 'Our Mission' },
              { id: 'vision', label: 'Our Vision' },
              { id: 'values', label: 'Our Values' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'mission' && (
              <div className="text-center">
                <div className="bg-blue-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <Target className="text-blue-600" size={36} />
                </div>
                <h3 className="text-2xl font-semibold text-neutral-800 mb-4">Our Mission</h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  To revolutionize the hospitality supply industry by providing premium quality products, 
                  exceptional service, and innovative solutions that enable our clients to deliver 
                  outstanding guest experiences while optimizing their operational efficiency.
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="text-center">
                <div className="bg-blue-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <Globe className="text-blue-600" size={36} />
                </div>
                <h3 className="text-2xl font-semibold text-neutral-800 mb-4">Our Vision</h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  To become India's most trusted and innovative hospitality supply partner, setting new 
                  standards for quality, sustainability, and customer service while expanding our reach 
                  to serve businesses across the globe.
                </p>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl p-6 border border-neutral-100">
                      <div className="bg-blue-50 rounded-lg h-12 w-12 flex items-center justify-center mb-4">
                        <IconComponent className="text-blue-600" size={24} />
                      </div>
                      <h4 className="text-xl font-medium text-neutral-800 mb-3">{value.title}</h4>
                      <p className="text-neutral-600">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-neutral-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  Founded in 2013 in the heart of Surat, Gujarat, Ambika International began as a family-owned 
                  business with a simple yet powerful vision: to provide the hospitality industry with products 
                  and services that truly make a difference.
                </p>
                <p>
                  What started as a small operation has grown into one of India's most trusted hospitality 
                  supply partners, serving over 1000+ hotels, resorts, and businesses across the country. 
                  Our growth has been fueled by our unwavering commitment to quality, innovation, and 
                  customer satisfaction.
                </p>
                <p>
                  Today, we offer a comprehensive range of products from cleaning essentials and security 
                  solutions to electronics and waste management systems. Every product in our catalog is 
                  carefully selected and rigorously tested to meet the highest standards of quality and reliability.
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all group"
                >
                  Get in Touch
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div 
                className="relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-3xl p-12 h-96 flex items-center justify-center border border-white/20 shadow-lg"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.15)"
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Animated dots pattern */}
                <motion.div 
                  className="absolute inset-0 opacity-30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }}>
                    <motion.div
                      className="w-full h-full"
                      animate={{ 
                        backgroundPosition: ['0px 0px', '40px 40px', '0px 0px']
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
                </motion.div>

                {/* Animated floating geometric shapes */}
                <motion.div
                  className="absolute top-8 right-8 w-3 h-3 bg-blue-400/40 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.4, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  animate={{ 
                    y: [-8, 8, -8],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-8 left-8 w-2 h-8 bg-indigo-400/30 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.3, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.6 }}
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Main content with staggered animations */}
                <motion.div 
                  className="text-center relative z-10"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Icon with enhanced animation */}
                  <motion.div 
                    className="relative mx-auto mb-6 w-20 h-20"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <motion.div
                      className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                      whileHover={{ 
                        boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.2)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Animated glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl"
                        animate={{ 
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Rotating border */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border border-blue-300/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />
                      
                      <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <Award className="text-blue-600" size={32} />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Text content with staggered reveal */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <motion.h3 
                      className="text-2xl font-semibold text-neutral-800 mb-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      12+ Years of Excellence
                    </motion.h3>
                    <motion.p 
                      className="text-neutral-600 leading-relaxed max-w-sm mx-auto"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      Serving the hospitality industry with dedication and innovation
                    </motion.p>
                  </motion.div>

                  {/* Animated decorative line */}
                  <motion.div
                    className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-6"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                  />
                </motion.div>

                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                >
                  <motion.div 
                    className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-300/50 rounded-tr-xl"
                    animate={{ 
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-neutral-800 mb-4">Our Journey</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Key milestones that have shaped our growth and commitment to excellence.
            </p>
          </motion.div>

          <div className="relative">
            {/* Animated Timeline line */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-blue-200 hidden md:block"
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            ></motion.div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={index} 
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    delay: index * 0.2 
                  }}
                >
                  {/* Animated Timeline dot */}
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 h-4 w-4 bg-blue-600 rounded-full border-4 border-white shadow-lg hidden md:block"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      ease: "easeOut",
                      delay: 0.5 + (index * 0.2)
                    }}
                    whileHover={{ scale: 1.2 }}
                  ></motion.div>
                  
                  {/* Animated Content */}
                  <motion.div 
                    className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <motion.div 
                      className="bg-white rounded-xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
                        borderColor: "rgba(59, 130, 246, 0.2)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="flex items-center gap-4 mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + (index * 0.2), duration: 0.4 }}
                      >
                        <motion.span 
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {milestone.year}
                        </motion.span>
                      </motion.div>
                      <motion.h3 
                        className="text-xl font-semibold text-neutral-800 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + (index * 0.2), duration: 0.4 }}
                      >
                        {milestone.title}
                      </motion.h3>
                      <motion.p 
                        className="text-neutral-600"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + (index * 0.2), duration: 0.4 }}
                      >
                        {milestone.description}
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-neutral-800 mb-4">Meet Our Leadership</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              The experienced professionals behind Ambika International's success story.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-100 to-neutral-100 rounded-2xl h-64 flex items-center justify-center mb-6">
                  <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center shadow-lg">
                    <Users className="text-blue-600" size={36} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                <p className="text-neutral-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-neutral-800 mb-4">Why Choose Ambika International?</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We go beyond just supplying products - we provide solutions that drive your business success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Quality Guaranteed',
                description: 'Every product undergoes rigorous quality testing to ensure it meets our high standards.'
              },
              {
                icon: Truck,
                title: 'Reliable Delivery',
                description: 'Timely delivery across India with real-time tracking and dedicated customer support.'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: 'Our experienced team provides personalized consultation and ongoing support.'
              },
              {
                icon: Shield,
                title: 'Trusted Partner',
                description: '12+ years of experience serving 1000+ satisfied customers across the hospitality industry.'
              },
              {
                icon: Star,
                title: 'Competitive Pricing',
                description: 'Best-in-class products at competitive prices with flexible bulk ordering options.'
              },
              {
                icon: Globe,
                title: 'Innovation Focus',
                description: 'Continuously updating our product range with the latest innovations and eco-friendly solutions.'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-neutral-100">
                  <div className="bg-blue-50 rounded-lg h-12 w-12 flex items-center justify-center mb-4">
                    <IconComponent className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">Ready to Partner with Us?</h2>
              </div>
              <p className="text-slate-300">Join hundreds of businesses that trust Ambika International for their hospitality supply needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-2xl">⭐</div>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">500+</p>
                  <p className="font-semibold mb-2">Happy Customers</p>
                  <p className="text-slate-400 text-sm">Premium hotels & resorts across India trust our solutions</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-2xl">🚚</div>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">Same Day</p>
                  <p className="font-semibold mb-2">Express Delivery</p>
                  <p className="text-slate-400 text-sm">Lightning-fast delivery in major metropolitan cities</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-2xl">🛡️</div>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">30-Day</p>
                  <p className="font-semibold mb-2">Hassle-Free Returns</p>
                  <p className="text-slate-400 text-sm">Complete satisfaction guarantee with premium support</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center py-3 px-8 bg-white text-slate-800 rounded-lg font-medium hover:bg-slate-100 transition-all"
              >
                Contact Us Today
              </a>
              <a
                href="/categories"
                className="inline-flex items-center justify-center py-3 px-8 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-slate-800 transition-all"
              >
                Browse Products
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;