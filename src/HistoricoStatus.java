import java.time.LocalDateTime;

public class HistoricoStatus {
    private Long id;
    private StatusOS statusAnterior, statusNovo;
    private LocalDateTime dataAlteracao;

    public HistoricoStatus() {
    }


    public HistoricoStatus(Long id, StatusOS statusAnterior, StatusOS statusNovo, LocalDateTime dataAlteracao) {
        this.id = id;
        this.statusAnterior = statusAnterior;
        this.statusNovo = statusNovo;
        this.dataAlteracao = dataAlteracao;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public StatusOS getStatusAnterior() {
        return statusAnterior;
    }


    public void setStatusAnterior(StatusOS statusAnterior) {
        this.statusAnterior = statusAnterior;
    }


    public StatusOS getStatusNovo() {
        return statusNovo;
    }


    public void setStatusNovo(StatusOS statusNovo) {
        this.statusNovo = statusNovo;
    }


    public LocalDateTime getDataAlteracao() {
        return dataAlteracao;
    }


    public void setDataAlteracao(LocalDateTime dataAlteracao) {
        this.dataAlteracao = dataAlteracao;
    }

    @Override

    public String toString() {
        return "HistoricoStatus{" +
                "id=" + id +
                ", statusAnterior=" + statusAnterior +
                ", statusNovo=" + statusNovo +
                ", dataAlteracao=" + dataAlteracao +
                '}';
    }
}
