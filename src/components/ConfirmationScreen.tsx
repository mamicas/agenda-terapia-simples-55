import React from 'react';
import WhatsAppFloat from './WhatsAppFloat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Calendar, 
  Clock,
  Receipt,
  Home,
  Download
} from 'lucide-react';

interface ConfirmationScreenProps {
  paymentData: {
    method: 'pix' | 'card';
    amount: number;
    sessions: Array<{date: string, time: string}>;
    orderId: string;
    timestamp: string;
  };
  sessionPrice: number;
  onBackToHome: () => void;
}

const ConfirmationScreen = ({ paymentData, sessionPrice, onBackToHome }: ConfirmationScreenProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const downloadReceipt = () => {
    const receiptContent = `
COMPROVANTE DE PAGAMENTO
========================

Número do Pedido: ${paymentData.orderId}
Data do Pagamento: ${formatDate(paymentData.timestamp)}
Horário: ${formatTime(paymentData.timestamp)}

SESSÕES AGENDADAS:
${paymentData.sessions.map((session, index) => `
${index + 1}. ${formatDate(session.date)} às ${session.time}
   Valor: R$ ${sessionPrice},00
`).join('')}

RESUMO DO PAGAMENTO:
Total de Sessões: ${paymentData.sessions.length}
Valor Total: R$ ${paymentData.amount},00
Forma de Pagamento: ${paymentData.method === 'pix' ? 'PIX' : 'Cartão de Crédito'}

Status: PAGO ✓

Obrigado por escolher nossos serviços!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-${paymentData.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-green-100 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Sucesso */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-inter font-bold text-green-800 mb-2">
              Pagamento Realizado!
            </h1>
            <p className="text-muted-foreground font-inter">
              Suas sessões foram agendadas com sucesso
            </p>
          </div>
        </div>

        {/* Número do Pedido */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm border-green-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Receipt className="w-5 h-5 text-green-600" />
              <span className="font-inter font-medium text-green-800">Número do Pedido</span>
            </div>
            <p className="text-2xl font-inter font-bold text-green-800 font-mono">
              {paymentData.orderId}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Guarde este número para futuras consultas
            </p>
          </CardContent>
        </Card>

        {/* Detalhes das Sessões */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="flex items-center font-inter text-lg">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Suas Sessões Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {paymentData.sessions.map((session, index) => (
              <div 
                key={`${session.date}-${session.time}`}
                className="bg-green-50 rounded-lg p-3 border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-inter font-medium text-green-800">
                        {formatDate(session.date)}
                      </p>
                      <div className="flex items-center space-x-1 text-sm text-green-700">
                        <Clock className="w-3 h-3" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-inter font-semibold text-green-800">
                    R$ {sessionPrice}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="border-t border-green-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-inter font-semibold text-green-800">
                  Total Pago:
                </span>
                <span className="text-xl font-inter font-bold text-green-800">
                  R$ {paymentData.amount},00
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Pago via {paymentData.method === 'pix' ? 'PIX' : 'Cartão de Crédito'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <Card className="border-0 shadow-lg bg-blue-50 backdrop-blur-sm border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-inter font-semibold text-blue-800 mb-3">
              Informações Importantes
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Chegue 10 minutos antes do horário agendado</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Em caso de cancelamento, avise com 24h de antecedência</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Você receberá lembretes por email antes de cada sessão</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-3">
          <Button 
            variant="outline"
            className="w-full font-inter font-medium border-green-600 text-green-700 hover:bg-green-50"
            onClick={downloadReceipt}
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Comprovante
          </Button>
          
          <Button 
            className="w-full font-inter font-semibold bg-green-600 hover:bg-green-700"
            onClick={onBackToHome}
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        <WhatsAppFloat />
      </div>
    </div>
  );
};

export default ConfirmationScreen;