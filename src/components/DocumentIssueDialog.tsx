import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FileText, BarChart3, Mail, AlertCircle } from 'lucide-react'; // Updated icons

interface DocumentIssueDialogProps {
  sessions: any[];
  onIssueDocuments: (sessionIds: number[], documentType: 'invoice' | 'frequency', email: string) => void;
}

const DocumentIssueDialog = ({ sessions, onIssueDocuments }: DocumentIssueDialogProps) => {
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [documentType, setDocumentType] = useState<'invoice' | 'frequency'>('invoice');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const availableSessions = sessions.filter(session => 
    session.status === 'completed' && 
    (documentType === 'invoice' ? !session.invoiceIssued : !session.frequencyReportIssued)
  );

  const handleSessionToggle = (sessionId: number) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleSubmit = () => {
    if (selectedSessions.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma sessão",
        variant: "destructive"
      });
      return;
    }

    if (!email || !confirmEmail) {
      toast({
        title: "Erro",
        description: "Preencha os campos de email",
        variant: "destructive"
      });
      return;
    }

    if (email !== confirmEmail) {
      toast({
        title: "Erro",
        description: "Os emails não coincidem",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erro",
        description: "Digite um email válido",
        variant: "destructive"
      });
      return;
    }

    onIssueDocuments(selectedSessions, documentType, email);
    setOpen(false);
    setSelectedSessions([]);
    setEmail('');
    setConfirmEmail('');

    toast({
      title: "Documento enviado",
      description: `${documentType === 'invoice' ? 'Nota fiscal' : 'Relatório de Frequência'} enviado para ${email}`,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-inter">
          <FileText className="w-4 h-4 mr-2" />
          Emitir Documentos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-inter">Emitir Documentos</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tipo de Documento */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de Documento</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={documentType === 'invoice' ? 'default' : 'outline'}
                onClick={() => {
                  setDocumentType('invoice');
                  setSelectedSessions([]);
                }}
                className="justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Nota Fiscal
              </Button>
              <Button
                variant={documentType === 'frequency' ? 'default' : 'outline'}
                onClick={() => {
                  setDocumentType('frequency');
                  setSelectedSessions([]);
                }}
                className="justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatório de Frequência
              </Button>
            </div>
          </div>

          <Separator />

          {/* Seleção de Sessões */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Selecionar Sessões ({availableSessions.length} disponíveis)
            </Label>
            
            {availableSessions.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Nenhuma sessão disponível para {documentType === 'invoice' ? 'emissão de nota fiscal' : 'emissão de relatório de frequência'}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableSessions.map((session) => (
                  <div key={session.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedSessions.includes(session.id)}
                      onCheckedChange={() => handleSessionToggle(session.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {formatDate(session.date)} - {session.time}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          R$ {session.price},00
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.psychologist} • {session.orderNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {availableSessions.length > 0 && (
            <>
              <Separator />

              {/* Email */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <Label className="text-base font-medium">Email para Envio</Label>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite o email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmEmail" className="text-sm">Confirmar Email</Label>
                    <Input
                      id="confirmEmail"
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder="Confirme o email"
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              {selectedSessions.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">
                    {selectedSessions.length} sessão(ões) selecionada(s)
                  </span>
                  <span className="font-bold">
                    Total: R$ {selectedSessions.reduce((sum, id) => {
                      const session = availableSessions.find(s => s.id === id);
                      return sum + (session?.price || 0);
                    }, 0)},00
                  </span>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Emitir e Enviar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentIssueDialog;