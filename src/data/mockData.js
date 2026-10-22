// Dados completos do projeto Associação Melhor Idade extraídos do design no Figma

export const siteData = {
  brand: {
    name: "Melhor Idade",
    subtitle: "ASSOCIAÇÃO COMUNITÁRIA",
    since: 2011,
    email: "",
    address: "",
    phone: "",
    pixKey: "",
    mission: "Desde 2011, promovemos bem-estar, convivência e valorização da pessoa idosa por meio de atividades culturais e de lazer. Venha nos fazer uma visita!"
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
        "Idealizado por Maria Saraiva de Santiago, com o apoio de Arnóbio Santiago de Freitas e de um grupo de idosas, o projeto nasceu para ampliar o bem-estar, a convivência e a valorização da pessoa idosa.",
        "Desde 2011, a Associação promove atividades culturais e de lazer, como Forró, Quadrilha, Reisado, Coral, eventos comemorativos e viagens."
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

  // 2. TELA ATIVIDADES
    activities: {
      tag: "AÇÕES COM AMOR",
      title: "Nossas Ações diárias",
      subtitle: "Nossas atividades artísticas, culturais e de lazer promovem convivência, valorizam tradições e incentivam a participação ativa. Entre elas estão o Forró, as danças culturais e os eventos comemorativos.",
  },

  // 4. TELA CALENDÁRIO
  calendar: {
      tag: "CALENDÁRIO DO IDOSO",
      title: "Nossa Programação",
      subtitle: "Acompanhe os encontros e eventos da Associação. O Forró da Melhor Idade acontece às quartas-feiras, na quadra da Escola São Vicente de Paula – Patronato.",
  },

  // 5. TELA GALERIA DE FOTOS
  gallery: {
      tag: "GALERIA DE FOTOS",
      title: "Álbum de Lembranças",
      subtitle: "Registros do Forró, da Quadrilha, do Reisado, do Coral e de outras atividades culturais e de lazer que celebram nossos encontros e tradições.",
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
