function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function moeda(value: unknown): string {
  return Number(value ?? 0).toLocaleString('pt-BR', {
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

export function gerarHtmlOrdemServico(os: any): string {
  const nomeEmpresa =
    os.empresa?.nomeFantasia ?? os.empresa?.razaoSocial ?? 'Empresa';
  const itens = Array.isArray(os.itensOs) ? os.itensOs : [];
  const diagnosticos = Array.isArray(os.diagnosticos) ? os.diagnosticos : [];
  const totalItens = itens.reduce(
    (total: number, item: any) =>
      total +
      (Number(item.quantidade ?? 1) || 0) *
        (Number(item.valorUnitario ?? 0) || 0),
    0,
  );
  const total = os.vlTotal == null ? totalItens : Number(os.vlTotal);
  const descricaoDiagnostico =
    os.diagnostico ??
    diagnosticos
      .map((diagnostico: any) => diagnostico.relatoTecnico)
      .filter(Boolean)
      .join(' | ');
  const servicosHtml = itens
    .map((item: any) => {
      const descricao =
        item.servico?.descricao ??
        item.peca?.descricao ??
        'Item não identificado';
      const quantidade = Number(item.quantidade ?? 1) || 0;
      const valorUnitario = Number(item.valorUnitario ?? 0) || 0;
      const subtotal = quantidade * valorUnitario;

      return `
        <tr>
                        <td>${escapeHtml(descricao)}</td>
                        <td class="center">${quantidade}</td>
                        <td class="right">R$ ${moeda(valorUnitario)}</td>
                        <td class="right">R$ ${moeda(subtotal)}</td>
        </tr>
      `;
    })
    .join('');
  const linhasItens =
    servicosHtml ||
    '<tr><td colspan="4" class="empty">Nenhum serviço ou peça lançado.</td></tr>';

  return `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
<meta charset="UTF-8">

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    background:#eef1f4;
    color:#263238;
    padding:24px;
}

.container{
    background:white;
    max-width:900px;
    margin:auto;
    border-radius:6px;
    overflow:hidden;
    border:1px solid #DDD;
}

.header{

    background:#263238;
    color:white;

    display:flex;
    justify-content:space-between;
    align-items:center;

    padding:24px 28px;
}

.logo{
    font-size:28px;
    font-weight:bold;
}

.os{
    text-align:right;
}

.os h1{
    font-size:26px;
}

.section{
    padding:20px 30px;
}

.card{
    border:1px solid #DDD;
    margin-bottom:15px;
    overflow:hidden;
}

.card-title{

    background:#f0f4f8;
    color:#263238;

    font-weight:bold;
    padding:10px 15px;
}

.card-content{
    padding:15px;
    line-height:1.8;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:24px;
    font-size:13px;
}

thead{
    background:#455a64;
    color:white;
}

th{
    padding:12px;
}

td{
    padding:10px;
    border-bottom:1px solid #EEE;
}

.center{ text-align:center; }
.right{ text-align:right; white-space:nowrap; }
.empty{ color:#78909c; text-align:center; padding:18px; }

tfoot td{
    font-weight:bold;
}

.total{

    margin-top:20px;

    text-align:right;

    font-size:22px;
    color:#263238;
    font-weight:bold;
}

.obs{

    margin-top:25px;

    border:1px dashed #999;

    padding:15px;
    border-radius:6px;
}

.assinaturas{

    margin-top:70px;

    display:flex;
    justify-content:space-between;
}

.assinatura{
    width:250px;
    text-align:center;
}

.assinatura hr{
    margin-bottom:5px;
}

.meta{
    color:#b0bec5;
    font-size:12px;
    margin-top:4px;
}

@media print{
    body{ background:white; padding:0; }
    .container{ border:0; max-width:none; }
}

</style>

</head>

<body>

<div class="container">

<div class="header">

<div>

<div class="logo">
${escapeHtml(nomeEmpresa)}
</div>

<div>${escapeHtml(os.empresa?.razaoSocial ?? '')}</div>

<div class="meta">${escapeHtml(os.empresa?.endereco ?? '')}</div>

<div class="meta">CNPJ: ${escapeHtml(os.empresa?.cnpj ?? '')} | Tel.: ${escapeHtml(os.empresa?.telefone ?? '')}</div>

</div>

<div class="os">

<h1>OS #${escapeHtml(os.numOs)}</h1>

<div>Status: <strong>${escapeHtml(os.status ?? 'Não informado')}</strong></div>

<div class="meta">Entrada: ${dataHora(os.dtEntrada)}</div>

</div>

</div>

<div class="section">

<div class="card">

<div class="card-title">
DADOS DO CLIENTE
</div>

<div class="card-content">

<strong>Nome:</strong> ${escapeHtml(os.cliente?.nmCompleto ?? '')}<br>

<strong>CPF:</strong> ${escapeHtml(os.cliente?.cpf ?? '')}<br>

<strong>Telefone:</strong> ${escapeHtml(os.cliente?.telefone ?? '')}<br>

<strong>E-mail:</strong> ${escapeHtml(os.cliente?.email ?? '')}<br>

<strong>Endereço:</strong> ${escapeHtml(os.cliente?.endereco ?? '')}

</div>

</div>

<div class="card">

<div class="card-title">
EQUIPAMENTO
</div>

<div class="card-content">

<strong>Modelo:</strong> ${escapeHtml(os.aparelho?.modelo ?? '')}<br>

<strong>Cor:</strong> ${escapeHtml(os.aparelho?.cor ?? '')}<br>

<strong>IMEI:</strong> ${escapeHtml(os.aparelho?.imei ?? '')}<br>

<strong>Tipo de senha:</strong> ${escapeHtml(os.aparelho?.tipoSenha ?? 'Não informada')}

</div>

</div>

<div class="card">

<div class="card-title">
DIAGNÓSTICO
</div>

<div class="card-content">

<strong>Problema:</strong>

${escapeHtml(descricaoDiagnostico || 'Não informado')}

<br><br>

<strong>Solução:</strong>

${itens
  .map((i: any) => i.servico?.descricao ?? i.peca?.descricao)
  .filter(Boolean)
  .map((descricao: string) => escapeHtml(descricao))
  .join(', ')}

</div>

</div>

<table>

<thead>

<tr>

<th>Descrição</th>

<th width="70">Qtd</th>

<th width="140">Valor Unit.</th>

<th width="140">Subtotal</th>

</tr>

</thead>

<tbody>

${linhasItens}

</tbody>

</table>

<div class="total">

TOTAL: R$ ${moeda(total)}

</div>

<div class="obs">

<b>OBSERVAÇÕES</b>

<br><br>

• A garantia aplica-se apenas aos serviços executados, conforme as condições informadas pela empresa.

<br>

• Danos causados por mau uso ou contato com líquidos anulam a garantia.

<br>

• A empresa não se responsabiliza por dados armazenados no aparelho.

</div>

<div class="assinaturas">

<div class="assinatura">

<hr>

Cliente

</div>

<div class="assinatura">

<hr>

Responsável Técnico

</div>

</div>

</div>

</body>

</html>

`;
}
