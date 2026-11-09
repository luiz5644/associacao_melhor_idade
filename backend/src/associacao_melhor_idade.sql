CREATE TABLE administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE brand_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    email VARCHAR(150),
    address VARCHAR(255),
    phone VARCHAR(30),
    pixKey VARCHAR(255),
    mission TEXT,
    since INT
) ENGINE=InnoDB;

CREATE TABLE associados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(30),
    data_adesao DATE NOT NULL,
    status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo'
) ENGINE=InnoDB;


CREATE TABLE voluntarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    especialidade VARCHAR(150),
    telefone VARCHAR(30)
) ENGINE=InnoDB;


CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    `desc` TEXT,
    data_completa DATE NOT NULL,
    horario TIME,
    local VARCHAR(200),
    is_highlight BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('ativo', 'cancelado') NOT NULL DEFAULT 'ativo'
) ENGINE=InnoDB;


CREATE TABLE acoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia_semana ENUM('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado') NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    local VARCHAR(255) NULL,
    responsavel VARCHAR(255) NULL,
    titulo VARCHAR(250) NOT NULL,
    url_imagem VARCHAR(255) NULL,
    descricao_curta VARCHAR(100) NULL,
    orientacoes VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE albuns_lembrancas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    description TEXT,
    `date` DATE
) ENGINE=InnoDB;


CREATE TABLE fotos_lembranca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    url_imagem VARCHAR(500) NOT NULL,
    eh_capa BOOLEAN NOT NULL DEFAULT FALSE,
    data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

CREATE TABLE patrocinadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    logo VARCHAR(500),
    category VARCHAR(100),
    websiteUrl VARCHAR(500),
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;
   
CREATE TABLE depoimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    papel VARCHAR(255),
    url_imagem VARCHAR(500),
    depoimento TEXT NOT NULL
) ENGINE=InnoDB;

ALTER TABLE administradores ADD COLUMN email VARCHAR(150) NOT NULL;

  CREATE TABLE fotos_lembranca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    url_imagem VARCHAR(500) NOT NULL,
    eh_capa BOOLEAN NOT NULL DEFAULT FALSE,
    data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fotos_album
        FOREIGN KEY (album_id)
        REFERENCES albuns_lembrancas(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE token_recuperacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    data_expiracao DATETIME NOT NULL,
    utilizado BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_admin
        FOREIGN KEY (usuario_id)
        REFERENCES administradores(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;