// Núcleo experimental puro: ainda não conectado à edição clássica ou ao Phaser.
// Não define potência, duração, recipiente, custos, desbloqueios nem saves.
function obterItens(catalogo) {
  if (!catalogo || typeof catalogo !== 'object' ||
      !catalogo.itens || typeof catalogo.itens !== 'object' ||
      Array.isArray(catalogo.itens)) {
    throw new TypeError('Catálogo inválido: esperado objeto com mapa itens.');
  }
  return catalogo.itens;
}

function validarAtributos(id, ficha) {
  if (!ficha || !Array.isArray(ficha.atributos)) {
    throw new TypeError('Ingredientes sem atributos: ' + id);
  }
  const vistos = new Set();
  for (const atributo of ficha.atributos) {
    if (!atributo || typeof atributo.id !== 'string' || !atributo.id ||
        typeof atributo.nome !== 'string' || !atributo.nome) {
      throw new TypeError('Atributo sem ID ou nome: ' + id);
    }
    if (!Number.isInteger(atributo.intensidade) ||
        atributo.intensidade < 1 || atributo.intensidade > 3) {
      throw new RangeError('Intensidade inválida: ' + id + '/' + atributo.id);
    }
    if (vistos.has(atributo.id)) {
      throw new RangeError('Atributo duplicado na ficha: ' + id + '/' + atributo.id);
    }
    vistos.add(atributo.id);
  }
}

// Cada efeito é ativado por no mínimo duas ESPÉCIES de ingredientes distintas.
// A+B e B+A retornam objetos idênticos, independentemente da ordem recebida.
export function avaliarMistura(catalogo, selecao) {
  const itens = obterItens(catalogo);
  if (!Array.isArray(selecao) || !selecao.length ||
      selecao.some(id => typeof id !== 'string' || !id)) {
    throw new TypeError('Seleção deve ser um array não vazio de IDs de ingredientes.');
  }
  const ingredientes = [...new Set(selecao)].sort();
  for (const id of ingredientes) {
    if (!Object.hasOwn(itens, id)) throw new RangeError('Ingrediente desconhecido: ' + id);
    validarAtributos(id, itens[id]);
  }
  if (ingredientes.length < 2) {
    return { estado: 'falha', motivo: 'fontes_distintas_insuficientes', ingredientes, efeitos: [] };
  }

  const porEfeito = new Map();
  for (const id of ingredientes) {
    for (const atributo of itens[id].atributos) {
      if (!porEfeito.has(atributo.id)) {
        porEfeito.set(atributo.id, { id: atributo.id, nome: atributo.nome, fontes: [] });
      }
      porEfeito.get(atributo.id).fontes.push({
        ingredienteId: id,
        intensidade: atributo.intensidade
      });
    }
  }
  const efeitos = [...porEfeito.values()]
    .filter(efeito => efeito.fontes.length >= 2)
    .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  return {
    estado: efeitos.length ? 'preparacao' : 'falha',
    motivo: efeitos.length ? null : 'sem_efeitos_compartilhados',
    ingredientes,
    efeitos
  };
}

// Diagnóstico estrutural somente leitura; não corrige a curadoria automaticamente.
export function auditarCatalogo(catalogo) {
  const itens = obterItens(catalogo);
  const erros = [];
  const nomes = new Map();
  const efeitoFontes = new Map();
  const contagemAtributos = {};
  const ids = Object.keys(itens).sort();

  for (const id of ids) {
    const ficha = itens[id];
    const nome = ficha?.nome;
    if (typeof nome !== 'string' || !nome.trim()) erros.push('Nome inválido: ' + id);
    else {
      const chave = nome.trim().toLocaleLowerCase('pt-BR');
      if (!nomes.has(chave)) nomes.set(chave, { nome, ids: [] });
      nomes.get(chave).ids.push(id);
    }
    if (!Array.isArray(ficha?.atributos)) {
      erros.push('Atributos ausentes: ' + id);
      continue;
    }
    contagemAtributos[ficha.atributos.length] = (contagemAtributos[ficha.atributos.length] || 0) + 1;
    if (ficha.atributos.length < 3) erros.push('Menos de três atributos: ' + id);
    const vistos = new Set();
    for (const a of ficha.atributos) {
      if (!a || typeof a.id !== 'string' || !a.id) {
        erros.push('ID de atributo inválido: ' + id);
        continue;
      }
      if (vistos.has(a.id)) erros.push('Atributo duplicado: ' + id + '/' + a.id);
      vistos.add(a.id);
      if (!Number.isInteger(a.intensidade) || a.intensidade < 1 || a.intensidade > 3) {
        erros.push('Intensidade fora de I-III: ' + id + '/' + a.id);
      }
      if (/stamina/i.test(a.id + ' ' + (a.nome || ''))) {
        erros.push('Stamina proibida: ' + id + '/' + a.id);
      }
      if (!efeitoFontes.has(a.id)) efeitoFontes.set(a.id, new Set());
      efeitoFontes.get(a.id).add(id);
    }
  }
  const nomesDuplicados = [...nomes.values()].filter(n => n.ids.length > 1);
  const efeitosIsolados = [...efeitoFontes.entries()]
    .filter(([, fontes]) => fontes.size < 2).map(([id]) => id).sort();
  return {
    contagens: {
      ingredientes: ids.length,
      efeitos: efeitoFontes.size,
      efeitosIsolados: efeitosIsolados.length,
      atributosPorIngrediente: contagemAtributos
    },
    nomesDuplicados,
    efeitosIsolados,
    erros
  };
}
