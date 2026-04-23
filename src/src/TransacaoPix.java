import java.time.LocalDateTime;

public class TransacaoPix extends Transicao {
    private String chaveDestino, qrCode;

    public TransacaoPix() {
    }

    public TransacaoPix(Long id, Double valor, LocalDateTime data, String chaveDestino) {
        super(id, valor, data);
        this.chaveDestino = chaveDestino;
    }

    public String getChaveDestino() {
        return chaveDestino;
    }

    public void setChaveDestino(String chaveDestino) {
        this.chaveDestino = chaveDestino;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    @Override
    void registrar() {
        if (valor == null || valor <= 0) {
            throw new IllegalArgumentException("Valor da transacao PIX deve ser maior que zero.");
        }
        if (chaveDestino == null || chaveDestino.isBlank()) {
            throw new IllegalStateException("Chave PIX de destino obrigatoria.");
        }
        if (data == null) {
            data = LocalDateTime.now();
        }
    }

    @Override
    void cancelar() {
        this.data = null;
    }

    @Override
    public String toString() {
        return "Pix{" +
                super.toString() +
                "chaveDestino='" + chaveDestino + '\'' +
                ", qrCode='" + qrCode + '\'' +
                ", data=" + data +
                '}';
    }
}
