// Dados completos do projeto Associação Melhor Idade extraídos do design no Figma

export const siteData = {
  brand: {
    name: "Melhor Idade",
    subtitle: "ASSOCIAÇÃO COMUNITÁRIA",
    since: 2005,
    email: "contato@associacaomelhoridade.org",
    address: "Rua das Oliveiras, 450 – Bairro das Flores, São Paulo – SP",
    phone: "(11) 98765-4321",
    pixKey: "contato@associacaomelhoridade.org",
    mission: "Oferecendo dignidade, alegria, integração e bem-estar para a melhor idade da nossa comunidade desde 2005. Venha nos fazer uma visita!"
  },

  // 1. TELA INÍCIO
  home: {
    hero: {
      tag: "SEJA BEM-VINDO(A) À NOSSA CASA",
      title: "A vida recomeça todos os dias com afeto e amizade.",
      description: "A Associação Melhor Idade é um espaço acolhedor e vibrante em nossa comunidade, promovendo encontros, atividades saudáveis e resgatando histórias de vida.",
      image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=1200&auto=format&fit=crop" // Idosos felizes em parque celebrando
    },
    upcoming: {
      tag: "CALENDÁRIO DO IDOSO",
      title: "Próximos Encontros",
      subtitle: "Fique por dentro das atividades de destaque desta semana e participe com a gente!",
      items: [
        {
          id: "forro-1",
          day: "Sex, 14:00",
          category: "Música",
          title: "Forró da Melhor Idade",
          description: "Nossa tarde mais animada com música ao vivo, comidinhas típicas e muito arrasta-pé."
        },
        {
          id: "coral-1",
          day: "Ter, 09:00",
          category: "Coral",
          title: "Ensaio Geral do Coral",
          description: "Afinando as vozes e corações para as apresentações festivas de fim de ano."
        },
        {
          id: "caminhada-1",
          day: "Quinta, 08:30",
          category: "Saúde",
          title: "Caminhada Ecológica",
          description: "Passeio leve pelo parque local acompanhado por um instrutor físico."
        }
      ]
    },
    historyTeaser: {
      tag: "HISTÓRIA",
      title: "Nossa Caminhada",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop", // Foto comunitária nostálgica / vintage
      paragraphs: [
        "Nascemos do sonho de integrar as pessoas idosas de nossa comunidade, trazendo companhia, risadas e resgate cultural para o bairro.",
        "Em 2005, um pequeno grupo de vizinhos se juntou na garagem da Dona Alzira para conversar e costurar. Hoje, somos centenas de associados que encontram um lar acolhedor todos os dias."
      ],
      ctaText: "Ler nossa história completa"
    },
    recentMoments: {
      tag: "GALERIA",
      title: "Momentos Recentes",
      subtitle: "Espie a alegria que contagia nossas tardes de encontro, festividades e excursões.",
      items: [
        {
          id: "rec-1",
          image: "https://images.unsplash.com/photo-1545232979-fbf6c1417ca9?q=80&w=800&auto=format&fit=crop", // Baile forró idosos
          title: "Forró da Melhor Idade",
          subtitle: "Casais dançando sorridentes"
        },
        {
          id: "rec-2",
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop", // Coral / canto
          title: "Nosso Coral do Bairro",
          subtitle: "Apresentação no teatro municipal"
        },
        {
          id: "rec-3",
          image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop", // Viagem em grupo montanhas
          title: "Viagem para Campos do Jordão",
          subtitle: "Excursão de inverno divertida"
        }
      ]
    },
    cta: {
      title: "Ajude-nos a manter essa chama acesa!",
      description: "A Associação Melhor Idade é sem fins lucrativos. Sua doação de qualquer valor ou sua ajuda voluntária nos permite expandir as oficinas, organizar mais passeios e fornecer café da tarde comunitário saudável.",
      buttonText: "Quero Doar ou Apoiar"
    }
  },

  // 2. TELA NOSSA HISTÓRIA
  history: {
    tag: "NOSSA TRAJETÓRIA",
    title: "Nossa Linda História",
    subtitle: "Como o carinho transformou uma garagem humilde em um refúgio de amizade para centenas de idosos.",
    timeline: [
      {
        year: "2005",
        yearColor: "#2A5C66",
        title: "O Início na Garagem",
        text: "Tudo começou quando a Dona Alzira e mais três amigas decidiram se reunir para tomar chá, fazer tricô e compartilhar lembranças. Elas perceberam que muitos idosos do bairro passavam as tardes sozinhos. Nascia a semente da nossa associação.",
        image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=900&auto=format&fit=crop", // Senhoras tricotando e conversando na sala/garagem
        imagePosition: "right"
      },
      {
        year: "2012",
        yearColor: "#E8A87C",
        title: "O Primeiro Coral",
        text: "O grupo cresceu tanto que o salão da paróquia local foi pequeno. Nesse ano, fundamos o Coral da Melhor Idade sob a regência voluntária do maestro Roberto, trazendo melodia e união às nossas terças-feiras.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop", // Grupo de coral com partituras
        imagePosition: "left"
      },
      {
        year: "2018",
        yearColor: "#3D6058",
        title: "A Conquista da Sede Própria",
        text: "Graças às generosas contribuições e parcerias com o comércio do bairro, conseguimos restaurar uma antiga chácara abandonada e transformá-la em nossa maravilhosa sede atual, com horta, cozinha e amplo salão para bailes.",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=900&auto=format&fit=crop", // Bela casa histórica com jardim e flores
        imagePosition: "right"
      }
    ]
  },

  // 3. TELA ATIVIDADES
  activities: {
    tag: "ATIVIDADES COM AMOR",
    title: "Nossas Atividades diárias",
    subtitle: "Oferecemos uma variedade de oficinas, encontros e dinâmicas criadas especialmente para o seu bem-estar mental e físico.",
    items: [
      {
        id: "act-forro",
        categoryTag: "MÚSICA & DANÇA",
        title: "Forró da Melhor Idade",
        description: "Nosso baile mais tradicional! Venha dançar, rir e comer saborosos quitutes comunitários.",
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=800&auto=format&fit=crop",
        schedule: {
          days: "Todas as Sextas-feiras",
          time: "14:00 às 18:00",
          location: "Salão Nobre Principal",
          instructor: "Prof. Tiago Silva & Sanfona Regional",
          details: "Baile aberto com lanche comunitário. Traje livre e confortável!"
        }
      },
      {
        id: "act-coral",
        categoryTag: "CULTURA",
        title: "Canto & Coral",
        description: "Aulas de expressão vocal e coral comunitário. Cante suas músicas favoritas do passado.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        schedule: {
          days: "Terças e Quintas",
          time: "09:00 às 11:00",
          location: "Sala de Música Maestro Roberto",
          instructor: "Maestro Roberto Albuquerque",
          details: "Não precisa de experiência prévia. Exercícios de respiração e técnica vocal suave."
        }
      },
      {
        id: "act-viagens",
        categoryTag: "LAZER",
        title: "Viagens & Passeios",
        description: "Excursões seguras e planejadas de um dia ou finais de semana para praias e cidades do interior.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
        schedule: {
          days: "1 a 2 vezes por mês (Sábados/Domingos)",
          time: "Saída às 07:00 da sede",
          location: "Destinos turísticos selecionados",
          instructor: "Equipe de Guias e Enfermagem de Apoio",
          details: "Ônibus leito executivo com ar-condicionado, kit lanche e seguro viagem incluso."
        }
      },
      {
        id: "act-rainha",
        categoryTag: "FESTA",
        title: "Rainha da Melhor Idade",
        description: "Nosso desfile anual de carisma e simpatia, celebrando a beleza e a sabedoria das nossas idosas.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
        schedule: {
          days: "Anual (Mês de Outubro)",
          time: "19:00",
          location: "Teatro Municipal e Sede",
          instructor: "Comissão de Celebração e Voluntários",
          details: "Ensaio e produção de maquiagem, vestidos e premiação de simpatia e elegância."
        }
      },
      {
        id: "act-artesanato",
        categoryTag: "TRABALHOS MANUAIS",
        title: "Oficinas de Artesanato",
        description: "Aulas práticas de crochê, pintura, cerâmica e jardinagem comunitária.",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop",
        schedule: {
          days: "Segundas e Quartas",
          time: "14:00 às 16:30",
          location: "Ateliê Dona Alzira",
          instructor: "Profª Maria Helena e Voluntárias",
          details: "Todos os materiais de pintura, cerâmica e fios são fornecidos gratuitamente."
        }
      },
      {
        id: "act-tematicas",
        categoryTag: "CELEBRAÇÃO",
        title: "Festas Temáticas",
        description: "Festas juninas, aniversariantes do mês, baile de máscaras e comemorações tradicionais.",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop",
        schedule: {
          days: "Último sábado de cada mês",
          time: "17:00 às 22:00",
          location: "Pátio Coberto e Jardim",
          instructor: "Comissão de Eventos da Associação",
          details: "Comidas típicas, brincadeiras tradicionais e confraternização com as famílias."
        }
      }
    ]
  },

  // 4. TELA CALENDÁRIO
  calendar: {
    tag: "CALENDÁRIO DO IDOSO",
    title: "Nossa Programação",
    subtitle: "Datas claras e de fácil leitura para você programar seus dias de diversão e aprendizado.",
    categories: [
      { id: "Todas", label: "Todas" },
      { id: "Música", label: "Música" },
      { id: "Coral", label: "Coral" },
      { id: "Lazer", label: "Lazer" },
      { id: "Artes", label: "Artes" }
    ],
    // Destaques fixos do mês (conforme imagem do Figma)
    highlights: [
      {
        dateLabel: "Terça, 01 - 09:00",
        category: "Coral",
        title: "Canto Coral",
        description: "Aprimorando voz e postura com o maestro Roberto.",
        color: "#2A5C66"
      },
      {
        dateLabel: "Sexta, 04 - 14:00",
        category: "Música",
        title: "Tarde do Forró Comunitário",
        description: "Baile especial com sanfoneiro ao vivo.",
        color: "#E8A87C"
      },
      {
        dateLabel: "Quarta, 08 - 14:00",
        category: "Artes",
        title: "Oficina de Pintura em Tela",
        description: "Traga avental, tintas inclusas.",
        color: "#3D6058"
      }
    ],
    // Eventos distribuídos nos dias de Outubro 2026
    eventsOctober2026: [
      { day: 1, title: "Canto Coral", time: "09:00", category: "Coral", desc: "Aprimorando voz e postura com o maestro Roberto." },
      { day: 4, title: "Tarde do Forró Comunitário", time: "14:00", category: "Música", desc: "Baile especial com sanfoneiro ao vivo e mesa de bolos." },
      { day: 6, title: "Café com Poesia", time: "15:00", category: "Lazer", desc: "Leitura de poemas e contação de causos." },
      { day: 8, title: "Oficina de Pintura em Tela", time: "14:00", category: "Artes", desc: "Técnica de aquarela e óleo sobre tela. Tintas inclusas." },
      { day: 11, title: "Forró Semanal da Saudade", time: "14:00", category: "Música", desc: "Músicas de Luiz Gonzaga, Dominguinhos e Trio Nordestino." },
      { day: 14, title: "Aula de Ioga e Respiração", time: "08:30", category: "Lazer", desc: "Alongamento suave na grama do jardim." },
      { day: 15, title: "Ensaio Geral do Coral", time: "09:00", category: "Coral", desc: "Preparação para o festival de corais da cidade." },
      { day: 18, title: "Forró com Concurso de Dança", time: "14:00", category: "Música", desc: "Premiação simbólica para o casal mais animado." },
      { day: 22, title: "Oficina de Modelagem em Cerâmica", time: "14:00", category: "Artes", desc: "Criação de vasos decorativos com argila natural." },
      { day: 25, title: "Excursão Campos do Jordão", time: "07:00", category: "Lazer", desc: "Passeio pelo teleférico, feira de malhas e chocolate artesanal." },
      { day: 28, title: "Canto Coral & Harmonia", time: "09:00", category: "Coral", desc: "Repertório natalino e clássicos da MPB." },
      { day: 31, title: "Baile das Máscaras & Aniversariantes", time: "16:00", category: "Música", desc: "Grande celebração com bolo de aniversário comunitário!" }
    ]
  },

  // 5. TELA GALERIA DE FOTOS
  gallery: {
    tag: "GALERIA DE FOTOS",
    title: "Álbum de Lembranças",
    subtitle: "Cada fotografia guarda um sorriso, uma história e o orgulho de pertencer à nossa grande família.",
    categories: [
      { id: "Todos", label: "Todos os Momentos" },
      { id: "Forro", label: "Forró" },
      { id: "Coral", label: "Coral" },
      { id: "Viagens", label: "Viagens e Passeios" },
      { id: "Celebracoes", label: "Celebrações" }
    ],
    items: [
      {
        id: "gal-1",
        category: "Celebracoes",
        title: "Nossa Quadrilha de São João",
        subtitle: "Junho de 2026",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=900&auto=format&fit=crop",
        description: "Mais de 150 participantes vestidos a caráter celebrando o São João da comunidade com muito carinho e comidas típicas."
      },
      {
        id: "gal-2",
        category: "Coral",
        title: "Coral Cantando na Praça",
        subtitle: "Apresentação de Primavera",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop",
        description: "Concerto ao ar livre sob a sombra das árvores na Praça das Flores, emocionando moradores e visitantes."
      },
      {
        id: "gal-3",
        category: "Viagens",
        title: "Passeio em Ubatuba",
        subtitle: "Pé na areia e muita brisa",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
        description: "Final de semana inesquecível no litoral norte, com banho de mar assistido, caminhadas na areia e peixe fresco."
      },
      {
        id: "gal-4",
        category: "Forro",
        title: "Baile do Forró Semanal",
        subtitle: "Todas as sextas com alegria",
        image: "https://images.unsplash.com/photo-1545232979-fbf6c1417ca9?q=80&w=900&auto=format&fit=crop",
        description: "O momento mais aguardado da semana: nossos idosos preenchem o salão com vitalidade, passos ensaiados e muita amizade."
      },
      {
        id: "gal-5",
        category: "Celebracoes",
        title: "Festa de Fim de Ano",
        subtitle: "Jantar comunitário",
        image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=900&auto=format&fit=crop",
        description: "Banquete de confraternização comemorando as conquistas do ano, homenageando associados e compartilhando votos de paz."
      },
      {
        id: "gal-6",
        category: "Celebracoes",
        title: "Oficina de Cerâmica",
        subtitle: "Nossos artesãos orgulhosos",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=900&auto=format&fit=crop",
        description: "Exposição final das peças produzidas no semestre: vasos pintados à mão, esculturas em argila e toalhas bordadas."
      }
    ]
  }
};
