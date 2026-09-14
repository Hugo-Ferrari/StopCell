export function emailValido(email: string): boolean {
  // exige validaççao de ter um @ no email e um dominio com ponto depois, tipo @gmail.com
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}