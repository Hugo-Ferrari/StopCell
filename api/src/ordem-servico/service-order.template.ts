// mesmos itens do checklist de entrada da tela de nova OS (ChecklistForm.tsx).
// se a O.S. não tiver checklist salvo, imprime essa lista em branco pra marcar à mão
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

const ROTULO_FORMA_PAGAMENTO: Record<string, string> = {
  PIX: 'Pix',
  CARTAO: 'Cartão',
  DINHEIRO: 'Dinheiro',
  BOLETO: 'Boleto',
};

// a tabela sempre tem pelo menos essas linhas, pra dar espaço de anotar à mão
const MINIMO_LINHAS_ITENS = 3;

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function numero(value: unknown): number {
  const convertido = Number(value ?? 0);
  return Number.isFinite(convertido) ? convertido : 0;
}

function moeda(value: unknown): string {
  return numero(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function data(value: unknown, comHora = true): string {
  if (!value) return '';

  const convertida = new Date(String(value));
  if (Number.isNaN(convertida.getTime())) return '';

  return convertida.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: comHora ? 'short' : undefined,
    timeZone: 'America/Sao_Paulo',
  });
}

function formatarCpf(value?: string | null): string {
  return (value ?? '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function formatarCnpj(value?: string | null): string {
  return (value ?? '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function formatarTelefone(value?: string | null): string {
  return (value ?? '').replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
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

// desenha as caixinhas e marca a que bate com o valor salvo
function opcoes(rotulos: string[], marcado?: string | null): string {
  return rotulos
    .map(
      (rotulo) =>
        `<span class="opcao"><span class="caixa ${rotulo === marcado ? 'marcada' : ''}"></span>${rotulo}</span>`,
    )
    .join('');
}

function montarChecklist(osChecklists: any[]): string {
  // no banco fica "NA", no papel aparece "N/A"
  const salvos = osChecklists.map((item) => ({
    descricao: item.checklist?.descricao ?? 'Item',
    status: item.status === 'NA' ? 'N/A' : item.status,
    observacao: item.observacao,
  }));

  // mantém a ordem da tela de entrada; o que for diferente vai pro final
  const ordem = (descricao: string) => {
    const posicao = ITENS_CHECKLIST.indexOf(descricao);
    return posicao === -1 ? ITENS_CHECKLIST.length : posicao;
  };
  salvos.sort((a, b) => ordem(a.descricao) - ordem(b.descricao));

  const linhas = salvos.length
    ? salvos
    : ITENS_CHECKLIST.map((descricao) => ({ descricao, status: null, observacao: null }));

  return linhas
    .map(
      (item) => `
      <div class="item-checklist">
        <div class="linha-checklist">
          <span>${escapeHtml(item.descricao)}</span>
          <span class="opcoes">${opcoes(['OK', 'NOK', 'N/A'], item.status)}</span>
        </div>
        ${item.observacao ? `<div class="obs-checklist">${escapeHtml(item.observacao)}</div>` : ''}
      </div>
    `,
    )
    .join('');
}

function montarLaudo(diagnosticos: any[]): string {
  const registros = diagnosticos.filter((d) => d.relatoTecnico?.trim());

  if (!registros.length) {
    return '<div class="linha-escrita"></div><div class="linha-escrita"></div>';
  }

  return `
    <div class="laudo">
      ${registros
        .map(
          (d) => `
          <div class="laudo-item">
            <span class="laudo-data">${data(d.dataHora)}</span>
            <span>${escapeHtml(d.relatoTecnico)}</span>
          </div>
        `,
        )
        .join('')}
    </div>
  `;
}

function montarItens(itens: any[]): string {
  const linhas = itens
    .map((item) => {
      const quantidade = numero(item.quantidade ?? 1);
      const valorUnitario = numero(item.valorUnitario);

      return `
        <tr>
          <td class="centro">${quantidade}</td>
          <td>
            <span class="tipo-item">${item.tipo === 'PECA' ? 'Peça' : 'Serviço'}</span>
            ${escapeHtml(item.descricao)}
          </td>
          <td class="direita">R$ ${moeda(valorUnitario)}</td>
          <td class="direita">R$ ${moeda(quantidade * valorUnitario)}</td>
        </tr>
      `;
    })
    .join('');

  const emBranco = `
    <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
  `.repeat(Math.max(0, MINIMO_LINHAS_ITENS - itens.length));

  return linhas + emBranco;
}

// cabe numa linha só: "05/11/2026 · Pix · R$ 200,00"
function montarPagamentos(pagamentos: any[]): string {
  if (!pagamentos.length) {
    return '<span class="pagamento">Nenhum pagamento registrado</span>';
  }

  return pagamentos
    .map((p) => {
      const forma = ROTULO_FORMA_PAGAMENTO[p.formaPagamento] ?? p.formaPagamento ?? '';
      return `<span class="pagamento">${data(p.dtPagamento, false)} · ${escapeHtml(forma)} · <strong>R$ ${moeda(p.valorPago)}</strong></span>`;
    })
    .join('');
}

export function gerarHtmlOrdemServico(os: any): string {
  const nomeEmpresa = os.empresa?.nomeFantasia ?? os.empresa?.razaoSocial ?? 'StopCell';

  const itens: any[] = os.itensOs ?? [];
  const pagamentos: any[] = os.pagamentos ?? [];

  const totalPecas = itens
    .filter((item) => item.tipo === 'PECA')
    .reduce((soma, item) => soma + numero(item.quantidade ?? 1) * numero(item.valorUnitario), 0);
  const totalServicos = itens
    .filter((item) => item.tipo !== 'PECA')
    .reduce((soma, item) => soma + numero(item.quantidade ?? 1) * numero(item.valorUnitario), 0);

  const total = os.vlTotal == null ? totalPecas + totalServicos : numero(os.vlTotal);
  const totalPago = pagamentos.reduce((soma, p) => soma + numero(p.valorPago), 0);
  const saldo = Math.max(Math.round((total - totalPago) * 100) / 100, 0);

  const aparelho = os.aparelho ?? {};
  const modelo = [aparelho.marca?.nmMarca, aparelho.modelo].filter(Boolean).join(' ');

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
      padding: 12px 22px;
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
      width: 62px;
      height: 62px;
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
      margin-top: 9px;
      break-inside: avoid;
    }

    .campos {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
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
      padding: 5px 12px;
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
      gap: 7px;
      padding: 8px 4px 0;
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
      min-height: 30px;
      padding: 6px 10px;
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
      padding: 4px 8px;
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

    .tabela-itens th:nth-child(1) {
      width: 9%;
    }

    .tabela-itens th:nth-child(3),
    .tabela-itens th:nth-child(4) {
      width: 17%;
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
      margin-top: 6px;
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
      padding: 6px 12px;
      color: #fff;
      background: var(--fundo-escuro);
      border-left: 4px solid var(--primaria);
      border-radius: 6px;
      font-size: 9px;
      line-height: 1.4;
    }

    .assinaturas {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      gap: 16px;
      margin-top: 18px;
      font-size: 10px;
      text-align: center;
      break-inside: avoid;
    }

    .assinatura {
      padding-top: 4px;
      border-top: 1px solid var(--texto);
    }

    .rodape {
      margin-top: 10px;
      padding: 6px 14px;
      color: #fff;
      background: var(--fundo-escuro);
      border-radius: 0 0 10px 10px;
      font-size: 9.5px;
      text-align: center;
      break-inside: avoid;
    }

    .caixa.marcada {
      position: relative;
      background: var(--primaria);
      border-color: var(--primaria);
    }

    .caixa.marcada::after {
      content: '';
      position: absolute;
      left: 3.5px;
      top: 0.5px;
      width: 3px;
      height: 7px;
      border: solid #fff;
      border-width: 0 1.5px 1.5px 0;
      transform: rotate(45deg);
    }

    .item-checklist {
      padding: 3px 8px;
    }

    .item-checklist:nth-child(even) {
      background: var(--fundo-secao);
    }

    .obs-checklist {
      margin-top: 1px;
      color: var(--texto-secundario);
      font-size: 9px;
      font-style: italic;
    }

    .sem-quebra {
      white-space: normal;
    }

    .laudo-item span:last-child {
      white-space: pre-wrap;
    }

    .laudo {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .laudo-item {
      display: flex;
      gap: 8px;
    }

    .laudo-data {
      flex-shrink: 0;
      color: var(--texto-secundario);
      font-size: 9.5px;
    }

    .tipo-item {
      color: var(--texto-secundario);
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .subtotais {
      display: flex;
      justify-content: flex-end;
      gap: 18px;
      margin-top: 6px;
      color: var(--texto-secundario);
      font-size: 10px;
    }

    .pagamentos {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 7px 12px;
      border: 1px solid var(--borda);
      border-radius: 6px;
    }

    .lista-pagamentos {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px;
      font-size: 10px;
    }

    .resumo-pagamento {
      display: flex;
      flex-shrink: 0;
      gap: 14px;
      font-size: 10.5px;
    }

    .resumo-pagamento strong {
      color: var(--texto);
    }

    .saldo-pendente strong {
      color: var(--primaria);
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
      ${campo('Atendente', os.usuario?.nome, 'metade')}
      ${campo('Retrabalho da O.S.', os.numOsAnterior ? `Nº ${os.numOsAnterior}` : 'Não', 'metade')}
    </section>

    <div class="bloco colunas">
      <section>
        <div class="titulo-secao">Checklist de entrada</div>
        <div class="corpo-checklist">${montarChecklist(os.osChecklists ?? [])}</div>
      </section>

      <section>
        <div class="titulo-secao">Informações do aparelho</div>

        <div class="corpo-aparelho">
          ${campo('Modelo', modelo)}
          ${campo('Cor', aparelho.cor)}
          ${campo('IMEI', aparelho.imei)}
          ${campo('Tipo de senha', aparelho.tipoSenha)}
          ${aparelho.tipoSenha === 'Padrão (Desenho)' ? padraoDesenho(aparelho.senhaAparelho) : ''}

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
        </div>
      </section>
    </div>

    <section class="bloco relato"><span class="rotulo-campo">Problema relatado pelo cliente:</span>${escapeHtml(os.diagnostico)}</section>

    <section class="bloco relato sem-quebra"><span class="rotulo-campo">Laudo técnico:</span>${montarLaudo(os.diagnosticos ?? [])}</section>

    <section class="bloco">
      <div class="tabela">
        <div class="titulo-tabela">Peças e serviços</div>

        <table class="tabela-itens">
          <thead>
            <tr>
              <th>Qtd.</th>
              <th>Descrição</th>
              <th>Valor unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            ${montarItens(itens)}
          </tbody>
        </table>
      </div>

      <div class="subtotais">
        <span>Peças: <strong>R$ ${moeda(totalPecas)}</strong></span>
        <span>Mão de obra: <strong>R$ ${moeda(totalServicos)}</strong></span>
      </div>

      <div class="fechamento">
        ${campo('Previsão de entrega', '')}

        <div class="total">
          Total
          <span class="valor-total">R$ ${moeda(total)}</span>
        </div>
      </div>
    </section>

    <section class="bloco pagamentos">
      <div class="lista-pagamentos">
        <span class="rotulo-campo">Pagamentos:</span>
        ${montarPagamentos(pagamentos)}
      </div>

      <div class="resumo-pagamento">
        <span>Pago: <strong>R$ ${moeda(totalPago)}</strong></span>
        <span class="saldo-pendente">Falta pagar: <strong>R$ ${moeda(saldo)}</strong></span>
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