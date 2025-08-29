// Exporta a classe Chapeu para ser usada em outros arquivos (como no jogo principal)
export class Chapeu {
  // Construtor da classe, chamado quando um novo chapéu é criado
  constructor(cor, modificadorSorte) {
    // Define a cor do chapéu (string, ex: "vermelho", "azul", etc.)
    this.cor = cor;

    // Define o modificador de sorte que o chapéu concede ao gnomo
    // Pode ser um número positivo, negativo ou zero (ex: +2 de sorte)
    this.modificadorSorte = modificadorSorte;
  }
}
