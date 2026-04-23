public class ItemCheckList {
    private Long id;
    private String descricao;
    private boolean marcado;

    public ItemCheckList() {
    }

    public ItemCheckList(Long id, String descricao, boolean marcado) {
        this.id = id;
        this.descricao = descricao;
        this.marcado = marcado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean isMarcado() {
        return marcado;
    }

    public void setMarcado(boolean marcado) {
        this.marcado = marcado;
    }

    public void marcar() {
        this.marcado = true;
    }

    public void desmarcar() {
        this.marcado = false;
    }

    @Override
    public String toString() {
        return "ItemCheckList{" +
                "id=" + id +
                ", descricao='" + descricao + '\'' +
                ", marcado=" + marcado +
                '}';
    }
}
