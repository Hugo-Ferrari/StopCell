import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

public class OrdemServico implements Pagavel {
    private static int ultimoNumeroGerado;

    private Long id;
    private int numero;
    private Aparelho aparelho;
    private Cliente cliente;
    private String defeitoRelatado, estadoAparelho, observacoes, senhaAparelho;
    private Double orcamento, valorCobrado;
    private StatusOS status;
    private LocalDateTime dataAbertura;
    private LocalDateTime dataEncerramento;
    private LocalDate dataVencimento;
    private Garantia garantia;
    private CheckList checkListEntreda;
    private CheckList checkListSaida;
    private List<HistoricoStatus> historicoStatus;
    private List<Transicao> transicoes;
    private List<Notificacao> notificacoes;

    public void abrirOS() {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente obrigatorio para abrir uma ordem de servico.");
        }
        if (aparelho == null) {
            throw new IllegalArgumentException("Aparelho obrigatorio para abrir uma ordem de servico.");
        }
        if (numero <= 0) {
            numero = gerarNumeroSequencial();
        }
        dataAbertura = LocalDateTime.now();
        dataEncerramento = null;
        inicializarColecoes();
        status = StatusOS.EM_ANALISE;
        registrarMudancaStatus(null, status);
    }

    public void encerrarOS() {
        if (status != StatusOS.FINALIZADO && status != StatusOS.ENTREGUE) {
            throw new IllegalArgumentException("A ordem de servico precisa estar finalizada antes do encerramento.");
        }
        if (status == StatusOS.FINALIZADO) {
            atualizarStatus(StatusOS.ENTREGUE);
        }
        dataEncerramento = LocalDateTime.now();
    }

    public void atualizarStatus(StatusOS status) {
        if (status == null) {
            throw new IllegalArgumentException("Novo status obrigatorio.");
        }
        if (this.status == null) {
            this.status = status;
            registrarMudancaStatus(null, status);
            return;
        }
        if (this.status == status) {
            return;
        }
        validarTransicao(status);
        registrarMudancaStatus(this.status, status);
        this.status = status;
        if (status == StatusOS.FINALIZADO && garantia != null) {
            dataVencimento = garantia.getDataValidade();
        }
    }

    public Double ValorTotal() {
        if (this.valorCobrado != null) {
            return this.valorCobrado;
        }
        return this.orcamento != null ? this.orcamento : 0.0;
    }

    @Override
    public void registrarPagamento(Transicao transicao) {
        if (transicao == null) {
            throw new IllegalArgumentException("Transacao de pagamento obrigatoria.");
        }
        inicializarColecoes();
        transicao.registrar();
        this.transicoes.add(transicao);
    }

    @Override
    public boolean isPago() {
        if (transicoes == null || transicoes.isEmpty()) {
            return false;
        }
        double totalPago = transicoes.stream().map(Transicao::getValor).filter(valor -> valor != null).mapToDouble(Double :: doubleValue).sum();
        return totalPago >= ValorTotal();
    }

    public void registrarAlteracao(String alteracao) {
        System.out.println("A alteracao " + alteracao + " foi registrada");
    }

    public int gerarNumeroSequencial() {
        ultimoNumeroGerado++;
        return ultimoNumeroGerado;
    }

    public boolean isProximoVencimento() {
        return dataVencimento != null && !dataVencimento.isBefore(LocalDate.now()) && !dataVencimento.isAfter(LocalDate.now().plusDays(3));
    }

    private void inicializarColecoes() {
        if (historicoStatus == null) {
            historicoStatus = new ArrayList<>();
        }
        if (transicoes == null) {
            transicoes = new ArrayList<>();
        }
        if (notificacoes == null) {
            notificacoes = new ArrayList<>();
        }
    }

    private void registrarMudancaStatus(StatusOS anterior, StatusOS novo) {
        inicializarColecoes();
        historicoStatus.add(new HistoricoStatus(null, anterior, novo, LocalDateTime.now()));
    }

    private void validarTransicao(StatusOS novoStatus) {
        EnumSet<StatusOS> permitidos;
        switch (this.status) {
            case EM_ANALISE:
                permitidos = EnumSet.of(StatusOS.AGUARDANDO_APOVAÇÃO, StatusOS.EM_REPARO);
                break;
            case AGUARDANDO_APOVAÇÃO:
                permitidos = EnumSet.of(StatusOS.EM_REPARO);
                break;
            case EM_REPARO:
                permitidos = EnumSet.of(StatusOS.FINALIZADO);
                break;
            case FINALIZADO:
                if (!isPago()) {
                    throw new IllegalArgumentException("Nao e possivel entregar uma ordem sem pagamento.");
                }
                permitidos = EnumSet.of(StatusOS.ENTREGUE);
                break;
            case ENTREGUE:
                permitidos = EnumSet.noneOf(StatusOS.class);
                break;
            default:
                permitidos = EnumSet.noneOf(StatusOS.class);
        }

        if (!permitidos.contains(novoStatus)) {
            throw new IllegalArgumentException("Transicao de status invalida: " + this.status + " -> " + novoStatus);
        }
    }
}
