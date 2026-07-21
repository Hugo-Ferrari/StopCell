export function gerarHtmlOrdemServico(os: any): string {
  const servicosHtml = os.itensOs
    .map((item: any) => {
      const descricao = item.servico?.descricao ?? item.peca?.descricao ?? '';
      const subtotal =
        (item.quantidade ?? 1) * Number(item.valorUnitario ?? 0);

      return `
        <tr>
            <td>${descricao}</td>
            <td align="center">${item.quantidade ?? 1}</td>
            <td align="right">R$ ${Number(item.valorUnitario ?? 0).toFixed(2)}</td>
            <td align="right">R$ ${subtotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

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
    background:#f5f5f5;
    color:#333;
    padding:30px;
}

.container{
    background:white;
    max-width:900px;
    margin:auto;
    border-radius:10px;
    overflow:hidden;
    border:1px solid #DDD;
}

.header{

    background:#7F7F7F;
    color:white;

    display:flex;
    justify-content:space-between;
    align-items:center;

    padding:25px;
}

.logo{
    font-size:32px;
    font-weight:bold;
}

.logo span{
    color:#FFA500;
}

.os{
    text-align:right;
}

.os h1{
    font-size:30px;
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
    color:#00000;

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
    margin-top:20px;
}

thead{
    background:#7F7F7F;
    color:white;
}

th{
    padding:12px;
}

td{
    padding:10px;
    border-bottom:1px solid #EEE;
}

tfoot td{
    font-weight:bold;
}

.total{

    margin-top:20px;

    text-align:right;

    font-size:22px;
    color:#000000;
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

</style>

</head>

<body>

<div class="container">

<div class="header">

<div>

<div class="logo">
STOP<span>CELL</span>
</div>

<div>${os.empresa?.nomeFantasia ?? ''}</div>

<div>${os.empresa?.endereco ?? ''}</div>

<div>CNPJ: ${os.empresa?.cnpj ?? ''}</div>

</div>

<div class="os">

<h1>OS #${os.numOs}</h1>

<div>Status: <strong>${os.status}</strong></div>

</div>

</div>

<div class="section">

<div class="card">

<div class="card-title">
DADOS DO CLIENTE
</div>

<div class="card-content">

<strong>Nome:</strong> ${os.cliente?.nmCompleto ?? ''}<br>

<strong>CPF:</strong> ${os.cliente?.cpf ?? ''}<br>

<strong>Telefone:</strong> ${os.cliente?.telefone ?? ''}

</div>

</div>

<div class="card">

<div class="card-title">
EQUIPAMENTO
</div>

<div class="card-content">

<strong>Modelo:</strong> ${os.aparelho?.modelo ?? ''}<br>

<strong>Cor:</strong> ${os.aparelho?.cor ?? ''}<br>

<strong>IMEI:</strong> ${os.aparelho?.imei ?? ''}

</div>

</div>

<div class="card">

<div class="card-title">
DIAGNÓSTICO
</div>

<div class="card-content">

<strong>Problema:</strong>

${os.diagnosticos[0]?.relatoTecnico ?? ''}

<br><br>

<strong>Solução:</strong>

${os.itensOs
  .map((i: any) => i.servico?.descricao)
  .filter(Boolean)
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

${servicosHtml}

</tbody>

</table>

<div class="total">

TOTAL: R$ ${Number(os.vlTotal ?? 0).toFixed(2)}

</div>

<div class="obs">

<b>OBSERVAÇÕES</b>

<br><br>

• Garantia válida apenas para os serviços executados.

<br>

• Danos causados por mau uso ou contato com líquidos anulam a garantia.

<br>

• A StopCell não se responsabiliza por dados armazenados no aparelho.

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