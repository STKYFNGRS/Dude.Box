import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    items, 
    itemCount, 
    removeFromCart, 
    updateQuantity,
    isLoading,
    checkoutUrl,
    total
  } = useCart();

  const handleCheckout = () => {
    if (!checkoutUrl) {
      return;
    }
    window.location.href = checkoutUrl;
  };

  return (
    <div>
      {/* Cart Button with Counter */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Open shopping cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsOpen(false)}
            aria-label="Close shopping cart"
          />
          
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-gray-900 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Shopping Cart ({itemCount})</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-full"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
  <div key={item.id + item.variantId} className="flex gap-4 bg-gray-800 p-4 rounded-lg">
    <div className="relative w-20 h-20">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover rounded"
        sizes="(max-width: 80px) 100vw, 80px"
      />
    </div>
    
    <div className="flex-1">
      <div className="space-y-1">
        <h3 className="font-medium text-white">{item.title}</h3>
        {item.size && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Size:</span>
            <span className="text-sm font-medium text-gray-200">{item.size}</span>
          </div>
        )}
        <p className="text-sm font-medium text-blue-400">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          aria-label="Decrease quantity"
          disabled={isLoading}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          aria-label="Increase quantity"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => removeFromCart(item.id)}
          className="ml-auto text-red-500 hover:text-red-400 text-sm transition-colors"
          aria-label={`Remove ${item.title} from cart`}
          disabled={isLoading}
        >
          Remove
        </button>
      </div>
    </div>
  </div>
))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 border-t border-gray-800">
                  <div className="flex justify-between mb-4">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCheckout}
                    disabled={isLoading || !checkoutUrl}
                  >
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}