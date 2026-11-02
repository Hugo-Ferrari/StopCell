import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // nas rotas de login/cadastro/recuperar senha o 401 significa "senha errada",
    // não "sessão expirou". se redirecionar aqui a página recarrega e o aviso some.
    // o replace tira a barra do começo, pra funcionar com "/auth/login" e "auth/login"
    const url = (error.config?.url ?? "").replace(/^\//, "");
    const rotaDeAuth = url.startsWith("auth/");

    if (error.response?.status === 401 && !rotaDeAuth) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;