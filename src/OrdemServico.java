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

    public OrdemServico() {
    }

    public OrdemServico(Long id, int numero, Aparelho aparelho, Cliente cliente, String defeitoRelatado, String estadoAparelho, String observacoes, String senhaAparelho, Double orcamento, Double valorCobrado, StatusOS status, LocalDateTime dataAbertura, LocalDateTime dataEncerramento, LocalDate dataVencimento, Garantia garantia, CheckList checkListEntreda, CheckList checkListSaida, List<HistoricoStatus> historicoStatus, List<Transicao> transicoes, List<Notificacao> notificacoes) {
        this.id = id;
        this.numero = numero;
        this.aparelho = aparelho;
        this.cliente = cliente;
        this.defeitoRelatado = defeitoRelatado;
        this.estadoAparelho = estadoAparelho;
        this.observacoes = observacoes;
        this.senhaAparelho = senhaAparelho;
        this.orcamento = orcamento;
        this.valorCobrado = valorCobrado;
        this.status = status;
        this.dataAbertura = dataAbertura;
        this.dataEncerramento = dataEncerramento;
        this.dataVencimento = dataVencimento;
        this.garantia = garantia;
        this.checkListEntreda = checkListEntreda;
        this.checkListSaida = checkListSaida;
        this.historicoStatus = historicoStatus;
        this.transicoes = transicoes;
        this.notificacoes = notificacoes;
    }


    public static int getUltimoNumeroGerado() {
        return ultimoNumeroGerado;
    }

    public static void setUltimoNumeroGerado(int ultimoNumeroGerado) {
        OrdemServico.ultimoNumeroGerado = ultimoNumeroGerado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public Aparelho getAparelho() {
        return aparelho;
    }

    public void setAparelho(Aparelho aparelho) {
        this.aparelho = aparelho;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getDefeitoRelatado() {
        return defeitoRelatado;
    }

    public void setDefeitoRelatado(String defeitoRelatado) {
        this.defeitoRelatado = defeitoRelatado;
    }

    public String getEstadoAparelho() {
        return estadoAparelho;
    }

    public void setEstadoAparelho(String estadoAparelho) {
        this.estadoAparelho = estadoAparelho;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getSenhaAparelho() {
        return senhaAparelho;
    }

    public void setSenhaAparelho(String senhaAparelho) {
        this.senhaAparelho = senhaAparelho;
    }

    public Double getOrcamento() {
        return orcamento;
    }

    public void setOrcamento(Double orcamento) {
        this.orcamento = orcamento;
    }

    public Double getValorCobrado() {
        return valorCobrado;
    }

    public void setValorCobrado(Double valorCobrado) {
        this.valorCobrado = valorCobrado;
    }

    public StatusOS getStatus() {
        return status;
    }

    public void setStatus(StatusOS status) {
        this.status = status;
    }

    public LocalDateTime getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDateTime dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public LocalDateTime getDataEncerramento() {
        return dataEncerramento;
    }

    public void setDataEncerramento(LocalDateTime dataEncerramento) {
        this.dataEncerramento = dataEncerramento;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDate dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public Garantia getGarantia() {
        return garantia;
    }

    public void setGarantia(Garantia garantia) {
        this.garantia = garantia;
    }

    public CheckList getCheckListEntreda() {
        return checkListEntreda;
    }

    public void setCheckListEntreda(CheckList checkListEntreda) {
        this.checkListEntreda = checkListEntreda;
    }

    public CheckList getCheckListSaida() {
        return checkListSaida;
    }

    public void setCheckListSaida(CheckList checkListSaida) {
        this.checkListSaida = checkListSaida;
    }

    public List<HistoricoStatus> getHistoricoStatus() {
        return historicoStatus;
    }

    public void setHistoricoStatus(List<HistoricoStatus> historicoStatus) {
        this.historicoStatus = historicoStatus;
    }

    public List<Transicao> getTransicoes() {
        return transicoes;
    }

    public void setTransicoes(List<Transicao> transicoes) {
        this.transicoes = transicoes;
    }

    public List<Notificacao> getNotificacoes() {
        return notificacoes;
    }

    public void setNotificacoes(List<Notificacao> notificacoes) {
        this.notificacoes = notificacoes;
    }

    // Abre a ordem validando cliente e aparelho, gerando número e registrando o status inicial.
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

    // Encerra a ordem apenas quando ela estiver finalizada ou entregue, registrando a data de encerramento.
    public void encerrarOS() {
        if (status != StatusOS.FINALIZADO && status != StatusOS.ENTREGUE) {
            throw new IllegalArgumentException("A ordem de servico precisa estar finalizada antes do encerramento.");
        }
        if (status == StatusOS.FINALIZADO) {
            atualizarStatus(StatusOS.ENTREGUE);
        }
        dataEncerramento = LocalDateTime.now();
    }

    // Atualiza o status atual após validar a transição e grava o histórico da mudança.
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

    // Retorna o valor cobrado quando existir; caso contrário usa o orçamento ou zero.
    public Double ValorTotal() {
        if (this.valorCobrado != null) {
            return this.valorCobrado;
        }
        return this.orcamento != null ? this.orcamento : 0.0;
    }

    @Override
    // Registra uma transação de pagamento após validar o objeto recebido.
    public void registrarPagamento(Transicao transicao) {
        if (transicao == null) {
            throw new IllegalArgumentException("Transacao de pagamento obrigatoria.");
        }
        inicializarColecoes();
        transicao.registrar();
        this.transicoes.add(transicao);
    }

    @Override
    // Soma os pagamentos registrados e verifica se o total já cobre o valor da ordem.
    public boolean isPago() {
        if (transicoes == null || transicoes.isEmpty()) {
            return false;
        }
        double totalPago = transicoes.stream().map(Transicao::getValor).filter(valor -> valor != null).mapToDouble(Double :: doubleValue).sum();
        return totalPago >= ValorTotal();
    }

    // Exibe no console uma mensagem simples de alteração da ordem de serviço.
    public void registrarAlteracao(String alteracao) {
        System.out.println("A alteracao " + alteracao + " foi registrada");
    }

    // Gera o próximo número sequencial compartilhado entre as ordens de serviço.
    public int gerarNumeroSequencial() {
        ultimoNumeroGerado++;
        return ultimoNumeroGerado;
    }

    // Verifica se a data de vencimento está entre hoje e os próximos três dias.
    public boolean isProximoVencimento() {
        return dataVencimento != null && !dataVencimento.isBefore(LocalDate.now()) && !dataVencimento.isAfter(LocalDate.now().plusDays(3));
    }

    // Garante que as coleções usadas pela ordem estejam inicializadas antes do uso.
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

    // Adiciona um novo registro no histórico sempre que houver mudança de status.
    private void registrarMudancaStatus(StatusOS anterior, StatusOS novo) {
        inicializarColecoes();
        historicoStatus.add(new HistoricoStatus(null, anterior, novo, LocalDateTime.now()));
    }

    // Valida se a mudança solicitada respeita o fluxo permitido da ordem de serviço.
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

    @Override
    public String toString() {
        return "OrdemServico{" +
                "id=" + id +
                ", numero=" + numero +
                ", aparelho=" + aparelho +
                ", cliente=" + cliente +
                ", defeitoRelatado='" + defeitoRelatado + '\'' +
                ", estadoAparelho='" + estadoAparelho + '\'' +
                ", observacoes='" + observacoes + '\'' +
                ", senhaAparelho='" + senhaAparelho + '\'' +
                ", orcamento=" + orcamento +
                ", valorCobrado=" + valorCobrado +
                ", status=" + status +
                ", dataAbertura=" + dataAbertura +
                ", dataEncerramento=" + dataEncerramento +
                ", dataVencimento=" + dataVencimento +
                ", garantia=" + garantia +
                ", checkListEntreda=" + checkListEntreda +
                ", checkListSaida=" + checkListSaida +
                ", historicoStatus=" + historicoStatus +
                ", transicoes=" + transicoes +
                ", notificacoes=" + notificacoes +
                '}';
    }
}
