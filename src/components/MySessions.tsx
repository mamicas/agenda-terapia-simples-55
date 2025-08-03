import React, { useState } from 'react';
import WhatsAppFloat from './WhatsAppFloat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RescheduleDialog from '@/components/RescheduleDialog';
import SessionDetailsDialog from '@/components/SessionDetailsDialog';
import DocumentIssueDialog from '@/components/DocumentIssueDialog';
import { 
  Calendar, 
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock3,
  MapPin,
  Phone,
  Video,
  Receipt,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface MySessionsProps {
  onBack: () => void;
}

const MySessions = ({ onBack }: MySessionsProps) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Dados simulados das sessões
  const [sessions, setSessions] = useState([
    {
      id: 1,
      orderNumber: "PED-2024-001",
      date: "2024-02-15",
      time: "14:00",
      status: "confirmed",
      type: "online",
      price: 150,
      psychologist: "Dra. Maria Silva",
      specialty: "Psicologia Clínica",
      invoiceIssued: false,
      frequencyReportIssued: false
    },
    {
      id: 2,
      orderNumber: "PED-2024-002",
      date: "2024-02-12",
      time: "16:00",
      status: "completed",
      type: "presencial",
      price: 150,
      psychologist: "Dra. Maria Silva",
      specialty: "Psicologia Clínica",
      invoiceIssued: false,
      frequencyReportIssued: true
    },
    {
      id: 3,
      orderNumber: "PED-2024-003",
      date: "2024-02-18",
      time: "10:00",
      status: "confirmed",
      type: "online",
      price: 150,
      psychologist: "Dra. Maria Silva",
      specialty: "Psicologia Clínica",
      invoiceIssued: false,
      frequencyReportIssued: false
    },
    {
      id: 4,
      orderNumber: "PED-2024-004",
      date: "2024-02-08",
      time: "15:00",
      status: "cancelled",
      type: "online",
      price: 150,
      psychologist: "Dra. Maria Silva",
      specialty: "Psicologia Clínica",
      invoiceIssued: false,
      frequencyReportIssued: false
    },
    {
      id: 5,
      orderNumber: "PED-2024-005",
      date: "2024-02-22",
      time: "09:00",
      status: "confirmed",
      type: "presencial",
      price: 150,
      psychologist: "Dra. Maria Silva",
      specialty: "Psicologia Clínica",
      invoiceIssued: false,
      frequencyReportIssued: false
    },
    {
      id: 6,
      orderNumber: "PED-2024-006",
      date: "2024-02-05",
      time: "11:00",
      status: "completed",
      type: "online",
      price: 150,
      psychologist: "Dra. Maria Silva",
      specialty: "Psicologia Clínica",
      invoiceIssued: true,
      frequencyReportIssued: false
    }
  ]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Clock3 className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return session.status === 'confirmed';
    return session.status === filter;
  });

  const handleReschedule = (sessionId: number, newDate: string, newTime: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, date: newDate, time: newTime }
        : session
    ));
  };

  const handleIssueDocuments = (sessionIds: number[], documentType: 'invoice' | 'frequency', email: string) => {
    setSessions(prev => prev.map(session => 
      sessionIds.includes(session.id)
        ? { 
            ...session, 
            [documentType === 'invoice' ? 'invoiceIssued' : 'frequencyReportIssued']: true 
          }
        : session
    ));
  };

  const upcomingSessions = sessions.filter(s => s.status === 'confirmed').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm bg-blue-50/50">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-inter font-bold text-blue-600">{upcomingSessions}</div>
            <div className="text-xs font-inter text-blue-700">Agendadas</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-green-50/50">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-inter font-bold text-green-600">{completedSessions}</div>
            <div className="text-xs font-inter text-green-700">Concluídas</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-red-50/50">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-inter font-bold text-red-600">{cancelledSessions}</div>
            <div className="text-xs font-inter text-red-700">Canceladas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <div className="space-y-3">
        <Card className="border-0 shadow-sm bg-card/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="font-inter text-xs"
              >
                Todas
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('upcoming')}
                className="font-inter text-xs"
              >
                Agendadas
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
                className="font-inter text-xs"
              >
                Concluídas
              </Button>
              <Button
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('cancelled')}
                className="font-inter text-xs"
              >
                Canceladas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ações de Documentos */}
        <Card className="border-0 shadow-sm bg-card/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-center">
              <DocumentIssueDialog 
                sessions={sessions} 
                onIssueDocuments={handleIssueDocuments}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Sessões */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header com status e número do pedido */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(session.status)}
                    {getStatusBadge(session.status)}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Receipt className="w-3 h-3" />
                    <span className="font-inter font-mono">{session.orderNumber}</span>
                  </div>
                </div>

                {/* Data e Horário */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-inter font-medium text-sm text-foreground">
                      {formatDate(session.date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-inter text-sm text-muted-foreground">
                      {session.time}
                    </span>
                  </div>
                </div>

                {/* Tipo de sessão e profissional */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {session.type === 'online' ? (
                      <Video className="w-4 h-4 text-blue-600" />
                    ) : (
                      <MapPin className="w-4 h-4 text-green-600" />
                    )}
                    <span className="font-inter text-sm capitalize">
                      Sessão {session.type}
                    </span>
                  </div>
                  <div className="text-sm font-inter">
                    <span className="font-medium text-foreground">{session.psychologist}</span>
                    <span className="text-muted-foreground"> • {session.specialty}</span>
                  </div>
                </div>

                {/* Indicadores de Documentos Emitidos */}
                {(session.invoiceIssued || session.frequencyReportIssued) && (
                  <div className="flex items-center space-x-2 mt-2">
                    {session.invoiceIssued && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-700 font-inter">Nota Fiscal</span>
                      </div>
                    )}
                    {session.frequencyReportIssued && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-full">
                        <FileCheck className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-blue-700 font-inter">Relatório de Frequência</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Preço e ações */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="font-inter font-semibold text-lg text-primary">
                    R$ {session.price},00
                  </span>
                  
                  <div className="flex space-x-2">
                    {session.status === 'confirmed' && (
                      <>
                        {session.type === 'online' && (
                          <Button variant="outline" size="sm" className="font-inter text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Entrar
                          </Button>
                        )}
                        <RescheduleDialog 
                          session={session} 
                          onReschedule={handleReschedule}
                        />
                      </>
                    )}
                    {(session.status === 'completed' || session.status === 'confirmed') && (
                      <SessionDetailsDialog session={session} />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card className="border-0 shadow-sm bg-card/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-inter text-muted-foreground">
              Nenhuma sessão encontrada para este filtro
            </p>
          </CardContent>
        </Card>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default MySessions;