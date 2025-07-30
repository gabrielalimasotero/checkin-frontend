
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  isShared: boolean;
  sharedWith: string[];
  observations?: string;
}

interface OrderTabProps {
  orderItems: OrderItem[];
  setOrderItems: (items: OrderItem[]) => void;
  menuItems: MenuItem[];
}

const OrderTab = ({ orderItems, setOrderItems, menuItems }: OrderTabProps) => {
  const [observations, setObservations] = useState<{[key: number]: string}>({});

  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem => 
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1, isShared: false, sharedWith: [], observations: "" }]);
    }
  };

  const removeFromOrder = (itemId: number) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => item.quantity > 0));
  };

  const toggleShared = (itemId: number) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId 
        ? { ...item, isShared: !item.isShared, sharedWith: !item.isShared ? [] : item.sharedWith }
        : item
    ));
  };

  const updateObservations = (itemId: number, obs: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId 
        ? { ...item, observations: obs }
        : item
    ));
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="space-y-4">
      {/* Current Order */}
      {orderItems.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Seu Pedido
          </h3>
          <div className="space-y-3">
            {orderItems.map((item) => (
              <div key={item.id} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.name}</span>
                      {item.isShared && (
                        <Badge variant="secondary" className="text-xs">
                          👥 Dividido
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      R$ {item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeFromOrder(item.id)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addToOrder(item)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Textarea
                    placeholder="Observações (ex: sem cebola, ponto da carne, etc.)"
                    value={item.observations || ""}
                    onChange={(e) => updateObservations(item.id, e.target.value)}
                    className="text-xs min-h-[60px]"
                  />
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleShared(item.id)}
                      className="text-xs flex-1"
                    >
                      {item.isShared ? "Tornar Individual" : "Dividir Item"}
                    </Button>
                    {item.isShared && (
                      <Button variant="outline" size="sm" className="text-xs">
                        Escolher Pessoas
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-checkin-turquoise-600">
                R$ {getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Menu */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Cardápio</h3>
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="font-semibold text-checkin-turquoise-600">
                  R$ {item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => addToOrder(item)}
                  size="sm"
                  variant="outline"
                >
                  Pedir
                </Button>
                <Button 
                  onClick={() => {
                    const newItem = { ...item, quantity: 1, isShared: true, sharedWith: [], observations: "" };
                    setOrderItems([...orderItems, newItem]);
                  }}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Dividir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrderTab;
