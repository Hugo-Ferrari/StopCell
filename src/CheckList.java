import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CheckList {
    private Long id;
    private LocalDateTime dataResgistro;
    private List<ItemCheckList> itens;

    public CheckList() {
    }

    public CheckList(Long id, LocalDateTime dataResgistro, List<ItemCheckList> itens) {
        this.id = id;
        this.dataResgistro = dataResgistro;
        this.itens = itens;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataResgistro() {
        return dataResgistro;
    }

    public void setDataResgistro(LocalDateTime dataResgistro) {
        this.dataResgistro = dataResgistro;
    }

    public List<ItemCheckList> getItens() {
        return itens;
    }

    public void setItens(List<ItemCheckList> itens) {
        this.itens = itens;
    }

    // Garante que o checklist tenha data de registro e uma colecao de itens pronta para uso.
    public void registrar() {
        if (this.dataResgistro == null) {
            this.dataResgistro = LocalDateTime.now();
        }
        if (this.itens == null) {
            this.itens = new ArrayList<>();
        }
    }

    // Finaliza o checklist apenas quando todos os itens ja estiverem marcados.
    public void finalizar() {
        if (!isCompleto()) {
            throw new IllegalStateException("Nao e possivel finalizar um checklist incompleto.");
        }
        if (this.dataResgistro == null) {
            this.dataResgistro = LocalDateTime.now();
        }
    }

    // Verifica se existe pelo menos um item e se todos foram marcados.
    public boolean isCompleto() {
        return itens != null && !itens.isEmpty() && itens.stream().allMatch(ItemCheckList::isMarcado);
    }

    @Override
    // Monta uma representacao textual do checklist com seus dados principais.
    public String toString() {
        return "CheckList{" +
                "id=" + id +
                ", dataResgistro=" + dataResgistro +
                ", itens=" + itens +
                '}';
    }
}
