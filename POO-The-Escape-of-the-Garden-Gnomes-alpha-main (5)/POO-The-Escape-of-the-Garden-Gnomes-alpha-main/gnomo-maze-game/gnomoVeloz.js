// Importa a classe base Gnomo
import { Gnomo } from './gnomo.js';

// Define a subclasse GnomoVeloz que herda de Gnomo
export class GnomoVeloz extends Gnomo {
  
  // Construtor recebe o nome e o chapéu, define a velocidade base como 10
  constructor(nome, chapeu) {
    // Chama o construtor da classe base com velocidade fixa 10
    super(nome, 10, chapeu);
  }

  // Implementa o método avancar, que define como esse gnomo se move na corrida
  avancar() {
    // Calcula o movimento somando a velocidade base com o modificador de sorte do chapéu
    const movimento = this.velocidadeBase + this.chapeu.modificadorSorte;

    // Atualiza a posição do gnomo somando o movimento calculado
    this.posicao += movimento;
  }
}
