import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = ({ user, setIsLoginOpen }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (window.confirm('Você precisa estar logado para ver seus pedidos. Deseja fazer login agora?')) {
        setIsLoginOpen(true);
      } else {
        navigate('/');
      }
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        alert('Erro ao carregar pedidos. Tente novamente.');
      }
    };

    fetchOrders();
  }, [user, setIsLoginOpen, navigate]);

  if (!user) {
    return null; // Redireciona antes de renderizar
  }

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen pb-16">
      <h1 className="text-3xl font-bold text-[#e63946] mb-6 text-center">Meus Pedidos</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Pedido #{order._id}
              </h2>

              {/* Itens do Pedido */}
              <div className="mb-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">Itens:</h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{item.product.name} (x{item.quantity})</p>
                        <p className="text-gray-600 text-sm">
                          R$ {item.product.price.toFixed(2)} cada
                        </p>
                      </div>
                      <p className="font-semibold">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="text-right mb-4">
                <p className="text-lg font-bold text-gray-800">
                  Total: R$ {order.total.toFixed(2)}
                </p>
              </div>

              {/* Opção de Entrega */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-1">Entrega:</h3>
                {order.deliveryOption === 'delivery' ? (
                  <div className="text-gray-600">
                    <p>Entrega no Endereço</p>
                    {order.address && (
                      <div className="ml-4">
                        <p>{`${order.address.street}, ${order.address.number}`}</p>
                        <p>{`${order.address.neighborhood}, ${order.address.city} - ${order.address.cep}`}</p>
                        {order.address.complement && (
                          <p>Complemento: {order.address.complement}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Retirar Pessoalmente</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;