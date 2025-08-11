import { Button } from "../components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Star, Quote } from "lucide-react";
import { useEffect } from "react";

// Custom ScrollToTop component to reset scroll position on navigation
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  
  return null;
};

// Example images (replace with your own assets)
const categories = [
    {
        name: "Cleaning Essentials",
        img: "/cleaning.jpeg",
        link: "/categories?category=Cleaning%20Essentials"
    },
    {
        name: "Security",
        img: "/door-lock.jpeg",
        link: "/categories?category=Security"
    },
    {
        name: "Electronics",
        img: "/hair-dryer.jpeg",
        link: "/categories?category=Electronics"
    },
    {
        name: "Waste Management",
        img: "/dustbin-2.jpeg",
        link: "/categories?category=Waste%20Management"
    },
];

// Example featured products
const featuredProducts = [
    {
        id: 1,
        name: "Premium Luxury Towel Set",
        price: 149,
        img: "https://media.istockphoto.com/id/1205011453/photo/clean-terry-towels-on-wooden-chair-with-brick-wall-background-copy-space.jpg?s=612x612&w=0&k=20&c=Y-AFkM-p0amwdFAsvmODJNchLQu8sV_D_ht6XkiVxak=",
        category: "Room Supplies"
    },
    {
        id: 2,
        name: "Electronic Door Lock System",
        price: 349,
        img: "/door-lock2.jpg",
        category: "Security"
    },
    {
        id: 3,
        name: "Professional Cleaning Spray",
        price: 99,
        img: "https://media.istockphoto.com/id/1331969039/photo/cleaning-supplies-are-placed-on-a-wooden-table-for-cleaning.jpg?s=612x612&w=0&k=20&c=YOUKOOTxT6440GnMzYXNns6Ah88D-mKlx6qlyngdbnM=",
        category: "Cleaning Essentials"
    }
];

// Example testimonials
const testimonials = [
    {
        quote: "Ambika International has been our trusted supplier for over 5 years. Their products are consistently high quality and their service is excellent.",
        author: "Raj Sharma",
        position: "Hotel Operations Manager, Taj Hotels",
        rating: 5
    },
    {
        quote: "We rely on Ambika for all our housekeeping supplies. Their bulk delivery options and competitive pricing have saved us significant operational costs.",
        author: "Priya Patel",
        position: "Procurement Director, Leela Palace",
        rating: 5
    },
];

// Example trusted brands
const brands = ["brand1.svg", "brand2.svg", "brand3.svg", "brand4.svg", "brand5.svg"];

