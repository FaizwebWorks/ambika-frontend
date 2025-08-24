import {
    AlertCircle,
    ArrowLeft,
    Award,
    Check,
    Crown,
    FileText,
    Heart,
    Info,
    Layers,
    Loader2,
    Minus,
    Package,
    Plus,
    RotateCcw,
    Ruler,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck,
    Weight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import {
    useAddToCartMutation,
    useAddToWishlistMutation,
    useGetWishlistQuery,
    useRemoveFromWishlistMutation
} from '../store/api/authApiSlice';
import { useGetProductsQuery, useGetPublicProductByIdQuery } from '../store/api/publicApiSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);

    // Fetch product data from backend
    const {
        data: productResponse,
        isLoading,
        error
    } = useGetPublicProductByIdQuery(id);

    const product = productResponse?.data?.product;

    // Fetch related products (same category)
    const {
        data: relatedProductsResponse
    } = useGetProductsQuery(
        product?.category?._id ? { category: product.category._id, limit: 4 } : {},
        { skip: !product?.category?._id }
    );

    const relatedProducts = relatedProductsResponse?.data?.products?.filter(p => p._id !== id) || [];

    // Cart mutation
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

    // Wishlist API hooks
    const { data: wishlistResponse } = useGetWishlistQuery(undefined, {
        skip: !isLoggedIn
    });
    const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
    const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();

    // Check if current product is in wishlist
    const wishlistItems = wishlistResponse?.data?.items || [];
    const wishlistProductIds = wishlistItems.map(item => item.product?._id || item.productId);
    const isProductInWishlist = wishlistProductIds.includes(product?._id);

    // Local state
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Reset states when product changes
    useEffect(() => {
        if (product) {
            setSelectedImage(0);
            setQuantity(product.minOrderQuantity || 1);
        }
    }, [product]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-blue-600 mb-4 mx-auto" />
                    <h3 className="text-lg font-medium text-neutral-800 mb-2">Loading product...</h3>
                    <p className="text-neutral-500">Please wait while we fetch the product details.</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                        <AlertCircle size={24} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 mb-2">Product not found</h3>
                    <p className="text-neutral-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <Button
                        onClick={() => navigate('/categories')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }

    // No product data
    if (!product) {
        return null;
    }

    const images = product.images || [];
    const inStock = product.stock > 0;

    // Handle quantity change
    const handleQuantityChange = (change) => {
        setQuantity(Math.max(1, Math.min(product.stock, quantity + change)));
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            const cartData = {
                productId: product._id,
                quantity: quantity
            };

            await addToCart(cartData).unwrap();

            // Show success toast
            toast.success(`${product.title} added to cart successfully!`, {
                duration: 3000,
                position: 'top-center',
            });

            // Navigate to cart page after successful addition
            navigate('/cart');

        } catch (error) {
            console.error('Failed to add to cart:', error);

            // Show error toast
            if (error?.data?.message) {
                toast.error(`Error: ${error.data.message}`, {
                    duration: 4000,
                    position: 'top-center',
                });
            } else if (error?.status === 401) {
                toast.error('Please sign in to add items to cart', {
                    duration: 4000,
                    position: 'top-center',
                });
                navigate('/login');
            } else {
                toast.error('Failed to add product to cart. Please try again.', {
                    duration: 4000,
                    position: 'top-center',
                });
            }
        }
    };

    // Handle wishlist toggle
    const handleWishlistToggle = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            if (isProductInWishlist) {
                await removeFromWishlist(product._id).unwrap();
                toast.success(`${product.title} removed from wishlist`, {
                    duration: 2000,
                    position: 'bottom-center',
                });
            } else {
                await addToWishlist(product._id).unwrap();
                toast.success(`${product.title} added to wishlist`, {
                    duration: 2000,
                    position: 'bottom-center',
                });
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            toast.error('Failed to update wishlist. Please try again.', {
                duration: 3000,
                position: 'bottom-center',
            });
        }
    };

    // Handle share
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (error) {
                // User cancelled sharing or error occurred
                console.log('Sharing cancelled or failed');
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Product link copied to clipboard!', {
                    duration: 2000,
                    position: 'top-center',
                });
            } catch (error) {
                toast.error('Failed to copy link to clipboard', {
                    duration: 2000,
                    position: 'top-center',
                });
            }
        }
    };

    return (
        <div className="bg-white min-h-screen w-full">
            {/* Header */}
            <div className="border-b border-neutral-100 sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleWishlistToggle}
                                disabled={isAddingToWishlist || isRemovingFromWishlist}
                                className={`p-2 rounded-full transition-all ${isProductInWishlist
                                        ? 'bg-red-50 text-red-600'
                                        : 'hover:bg-neutral-100 text-neutral-600'
                                    }`}
                            >
                                <Heart
                                    size={20}
                                    className={isProductInWishlist ? 'fill-red-500' : ''}
                                />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-50">
                            {images.length > 0 ? (
                                <img
                                    src={images[selectedImage]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package size={64} className="text-neutral-300" />
                                </div>
                            )}
                        </div>

                        {/* Image Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-blue-500 shadow-lg'
                                                : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 leading-tight">
                                    {product.title}
                                    {product.featured && (
                                        <span className="ml-3 inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                                            <Crown size={14} className="mr-1" />
                                            Featured
                                        </span>
                                    )}
                                </h1>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-neutral-600">
                                        Category: {product.category?.name || 'Uncategorized'}
                                    </p>
                                    {product.avgRating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < Math.floor(product.avgRating) 
                                                            ? 'text-yellow-400 fill-yellow-400' 
                                                            : 'text-neutral-300'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-neutral-600">
                                                {product.avgRating.toFixed(1)} ({product.numReviews} reviews)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-neutral-900">
                                        ₹{(product.discountPrice || product.price)?.toLocaleString('en-IN')}
                                    </span>
                                    {product.discountPrice && product.discountPrice < product.price && (
                                        <>
                                            <span className="text-xl text-neutral-500 line-through">
                                                ₹{product.price?.toLocaleString('en-IN')}
                                            </span>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Quick Specs */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-xl">
                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <Check size={16} className="text-green-600" />
                                        <span className="text-sm text-neutral-700">In Stock ({product.stock})</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={16} className="text-red-600" />
                                        <span className="text-sm text-neutral-700">Out of Stock</span>
                                    </div>
                                )}

                                {product.specifications?.material && (
                                    <div className="flex items-center gap-2">
                                        <Layers size={16} className="text-neutral-500" />
                                        <span className="text-sm text-neutral-700">{product.specifications.material}</span>
                                    </div>
                                )}

                                {product.specifications?.dimensions && (
                                    <div className="flex items-center gap-2">
                                        <Ruler size={16} className="text-neutral-500" />
                                        <span className="text-sm text-neutral-700">{product.specifications.dimensions}</span>
                                    </div>
                                )}

                                {product.specifications?.weight && (
                                    <div className="flex items-center gap-2">
                                        <Weight size={16} className="text-neutral-500" />
                                        <span className="text-sm text-neutral-700">{product.specifications.weight}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        {inStock && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-neutral-900">Quantity:</span>
                                    <div className="flex items-center border border-neutral-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.stock}
                                            className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <span className="text-sm text-neutral-600">
                                        (Min: {product.minOrderQuantity || 1}
                                        {product.maxOrderQuantity && `, Max: ${product.maxOrderQuantity}`})
                                    </span>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart || !inStock}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin mr-2" />
                                            Adding to Cart...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={20} className="mr-2" />
                                            Add to Cart
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-t border-neutral-100">
                            <div className="flex flex-col items-center text-center">
                                <Shield size={24} className="text-green-600 mb-2" />
                                <span className="text-sm font-medium text-neutral-700">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Truck size={24} className="text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-neutral-700">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <RotateCcw size={24} className="text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-neutral-700">Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16 border-t border-neutral-100 pt-8">
            <div className="flex border-b border-neutral-100 mb-8 overflow-x-auto">
                {[
                    { id: 'description', label: 'Description', icon: FileText },
                    { id: 'specifications', label: 'Specifications', icon: Info },
                    { id: 'warranty', label: 'Warranty & Support', icon: Shield }
                ].map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 px-6 py-3 text-nowrap font-medium transition-colors ${activeTab === id
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>                    <div className="max-w-4xl">
                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="prose prose-neutral max-w-none">
                                <p className="text-neutral-700 leading-relaxed text-lg">
                                    {product.description}
                                </p>

                                {/* Quality Level */}
                                {product.quality && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award size={20} className="text-blue-600" />
                                            <span className="font-semibold text-blue-900">Quality Level</span>
                                        </div>
                                        <p className="text-blue-800">{product.quality}</p>
                                    </div>
                                )}

                                {/* Usage Information */}
                                {product.specifications?.usage && (
                                    <div className="mt-4 p-4 bg-green-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Info size={20} className="text-green-600" />
                                            <span className="font-semibold text-green-900">Usage</span>
                                        </div>
                                        <p className="text-green-800">{product.specifications.usage}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Specifications Tab */}
                        {activeTab === 'specifications' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Basic Specifications */}
                                    {[
                                        { label: 'Material', value: product.specifications?.material, icon: Layers },
                                        { label: 'Dimensions', value: product.specifications?.dimensions, icon: Ruler },
                                        { label: 'Warranty', value: product.specifications?.warranty, icon: Shield }
                                    ].filter(spec => spec.value).map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl">
                                            <Icon size={20} className="text-neutral-500 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-neutral-900">{label}</h4>
                                                <p className="text-neutral-600 mt-1">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* No specifications message */}
                                {!product.specifications?.material && !product.specifications?.dimensions && !product.specifications?.warranty && (
                                    <div className="text-center py-8">
                                        <Info size={48} className="text-neutral-400 mx-auto mb-4" />
                                        <p className="text-neutral-600">No detailed specifications available for this product.</p>
                                    </div>
                                )}

                                {/* Additional Specifications */}
                                {product.specifications && typeof product.specifications === 'object' && (
                                    <div className="space-y-3">
                                        {Object.entries(product.specifications)
                                            .filter(([key]) => !['material', 'dimensions', 'weight', 'packaging', 'certifications', 'usage', 'warranty'].includes(key))
                                            .map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center py-3 border-b border-neutral-100">
                                                    <span className="font-medium text-neutral-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span className="text-neutral-600">{value}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Warranty Tab */}
                        {activeTab === 'warranty' && (
                            <div className="space-y-6">
                                {product.specifications?.warranty ? (
                                    <div className="p-6 bg-green-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield size={24} className="text-green-600" />
                                            <h4 className="text-xl font-semibold text-green-900">Warranty Coverage</h4>
                                        </div>
                                        <p className="text-green-800 text-lg">{product.specifications.warranty}</p>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-neutral-50 rounded-xl">
                                        <p className="text-neutral-600">Warranty information not specified for this product.</p>
                                    </div>
                                )}

                                {/* Support Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 border border-neutral-200 rounded-xl">
                                        <h5 className="font-semibold text-neutral-900 mb-2">Customer Support</h5>
                                        <p className="text-neutral-600 text-sm">Get help with your product through our customer support team.</p>
                                    </div>
                                    <div className="p-4 border border-neutral-200 rounded-xl">
                                        <h5 className="font-semibold text-neutral-900 mb-2">Return Policy</h5>
                                        <p className="text-neutral-600 text-sm">Easy returns within the specified return period.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 border-t border-neutral-100 pt-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct._id}
                                    product={relatedProduct}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;

