# Kriggor Route

**Smart Route Planning** — primeira versão da interface web.

## Como visualizar
Este projeto é estático: não exige Node.js, Python ou instalação de dependências.

- Para testar no computador, extraia o ZIP e abra `index.html` no navegador.
- Para publicar, crie um repositório GitHub e envie os arquivos `index.html`, `styles.css` e `app.js` (e este README, se desejar).
- No GitHub, abra **Settings → Pages**, selecione **Deploy from a branch**, escolha `main` e a pasta `/ (root)` e salve.

## O que esta versão já faz
- Interface responsiva para computador e celular.
- Navegação entre painel, clientes, rotas, histórico, relatórios e viagens.
- Cadastro e exclusão de clientes.
- Registro de visitas concluídas.
- Cadastro e edição de rotas com origem e lista de destinos.
- Mapa interativo OpenStreetMap/Leaflet: pesquisar endereços, clicar para marcar locais e adicionar pontos às rotas.
- Cadastro de viagens e destinos.
- Exportação dos dados locais em JSON.

## Limitações importantes desta versão
Esta é a primeira versão de interface e protótipo funcional. Os registros ficam no `localStorage` do navegador utilizado. Portanto:
- Não há login/autenticação segura ainda.
- Os dados não sincronizam entre computador e celular.
- O mapa usa OpenStreetMap e busca de endereços via Nominatim; serviços públicos podem ter limites e disponibilidade variável.
- Ainda não há cálculo de trajeto de carro, trânsito em tempo real nem otimização automática da ordem dos destinos.
- Não use dados pessoais sensíveis ou informações confidenciais nesta versão.

## Próximas etapas
1. Criar projeto Supabase e configurar autenticação individual, banco de dados e políticas de acesso.
2. Integrar Google Maps Platform com chave restrita e limites de uso.
3. Implementar otimização de rotas e sincronização/offline.
4. Publicar a aplicação completa com serviços de backend.