const Home = () => {
  const navigate = useNavigate();
  
  // Function to navigate to category page and ensure scroll to top
  const navigateToCategory = (link) => {
    navigate(link);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="home-page w-full">
      <ScrollToTop />
      
      {/* Enhanced Hero Section with background */}
      <div className="relative bg-gradient-to-r from-blue-50 to-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col items-center justify-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-semibold text-neutral-800 tracking-tight text-center leading-tight max-w-3xl">
            Premium Hotel Supplies for Exceptional Hospitality
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 text-center max-w-2xl mt-6">
            Trusted by India's leading hotels for quality essentials and exceptional service
          </p>
          <div className="flex flex-row sm:flex-row gap-4 mt-10">
            <Link to="/categories">
              <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                Shop Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-6 py-3 border border-neutral-200 text-neutral-800 hover:bg-neutral-50 rounded-lg">
                Contact Sales
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-3xl">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-blue-600">5000+</p>
              <p className="text-sm text-neutral-500 mt-1">Products Available</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-blue-600">300+</p>
              <p className="text-sm text-neutral-500 mt-1">Hotels Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-blue-600">15+</p>
              <p className="text-sm text-neutral-500 mt-1">Years Experience</p>
            </div>
          </div>
        </div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Categories Section - Enhanced with title */}
      <div className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-neutral-800">Shop By Category</h2>
            <p className="text-neutral-500 mt-3 max-w-2xl mx-auto">
              Browse our curated collections of premium hotel and shop supplies
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {categories.map((cat) => (
              // Replace Link with onClick handler to ensure scroll reset
              <div 
                key={cat.name}
                onClick={() => navigateToCategory(cat.link)}
                className="cursor-pointer"
              >
                <div className="relative bg-neutral-50 w-full aspect-[4/5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end pb-6 px-2 text-center">
                    <span className="text-white font-medium text-base sm:text-lg">{cat.name}</span>
                    <span className="text-blue-200 text-sm flex items-center mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition">
                      View Collection <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="w-full py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-semibold text-neutral-800">Featured Products</h2>
              <p className="text-neutral-500 mt-3 max-w-xl">
                Our best selling items trusted by leading hospitality businesses
              </p>
            </div>
            <div 
              onClick={() => navigateToCategory("/categories")}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-4 md:mt-0 cursor-pointer"
            >
              View All Products <ArrowRight size={16} className="ml-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-out"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-blue-600">{product.category}</span>
                    <h3 className="font-medium text-lg text-neutral-800 mt-1">{product.name}</h3>
                    <p className="text-neutral-900 font-semibold mt-3">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features/Benefits Section - Enhanced version */}
      <div className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-neutral-800">Why Choose Ambika</h2>
            <p className="text-neutral-500 mt-3 max-w-2xl mx-auto">
              We're committed to excellence in hospitality supplies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="bg-blue-50 h-16 w-16 flex items-center justify-center rounded-lg mb-6">
                <img
                  src="/truck.svg"
                  alt="Fast Delivery"
                  className="h-8 w-8 text-blue-600"
                />
              </div>
              <h3 className="font-semibold text-xl text-neutral-800 mb-3">
                Bulk & Fast Delivery
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                Get wholesale rates and quick delivery for all your hotel and shop supplies. We deliver bulk orders efficiently, so you never run out of essentials.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="bg-blue-50 h-16 w-16 flex items-center justify-center rounded-lg mb-6">
                <img
                  src="/star-badge.svg"
                  alt="Quality Guarantee"
                  className="h-8 w-8 text-blue-600"
                />
              </div>
              <h3 className="font-semibold text-xl text-neutral-800 mb-3">
                Quality Assurance
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                Trusted by hotels and retailers for premium products. Every item is carefully sourced and quality-checked to meet your business standards.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="bg-blue-50 h-16 w-16 flex items-center justify-center rounded-lg mb-6">
                <img
                  src="/shield-check.svg"
                  alt="Secure Payment"
                  className="h-8 w-8 text-blue-600"
                />
              </div>
              <h3 className="font-semibold text-xl text-neutral-800 mb-3">
                Secure Wholesale Payments
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                Your business transactions are safe with us. Multiple secure payment options for hassle-free ordering and invoicing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-neutral-800">What Our Clients Say</h2>
            <p className="text-neutral-500 mt-3 max-w-2xl mx-auto">
              Trusted by India's leading hospitality brands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-100" />
                  <p className="text-neutral-700 italic relative z-10 pl-6">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <p className="font-medium text-neutral-800">{testimonial.author}</p>
                  <p className="text-sm text-neutral-500">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trusted Brands Section */}
      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-xl font-medium text-neutral-500">Trusted by Leading Brands</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {brands.map((brand, index) => (
              <img 
                key={index} 
                src={`/${brand}`} 
                alt="Partner Brand" 
                className="h-6 md:h-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-neutral-800">Ready to Transform Your Supply Chain?</h2>
            <p className="text-neutral-600 mt-4 max-w-2xl mx-auto text-lg">
              Join hundreds of hotels and businesses that trust Ambika International
            </p>
            <div className="mt-10 flex sm:flex-row gap-4 justify-center">
              <Button 
                className="w-fit px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                onClick={() => navigateToCategory("/categories")}
              >
                Browse Products
              </Button>
              <Button 
                variant="outline" 
                className=" w-fit px-8 py-3 border border-neutral-200 text-neutral-800 bg-white hover:bg-neutral-50 rounded-lg"
                onClick={() => navigateToCategory("/contact")}
              >
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="w-full py-16 bg-white border-t border-neutral-100">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-medium text-neutral-800">Stay Updated</h3>
          <p className="text-neutral-500 mt-3 mb-6">
            Subscribe for exclusive offers and industry insights
          </p>
          <div className="flex flex-row sm:flex-row gap-3 items-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:outline-none"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm px-6 py-3 h-full whitespace-nowrap">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            By subscribing, you agree to our Privacy Policy. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;