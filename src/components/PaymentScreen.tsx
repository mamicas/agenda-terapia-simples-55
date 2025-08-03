import React, { useState } from 'react';
import WhatsAppFloat from './WhatsAppFloat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CreditCard, 
  QrCode, 
  ArrowLeft,
  Clock,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentScreenProps {
  selectedSlots: Array<{date: string, time: string}>;
  totalPrice: number;
  sessionPrice: number;
  onBack: () => void;
  onPaymentComplete: (paymentData: any) => void;
}

const PaymentScreen = ({ 
  selectedSlots, 
  totalPrice, 
  sessionPrice, 
  onBack, 
  onPaymentComplete 
}: PaymentScreenProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCode] = useState('00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-42665544000052040000530398654041.505802BR5913PSICOLOGIA APP6009SAO PAULO62070503***6304C2A3');
  const { toast } = useToast();

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardData(prev => ({ ...prev, number: formatted }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setCardData(prev => ({ ...prev, expiry: formatted }));
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código PIX copiado!",
      description: "Cole no app do seu banco para efetuar o pagamento.",
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentData = {
      method: paymentMethod,
      amount: totalPrice,
      sessions: selectedSlots,
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    onPaymentComplete(paymentData);
    setIsProcessing(false);
  };

  const isCardValid = paymentMethod === 'card' && 
    cardData.number.length >= 19 && 
    cardData.name.length >= 3 && 
    cardData.expiry.length === 5 && 
    cardData.cvv.length >= 3;

  const isPaymentReady = paymentMethod === 'pix' || isCardValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary/30 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Button variant="outline" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-inter font-semibold">Pagamento</h1>
        </div>

        {/* Resumo do Pedido */}
        <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-inter">Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {selectedSlots.map((slot, index) => (
              <div key={`${slot.date}-${slot.time}`} className="flex justify-between text-sm">
                <span className="font-inter text-muted-foreground">
                  {formatDate(slot.date)} às {slot.time}
                </span>
                <span className="font-inter font-medium">R$ {sessionPrice}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between">
              <span className="font-inter font-semibold">Total:</span>
              <span className="font-inter font-bold text-lg text-primary">
                R$ {totalPrice},00
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pagamento */}
        <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-inter">Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value: 'pix' | 'card') => setPaymentMethod(value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent data-[state=checked]:border-primary">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center space-x-3 cursor-pointer flex-1">
                  <QrCode className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-inter font-medium">PIX</p>
                    <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent data-[state=checked]:border-primary">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-inter font-medium">Cartão de Crédito</p>
                    <p className="text-xs text-muted-foreground">À vista ou parcelado</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* PIX */}
        {paymentMethod === 'pix' && (
          <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg">
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-inter font-medium">Escaneie o QR Code</p>
                  <p className="text-sm text-muted-foreground">
                    Ou copie e cole o código no seu app de pagamento
                  </p>
                </div>

                <div className="bg-secondary/20 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-mono break-all mr-2">
                      {pixCode.substring(0, 50)}...
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyPixCode}
                      className="p-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-amber-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-inter">Expire em 15 minutos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cartão */}
        {paymentMethod === 'card' && (
          <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="font-inter">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={cardData.number}
                  onChange={handleCardNumberChange}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName" className="font-inter">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="Nome completo"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="font-inter">Validade</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={handleExpiryChange}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="font-inter">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="000"
                    maxLength={4}
                    value={cardData.cvv}
                    onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de Pagamento */}
        <Button 
          className="w-full font-inter font-semibold" 
          size="lg"
          onClick={handlePayment}
          disabled={!isPaymentReady || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : (
            `Pagar R$ ${totalPrice},00`
          )}
        </Button>

        <WhatsAppFloat />
      </div>
    </div>
  );
};

export default PaymentScreen;