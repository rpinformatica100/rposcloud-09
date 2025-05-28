
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssinanteCompleto } from '@/types/assinante';

interface EtapaDadosFiscaisProps {
  dados: Partial<AssinanteCompleto>;
  onUpdate: (dados: Partial<AssinanteCompleto>) => void;
}

const EtapaDadosFiscais = ({ dados, onUpdate }: EtapaDadosFiscaisProps) => {
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const renderDocumentosPF = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={dados.dadosPF?.cpf || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosPF: { ...dados.dadosPF, cpf: e.target.value }
              })
            }
            placeholder="000.000.000-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            value={dados.dadosPF?.rg || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosPF: { ...dados.dadosPF, rg: e.target.value }
              })
            }
            placeholder="00.000.000-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataNascimento">Data de Nascimento</Label>
          <Input
            id="dataNascimento"
            type="date"
            value={dados.dadosPF?.dataNascimento || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosPF: { ...dados.dadosPF, dataNascimento: e.target.value }
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estadoCivil">Estado Civil</Label>
          <Select
            value={dados.dadosPF?.estadoCivil || ''}
            onValueChange={(value) => 
              onUpdate({
                ...dados,
                dadosPF: { ...dados.dadosPF, estadoCivil: value }
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
              <SelectItem value="uniao_estavel">União Estável</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderDocumentosPJ = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            value={dados.dadosPJ?.cnpj || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosPJ: { ...dados.dadosPJ, cnpj: e.target.value }
              })
            }
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
          <Input
            id="inscricaoEstadual"
            value={dados.dadosPJ?.inscricaoEstadual || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosPJ: { ...dados.dadosPJ, inscricaoEstadual: e.target.value }
              })
            }
            placeholder="000.000.000.000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
          <Input
            id="inscricaoMunicipal"
            value={dados.dadosPJ?.inscricaoMunicipal || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosPJ: { ...dados.dadosPJ, inscricaoMunicipal: e.target.value }
              })
            }
            placeholder="000000000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="regimeTributario">Regime Tributário</Label>
          <Select
            value={dados.dadosPJ?.regimeTributario || ''}
            onValueChange={(value: 'simples_nacional' | 'lucro_presumido' | 'lucro_real') => 
              onUpdate({
                ...dados,
                dadosPJ: { ...dados.dadosPJ, regimeTributario: value }
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
              <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
              <SelectItem value="lucro_real">Lucro Real</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderDocumentosMEI = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cnpjMei">CNPJ *</Label>
          <Input
            id="cnpjMei"
            value={dados.dadosMEI?.cnpj || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosMEI: { ...dados.dadosMEI, cnpj: e.target.value }
              })
            }
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="atividadePrincipal">Atividade Principal</Label>
          <Input
            id="atividadePrincipal"
            value={dados.dadosMEI?.atividadePrincipal || ''}
            onChange={(e) => 
              onUpdate({
                ...dados,
                dadosMEI: { ...dados.dadosMEI, atividadePrincipal: e.target.value }
              })
            }
            placeholder="Ex: Reparação de equipamentos eletrônicos"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Documentos específicos por tipo */}
      <div>
        <h3 className="text-lg font-medium mb-4">Documentos</h3>
        {dados.tipoPessoa === 'pessoa_fisica' && renderDocumentosPF()}
        {dados.tipoPessoa === 'pessoa_juridica' && renderDocumentosPJ()}
        {dados.tipoPessoa === 'mei' && renderDocumentosMEI()}
      </div>

      {/* Endereço */}
      <div>
        <h3 className="text-lg font-medium mb-4">Endereço</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                value={dados.endereco?.cep || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    endereco: { ...dados.endereco, cep: e.target.value }
                  })
                }
                placeholder="00000-000"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="logradouro">Logradouro *</Label>
              <Input
                id="logradouro"
                value={dados.endereco?.logradouro || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    endereco: { ...dados.endereco, logradouro: e.target.value }
                  })
                }
                placeholder="Rua, Avenida, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                value={dados.endereco?.numero || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    endereco: { ...dados.endereco, numero: e.target.value }
                  })
                }
                placeholder="123"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={dados.endereco?.complemento || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    endereco: { ...dados.endereco, complemento: e.target.value }
                  })
                }
                placeholder="Apto, Sala, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                value={dados.endereco?.bairro || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    endereco: { ...dados.endereco, bairro: e.target.value }
                  })
                }
                placeholder="Nome do bairro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={dados.endereco?.cidade || ''}
                onChange={(e) => 
                  onUpdate({
                    ...dados,
                    endereco: { ...dados.endereco, cidade: e.target.value }
                  })
                }
                placeholder="Nome da cidade"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Select
              value={dados.endereco?.estado || ''}
              onValueChange={(value) => 
                onUpdate({
                  ...dados,
                  endereco: { ...dados.endereco, estado: value }
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaDadosFiscais;
