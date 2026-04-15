# 📦 StockPlus API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![Status](https://img.shields.io/badge/status-ativo-brightgreen?style=flat-square)
![Arquitetura](https://img.shields.io/badge/arquitetura-em%20camadas-blueviolet?style=flat-square)
![Padrão](https://img.shields.io/badge/padrão-Factory%20Method-orange?style=flat-square)
![OOP](https://img.shields.io/badge/paradigma-OOP-informational?style=flat-square)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rafafrd_StockPlus-Distribuidora&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rafafrd_StockPlus-Distribuidora)

</div>

## Contextualização

A empresa **StockPlus Distribuidora**, atua no setor de **comercialização e distribuição de produtos variados para o varejo**. Com o crescimento do número de clientes e fornecedores, a empresa passou a lidar com um volume cada vez maior de produtos armazenados, tornando essencial um controle eficiente de estoque, entradas e saídas de mercadorias.

Atualmente, a StockPlus utiliza um **sistema legado** para o cadastro de produtos e controle de estoque, desenvolvido sem uma arquitetura bem estruturada. Esse sistema apresenta limitações na manutenção, dificuldade para a inclusão de novas funcionalidades e pouca flexibilidade para atender regras de negócio mais complexas, como o **controle de validade dos produtos**, **rastreamento de movimentações** e **geração de alertas**.

Diante desse cenário, a empresa necessita do desenvolvimento de um **novo sistema de gestão de estoque**, fundamentado nos princípios da **Programação Orientada a Objetos (POO)** e no uso de **padrões de projeto**, visando maior organização, extensibilidade e reutilização do código.

### Funcionalidades mínimas do sistema

O sistema deverá contemplar, no mínimo, as seguintes funcionalidades:

- Cadastro, edição, consulta e exclusão de produtos;
- Controle de estoque com registro de entradas e saídas de mercadorias;
- Associação de produtos a categorias e fornecedores;
- Controle de datas de vencimento, permitindo a identificação de produtos próximos ou com validade expirada;
- Registro do histórico de movimentações de estoque (entrada e saída);
- Alerta de estoque próximo ao mínimo;
- Alerta dos produtos com data de vencimento faltando **90** e **45 dias** para vencer;
- Relatórios de produtos em estoque.

### Requisitos de projeto

A solução deve ser projetada de forma a permitir a **evolução do sistema**, possibilitando a inclusão de novas regras de negócio, relatórios e formas de controle sem impactar significativamente o código existente.


ronaldo
