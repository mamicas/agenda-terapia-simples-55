import React, { useState } from 'react';
import WhatsAppFloat from './WhatsAppFloat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock,
  CheckCircle,
  DollarSign,
  ArrowLeft,
  FileText,
  Shield
} from 'lucide-react';

interface AppointmentConfirmationProps {
  selectedSlots: Array<{date: string, time: string}>;
  sessionPrice: number;
  onConfirm: () => void;
  onBack: () => void;
}

const AppointmentConfirmation = ({ selectedSlots, sessionPrice, onConfirm, onBack }: AppointmentConfirmationProps) => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const totalPrice = selectedSlots.length * sessionPrice;

  const handleConfirmClick = () => {
    setShowPolicyModal(true);
  };

  const handleAcceptPolicy = () => {
    setShowPolicyModal(false);
    onConfirm();
  };

  const handleRejectPolicy = () => {
    setShowPolicyModal(false);
  };

  return (
    <div className="px-4 py-6 space-y-6">
        {/* Resumo dos Agendamentos */}
        <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center text-lg font-inter">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Suas Sessões Selecionadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {selectedSlots.map((slot, index) => (
                <div 
                  key={`${slot.date}-${slot.time}`}
                  className="bg-primary/5 rounded-lg p-4 border border-primary/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Sessão {index + 1}
                        </Badge>
                      </div>
                      <p className="font-inter font-medium text-foreground">
                        {formatDate(slot.date)}
                      </p>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-inter">{slot.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-inter font-semibold text-primary">
                        R$ {sessionPrice},00
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="border-0 shadow-lg bg-primary/10 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <DollarSign className="w-6 h-6 text-primary" />
                <span className="text-sm font-inter text-muted-foreground">
                  Total do Agendamento
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-inter font-bold text-primary">
                  R$ {totalPrice},00
                </p>
                <p className="text-sm font-inter text-muted-foreground">
                  {selectedSlots.length} sessão{selectedSlots.length > 1 ? 'ões' : ''} × R$ {sessionPrice},00
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full font-inter font-semibold" 
              onClick={handleConfirmClick}
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirmar e Continuar
            </Button>
          </CardContent>
        </Card>

        {/* Modal de Política */}
        <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
              <DialogTitle className="font-inter text-lg">
                Termos e Política de Agendamento
              </DialogTitle>
              <DialogDescription className="text-left mt-4 space-y-3 text-sm">
                <p>
                  <strong>Política de Cancelamento:</strong><br />
                  • Cancelamentos gratuitos até 24 horas antes da sessão<br />
                  • Cancelamentos com menos de 24h: taxa de 50%<br />
                  • Não comparecimento: cobrança integral
                </p>
                <p>
                  <strong>Reagendamento:</strong><br />
                  • Permitido até 12 horas antes da sessão<br />
                  • Máximo de 2 reagendamentos por mês
                </p>
                <p>
                  <strong>Sessões Online:</strong><br />
                  • Link será enviado 1 hora antes via WhatsApp<br />
                  • Teste de conexão recomendado 15 minutos antes
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col space-y-2 mt-6">
              <Button 
                onClick={handleAcceptPolicy}
                className="w-full font-inter font-semibold"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aceito os Termos
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRejectPolicy}
                className="w-full font-inter"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <WhatsAppFloat />
      </div>
    );
};

export default AppointmentConfirmation;