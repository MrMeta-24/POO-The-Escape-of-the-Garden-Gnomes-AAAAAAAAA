// Importa os tipos específicos de gnomos que podem ser criados
import { GnomoVeloz } from './gnomoVeloz.js';
import { GnomoAzarado } from './gnomoAzarado.js';
import { GnomoInteligente } from './gnomoInteligente.js';
import { Chapeu } from './chapeu.js';

// Define a classe de fábrica que cria instâncias de gnomos com base no tipo
export class GnomoFactory {
  
  // Método estático (pode ser chamado sem criar uma instância de GnomoFactory)

  static criarGnomo(tipo, nome, corChapeu) {
    
    // Cria um novo chapéu com a cor fornecida e um modificador de sorte aleatório entre 0 e 4
    const chapeu = new Chapeu(corChapeu, Math.floor(Math.random() * 5));
    
    // Verifica o tipo e retorna o gnomo correspondente
    if (tipo === 'Veloz') {
      return new GnomoVeloz(nome, chapeu);
    } else if (tipo === 'Azarado') {
      return new GnomoAzarado(nome, chapeu);
    } else if (tipo === 'Inteligente') {
      return new GnomoInteligente(nome, chapeu);
    }

    // Caso o tipo seja inválido, lança um erro
    throw new Error('Tipo de gnomo desconhecido');
  }
}
