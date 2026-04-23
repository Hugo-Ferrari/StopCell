import java.time.LocalDateTime;

public abstract class Transicao {
    protected Long id;
    protected Double valor;
    protected LocalDateTime data;

    public Transicao() {
    }

    public Transicao(Long id, Double valor, LocalDateTime data) {
        this.id = id;
        this.valor = valor;
        this.data = data;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    abstract void registrar();

    abstract void cancelar();

    @Override
    public String toString() {
        return "Transicao{" +
                "id=" + id +
                ", valor=" + valor +
                ", data=" + data +
                '}';
    }
}
