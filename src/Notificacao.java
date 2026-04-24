import java.time.LocalDateTime;

public class Notificacao {
    private Long id;
    private Cliente cliente;
    private OrdemServico ordemServico;
    private String mensagem;
    private LocalDateTime dataEnvio;
    private StatusEnvio statusEnvio;
    private TipoEvento tipoEvento;

    public Notificacao() {
    }


    public Notificacao(Long id, Cliente cliente, OrdemServico ordemServico, String mensagem, LocalDateTime dataEnvio, StatusEnvio statusEnvio, TipoEvento tipoEvento) {
        this.id = id;
        this.cliente = cliente;
        this.ordemServico = ordemServico;
        this.mensagem = mensagem;
        this.dataEnvio = dataEnvio;
        this.statusEnvio = statusEnvio;
        this.tipoEvento = tipoEvento;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Cliente getCliente() {
        return cliente;
    }


    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }


    public OrdemServico getOrdemServico() {
        return ordemServico;
    }


    public void setOrdemServico(OrdemServico ordemServico) {
        this.ordemServico = ordemServico;
    }


    public String getMensagem() {
        return mensagem;
    }


    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }


    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }


    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }


    public StatusEnvio getStatusEnvio() {
        return statusEnvio;
    }


    public void setStatusEnvio(StatusEnvio statusEnvio) {
        this.statusEnvio = statusEnvio;
    }


    public TipoEvento getTipoEvento() {
        return tipoEvento;
    }


    public void setTipoEvento(TipoEvento tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    // Valida os dados mínimos, registra a data de envio e encaminha a mensagem ao cliente.
    public void enviar() {
        if (cliente == null || mensagem == null || mensagem.isBlank()) {
            this.statusEnvio = StatusEnvio.FALHA;
            return;
        }
        this.dataEnvio = LocalDateTime.now();
        this.statusEnvio = StatusEnvio.ENVIADO;
        cliente.receberNotificacao(this);
    }

    // Ao editar uma notificação já enviada, ela volta para pendente e limpa a data anterior.
    public void editar() {
        if (this.statusEnvio == StatusEnvio.ENVIADO) {
            this.statusEnvio = StatusEnvio.PENDENTE;
            this.dataEnvio = null;
        }
    }

    @Override

    public String toString() {
        return "Notificacao{" +
                "id=" + id +
                ", cliente=" + cliente +
                ", ordemServico=" + ordemServico +
                ", mensagem='" + mensagem + '\'' +
                ", dataEnvio=" + dataEnvio +
                ", statusEnvio=" + statusEnvio +
                ", tipoEvento=" + tipoEvento +
                '}';
    }
}
