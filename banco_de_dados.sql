-- Remove o banco de dados se já existir
DROP DATABASE IF EXISTS restaurante_db;

-- Cria o banco com suporte a acentos do português
CREATE DATABASE restaurante_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restaurante_db;

-- ============================================================
-- TABELA DE USUÁRIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     ENUM('admin', 'usuario') NOT NULL
);

-- ============================================================
-- TABELA DE PRATOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pratos (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(100)  NOT NULL,
    categoria  VARCHAR(50)   NOT NULL,
    descricao  TEXT          NOT NULL,
    preco      DECIMAL(8,2)  NOT NULL,
    status     ENUM('Disponível', 'Indisponível') DEFAULT 'Disponível',
    imagem     VARCHAR(255)  DEFAULT 'default.jpg',
    criado_em  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DADOS INICIAIS — os 6 pratos originais do cardápio
-- ============================================================
INSERT INTO pratos (nome, categoria, descricao, preco, status, imagem) VALUES
  ('Feijoada Completa',  'Pratos Principais', 'O prato mais icônico do Brasil, com feijão preto, carnes selecionadas, couve, farofa e laranja',  85.00, 'Disponível', 'https://compactaprint.com.br/wp-content/uploads/2025/06/Receita-de-Feijoada-Completa-Simples-e-Saborosa-na-sua-Mesa.jpg'),
  ('Moqueca Baiana',     'Pratos Principais', 'Peixe fresco em molho de dendê, leite de coco, pimentões e temperos especiais',                    95.00, 'Disponível', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCrtdMwfrgRU0HBEPZhPdCNyHuyrx8JUzcIA&s'),
  ('Picanha na Brasa',   'Grelhados',         'Picanha premium grelhada no ponto, acompanhada de farofa, vinagrete e arroz',                       120.00, 'Disponível', 'https://cozinha365.com.br/wp-content/uploads/2025/02/Picanha-na-Brasa-S.webp'),
  ('Baião de Dois',      'Pratos Regionais',  'Arroz com feijão de corda, queijo coalho, carne seca e manteiga de garrafa',                        65.00, 'Disponível', 'https://www.receiteria.com.br/wp-content/uploads/baiao-de-dois-rapido.jpg'),
  ('Bobó de Camarão',    'Frutos do Mar',     'Camarões frescos no molho cremoso de mandioca, azeite de dendê e leite de coco',                    98.00, 'Disponível', 'https://guiadacozinha.com.br/wp-content/uploads/2018/05/Bobo-de-camarao.jpg'),
  ('Acarajé Gourmet',    'Entradas',          'Bolinho de feijão fradinho frito no dendê, recheado com vatapá, caruru e camarão',                   45.00, 'Disponível', 'https://guiadacozinha.com.br/wp-content/uploads/2008/01/acaraje.jpg');
