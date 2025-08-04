import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PatientDataConfirmationProps {
  onConfirm: () => void;
}

interface PatientData {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  pais: string;
  email: string;
}

const PatientDataConfirmation = ({ onConfirm }: PatientDataConfirmationProps) => {
  const [moraExterior, setMoraExterior] = useState(false);
  const [dadosPaciente, setDadosPaciente] = useState<PatientData>({
    nome: "André60",
    sobrenome: "Mosini", 
    cpf: "00000000000",
    dataNascimento: "03/07/1986",
    telefone: "359999999",
    rua: "Rua Liberdade",
    numero: "2982",
    complemento: "",
    bairro: "Centro",
    cep: "99999",
    cidade: "Alfa",
    estado: "MG",
    pais: "Brasil",
    email: "teste@gmail.com"
  });

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setDadosPaciente(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMoraExteriorChange = (checked: boolean) => {
    setMoraExterior(checked);
    if (checked) {
      setDadosPaciente(prev => ({
        ...prev,
        cpf: "",
        cep: "",
        estado: "",
        pais: "Exterior"
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl text-primary">
              Olá André60, por favor verifique se seus dados estão atualizados.
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox 
                id="moraExterior" 
                checked={moraExterior}
                onCheckedChange={handleMoraExteriorChange}
              />
              <Label htmlFor="moraExterior" className="text-sm font-medium">
                Moro no exterior
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={dadosPaciente.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  value={dadosPaciente.sobrenome}
                  onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={dadosPaciente.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  disabled={moraExterior}
                  placeholder={moraExterior ? "Não se aplica" : "000.000.000-00"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={dadosPaciente.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="ddi">DDI</Label>
                <Select defaultValue="55">
                  <SelectTrigger>
                    <SelectValue placeholder="Erro ao carregar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="55">+55 (Brasil)</SelectItem>
                    <SelectItem value="1">+1 (EUA/Canadá)</SelectItem>
                    <SelectItem value="44">+44 (Reino Unido)</SelectItem>
                    <SelectItem value="33">+33 (França)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={dadosPaciente.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={dadosPaciente.rua}
                  onChange={(e) => handleInputChange('rua', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={dadosPaciente.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={dadosPaciente.complemento}
                  onChange={(e) => handleInputChange('complemento', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={dadosPaciente.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={dadosPaciente.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  disabled={moraExterior}
                  placeholder={moraExterior ? "Não se aplica" : "00000-000"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={dadosPaciente.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={dadosPaciente.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  disabled={moraExterior}
                  placeholder={moraExterior ? "Não se aplica" : "UF"}
                />
              </div>
              
              <div>
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  value={dadosPaciente.pais}
                  onChange={(e) => handleInputChange('pais', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={dadosPaciente.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={onConfirm}
                size="lg"
                className="px-8"
              >
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDataConfirmation;