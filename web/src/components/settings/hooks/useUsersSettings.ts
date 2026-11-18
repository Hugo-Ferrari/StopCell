import { useCallback, useEffect, useState } from "react";
import {
  atualizarPerfil,
  criarPerfil,
  listarCatalogoPermissoes,
  listarPerfis,
  removerPerfil,
  type PerfilAcesso,
  type PerfilDTO,
  type PermissaoCatalogo,
} from "@/services/perfilService";
import {
  atualizarUsuario,
  criarUsuario,
  listarUsuarios,
  type AtualizarUsuarioDTO,
  type NovoUsuarioDTO,
  type UsuarioDaLoja,
} from "@/services/userService";
import { mensagemDeErro } from "@/utils/apiError";

// só busca, sem mexer em estado (assim dá pra usar no useEffect e nos recarregamentos)
async function buscarTudo() {
  const [usuarios, perfis, catalogo] = await Promise.all([
    listarUsuarios(),
    listarPerfis(),
    listarCatalogoPermissoes(),
  ]);
  return { usuarios, perfis, catalogo };
}

export function useUsersSettings() {
  const [usuarios, setUsuarios] = useState<UsuarioDaLoja[]>([]);
  const [perfis, setPerfis] = useState<PerfilAcesso[]>([]);
  const [catalogo, setCatalogo] = useState<PermissaoCatalogo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const aplicar = useCallback((dados: Awaited<ReturnType<typeof buscarTudo>>) => {
    setUsuarios(dados.usuarios);
    setPerfis(dados.perfis);
    setCatalogo(dados.catalogo);
    setErro(null);
  }, []);

  useEffect(() => {
    buscarTudo()
      .then(aplicar)
      .catch((error) => setErro(mensagemDeErro(error, "Não foi possível carregar os usuários.")))
      .finally(() => setCarregando(false));
  }, [aplicar]);

  // recarrega tudo junto porque mexer em usuário muda o "X usuários" dos perfis
  async function carregar() {
    aplicar(await buscarTudo());
  }

  // os erros daqui sobem pro modal, que mostra a mensagem pro usuário
  async function salvarPerfil(dados: PerfilDTO, idPerfil?: number) {
    if (idPerfil) await atualizarPerfil(idPerfil, dados);
    else await criarPerfil(dados);
    await carregar();
  }

  async function salvarUsuario(dados: AtualizarUsuarioDTO, idUsuario?: number) {
    if (idUsuario) await atualizarUsuario(idUsuario, dados);
    // o modal já validou os campos obrigatórios antes de chegar aqui
    else await criarUsuario(dados as NovoUsuarioDTO);
    await carregar();
  }

  // a confirmação e a mensagem de erro ficam no ExcluirPerfilDialog
  async function excluirPerfil(perfil: PerfilAcesso) {
    await removerPerfil(perfil.idPerfil);
    await carregar();
  }

  return { usuarios, perfis, catalogo, carregando, erro, salvarPerfil, salvarUsuario, excluirPerfil };
}