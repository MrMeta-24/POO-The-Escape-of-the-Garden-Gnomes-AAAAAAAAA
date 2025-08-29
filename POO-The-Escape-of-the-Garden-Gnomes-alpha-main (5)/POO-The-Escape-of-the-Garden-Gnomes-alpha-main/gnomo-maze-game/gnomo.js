// Importa a classe Chapeu, usada para modificar atributos do gnomo
import { Chapeu } from './chapeu.js';

// Classe base "Gnomo" (abstrata), usada como modelo para criar tipos específicos de gnomos
export class Gnomo {
  // Propriedades privadas (acessadas somente por getters/setters ou dentro da própria classe)
  #nome;
  #velocidadeBase;
  #posicao;

  // Propriedade pública (o chapéu que o gnomo está usando)
  chapeu;

  // Construtor da classe - define os dados iniciais do gnomo
  constructor(nome, velocidadeBase, chapeu) {
    this.#nome = nome;                      // Nome do gnomo
    this.#velocidadeBase = velocidadeBase;  // Velocidade inicial do gnomo
    this.#posicao = 0;                      // Posição inicial (linha de largada)
    this.chapeu = chapeu;                   // Instância da classe Chapeu (modifica sorte, etc.)
  }

  // Getter para acessar o nome (externamente)
  get nome() {
    return this.#nome;
  }

  // Getter para acessar a posição atual
  get posicao() {
    return this.#posicao;
  }

  // Getter para acessar a velocidade base do gnomo
  get velocidadeBase() {
    return this.#velocidadeBase;
  }

  // Setter para alterar a posição, com validação (não permite posições negativas)
  set posicao(valor) {
    if (valor >= 0) {
      this.#posicao = valor;
    }
  }

  // Método que deve ser implementado pelas subclasses (ex: GnomoRapido, GnomoSortudo, etc.)
  avancar() {
    throw new Error("Método 'avancar()' deve ser implementado nas classes filhas.");
  }

  // Reseta a posição do gnomo para o início da corrida
  resetarPosicao() {
    this.#posicao = 0;
  }
}
