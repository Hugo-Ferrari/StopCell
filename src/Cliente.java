import java.time.LocalDate;
import java.time.LocalDateTime;

public class Cliente {
    private Long id;
    private String nomeCompleto, telefone, endereco;
    private LocalDate dataNascimento;
    private LocalDateTime datatCadastro;

    public Cliente() {
    }

    public Cliente(Long id, String nomeCompleto, String telefone, String endereco, LocalDate dataNascimento, LocalDateTime datatCadastro) {
        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.telefone = telefone;
        this.endereco = endereco;
        this.dataNascimento = dataNascimento;
        this.datatCadastro = datatCadastro;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public LocalDateTime getDatatCadastro() {
        return datatCadastro;
    }

    public void setDatatCadastro(LocalDateTime datatCadastro) {
        this.datatCadastro = datatCadastro;
    }

    // Preenche a data de cadastro caso ela ainda nao tenha sido informada.
    public void castrar() {
        if (this.datatCadastro == null) {
            this.datatCadastro = LocalDateTime.now();
        }
    }

    // Registra uma mensagem indicando que os dados do cliente foram alterados.
    public void editar() {
        registrarAlteracao("dados do cliente atualizados");
    }

    // Registra uma mensagem indicando exclusao logica do cliente.
    public void excluir() {
        registrarAlteracao("cliente excluido");
    }

    // Exibe no console a descricao da alteracao recebida.
    public void registrarAlteracao(String alteracao) {
        System.out.println("A alteracao " + alteracao + " foi registrada");
    }

    // Busca pelo telefone informado e retorna o nome quando houver correspondencia.
    public String buscarPorTelefone(String telefone) {
        if (this.telefone != null && this.telefone.equals(telefone)) {
            return this.nomeCompleto;
        }
        return null;
    }

    // Recebe uma notificacao e imprime sua mensagem quando ela existir.
    public void receberNotificacao(Notificacao notificacao) {
        if (notificacao != null) {
            System.out.println("Notificacao recebida: " + notificacao.getMensagem());
        }
    }

    @Override
    // Monta uma representacao textual do cliente para inspecao.
    public String toString() {
        return "Cliente{" +
                "id=" + id +
                ", nomeCompleto='" + nomeCompleto + '\'' +
                ", telefone='" + telefone + '\'' +
                ", endereco='" + endereco + '\'' +
                ", dataNascimento=" + dataNascimento +
                ", datatCadastro=" + datatCadastro +
                '}';
    }
}
