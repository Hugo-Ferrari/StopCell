// mesmos itens do checklist de entrada da tela de nova OS (ChecklistForm.tsx)
const ITENS_CHECKLIST = [
  'Tela / Touch',
  'Botões',
  'Câmera frontal',
  'Câmera traseira',
  'Conector de carga',
  'Som / Alto-falante',
  'Microfone',
  'Wi-Fi / Rede',
  'Biometria / Face ID',
  'Bateria',
  'Avarias físicas',
  'Chip / SIM',
];

// a tabela sempre tem pelo menos essas linhas, pra dar espaço de anotar à mão
const MINIMO_LINHAS_ITENS = 4;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function moeda(value: unknown): string {
  const numero = Number(value ?? 0);

  return (Number.isFinite(numero) ? numero : 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarCpf(value?: string | null): string {
  return (value ?? '').replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4',
  );
}

function formatarCnpj(value?: string | null): string {
  return (value ?? '').replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

function formatarTelefone(value?: string | null): string {
  return (value ?? '').replace(
    /^(\d{2})(\d{4,5})(\d{4})$/,
    '($1) $2-$3',
  );
}

// campo sem valor fica com a linha em branco, pra ser preenchido à mão
function campo(rotulo: string, valor: unknown, classe = ''): string {
  return `
    <div class="campo ${classe}">
      <span class="rotulo-campo">${rotulo}:</span>
      <span class="valor-campo">${escapeHtml(valor)}</span>
    </div>
  `;
}

// a tela de aparelho grava o desenho como a sequência das bolinhas, de 1 a 9 (ex: 14789)
function padraoDesenho(senha?: string | null): string {
  const posicao = (bolinha: number) => ({
    x: 10 + ((bolinha - 1) % 3) * 20,
    y: 10 + Math.floor((bolinha - 1) / 3) * 20,
  });

  const sequencia = (senha ?? '').replace(/[^1-9]/g, '').split('').map(Number);

  const caminho = sequencia
    .map((bolinha) => `${posicao(bolinha).x},${posicao(bolinha).y}`)
    .join(' ');

  const bolinhas = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map((bolinha) => {
      const { x, y } = posicao(bolinha);
      const usada = sequencia.includes(bolinha);
      const raio = bolinha === sequencia[0] ? 6 : 4;

      return `<circle cx="${x}" cy="${y}" r="${raio}" fill="${usada ? '#D9480F' : '#fff'}" stroke="${usada ? '#D9480F' : '#A8A3A0'}" />`;
    })
    .join('');

  return `
    <div class="padrao-senha">
      <span class="rotulo-campo">Desenho:</span>
      <svg viewBox="0 0 60 60" width="54" height="54">
        <polyline points="${caminho}" fill="none" stroke="#D9480F" stroke-width="2" />
        ${bolinhas}
      </svg>
    </div>
  `;
}

function opcoes(rotulos: string[]): string {
  return rotulos
    .map(
      (rotulo) =>
        `<span class="opcao"><span class="caixa"></span>${rotulo}</span>`,
    )
    .join('');
}

export function gerarHtmlOrdemServico(os: any): string {
  const nomeEmpresa =
    os.empresa?.nomeFantasia ??
    os.empresa?.razaoSocial ??
    'StopCell';

  const itens = Array.isArray(os.itensOs) ? os.itensOs : [];
  const diagnosticos = Array.isArray(os.diagnosticos)
    ? os.diagnosticos
    : [];

  const totalCalculado = itens.reduce(
    (total: number, item: any) => {
      const quantidade = Number(item.quantidade ?? 1);
      const valorUnitario = Number(item.valorUnitario ?? 0);

      if (
        !Number.isFinite(quantidade) ||
        !Number.isFinite(valorUnitario)
      ) {
        return total;
      }

      return total + quantidade * valorUnitario;
    },
    0,
  );

  const total =
    os.vlTotal == null ? totalCalculado : Number(os.vlTotal);

  const descricaoDiagnostico =
    os.diagnostico ||
    diagnosticos
      .map((diagnostico: any) => diagnostico.relatoTecnico)
      .filter(Boolean)
      .join(' | ');

  const linhasItens = itens
    .map((item: any) => {
      const descricao =
        item.servico?.descricao ??
        item.peca?.descricao ??
        'Item não identificado';

      const quantidade = Number(item.quantidade ?? 1) || 0;
      const valorUnitario = Number(item.valorUnitario ?? 0) || 0;
      const valorItem = quantidade * valorUnitario;

      return `
        <tr>
          <td class="centro">${quantidade}</td>
          <td>${escapeHtml(descricao)}</td>
          <td class="direita">R$ ${moeda(valorItem)}</td>
        </tr>
      `;
    })
    .join('');

  const linhasEmBranco = `
    <tr>
      <td>&nbsp;</td>
      <td></td>
      <td></td>
    </tr>
  `.repeat(Math.max(0, MINIMO_LINHAS_ITENS - itens.length));

  const linhasChecklist = ITENS_CHECKLIST.map(
    (item) => `
      <div class="linha-checklist">
        <span>${item}</span>
        <span class="opcoes">${opcoes(['OK', 'NOK', 'N/A'])}</span>
      </div>
    `,
  ).join('');

  const contatoEmpresa = [
    nomeEmpresa,
    os.empresa?.cnpj && `CNPJ: ${formatarCnpj(os.empresa.cnpj)}`,
    os.empresa?.telefone && formatarTelefone(os.empresa.telefone),
    os.empresa?.endereco,
  ]
    .filter(Boolean)
    .map((dado) => escapeHtml(dado))
    .join(' · ');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">

  <title>Ordem de Serviço ${escapeHtml(os.numOs)}</title>

  <style>
    :root {
      /* Mesmas cores do tema da StopCell (web/src/index.css). */
      --primaria: #D9480F;
      --primaria-clara: #F56333;
      --fundo-escuro: #141110;
      --fundo-secao: #F0EEED;
      --borda: #E4E1DF;
      --linha: #A8A3A0;
      --texto: #141110;
      --texto-secundario: #5F5A57;
    }

    * {
      box-sizing: border-box;
    }

    @page {
      size: A4;
      margin: 8mm;
    }

    body {
      margin: 0;
      color: var(--texto);
      background: #fff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cabecalho {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      padding: 16px 22px;
      color: #fff;
      background: var(--fundo-escuro);
      border-bottom: 4px solid var(--primaria);
      border-radius: 10px 10px 0 0;
    }

    .identificacao-os .rotulo {
      margin-bottom: 4px;
      font-size: 11px;
    }

    .numero-os {
      display: inline-block;
      min-width: 130px;
      padding: 6px 10px;
      color: var(--texto);
      background: #fff;
      border-radius: 6px;
      font-size: 17px;
      font-weight: 800;
    }

    .titulo {
      font-size: 26px;
      font-weight: 300;
      line-height: 1.05;
      text-align: center;
    }

    .titulo strong {
      display: block;
      color: var(--primaria-clara);
      font-weight: 700;
    }

    .logo {
      position: relative;
      justify-self: end;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      font-size: 11px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: 1px;
    }

    .logo svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .logo .laranja {
      color: var(--primaria-clara);
    }

    .contato-empresa {
      padding: 6px 12px;
      color: var(--texto-secundario);
      background: var(--fundo-secao);
      font-size: 9.5px;
      text-align: center;
      overflow-wrap: anywhere;
    }

    .bloco {
      margin-top: 11px;
      break-inside: avoid;
    }

    .campos {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;
    }

    .campo {
      display: flex;
      flex: 1 1 100%;
      gap: 5px;
      min-width: 0;
      align-items: flex-end;
    }

    .campo.metade {
      flex: 1 1 40%;
    }

    .campo.terco {
      flex: 1 1 28%;
    }

    .rotulo-campo {
      flex-shrink: 0;
      color: var(--texto-secundario);
    }

    .valor-campo {
      flex: 1;
      min-width: 0;
      min-height: 16px;
      padding: 0 3px;
      border-bottom: 1px solid var(--linha);
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .colunas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .titulo-secao {
      padding: 6px 12px;
      color: #fff;
      background: var(--primaria);
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      text-align: center;
    }

    .linha-checklist {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4.5px 8px;
    }

    .linha-checklist:nth-child(even) {
      background: var(--fundo-secao);
    }

    .corpo-checklist {
      margin-top: 4px;
    }

    .opcoes {
      display: flex;
      flex-shrink: 0;
      gap: 9px;
    }

    .opcao {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 9px;
    }

    .opcoes.largas .opcao {
      font-size: 10px;
    }

    .caixa {
      width: 11px;
      height: 11px;
      background: #fff;
      border: 1px solid var(--linha);
      border-radius: 2px;
    }

    .corpo-aparelho {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 9px 4px 0;
    }

    .padrao-senha {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pergunta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .linha-escrita {
      height: 18px;
      border-bottom: 1px solid var(--linha);
    }

    .relato {
      min-height: 44px;
      padding: 7px 10px;
      background: var(--fundo-secao);
      border-radius: 6px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .relato .rotulo-campo {
      display: block;
      margin-bottom: 2px;
    }

    .tabela {
      overflow: hidden;
      border: 1px solid var(--fundo-escuro);
      border-radius: 6px;
    }

    .titulo-tabela {
      padding: 6px 12px;
      color: #fff;
      background: var(--fundo-escuro);
      font-size: 11.5px;
      font-weight: 700;
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    th,
    td {
      padding: 5px 8px;
      border: 1px solid var(--linha);
      overflow-wrap: anywhere;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    th:first-child,
    td:first-child {
      border-left: 0;
    }

    th:last-child,
    td:last-child {
      border-right: 0;
    }

    th {
      border-top: 0;
      background: var(--fundo-secao);
    }

    th:nth-child(1) {
      width: 11%;
    }

    th:nth-child(3) {
      width: 20%;
    }

    tr {
      break-inside: avoid;
    }

    .centro {
      text-align: center;
    }

    .direita {
      text-align: right;
      white-space: nowrap;
    }

    .fechamento {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      gap: 16px;
      margin-top: 8px;
    }

    .fechamento .campo {
      flex: 0 1 50%;
      align-items: center;
    }

    .total {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 6px 14px;
      color: #fff;
      background: var(--primaria);
      border-radius: 6px;
      font-weight: 700;
    }

    .valor-total {
      font-size: 17px;
      font-weight: 800;
    }

    .garantia {
      padding: 8px 12px;
      color: #fff;
      background: var(--fundo-escuro);
      border-left: 4px solid var(--primaria);
      border-radius: 6px;
      font-size: 9.5px;
      line-height: 1.45;
    }

    .assinaturas {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      gap: 16px;
      margin-top: 30px;
      font-size: 10px;
      text-align: center;
      break-inside: avoid;
    }

    .assinatura {
      padding-top: 4px;
      border-top: 1px solid var(--texto);
    }

    .rodape {
      margin-top: 12px;
      padding: 7px 14px;
      color: #fff;
      background: var(--fundo-escuro);
      border-radius: 0 0 10px 10px;
      font-size: 9.5px;
      text-align: center;
      break-inside: avoid;
    }
  </style>
</head>

<body>
  <main>
    <header class="cabecalho">
      <div class="identificacao-os">
        <div class="rotulo">Ordem de serviço</div>
        <div class="numero-os">Nº ${escapeHtml(os.numOs)}</div>
      </div>

      <div class="titulo">
        Assistência
        <strong>técnica</strong>
      </div>

      <div class="logo">
        <svg viewBox="0 0 100 115" fill="none">
          <path
            d="M50 2 L96 28.5 L96 81.5 L50 108 L4 81.5 L4 28.5 Z"
            stroke="#F56333"
            stroke-width="3"
            stroke-linejoin="round"
          />
        </svg>
        <span>ST<span class="laranja">O</span>P</span>
        <span class="laranja">CELL</span>
      </div>
    </header>

    <div class="contato-empresa">${contatoEmpresa}</div>

    <section class="bloco campos">
      ${campo('Nome', os.cliente?.nmCompleto)}
      ${campo('CPF', formatarCpf(os.cliente?.cpf), 'terco')}
      ${campo('Telefone', formatarTelefone(os.cliente?.telefone), 'terco')}
      ${campo('E-mail', os.cliente?.email, 'terco')}
      ${campo('Endereço', os.cliente?.endereco)}
    </section>

    <div class="bloco colunas">
      <section>
        <div class="titulo-secao">Checklist</div>
        <div class="corpo-checklist">${linhasChecklist}</div>
      </section>

      <section>
        <div class="titulo-secao">Informações do aparelho</div>

        <div class="corpo-aparelho">
          ${campo('Modelo', os.aparelho?.modelo)}
          ${campo('Cor', os.aparelho?.cor)}
          ${campo('IMEI', os.aparelho?.imei)}
          ${campo('Tipo de senha', os.aparelho?.tipoSenha)}
          ${os.aparelho?.tipoSenha === 'Padrão (Desenho)' ? padraoDesenho(os.aparelho?.senhaAparelho) : ''}

          <div class="pergunta">
            Apresentou nota fiscal?
            <span class="opcoes largas">${opcoes(['Sim', 'Não'])}</span>
          </div>

          <div class="pergunta">
            Deixou com bateria?
            <span class="opcoes largas">${opcoes(['Sim', 'Não'])}</span>
          </div>

          ${campo('Observações', '')}
          <div class="linha-escrita"></div>
          <div class="linha-escrita"></div>
        </div>
      </section>
    </div>

    <section class="bloco relato"><span class="rotulo-campo">Problema relatado:</span>${escapeHtml(descricaoDiagnostico)}</section>

    <section class="bloco">
      <div class="tabela">
        <div class="titulo-tabela">Laudo técnico / diagnóstico</div>

        <table>
          <thead>
            <tr>
              <th>Quant.</th>
              <th>Descrição dos serviços</th>
              <th>Valor</th>
            </tr>
          </thead>

          <tbody>
            ${linhasItens}
            ${linhasEmBranco}
          </tbody>
        </table>
      </div>

      <div class="fechamento">
        ${campo('Previsão de entrega', '')}

        <div class="total">
          Total
          <span class="valor-total">R$ ${moeda(total)}</span>
        </div>
      </div>
    </section>

    <section class="bloco garantia">
      A garantia do serviço executado e dos componentes trocados é de _____ dias,
      a partir da data de entrega do aparelho. A nossa garantia não cobre danos
      causados por queda, manipulação por terceiros, queima por oscilação,
      umidade ou violação do lacre de garantia. Após aprovado o orçamento, o
      cliente terá o prazo máximo de 90 dias para a retirada; caso não haja
      retirada, o aparelho será vendido, a fim de cobrir as despesas geradas.
    </section>

    <div class="assinaturas">
      <div class="assinatura">Assinatura do cliente</div>
      <div class="assinatura">Responsável técnico</div>
      <div class="assinatura">Data</div>
    </div>

    <footer class="rodape">
      ${escapeHtml(nomeEmpresa)}
      · Documento referente à Ordem de Serviço Nº ${escapeHtml(os.numOs)}
    </footer>
  </main>
</body>
</html>
`;
}
