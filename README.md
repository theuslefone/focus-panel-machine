# FocusPanelMachine

Este projeto foi gerado com o [Angular CLI](https://github.com/angular/angular-cli) versão 17.2.3.

## Servidor de Desenvolvimento

Antes de começar, certifique-se de ter o Node.js e o Angular instalados em sua máquina. Você também precisará instalar globalmente o `json-server`.

```bash
npm install -g json-server
```

Após as instalações, execute os seguintes comandos:
```bash
npm install # Baixar os pacotes necessários
npm run server # Rodar o servidor json (dados mockados)
npm run start # Rodar a aplicação
```

## Sobre o Sistema

### Funcionalidades Atuais:

- **Inclusão de Gráficos no Dashboard:** Permite aos usuários integrar novos gráficos ao painel principal para uma análise visual detalhada dos dados.
- **Remoção de Gráficos do Dashboard:** Fornece a funcionalidade de retirar gráficos existentes do painel, garantindo flexibilidade na personalização do layout.
- **Preservação do Layout do Dashboard:** Oferece aos usuários a capacidade de salvar a configuração personalizada do dashboard localmente, garantindo consistência e facilidade de acesso.
- **Atualização em Tempo Real dos Dados:** Mantém os dados do servidor atualizados automaticamente, garantindo que as informações exibidas no painel estejam sempre precisas e atualizadas.

### Próximas Etapas do Projeto:

- **Armazenamento de Múltiplos Dashboards por CLP:** Implementação da capacidade de salvar e gerenciar diversos dashboards por CLP, proporcionando uma organização mais eficiente dos dados, podendo definir um nome para cada configuração.
- **Expansão das Opções de Gráficos:** Adicionando opções de gráficos diferentes para o mesmo dado.
- **Personalização Avançada do Grid:** Oferecerá opções avançadas de personalização do layout do grid para uma adaptação mais precisa e flexível do painel às preferências individuais dos usuários.
- **Otimização do Desempenho:** Melhoria da eficiência e desempenho do sistema para lidar com grandes conjuntos de dados e aumentar a velocidade de carregamento do dashboard.
- **Suporte a Dashboard Responsivo:** Implementação de recursos para tornar o dashboard responsivo, garantindo uma visualização adequada em diferentes dispositivos e tamanhos de tela.
- **Controle de Acesso e Permissões:** Adição de funcionalidades de controle de acesso e permissões para garantir a segurança e a privacidade dos dados do dashboard.
- **Exportação de Dados e Relatórios:** Implementação de recursos para exportar dados e relatórios do dashboard em vários formatos, como PDF ou CSV, para compartilhamento e análise externa.
