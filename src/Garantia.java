import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Garantia {
    private Long id;
    private int prazoEmDias;
    private String exclusoes;
    private LocalDate dataValidade;

    public Garantia() {
    }

    public Garantia(Long id, int prazoEmDias, String exclusoes, LocalDate dataValidade) {
        this.id = id;
        this.prazoEmDias = prazoEmDias;
        this.exclusoes = exclusoes;
        this.dataValidade = dataValidade;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPrazoEmDias() {
        return prazoEmDias;
    }

    public void setPrazoEmDias(int prazoEmDias) {
        this.prazoEmDias = prazoEmDias;
    }

    public String getExclusoes() {
        return exclusoes;
    }

    public void setExclusoes(String exclusoes) {
        this.exclusoes = exclusoes;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public int diasRestantes() {
        if (dataValidade == null) {
            return 0;
        }
        return (int) ChronoUnit.DAYS.between(LocalDate.now(), dataValidade);
    }

    @Override
    public String toString() {
        return "Garantia{" +
                "id=" + id +
                ", prazoEmDias=" + prazoEmDias +
                ", exclusoes='" + exclusoes + '\'' +
                ", dataValidade=" + dataValidade +
                '}';
    }
}
