import java.time.LocalDateTime;

public class TransacaoCartao extends Transicao {
    private String bandeira, ultimos4Digitos;
    private int numeroParcelas;

    public TransacaoCartao() {
    }


    public TransacaoCartao(Long id, Double valor, LocalDateTime data, String bandeira, String ultimos4Digitos, int numeroParcelas) {
        super(id, valor, data);
        this.bandeira = bandeira;
        this.ultimos4Digitos = ultimos4Digitos;
        this.numeroParcelas = numeroParcelas;
    }


    public String getBandeira() {
        return bandeira;
    }


    public void setBandeira(String bandeira) {
        this.bandeira = bandeira;
    }


    public String getUltimos4Digitos() {
        return ultimos4Digitos;
    }


    public void setUltimos4Digitos(String ultimos4Digitos) {
        this.ultimos4Digitos = ultimos4Digitos;
    }


    public int getNumeroParcelas() {
        return numeroParcelas;
    }


    public void setNumeroParcelas(int numeroParcelas) {
        this.numeroParcelas = numeroParcelas;
    }

    @Override
    // Valida os dados obrigatórios do pagamento em cartão e preenche valores padrão quando necessário.
    void registrar() {
        if (valor == null || valor <= 0) {
            throw new IllegalArgumentException("Valor da transacao no cartao deve ser maior que zero.");
        }
        if (bandeira == null || bandeira.isBlank()) {
            throw new IllegalStateException("Bandeira do cartao obrigatoria.");
        }
        if (ultimos4Digitos == null || ultimos4Digitos.length() != 4) {
            throw new IllegalStateException("Informe os 4 ultimos digitos do cartao.");
        }
        if (numeroParcelas <= 0) {
            numeroParcelas = 1;
        }
        if (data == null) {
            data = LocalDateTime.now();
        }
    }

    @Override
    // Cancela a transação limpando a data registrada.
    void cancelar() {
        this.data = null;
    }

    @Override

    public String toString() {
        return "Cartao{" +
                super.toString() +
                "bandeira='" + bandeira + '\'' +
                ", ultimos4Digitos='" + ultimos4Digitos + '\'' +
                ", numeroParcelas=" + numeroParcelas +
                '}';
    }
}
