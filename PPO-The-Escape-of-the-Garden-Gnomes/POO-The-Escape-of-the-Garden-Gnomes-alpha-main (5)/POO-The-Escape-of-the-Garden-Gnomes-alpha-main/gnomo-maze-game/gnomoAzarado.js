// Importa a classe base Gnomo (que define estrutura comum a todos os gnomos)
import { Gnomo } from './gnomo.js';

// Define uma subclasse de Gnomo chamada "GnomoAzarado"
export class GnomoAzarado extends Gnomo {

  // Construtor recebe o nome e o chapéu como parâmetros
  constructor(nome, chapeu) {
    // Chama o construtor da classe pai (Gnomo)
    // Define uma velocidade base fixa de 5 para todos os Gnomos Azarados
    super(nome, 5, chapeu);
  }

  // Implementa o método 'avancar', obrigatório por causa da classe base
  avancar() {
    // Movimento é calculado somando a velocidade base com o modificador de sorte do chapéu
    const movimento = this.velocidadeBase + this.chapeu.modificadorSorte;

    // Se o movimento for maior que 0, avança a posição
    // Caso contrário, não anda (evita movimento negativo ou para trás)
    this.posicao += movimento > 0 ? movimento : 0;
  }
}
