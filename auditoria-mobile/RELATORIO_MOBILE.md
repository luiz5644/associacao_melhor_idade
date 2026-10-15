# Auditoria da versão mobile

**Projeto:** Associação Melhor Idade  
**Data:** 15/10/2026  
**Escopo:** auditoria visual e funcional, sem correções no aplicativo.

## Resumo

O layout normal se ajusta às larguras testadas na maioria das páginas. Há uma falha reproduzível de rolagem horizontal no Calendário (22 px em 320 px e 65 px em 421 px). Textos propositalmente extremos sem espaços revelam um problema mais amplo: várias páginas e o menu lateral passam a exceder muito a largura do celular, dificultando navegação e leitura. Não foi possível concluir toda a sequência de teste de modais sob esses textos extremos porque o diálogo da Galeria interceptou o botão do menu.

## Como foi testado

- Chromium automatizado em emulação mobile, `deviceScaleFactor=1`, toque habilitado.
- Larguras e alturas: 320×568, 360×640, 390×844, 414×896, 768×1024 e 667×375; também 419, 421, 639, 641, 899 e 901 px para observar os breakpoints.
- Páginas: Início, Nossa História, Ações, Calendário, Galeria de Fotos e Depoimentos; menu mobile; rodapé; modais públicos quando a interação permitiu.
- Cenários: dados normais; strings extremas (incluindo palavras sem espaços); 28 itens simulados; imagens com URL quebrada; listas vazias; API offline. As respostas foram interceptadas no navegador e não houve escrita no banco.
- Foram capturadas 193 imagens em `screenshots/`. A tabela detalhada de larguras e alvos menores que 44 px está em `medicoes.json`.

## Achados

### P1 — Calendário causa rolagem horizontal mesmo com dados normais

| Janela | Largura do documento | Excesso |
|---|---:|---:|
| 320 px | 342 px | 22 px |
| 421 px | 486 px | 65 px |

O restante das larguras normais medidas não excedeu a janela. Em 320 px, os controles do calendário também produzem muitos alvos menores que 44 px (41 encontrados pelo verificador); requer conferir células/dias e controles antes de considerar o uso confortável por toque.

Capturas: [Calendário 320 px](screenshots/calendario-320-A.png), [Calendário 421 px](screenshots/calendario-421-A.png).

### P1 — Conteúdo extremo sem pontos de quebra expande páginas e esconde o menu

O cenário B usou títulos/endereço sem espaços e conteúdo longo. A largura do documento medida foi:

| Página | janela 320 | janela 390 | janela 768 |
|---|---:|---:|---:|
| Início | 956 px | 956 px | 2.199 px |
| Nossa História | 681 px | 682 px | 810 px |
| Ações | 681 px | 682 px | 810 px |
| Calendário | 681 px | 682 px | 810 px |
| Galeria | 681 px | 682 px | 810 px |
| Depoimentos | 801 px | 801 px | 1.618 px |

Como a informação comum do site (como endereço e conteúdo nos cards) pode vir da API, um texto extenso pode afetar mais de uma página. Na captura do menu a 320 px, o conteúdo ampliado empurra o drawer para longe da área inicialmente visível. Durante o teste do diálogo de detalhe da Galeria, esse diálogo interceptou a interação com o botão do menu e impediu continuar a sequência automatizada.

Capturas: [menu e Início com dados extremos](screenshots/menu-320-B.png), [detalhe de álbum com texto extremo](screenshots/modal-galeria-320-B.png), [Início 768 px com dados extremos](screenshots/inicio-768-B.png).

### P2 — Calendário tem controles compactos para toque

O verificador detectou diversos alvos com largura ou altura abaixo de 44 px no Calendário: 41 a 320 px, 10 a 421 px e 9 a 768 px no cenário normal. É um sinal de baixa precisão para toque, especialmente nos dias da grade. A contagem inclui todos os elementos clicáveis, inclusive itens internos da mesma célula.

### P2 — Imagens externas não carregaram nesta execução

