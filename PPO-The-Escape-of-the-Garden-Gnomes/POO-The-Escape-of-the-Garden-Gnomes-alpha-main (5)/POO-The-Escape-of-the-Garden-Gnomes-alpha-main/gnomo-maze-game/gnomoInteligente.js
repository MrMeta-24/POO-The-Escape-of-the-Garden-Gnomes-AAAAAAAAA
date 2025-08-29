// Importa a classe base Gnomo
import { Gnomo } from './gnomo.js';

// Define a subclasse GnomoInteligente que herda de Gnomo
export class GnomoInteligente extends Gnomo {
  
  // Construtor recebe o nome e o chapéu, define a velocidade base como 7
  constructor(nome, chapeu) {
    // Chama o construtor da classe base com velocidade média 7
    super(nome, 7, chapeu);
  }

  // Implementa o método avancar, que define como esse gnomo se move na corrida
  avancar() {
    // Calcula o movimento somando a velocidade base com o modificador de sorte do chapéu
    // Gnomos inteligentes têm um bônus adicional baseado na sorte
    const bonusInteligencia = this.chapeu.modificadorSorte > 2 ? 2 : 1;
    const movimento = this.velocidadeBase + this.chapeu.modificadorSorte + bonusInteligencia;

    // Atualiza a posição do gnomo somando o movimento calculado
    this.posicao += movimento;
  }
}

