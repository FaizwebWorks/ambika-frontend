import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useAddToCartMutation
} from '../store/api/authApiSlice';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // API hooks
  const {
    data: wishlistResponse,
    isLoading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishlist
  } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn
  });

  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const wishlistItems = wishlistResponse?.data?.items || [];

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (productId, productTitle) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success(`${productTitle} removed from wishlist`, {
        duration: 2000,
        position: 'bottom-center',
      });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        productId: product._id,
        quantity: 1
      }).unwrap();

      toast.success(`${product.name || product.title} added to cart!`, {
        duration: 2000,
        position: 'bottom-center',
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };

  // Loading state
  if (wishlistLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">Loading your wishlist</h3>
            <p className="text-slate-600 text-sm">Please wait while we fetch your items...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (wishlistError) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-red-50/20 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">Unable to load wishlist</h3>
          <p className="text-slate-600 mb-6 leading-relaxed">We encountered an issue while loading your wishlist. Please try again.</p>
          <Button
            onClick={refetchWishlist}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={20} className="text-slate-700" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900">My Wishlist</h1>
                <p className="text-slate-600 text-sm mt-0.5">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={24} className="text-red-500 fill-red-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {wishlistItems.length === 0 ? (
            // Empty Wishlist State
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart size={32} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Your wishlist is empty</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Save your favorite products to your wishlist and easily find them later.
                </p>

                <div className="space-y-4 mb-8">
                  <Button
                    onClick={() => navigate('/categories')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-semibold rounded-xl shadow-lg transition-all duration-300"
                  >
                    <ShoppingBag className="mr-3" size={20} />
                    Explore Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-10 rounded-xl font-medium"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Wishlist Items Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                const product = item.product || item;
                return (
                  <div key={product._id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200">
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name || product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id, product.name || product.title)}
                        disabled={isRemoving}
                        className="absolute top-3 right-3 z-10 p-2 bg-red-100 hover:bg-red-200 rounded-full backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                        <Heart size={18} className="text-red-500 fill-red-500" />
                      </button>

                      {/* Discount Badge */}
                      {product.discountPrice && (
                        <div className="absolute top-3 left-3 z-10">
                          <div className="bg-emerald-500 text-white px-2 py-1 rounded-lg font-bold text-sm">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link to={`/product/${product._id}`} className="block hover:text-blue-600 transition-colors duration-300">
                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 hover:text-blue-700">
                          {product.name || product.title}
                        </h3>
                      </Link>

                      {/* Category */}
                      <p className="text-sm text-blue-600 mb-3">
                        {product.category?.name || 'Uncategorized'}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        {product.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-emerald-600">
                              ₹{product.discountPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-slate-400 line-through font-medium">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-slate-900">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate(`/product/${product._id}`)}
                          variant="outline"
                          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl"
                        >
                          <Eye size={16} className="mr-2" />
                          View
                        </Button>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdding || product.stock === 0}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
                        >
                          {isAdding ? (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                          ) : (
                            <ShoppingBag size={16} className="mr-2" />
                          )}
                          {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
