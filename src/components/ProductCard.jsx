import { Link } from 'react-router-dom';

const ProductCard = ({ product, isLoggedIn }) => (
  <Link to={`/product/${product.id}`} className="block">
    <div className="bg-white rounded-lg overflow-hidden border border-neutral-100 transition-all duration-300 flex flex-col group">
      {/* Image container with proper aspect ratio */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Content with clean spacing */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-medium text-neutral-800 mb-2 line-clamp-2 min-h-[48px] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Size variants with subtle styling */}
        {product.size && Array.isArray(product.size) && product.size.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.size.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 border border-neutral-200 rounded-full text-neutral-600">
                {s}
              </span>
            ))}
          </div>
        )}
        
        {/* Availability with clean indicator */}
        <div className="mt-auto flex items-center">
          <span className={`inline-block h-2 w-2 rounded-full mr-2 ${product.inStock ? "bg-emerald-500" : "bg-red-400"}`}></span>
          <span className="text-xs text-neutral-500">
            {product.inStock ? "Available" : "Out of stock"}
          </span>
        </div>
        
        {/* Price with premium typography */}
        {isLoggedIn ? (
          <div className="mt-3 font-medium text-neutral-900">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
        ) : (
          <div className="mt-3 text-neutral-400 text-xs font-medium">
            Sign in to view price
          </div>
        )}
      </div>
    </div>
  </Link>
);

export default ProductCard;