As URLs externas de imagens do Unsplash foram registradas como imagens quebradas no Chromium da auditoria. Imagens locais da aplicação carregaram. Como a execução não conseguiu carregar o host externo, não foi possível separar bloqueio de rede do ambiente de teste de disponibilidade no ambiente real; não classifico isso como falha confirmada de produção.

Capturas de referência: [Início normal 320 px](screenshots/inicio-320-A.png), [Galeria com imagens simuladas quebradas](screenshots/galeria-320-D.png).

## Cobertura dos tamanhos — cenário normal

`OK` = sem overflow horizontal medido; `Atenção` = overflow horizontal. Os tamanhos indicam a largura em pixels; 667 representa a janela horizontal 667×375.

| Página | 320 | 360 | 390 | 414 | 419 | 421 | 639 | 641 | 667 | 768 | 899 | 901 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Início | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| Nossa História | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| Ações | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| Calendário | Atenção | OK | OK | OK | OK | Atenção | OK | OK | OK | OK | OK | OK |
| Galeria | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK |
| Depoimentos | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK | OK |

## Modais, menu e casos simulados

- Foi possível abrir e capturar os modais públicos de doação/PIX, patrocínio e horários na janela de 320 px sob texto extremo. Também foi capturado o detalhe de álbum; o excesso de conteúdo torna o modal muito alto e densamente preenchido, e a sobreposição interrompeu a sequência do teste. Os screenshots estão em `screenshots/modal-*.png`.
- As capturas do menu foram geradas para todas as larguras testadas; no cenário normal o menu foi aberto e a seleção de página fechou o drawer. Sob texto extremo, a largura global cresce e o drawer fica fora da área inicial visível.
- Foram geradas capturas dos cenários C (28 itens), D (imagens inválidas), E (listas vazias) e F (API offline) em 320, 390 e 768 px. O script mediu as seis páginas por cenário. A falha horizontal do Calendário em 320 px também aparece nesses cenários; fora isso, não houve overflow adicional medido para C–F.
- O fluxo completo dos modais em 390 e 768 px e testes de rolagem do fundo com gesto real não foram concluídos nesta execução.
- Painel autenticado do administrador e cadastro/edição não testados: não foram fornecidas credenciais e o escopo proíbe alterações de dados.
- A auditoria não realizou mutações no banco nem alterou arquivos da aplicação.

## Recomendações remanescentes (não aplicadas)

1. As células dos dias têm 44 px de altura, mas não 44 px de largura em algumas telas estreitas: sete colunas de 44 px não cabem sem rolagem horizontal. Aumentar a largura exigiria redesenhar a navegação da grade.
2. Reexecutar a verificação de imagens externas em uma rede sem bloqueio e repetir os fluxos de modal em um navegador mobile real antes de atribuir falha às imagens.

## Verificação após as correções

Após a auditoria, foram aplicadas correções somente em `src/index.css`:

- Nas larguras de 320, 390 e 421 px, o Calendário agora tem largura de documento igual à janela (sem rolagem horizontal). Os botões de navegação têm 44×44 px; os dias mantêm 44 px de altura e ocupam a largura disponível. A largura das células dos dias é menor que 44 px em algumas dessas janelas, porque sete colunas não cabem em 320 px com 44 px por coluna sem reintroduzir o overflow.
- O cenário de texto longo voltou a ficar limitado à largura da janela em 320, 390 e 768 px na página inicial.
- A compilação de produção passou. O lint completou sem erros, mas ainda reporta avisos existentes em arquivos fora da alteração CSS.

`medicoes.json` e as capturas registram o estado anterior às correções; esta seção contém as medidas de verificação posteriores.

## Arquivos da auditoria

- `RELATORIO_MOBILE.md` — este relatório.
- `medicoes.json` — medições coletadas por página, viewport e cenário.
- `screenshots/` — capturas de páginas, navegação, cenários simulados e alguns modais.

Para remover os resultados desta auditoria depois, exclua somente a pasta `auditoria-mobile/`.
