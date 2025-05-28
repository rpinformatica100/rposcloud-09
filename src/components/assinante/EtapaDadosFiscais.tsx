
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AssinanteCompleto } from '@/types/assinante';
import { useInputMask } from '@/hooks/use-input-mask';
import { useExternalServices } from '@/hooks/use-external-services';
import { Search, Loader2 } from 'lucide-react';

interface EtapaDadosFiscaisProps {
  dados: Partial<AssinanteCompleto>;
  onUpdate: (dados: Partial<AssinanteCompleto>) => void;
}

const EtapaDadosFiscais = ({ dados, onUpdate }: EtapaDadosFiscaisProps) => {
  const { cpfMask, cnpjMask, cepMask } = useInputMask();
  const { fetchCep, fetchCnpj, loadingCep, loadingCnpj } = useExternalServices();

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const buscarCep = async () => {
    if (!dados.endereco?.cep) return;
    
    const resultado = await fetchCep(dados.endereco.cep);
    if (resultado) {
      onUpdate({
        ...dados,
        endereco: {
          ...dados.endereco,
          logradouro: resultado.logradouro || '',
          bairro: resultado.bairro || '',
          cidade: resultado.localidade || '',
          estado: resultado.uf || ''
        }
      });
    }
  };

  const buscarCnpj = async (cnpj: string) => {
    if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) return;
    
    const resultado = await fetchCnpj(cnpj);
    if (resultado) {
      // Atualizar nome da empresa se for PJ ou MEI
      onUpdate({
        ...dados,
        nome: resultado.nome || dados.nome,
        telefone: resultado.telefone || dados.telefone,
        endereco: {
          cep: resultado.cep || dados.endereco?.cep || '',
          logradouro: resultado.logradouro || dados.endereco?.logradouro || '',
          numero: resultado.numero || dados.endereco?.numero || '',
          complemento: resultado.complemento || dados.endereco?.complemento || '',
          bairro: resultado.bairro || dados.endereco?.bairro || '',
          cidade: resultado.municipio || dados.endereco?.cidade || '',
          estado: resultado.uf || dados.endereco?.estado || ''
        },
        ...(dados.tipoPessoa === 'pessoa_juridica' && {
          dadosPJ: {
            ...dados.dadosPJ,
            cnpj: cnpj,
            nomeFantasia: resultado.fantasia || dados.dadosPJ?.nomeFantasia || ''
          }
        }),
        ...(dados.tipoPessoa === 'mei' && {
          dadosMEI: {
            ...dados.dadosMEI,
            cnpj: cnpj,
            atividadePrincipal: resultado.fantasia || dados.dadosMEI?.atividadePrincipal || ''
          }
        })
      });
    }
  };

  const renderDocumentosPF = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={dados.dadosPF?.cpf || ''}
            onChange={(e) => {
              const maskedEvent = cpfMask(e);
              onUpdate({
                ...dados,
                dadosPF: { ...dados.dadosPF, cpf: maskedEvent.target.value }
              });
            }}
            placeholder="000.000.000-00"
            maxLength={14}
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
          <div className="flex gap-2">
            <Input
              id="cnpj"
              value={dados.dadosPJ?.cnpj || ''}
              onChange={(e) => {
                const maskedEvent = cnpjMask(e);
                onUpdate({
                  ...dados,
                  dadosPJ: { ...dados.dadosPJ, cnpj: maskedEvent.target.value }
                });
              }}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => buscarCnpj(dados.dadosPJ?.cnpj || '')}
              disabled={loadingCnpj || !dados.dadosPJ?.cnpj}
            >
              {loadingCnpj ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );

  const renderDocumentosMEI = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cnpjMei">CNPJ *</Label>
          <div className="flex gap-2">
            <Input
              id="cnpjMei"
              value={dados.dadosMEI?.cnpj || ''}
              onChange={(e) => {
                const maskedEvent = cnpjMask(e);
                onUpdate({
                  ...dados,
                  dadosMEI: { ...dados.dadosMEI, cnpj: maskedEvent.target.value }
                });
              }}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => buscarCnpj(dados.dadosMEI?.cnpj || '')}
              disabled={loadingCnpj || !dados.dadosMEI?.cnpj}
            >
              {loadingCnpj ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
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
              <div className="flex gap-2">
                <Input
                  id="cep"
                  value={dados.endereco?.cep || ''}
                  onChange={(e) => {
                    const maskedEvent = cepMask(e);
                    onUpdate({
                      ...dados,
                      endereco: { ...dados.endereco, cep: maskedEvent.target.value }
                    });
                  }}
                  placeholder="00000-000"
                  maxLength={9}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={buscarCep}
                  disabled={loadingCep || !dados.endereco?.cep}
                >
                  {loadingCep ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
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
