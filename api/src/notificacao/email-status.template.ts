import type { StatusOs } from '@prisma/client';

interface ConteudoStatus {
  titulo: string;
  mensagem: (aparelho: string) => string;
}

// o que o cliente lê em cada etapa. escrito pra quem não entende de conserto
const CONTEUDO: Record<StatusOs, ConteudoStatus> = {
  ABERTA: {
    titulo: 'Recebemos seu aparelho',
    mensagem: (a) =>
      `Seu ${a} deu entrada na loja e já está na fila para o diagnóstico. A cada etapa você recebe um e-mail como este.`,
  },
  DIAGNOSTICO: {
    titulo: 'Seu aparelho está em diagnóstico',
    mensagem: (a) =>
      `Nosso técnico começou a analisar o ${a} para descobrir o defeito. Quando o orçamento estiver pronto, você recebe outro e-mail.`,
  },
  EM_APROVACAO: {
    titulo: 'Orçamento pronto para aprovação',
    mensagem: () =>
      'Terminamos o diagnóstico. Confira abaixo o que precisa ser feito e o valor. O reparo só começa depois da sua aprovação.',
  },
  EM_REPARO: {
    titulo: 'Reparo em andamento',
    mensagem: (a) => `Orçamento aprovado! O ${a} já está na bancada sendo consertado.`,
  },
  AGUARDANDO_PECA: {
    titulo: 'Aguardando peça',
    mensagem: () =>
      'O reparo está parado esperando a chegada de uma peça. Assim que ela chegar, retomamos o serviço e te avisamos.',
  },
  FINALIZADO: {
    titulo: 'Serviço finalizado',
    mensagem: (a) =>
      `O serviço do ${a} foi concluído. Obrigado pela confiança! Guarde este e-mail como comprovante da sua O.S.`,
  },
  CANCELADO: {
    titulo: 'O.S. cancelada',
    mensagem: () => 'Sua ordem de serviço foi cancelada. Se tiver qualquer dúvida, é só falar com a loja.',
  },
};

const COR_PRIMARIA = '#D9480F';
const COR_ESCURA = '#141110';

function escapar(valor: unknown): string {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function moeda(valor: unknown): string {
  return Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function data(valor: Date | string | null | undefined): string {
  if (!valor) return '-';
  return new Date(valor).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function formatarTelefone(valor?: string | null): string {
  return (valor ?? '').replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
}

function linhaInfo(rotulo: string, valor: string): string {
  return `
    <tr>
      <td style="padding:6px 0;color:#6b6460;font-size:13px">${rotulo}</td>
      <td style="padding:6px 0;color:${COR_ESCURA};font-size:13px;font-weight:bold;text-align:right">${valor}</td>
    </tr>`;
}

function tabelaOrcamento(itens: any[], total: unknown): string {
  const linhas = itens
    .map((item) => {
      const quantidade = item.quantidade ?? 1;
      const subtotal = quantidade * Number(item.valorUnitario ?? 0);
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:${COR_ESCURA}">
            ${quantidade > 1 ? `${quantidade}x ` : ''}${escapar(item.descricao)}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;text-align:right;white-space:nowrap">${moeda(subtotal)}</td>
        </tr>`;
    })
    .join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">
      ${linhas}
      <tr>
        <td style="padding:12px 0 0;font-size:15px;font-weight:bold;color:${COR_ESCURA}">Total</td>
        <td style="padding:12px 0 0;font-size:18px;font-weight:bold;color:${COR_PRIMARIA};text-align:right">${moeda(total)}</td>
      </tr>
    </table>`;
}

export function montarEmailStatus(os: any) {
  const status = os.status as StatusOs;
  const conteudo = CONTEUDO[status];

  const nomeLoja = os.empresa?.nomeFantasia ?? os.empresa?.razaoSocial ?? 'StopCell';
  const telefoneLoja = formatarTelefone(os.empresa?.telefone);
  const primeiroNome = (os.cliente?.nmCompleto ?? '').trim().split(' ')[0] || 'cliente';
  const aparelho =
    [os.aparelho?.marca?.nmMarca, os.aparelho?.modelo].filter(Boolean).join(' ') || 'aparelho';

  const mostrarOrcamento = status === 'EM_APROVACAO' && os.itensOs?.length > 0;
  const comoAprovar = telefoneLoja
    ? `Para aprovar, responda este e-mail ou ligue para ${telefoneLoja}.`
    : 'Para aprovar, é só responder este e-mail.';

  const assunto = `O.S. #${os.numOs} · ${conteudo.titulo}`;
  const mensagem = conteudo.mensagem(aparelho);

  const texto = [
    `Olá, ${primeiroNome}!`,
    '',
    conteudo.titulo,
    mensagem,
    mostrarOrcamento ? `\nTotal do orçamento: ${moeda(os.vlTotal)}\n${comoAprovar}` : '',
    '',
    `O.S. #${os.numOs} · ${aparelho}`,
    nomeLoja + (telefoneLoja ? ` · ${telefoneLoja}` : ''),
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f4f2f1;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2f1;padding:24px 12px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr>
          <td style="background:${COR_ESCURA};padding:20px 28px;border-bottom:4px solid ${COR_PRIMARIA}">
            <span style="color:#ffffff;font-size:18px;font-weight:bold">${escapar(nomeLoja)}</span>
            <span style="float:right;color:#ffffff;font-size:13px;line-height:24px">O.S. #${os.numOs}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px">
            <p style="margin:0 0 16px;color:#6b6460;font-size:14px">Olá, ${escapar(primeiroNome)}!</p>
            <h1 style="margin:0 0 10px;color:${COR_ESCURA};font-size:22px">${conteudo.titulo}</h1>
            <p style="margin:0;color:#3d3835;font-size:15px;line-height:1.55">${escapar(mensagem)}</p>

            ${mostrarOrcamento ? tabelaOrcamento(os.itensOs, os.vlTotal) : ''}
            ${mostrarOrcamento ? `<p style="margin:20px 0 0;padding:12px 14px;background:#fff4ee;border-radius:10px;color:${COR_ESCURA};font-size:14px">${escapar(comoAprovar)}</p>` : ''}

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;padding-top:16px;border-top:1px solid #eee">
              ${linhaInfo('Aparelho', escapar(aparelho))}
              ${linhaInfo('Entrada', data(os.dtEntrada))}
              ${status === 'FINALIZADO' ? linhaInfo('Valor total', moeda(os.vlTotal)) : ''}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;background:#f8f7f6;color:#8a837f;font-size:12px;line-height:1.5">
            ${escapar(nomeLoja)}${telefoneLoja ? ` · ${telefoneLoja}` : ''}${os.empresa?.endereco ? `<br>${escapar(os.empresa.endereco)}` : ''}<br>
            Você recebeu este e-mail porque deixou um aparelho na nossa loja.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { assunto, html, texto };
}