import React, { useState, useEffect } from 'react';
import { Package, Calendar, CreditCard, Eye, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    height?: number;
    width?: number;
    area?: string;
    quantity?: number;
    type?: string;
    description?: string;
  };
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number | string | null;
  status: string;
  payment_method: string;
  billing_info: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  created_at: string;
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount =
      typeof amount === 'number'
        ? amount
        : typeof amount === 'string'
          ? parseFloat(amount)
          : 0;

    if (!Number.isFinite(numericAmount)) {
      return '0.00';
    }

    return numericAmount.toFixed(2);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOrders();
      setOrders(response.orders || []);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <Package className="h-5 w-5" />
            <span>Back to Orders</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Order Header */}
          <div className="bg-gray-50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{selectedOrder.order_number}
                </h2>
                <p className="text-gray-600 mt-1">
                  Placed on {formatDate(selectedOrder.created_at)}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                {getStatusIcon(selectedOrder.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    {item.customization && (
                      <div className="mt-1 text-sm text-gray-600">
                        {item.customization.height && item.customization.width && (
                          <div>
                            Dimensions: {item.customization.height}" × {item.customization.width}"
                            {item.customization.area && ` (${item.customization.area} sq ft)`}
                          </div>
                        )}
                        {item.customization.type === 'gift' && item.customization.description && (
                          <div>{item.customization.description}</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">₹{formatCurrency(item.price)}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          <div className="p-6 border-t bg-gray-50">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> {selectedOrder.billing_info.email}</div>
                  <div><strong>Phone:</strong> {selectedOrder.billing_info.phone}</div>
                  <div><strong>Address:</strong> {selectedOrder.billing_info.address}</div>
                  <div><strong>City:</strong> {selectedOrder.billing_info.city}</div>
                  <div><strong>State:</strong> {selectedOrder.billing_info.state}</div>
                  <div><strong>PIN Code:</strong> {selectedOrder.billing_info.pincode}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                    <span><strong>Payment Method:</strong> {selectedOrder.payment_method}</span>
                  </div>
                  <div><strong>Total Amount:</strong> ₹{formatCurrency(selectedOrder.total_amount)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your glass product orders</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchOrders}
            className="mt-2 text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">You haven't placed any orders yet. Start shopping to see your orders here!</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.order_number}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{order.payment_method}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">
                        ₹{formatCurrency(order.total_amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          {item.customization && item.customization.height && item.customization.width && (
                            <span className="text-gray-600 ml-2">
                              ({item.customization.height}" × {item.customization.width}")
                            </span>
                          )}
                        </div>
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-sm text-gray-500">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};