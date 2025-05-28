
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssinanteCompleto, TipoPessoa } from '@/types/assinante';

interface EtapaDadosBasicosProps {
  dados: Partial<AssinanteCompleto>;
  onUpdate: (dados: Partial<AssinanteCompleto>) => void;
}

const EtapaDadosBasicos = ({ dados, onUpdate }: EtapaDadosBasicosProps) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({ ...dados, [field]: value });
  };

  const handleTipoPessoaChange = (tipoPessoa: TipoPessoa) => {
    // Limpar dados específicos do tipo anterior
    const dadosLimpos = { ...dados };
    delete dadosLimpos.dadosPF;
    delete dadosLimpos.dadosPJ;
    delete dadosLimpos.dadosMEI;
    delete dadosLimpos.responsavel;
    
    onUpdate({ ...dadosLimpos, tipoPessoa });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoPessoa">Tipo de Pessoa *</Label>
          <Select
            value={dados.tipoPessoa || ''}
            onValueChange={handleTipoPessoaChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
              <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
              <SelectItem value="mei">MEI (Microempreendedor Individual)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nome">
            {dados.tipoPessoa === 'pessoa_fisica' ? 'Nome Completo' : 'Razão Social'} *
          </Label>
          <Input
            id="nome"
            value={dados.nome || ''}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder={
              dados.tipoPessoa === 'pessoa_fisica' 
                ? 'Seu nome completo' 
                : 'Razão social da empresa'
            }
          />
        </div>
      </div>

      {dados.tipoPessoa === 'pessoa_juridica' && (
        <div className="space-y-2">
          <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
          <Input
            id="nomeFantasia"
            value={dados.dadosPJ?.nomeFantasia || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosPJ: { ...dados.dadosPJ, nomeFantasia: e.target.value }
              })
            }
            placeholder="Nome fantasia da empresa"
          />
        </div>
      )}

      {dados.tipoPessoa === 'mei' && (
        <div className="space-y-2">
          <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
          <Input
            id="nomeFantasia"
            value={dados.dadosMEI?.nomeFantasia || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosMEI: { ...dados.dadosMEI, nomeFantasia: e.target.value }
              })
            }
            placeholder="Nome fantasia do MEI"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={dados.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            value={dados.telefone || ''}
            onChange={(e) => handleChange('telefone', e.target.value)}
            placeholder="(11) 3333-4444"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="celular">Celular</Label>
          <Input
            id="celular"
            value={dados.celular || ''}
            onChange={(e) => handleChange('celular', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={dados.whatsapp || ''}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Informações importantes:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Campos marcados com * são obrigatórios</li>
          <li>• Estes dados aparecerão nas suas ordens de serviço</li>
          <li>• Você poderá alterar essas informações depois nas configurações</li>
        </ul>
      </div>
    </div>
  );
};

export default EtapaDadosBasicos;
