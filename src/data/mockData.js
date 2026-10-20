// Dados completos do projeto Associação Melhor Idade extraídos do design no Figma

export const siteData = {
  brand: {
    name: "Melhor Idade",
    subtitle: "ASSOCIAÇÃO COMUNITÁRIA",
    since: 2005,
    email: "",
    address: "",
    phone: "",
    pixKey: "",
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
        subtitle: "Fique por dentro das ações de destaque desta semana e participe com a gente!",
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
      tag: "AÇÕES COM AMOR",
      title: "Nossas Ações diárias",
      subtitle: "Oferecemos uma variedade de oficinas, encontros e dinâmicas criadas especialmente para o seu bem-estar mental e físico.",
  },

  // 4. TELA CALENDÁRIO
  calendar: {
      tag: "CALENDÁRIO DO IDOSO",
      title: "Nossa Programação",
      subtitle: "Datas claras e de fácil leitura para você programar seus dias de diversão e aprendizado.",
  },

  // 5. TELA GALERIA DE FOTOS
  gallery: {
      tag: "GALERIA DE FOTOS",
      title: "Álbum de Lembranças",
      subtitle: "Cada fotografia guarda um sorriso, uma história e o orgulho de pertencer à nossa grande família.",
  },

  // 6. DEPOIMENTOS
  testimonials: {
    tag: "O QUE DIZEM NOSSOS IDOSOS",
    title: "Vidas Transformadas pelo Carinho",
    subtitle: "Conheça histórias reais de quem encontrou uma nova família na Associação Melhor Idade.",
    items: [
      {
        id: "test-1",
        name: "Dona Alzira, 78 anos",
        role: "Fundadora e Associada",
        avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop",
        text: "Quando vim para a associação pela primeira vez, estava muito sozinha depois que meu marido se foi. Aqui encontrei não só amigas, mas uma família que me abraça todos os dias. O forró de sexta-feira me faz sentir viva de novo — danço, rio e esqueço as dores. A Melhor Idade me devolveu a vontade de sorrir."
      },
      {
        id: "test-2",
        name: "Seu João, 82 anos",
        role: "Associado há 12 anos",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        text: "Meus filhos moram longe e eu passava as tardes vendo TV sozinho. Minha neta insistiu pra eu vir conhecer o coral. No primeiro ensaio, o maestro Roberto me colocou pra cantar e eu me arrepiei todo. Hoje não perco uma terça-feira. O canto me deu voz de novo, e as viagens me deram pernas pra andar o mundo."
      },
      {
        id: "test-3",
        name: "Dona Maria José, 75 anos",
        role: "Voluntária e Associada",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        text: "Entre a oficina de cerâmica e a horta comunitária, descobri que ainda tenho muito o que ensinar. As meninas me perguntam sobre crochê, eu mostro ponto por ponto, e a gente ri muito. Aqui ninguém é 'velho' — a gente é experiente, é querido, é útil. Essa associação é meu segundo lar, e sou grata por cada abraço que recebo."
      }
    ]
  },
};
