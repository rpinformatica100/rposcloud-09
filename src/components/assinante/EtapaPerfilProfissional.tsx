
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { AssinanteCompleto, ESPECIALIDADES_ASSISTENCIA } from '@/types/assinante';

interface EtapaPerfilProfissionalProps {
  dados: Partial<AssinanteCompleto>;
  onUpdate: (dados: Partial<AssinanteCompleto>) => void;
}

const EtapaPerfilProfissional = ({ dados, onUpdate }: EtapaPerfilProfissionalProps) => {
  const [novaEspecialidade, setNovaEspecialidade] = useState('');

  const handleEspecialidadeChange = (especialidade: string, checked: boolean) => {
    const especialidadesAtuais = dados.especialidades || [];
    
    if (checked) {
      onUpdate({
        ...dados,
        especialidades: [...especialidadesAtuais, especialidade]
      });
    } else {
      onUpdate({
        ...dados,
        especialidades: especialidadesAtuais.filter(e => e !== especialidade)
      });
    }
  };

  const adicionarNovaEspecialidade = () => {
    if (novaEspecialidade.trim()) {
      const especialidadesAtuais = dados.especialidades || [];
      if (!especialidadesAtuais.includes(novaEspecialidade.trim())) {
        onUpdate({
          ...dados,
          especialidades: [...especialidadesAtuais, novaEspecialidade.trim()]
        });
      }
      setNovaEspecialidade('');
    }
  };

  const removerEspecialidade = (especialidade: string) => {
    const especialidadesAtuais = dados.especialidades || [];
    onUpdate({
      ...dados,
      especialidades: especialidadesAtuais.filter(e => e !== especialidade)
    });
  };

  const renderResponsavel = () => {
    if (dados.tipoPessoa === 'pessoa_fisica') return null;

    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Responsável Técnico</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavelNome">Nome do Responsável *</Label>
              <Input
                id="responsavelNome"
                value={dados.responsavel?.nome || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    responsavel: { ...dados.responsavel, nome: e.target.value }
                  })
                }
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavelCpf">CPF do Responsável *</Label>
              <Input
                id="responsavelCpf"
                value={dados.responsavel?.cpf || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    responsavel: { ...dados.responsavel, cpf: e.target.value }
                  })
                }
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavelCargo">Cargo</Label>
              <Input
                id="responsavelCargo"
                value={dados.responsavel?.cargo || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    responsavel: { ...dados.responsavel, cargo: e.target.value }
                  })
                }
                placeholder="Ex: Técnico Responsável"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavelTelefone">Telefone do Responsável</Label>
              <Input
                id="responsavelTelefone"
                value={dados.responsavel?.telefone || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    responsavel: { ...dados.responsavel, telefone: e.target.value }
                  })
                }
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Especialidades */}
      <div>
        <h3 className="text-lg font-medium mb-4">Especialidades *</h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecione as especialidades da sua assistência técnica:
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ESPECIALIDADES_ASSISTENCIA.map((especialidade) => (
              <div key={especialidade} className="flex items-center space-x-2">
                <Checkbox
                  id={especialidade}
                  checked={dados.especialidades?.includes(especialidade) || false}
                  onCheckedChange={(checked) => 
                    handleEspecialidadeChange(especialidade, checked as boolean)
                  }
                />
                <Label htmlFor={especialidade} className="text-sm">
                  {especialidade}
                </Label>
              </div>
            ))}
          </div>

          {/* Adicionar nova especialidade */}
          <div className="flex gap-2">
            <Input
              value={novaEspecialidade}
              onChange={(e) => setNovaEspecialidade(e.target.value)}
              placeholder="Adicionar nova especialidade"
              onKeyPress={(e) => e.key === 'Enter' && adicionarNovaEspecialidade()}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={adicionarNovaEspecialidade}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Especialidades selecionadas */}
          {dados.especialidades && dados.especialidades.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Especialidades selecionadas:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {dados.especialidades.map((especialidade) => (
                  <Badge key={especialidade} variant="secondary" className="flex items-center gap-1">
                    {especialidade}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4"
                      onClick={() => removerEspecialidade(especialidade)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsável (apenas para PJ/MEI) */}
      {renderResponsavel()}

      {/* Descrição dos serviços */}
      <div className="space-y-2">
        <Label htmlFor="descricaoServicos">Descrição dos Serviços</Label>
        <Textarea
          id="descricaoServicos"
          value={dados.descricaoServicos || ''}
          onChange={(e) => onUpdate({ ...dados, descricaoServicos: e.target.value })}
          placeholder="Descreva os serviços oferecidos pela sua assistência técnica..."
          rows={4}
        />
      </div>

      {/* Horário de funcionamento */}
      <div className="space-y-2">
        <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
        <Input
          id="horarioFuncionamento"
          value={dados.horarioFuncionamento || ''}
          onChange={(e) => onUpdate({ ...dados, horarioFuncionamento: e.target.value })}
          placeholder="Ex: Segunda a Sexta: 8h às 18h"
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={dados.website || ''}
          onChange={(e) => onUpdate({ ...dados, website: e.target.value })}
          placeholder="https://www.suaassistencia.com.br"
        />
      </div>

      {/* Redes sociais */}
      <div>
        <h3 className="text-lg font-medium mb-4">Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={dados.redesSociais?.facebook || ''}
              onChange={(e) => 
                onUpdate({
                  ...dados,
                  redesSociais: { ...dados.redesSociais, facebook: e.target.value }
                })
              }
              placeholder="https://facebook.com/suaassistencia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={dados.redesSociais?.instagram || ''}
              onChange={(e) => 
                onUpdate({
                  ...dados,
                  redesSociais: { ...dados.redesSociais, instagram: e.target.value }
                })
              }
              placeholder="https://instagram.com/suaassistencia"
            />
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Quase pronto!</h4>
        <p className="text-sm text-green-800">
          Após completar esta etapa, seu cadastro estará finalizado e você poderá usar todas as funcionalidades do sistema.
        </p>
      </div>
    </div>
  );
};

export default EtapaPerfilProfissional;
