import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Video, User, Receipt, FileText, BarChart3 } from 'lucide-react'; // Updated icons

interface SessionDetailsDialogProps {
  session: any;
}

const SessionDetailsDialog = ({ session }: SessionDetailsDialogProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Confirmada</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Concluída</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-inter text-xs">
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-inter">Detalhes da Sessão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Status e Número do Pedido */}
          <div className="flex items-center justify-between">
            {getStatusBadge(session.status)}
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Receipt className="w-4 h-4" />
              <span className="font-mono">{session.orderNumber}</span>
            </div>
          </div>

          <Separator />

          {/* Informações da Sessão */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{formatDate(session.date)}</p>
                <p className="text-sm text-muted-foreground">Data da sessão</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{session.time}</p>
                <p className="text-sm text-muted-foreground">Horário</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {session.type === 'online' ? (
                <Video className="w-5 h-5 text-blue-600" />
              ) : (
                <MapPin className="w-5 h-5 text-green-600" />
              )}
              <div>
                <p className="font-medium capitalize">Sessão {session.type}</p>
                <p className="text-sm text-muted-foreground">Modalidade</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{session.psychologist}</p>
                <p className="text-sm text-muted-foreground">{session.specialty}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Documentos Emitidos */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Documentos Emitidos</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 p-2 rounded-md bg-muted/50">
                <FileText className="w-4 h-4" />
                <span className="text-xs">
                  {session.invoiceIssued ? 'Nota emitida' : 'Nota não emitida'}
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md bg-muted/50">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs">
                  {session.frequencyReportIssued ? 'Relatório de Frequência emitido' : 'Relatório de Frequência não emitido'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Preço */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Valor da sessão</span>
            <span className="font-bold text-lg text-primary">R$ {session.price},00</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsDialog;