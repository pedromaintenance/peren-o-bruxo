/* LORE-02 — Crônica da mesa. Leitura exclusivamente; nenhuma API de save. */
(() => {
  "use strict";
  const root = document.getElementById("chronicleRoot");
  const text = (tag, value, cls) => {
    const el = document.createElement(tag);
    el.textContent = value == null || value === "" ? "Não informado no registro" : String(value);
    if (cls) el.className = cls;
    return el;
  };
  const appendLine = (container, label, value) => {
    if (value == null || value === "") return;
    const p = document.createElement("p");
    const strong = text("strong", label + ": ");
    p.append(strong, document.createTextNode(String(value)));
    container.append(p);
  };
  const section = (title, subtitle) => {
    const detail = document.createElement("details");
    detail.className = "card";
    const summary = document.createElement("summary");
    const titleBox = document.createElement("span");
    titleBox.append(text("strong", title), text("small", subtitle || "Clique para revelar"));
    summary.append(titleBox);
    const body = document.createElement("div");
    body.className = "card-body";
    detail.append(summary, body);
    root.append(detail);
    return body;
  };
  const entry = (parent, heading) => {
    const article = document.createElement("article");
    article.className = "entry";
    article.append(text("h3", heading));
    parent.append(article);
    return article;
  };
  const list = (parent, items) => {
    if (!Array.isArray(items) || !items.length) return;
    const ul = document.createElement("ul");
    for (const item of items) ul.append(text("li", item));
    parent.append(ul);
  };
  function render(d) {
    if (d.schema !== "peren-chronicle-1" || !Array.isArray(d.timeline) || d.timeline.length !== 21) {
      throw new Error("Formato da crônica não reconhecido");
    }
    root.replaceChildren();
    const intro = section("Peren Kerrhylon", "Premissa, personagem e ponto de retomada");
    const who = entry(intro, d.character.name);
    who.append(text("span", d.character.ancestry + " · " + d.character.class + " · nível " + d.character.level, "tag"));
    who.append(text("span", "Patrono: " + d.character.patron, "tag"));
    appendLine(who, "Pacto", d.character.pact);
    appendLine(who, "Premissa", d.premise);
    appendLine(who, "Questão central", d.question);
    const where = entry(intro, "Onde a mesa parou");
    appendLine(where, "Situação", d.currentScene.situation);
    appendLine(where, "Local", d.currentScene.place);
    appendLine(where, "Grupo presente", d.currentScene.group.join(", "));
    appendLine(where, "Ferimentos conhecidos", d.currentScene.health);
    appendLine(where, "Decisão ainda aberta", d.currentScene.openChoice);

    const timeline = section("Acontecimentos anteriores", d.timeline.length + " marcos da campanha · revelação voluntária");
    timeline.append(text("p", "Estes acontecimentos ocorreram na mesa. Não são vitórias, missões nem operações realizadas neste save.", "dim"));
    const lbl = text("label", "Filtrar os marcos da história", "search-label");
    lbl.htmlFor = "chronicleSearch";
    const input = document.createElement("input");
    input.id = "chronicleSearch";
    input.type = "search";
    input.className = "search";
    input.placeholder = "Buscar por cripta, Karsthal, Veyra…";
    input.autocomplete = "off";
    lbl.append(input);
    timeline.append(lbl);
    const cards = [];
    for (const e of d.timeline) {
      const item = document.createElement("details");
      item.className = "entry timeline-entry";
      const summary = text("summary", String(e.order).padStart(2, "0") + " — " + e.title);
      const content = document.createElement("div");
      content.className = "detail";
      list(content, e.facts);
      appendLine(content, "Proveniência", e.evidence);
      item.append(summary, content);
      timeline.append(item);
      cards.push({item, search: [e.title, ...(e.facts || [])].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()});
    }
    const empty = text("p", "Nenhum marco corresponde à busca.", "empty");
    empty.hidden = true;
    timeline.append(empty);
    input.addEventListener("input", () => {
      const q = input.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      let count = 0;
      for (const {item, search} of cards) {
        const match = search.includes(q);
        item.hidden = !match;
        if (match) count++;
      }
      empty.hidden = count !== 0;
    });

    const companions = section("Companhia e familiar", "Pessoas autônomas, condições e vínculos");
    companions.append(text("p", "Os contratos são voluntários. Nenhum integrante é apenas um bônus de dano.", "dim"));
    for (const c of d.company) {
      const e = entry(companions, c.name);
      appendLine(e, "Papel", c.role);
      appendLine(e, "Condição registrada", c.condition);
      appendLine(e, "Relação com Peren", c.relationship);
    }
    const familiar = entry(companions, d.familiar.name + " — familiar");
    appendLine(familiar, "Natureza", d.familiar.type);
    appendLine(familiar, "Vínculo", d.familiar.bond);

    const pact = section("Pacto e artefatos", "Khan, os sinos transformados e os preços de usá-los");
    const patron = entry(pact, d.patron.name);
    appendLine(patron, "Natureza", d.patron.type);
    appendLine(patron, "Relação", d.patron.relationship);
    for (const r of d.relics) {
      const e = entry(pact, r.name);
      appendLine(e, "Categoria", r.category);
      appendLine(e, "Função conhecida", r.function);
      appendLine(e, "Contrapartida", r.price);
      appendLine(e, "Condição/posse", r.condition);
      appendLine(e, "Juramento", r.vow);
      appendLine(e, "Restrição", r.restriction);
      appendLine(e, "Estado da regra", r.ruleStatus);
    }

    const promises = section("Promessas e dívidas", "Compromissos que não podem desaparecer por conveniência");
    for (const p of d.promises) {
      const e = entry(promises, p.creditor || p.id);
      appendLine(e, "Responsável", p.debtor);
      appendLine(e, "Obrigação", p.obligation);
      appendLine(e, "Situação documentada", p.state);
    }

    const factions = section("Facções e forças", "O poder político, o comércio e a disputa pelos lacres");
    for (const f of d.factions) {
      const e = entry(factions, f.name);
      appendLine(e, "Natureza", f.nature);
      appendLine(e, "Interesses", Array.isArray(f.interests) ? f.interests.join("; ") : f.interests);
      appendLine(e, "Estado conhecido", f.status);
    }

    const notices = section("Limites do registro", "Diferença entre certeza, regra provisória e lacuna");
    list(notices, d.warnings);
    const source = entry(notices, "Origem do arquivo");
    appendLine(source, "Dossiê", d.sourcePath);
    appendLine(source, "Versão", d.sourceVersion);
    appendLine(source, "Compilação", d.sourceDate);
    source.append(text("p", "A Crônica registra fatos prévios e não acessa, importa ou grava nenhum save.", "dim"));
  }

  fetch("./data/cronica-canonica.json")
    .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(render)
    .catch(() => {
      root.replaceChildren(text("p", "Não foi possível abrir a Crônica. Conecte-se uma vez para atualizar o cache e tente novamente. Seu progresso no jogo não foi afetado.", "notice"));
    });
})();
