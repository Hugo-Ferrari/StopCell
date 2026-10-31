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

function dataHora(value: unknown): string {
  if (!value) return 'Não informada';

  const data = new Date(String(value));

  if (Number.isNaN(data.getTime())) return 'Não informada';

  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function dataSimples(value: unknown): string {
  if (!value) return 'Não informada';

  const data = new Date(String(value));

  if (Number.isNaN(data.getTime())) return 'Não informada';

  return data.toLocaleDateString('pt-BR');
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
    os.diagnostico ??
    diagnosticos
      .map((diagnostico: any) => diagnostico.relatoTecnico)
      .filter(Boolean)
      .join(' | ');

  const solucao = itens
    .map(
      (item: any) =>
        item.servico?.descricao ?? item.peca?.descricao,
    )
    .filter(Boolean)
    .map((descricao: string) => escapeHtml(descricao))
    .join(', ');

  const linhasItens = itens.length
    ? itens
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
              <td class="descricao">${escapeHtml(descricao)}</td>
              <td class="direita">R$ ${moeda(valorItem)}</td>
            </tr>
          `;
        })
        .join('')
    : `
        <tr>
          <td colspan="2" class="vazio">
            Nenhum serviço ou peça lançado.
          </td>
        </tr>
      `;

  const enderecoEmpresa = os.empresa?.endereco;
  const telefoneEmpresa = os.empresa?.telefone;
  const cnpjEmpresa = os.empresa?.cnpj;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Ordem de Serviço ${escapeHtml(os.numOs)}</title>

  <style>
    :root {
      /* Ajuste estas variáveis às cores oficiais da StopCell. */
      --primaria: #263238;
      --primaria-clara: #438eae;
      --destaque: #69bfdc;
      --fundo-secao: #f1f3f4;
      --borda: #c9ced1;
      --texto: #252b2e;
      --texto-secundario: #59656b;
    }

    * {
      box-sizing: border-box;
    }

    @page {
      size: A4;
      margin: 7mm;
    }

    body {
      margin: 0;
      padding: 12px;
      color: var(--texto);
      background: #e9eef5;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .folha {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      overflow: hidden;
      background: #fff;
      border: 1px solid var(--borda);
      border-radius: 0;
    }

    .cabecalho {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 20px 24px;
      color: #fff;
      background: var(--primaria);
      border-bottom: 4px solid var(--destaque);
    }

    .empresa {
      min-width: 0;
    }

    .nome-empresa {
      margin-bottom: 5px;
      font-size: 24px;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .subtitulo-empresa {
      color: #dbeafe;
      font-size: 11px;
    }

    .contato-empresa {
      margin-top: 7px;
      color: #dbeafe;
      font-size: 10px;
      overflow-wrap: anywhere;
    }

    .identificacao-os {
      flex-shrink: 0;
      text-align: right;
    }

    .identificacao-os .rotulo {
      color: #dbeafe;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .numero-os {
      margin: 3px 0 8px;
      color: #fff;
      font-size: 25px;
      font-weight: 800;
    }

    .status {
      display: inline-block;
      padding: 4px 9px;
      color: #fff;
      background: var(--primaria-clara);
      border: 1px solid #93c5fd;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }

    .conteudo {
      padding: 17px 22px;
    }

    .linha-meta {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 17px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--borda);
      color: var(--texto-secundario);
      font-size: 11px;
    }

    .grade {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      margin-bottom: 12px;
    }

    .secao {
      min-width: 0;
      margin-bottom: 12px;
      border: 1px solid var(--borda);
      break-inside: avoid;
    }

    .titulo-secao {
      padding: 8px 12px;
      color: #fff;
      background: var(--primaria-clara);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .5px;
    }

    .corpo-secao {
      padding: 12px;
    }

    .campo {
      margin-bottom: 9px;
      overflow-wrap: anywhere;
    }

    .campo:last-child {
      margin-bottom: 0;
    }

    .rotulo-campo {
      color: var(--texto-secundario);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .valor-campo {
      margin-top: 2px;
      font-size: 12px;
      font-weight: 500;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .diagnostico {
      min-height: 65px;
      line-height: 1.7;
      overflow-wrap: anywhere;
    }

    .solucao {
      min-height: 32px;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px dashed var(--borda);
      overflow-wrap: anywhere;
    }

    .titulo-tabela {
      margin: 14px 0 0;
      padding: 9px 12px;
      color: #fff;
      background: var(--primaria);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 11px;
    }

    thead {
      color: var(--texto);
      background: #e7eaec;
    }

    th {
      padding: 10px 8px;
      border: 1px solid var(--borda);
      text-align: left;
    }

    td {
      padding: 11px 9px;
      border: 1px solid #b8c0c4;
      vertical-align: top;
      overflow-wrap: anywhere;
    }

    tbody tr:nth-child(even) {
      background: #f7f8f8;
    }

    th:first-child {
      width: 76%;
    }

    th:last-child {
      width: 24%;
    }

    .direita {
      text-align: right;
      white-space: nowrap;
    }

    .vazio {
      padding: 20px;
      color: var(--texto-secundario);
      text-align: center;
    }

    .area-total {
      display: flex;
      justify-content: flex-end;
      margin-top: 14px;
      break-inside: avoid;
    }

    .total {
      min-width: 210px;
      padding: 10px 14px;
      color: #fff;
      background: var(--primaria-clara);
      border-left: 5px solid var(--destaque);
      text-align: right;
    }

    .total .rotulo-total {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .valor-total {
      margin-top: 3px;
      font-size: 23px;
      font-weight: 800;
    }

    .previsao {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 18px;
      padding: 12px;
      background: var(--fundo-secao);
      border: 1px solid var(--borda);
      break-inside: avoid;
    }

    .observacoes {
      margin-top: 16px;
      padding: 14px;
      border: 1px solid var(--borda);
      break-inside: avoid;
    }

    .observacoes h3 {
      margin: 0 0 8px;
      color: var(--primaria);
      font-size: 11px;
      text-transform: uppercase;
    }

    .texto-garantia {
      color: var(--texto-secundario);
      font-size: 10px;
      line-height: 1.6;
    }

    .assinaturas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 35px;
      margin-top: 45px;
      break-inside: avoid;
    }

    .assinatura {
      padding-top: 8px;
      border-top: 1px solid #64748b;
      text-align: center;
      font-size: 11px;
    }

    .rodape {
      margin-top: 20px;
      padding: 10px 18px;
      color: var(--texto-secundario);
      background: #f8fafc;
      border-top: 1px solid var(--borda);
      text-align: center;
      font-size: 9px;
    }

    @media screen and (max-width: 600px) {
      body {
        padding: 8px;
      }

      .cabecalho {
        align-items: flex-start;
        flex-direction: column;
        padding: 18px;
      }

      .identificacao-os {
        text-align: left;
      }

      .conteudo {
        padding: 14px;
      }

      .grade {
        grid-template-columns: 1fr;
      }

      .linha-meta {
        flex-direction: column;
      }

      .assinaturas {
        gap: 20px;
      }
    }

    @media print {
      body {
        padding: 0;
        background: #fff;
      }

      .folha {
        max-width: none;
        border: 0;
        border-radius: 0;
      }

      .secao,
      .titulo-tabela,
      .area-total,
      .previsao,
      .observacoes,
      .assinaturas {
        break-inside: avoid;
      }

      tr {
        break-inside: avoid;
      }
    }
  </style>
</head>

<body>
  <main class="folha">
    <header class="cabecalho">
      <div class="empresa">
        <div class="nome-empresa">${escapeHtml(nomeEmpresa)}</div>
        <div class="subtitulo-empresa">Assistência técnica</div>

        <div class="contato-empresa">
          ${escapeHtml(enderecoEmpresa ?? '')}
        </div>

        <div class="contato-empresa">
          ${cnpjEmpresa ? `CNPJ: ${escapeHtml(cnpjEmpresa)}` : ''}
          ${cnpjEmpresa && telefoneEmpresa ? ' | ' : ''}
          ${telefoneEmpresa ? `Telefone: ${escapeHtml(telefoneEmpresa)}` : ''}
        </div>
      </div>

      <div class="identificacao-os">
        <div class="rotulo">Ordem de Serviço</div>
        <div class="numero-os">Nº ${escapeHtml(os.numOs)}</div>
        <div class="status">${escapeHtml(os.status ?? 'Não informado')}</div>
      </div>
    </header>

    <div class="conteudo">
      <div class="linha-meta">
        <span>
          <strong>Data de entrada:</strong>
          ${escapeHtml(dataHora(os.dtEntrada))}
        </span>

        <span>
          <strong>Data de saída:</strong>
          ${escapeHtml(dataHora(os.dtSaida))}
        </span>
      </div>

      <div class="grade">
        <section class="secao">
          <div class="titulo-secao">Dados do cliente</div>

          <div class="corpo-secao">
            <div class="campo">
              <div class="rotulo-campo">Nome completo</div>
              <div class="valor-campo">
                ${escapeHtml(os.cliente?.nmCompleto ?? 'Não informado')}
              </div>
            </div>

            <div class="campo">
              <div class="rotulo-campo">CPF</div>
              <div class="valor-campo">
                ${escapeHtml(os.cliente?.cpf ?? 'Não informado')}
              </div>
            </div>

            <div class="campo">
              <div class="rotulo-campo">Telefone</div>
              <div class="valor-campo">
                ${escapeHtml(os.cliente?.telefone ?? 'Não informado')}
              </div>
            </div>

            <div class="campo">
              <div class="rotulo-campo">E-mail</div>
              <div class="valor-campo">
                ${escapeHtml(os.cliente?.email ?? 'Não informado')}
              </div>
            </div>

            <div class="campo">
              <div class="rotulo-campo">Endereço</div>
              <div class="valor-campo">
                ${escapeHtml(os.cliente?.endereco ?? 'Não informado')}
              </div>
            </div>
          </div>
        </section>

        <section class="secao">
          <div class="titulo-secao">Informações do aparelho</div>

          <div class="corpo-secao">
            <div class="campo">
              <div class="rotulo-campo">Modelo</div>
              <div class="valor-campo">
                ${escapeHtml(os.aparelho?.modelo ?? 'Não informado')}
              </div>
            </div>

            <div class="campo">
              <div class="rotulo-campo">Cor</div>
              <div class="valor-campo">
                ${escapeHtml(os.aparelho?.cor ?? 'Não informada')}
              </div>
            </div>

            <div class="campo">
              <div class="rotulo-campo">IMEI</div>
              <div class="valor-campo">
                ${escapeHtml(os.aparelho?.imei ?? 'Não informado')}
              </div>
            </div>

            <div class="campo">
              <div class="rotulo-campo">Tipo de senha</div>
              <div class="valor-campo">
                ${escapeHtml(os.aparelho?.tipoSenha ?? 'Não informada')}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="secao">
        <div class="titulo-secao">Laudo técnico / diagnóstico</div>

        <div class="corpo-secao">
          <div class="diagnostico">
            <div class="rotulo-campo">Problema relatado / diagnóstico</div>
            <div class="valor-campo">
              ${escapeHtml(descricaoDiagnostico || 'Não informado')}
            </div>
          </div>

          <div class="solucao">
            <div class="rotulo-campo">Serviços / solução prevista</div>
            <div class="valor-campo">
              ${solucao || 'Não informado'}
            </div>
          </div>
        </div>
      </section>

      <div class="titulo-tabela">Laudo técnico / descrição dos serviços</div>

      <table>
        <thead>
          <tr>
            <th>Descrição dos serviços</th>
            <th class="direita">Valor</th>
          </tr>
        </thead>

        <tbody>
          ${linhasItens}
        </tbody>
      </table>

      <div class="area-total">
        <div class="total">
          <div class="rotulo-total">Valor total da OS</div>
          <div class="valor-total">R$ ${moeda(total)}</div>
        </div>
      </div>

      <div class="previsao">
        <div>
          <div class="rotulo-campo">Previsão de entrega</div>
          <div class="valor-campo">
            ${escapeHtml(dataSimples(os.dtPrevisaoEntrega))}
          </div>
        </div>

        <div>
          <div class="rotulo-campo">Situação da ordem</div>
          <div class="valor-campo">
            ${escapeHtml(os.status ?? 'Não informado')}
          </div>
        </div>
      </div>

      <section class="observacoes">
        <h3>Observações e garantia</h3>

        <div class="texto-garantia">
          A garantia aplica-se aos serviços executados e às peças
          substituídas, conforme as condições estabelecidas pela empresa.

          <br><br>

          Danos causados por mau uso, quedas, contato com líquidos ou
          intervenções de terceiros poderão afetar a cobertura da garantia,
          de acordo com as condições aplicáveis.

          <br><br>

          Observações adicionais:
          ${escapeHtml(os.observacoes ?? 'Nenhuma observação registrada.')}
        </div>
      </section>

      <div class="assinaturas">
        <div class="assinatura">
          Assinatura do cliente
        </div>

        <div class="assinatura">
          Responsável técnico
        </div>
      </div>
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