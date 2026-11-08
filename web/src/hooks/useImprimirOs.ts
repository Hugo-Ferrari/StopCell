import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { baixarPdfOs } from "@/services/serviceOrderService";
import { mensagemDeErro } from "@/utils/apiError";

function removerIframe(iframe: HTMLIFrameElement) {
  URL.revokeObjectURL(iframe.src);
  iframe.remove();
}

// como a requisição pede blob, o erro do back também chega como blob
// e o mensagemDeErro não consegue ler. aqui converte pra json antes
async function lerErroDoPdf(error: unknown) {
  if (isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      error.response.data = JSON.parse(await error.response.data.text());
    } catch {
      // não era json, fica a mensagem padrão mesmo
    }
  }
  return mensagemDeErro(error, "Não foi possível gerar o PDF da O.S.");
}

export function useImprimirOs(numOs: number) {
  const [imprimindo, setImprimindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    return () => {
      if (iframeRef.current) removerIframe(iframeRef.current);
    };
  }, []);

  async function imprimir() {
    setImprimindo(true);
    setErro(null);

    try {
      const pdf = await baixarPdfOs(numOs);

      // a rota exige token, então não dá pra abrir o link direto: baixa o PDF e imprime por um iframe.
      // o iframe só sai na próxima impressão porque removê-lo antes fecharia a janela de impressão
      if (iframeRef.current) removerIframe(iframeRef.current);

      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position: fixed; width: 0; height: 0; border: 0;";
      iframe.src = URL.createObjectURL(pdf);
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };

      document.body.appendChild(iframe);
      iframeRef.current = iframe;
    } catch (error) {
      setErro(await lerErroDoPdf(error));
    } finally {
      setImprimindo(false);
    }
  }

  return { imprimir, imprimindo, erro };
}