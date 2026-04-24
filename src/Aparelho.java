public class Aparelho {
    private Long id;
    private String modelo, marca, identificador;
    private Cliente cliente;


    public Aparelho() {
    }



    public Aparelho(Long id, String modelo, String marca, String identificador, Cliente cliente) {
        this.id = id;
        this.modelo = modelo;
        this.marca = marca;
        this.identificador = identificador;
        this.cliente = cliente;
    }



    public Long getId() {
        return id;
    }



    public void setId(Long id) {
        this.id = id;
    }



    public String getModelo() {
        return modelo;
    }



    public void setModelo(String modelo) {
        this.modelo = modelo;
    }



    public String getMarca() {
        return marca;
    }



    public void setMarca(String marca) {
        this.marca = marca;
    }



    public String getIdentificador() {
        return identificador;
    }



    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }



    public Cliente getCliente() {
        return cliente;
    }



    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }


    public void cadastrar(){
        if (modelo == null || modelo.isBlank()) {
            throw new IllegalArgumentException("Modelo do aparelho obrigatorio.");
        }
        if (marca == null || marca.isBlank()) {
            throw new IllegalArgumentException("Marca do aparelho obrigatoria.");
        }
        if (identificador == null || identificador.isBlank()) {
            throw new IllegalArgumentException("Identificador do aparelho obrigatorio.");
        }
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente obrigatorio para cadastrar um aparelho.");
        }
        if (cliente.getDatatCadastro() == null) {
            cliente.castrar();
        }
    }

    public void editar(){
        if (id == null) {
            throw new IllegalStateException("Nao e possivel editar um aparelho sem identificador.");
        }
        if (modelo == null || modelo.isBlank()) {
            throw new IllegalArgumentException("Modelo do aparelho obrigatorio.");
        }
        if (marca == null || marca.isBlank()) {
            throw new IllegalArgumentException("Marca do aparelho obrigatoria.");
        }
        if (identificador == null || identificador.isBlank()) {
            throw new IllegalArgumentException("Identificador do aparelho obrigatorio.");
        }
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente obrigatorio para editar um aparelho.");
        }
        cliente.registrarAlteracao("dados do aparelho atualizados");
    }

    @Override

    public String toString() {
        return "Aparelho{" +
                "id=" + id +
                ", modelo='" + modelo + '\'' +
                ", marca='" + marca + '\'' +
                ", identificador='" + identificador + '\'' +
                ", cliente=" + cliente +
                '}';
    }
}
