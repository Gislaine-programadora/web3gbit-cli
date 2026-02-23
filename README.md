

<p align="center">
  <img width="324" height="324" alt="image" src="https://github.com/user-attachments/assets/10649ace-2263-4aa1-b79a-0581a3fb638a" />
</p>

<p align="center">

  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>

  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js" />
  </a>

  <a href="https://github.com/Gislaine-programadora/projeto-web3-cli-deploy">
    <img src="https://img.shields.io/badge/Web3GBIT--CLI-comandos%20dos%2010-blue?logo=express" />
  </a>

  <a href="https://soliditylang.org/">
    <img src="https://img.shields.io/badge/Smart--Contract-Solidity-363636?logo=solidity" />
  </a>

  <a href="https://book.getfoundry.sh/">
    <img src="https://img.shields.io/badge/Built%20with-Foundry-FFDE00?logo=foundry" />
  </a>

  <a href="https://book.getfoundry.sh/forge/">
    <img src="https://img.shields.io/badge/Forge-Testing-red" />
  </a>

  <a href="https://pnpm.io/">
    <img src="https://img.shields.io/badge/pnpm-8.15.0-orange?logo=pnpm" />
  </a>

  <a href="https://www.npmjs.com/">
    <img src="https://img.shields.io/badge/npm-v1.0.0-cb3837?logo=npm" />
  </a>

</p>

 
## 💎 Sobre o Projeto: O CLI Web3 GBIT E Um Framework Fullstack para Smart-Contract com froundry:

O **Web3 Gbit** é uma ferramenta de linha de comando (CLI) projetada para automatizar o ciclo de vida de projetos blockchain. Desde a criação da estrutura inicial (**Forge**) até a gestão ativa de liquidez e volume (**Market Bot**).

> "O web3gbit on Foundry para a nova era da Web3."

---

  <img width="21" height="20" alt="image" src="https://github.com/user-attachments/assets/871f971b-eb41-429f-bc3c-131b6a0f3fba" />

 Link Oficial
``
Você pode encontrar este pacote no registro oficial do NPM:` 📦

[https://www.npmjs.com/package/web3gbit-cli](https://www.npmjs.com/package/web3gbit-cli)

 [https://www.npmjs.com/package/create-web3git-forge](https://www.npmjs.com/package/create-web3gbit-forge)


[![npm version](https://img.shields.io/npm/v/web3gbit-cli.svg?style=flat-square)](https://www.npmjs.com/package/web3gbit-cli)

[![npm version](https://badge.fury.io/js/create-web3gbit-forge.svg)](https://www.npmjs.com/package/create-web3gbit-forge)

## 🛠️ Instalação ## ⚡ Quick Start

```bash
 pnpm install create-web3gbit-forge
```

### 🎯 Criar Novo Projeto com Foundry + Forge

Crie um projeto Web3 completo com estrutura Foundry otimizada em segundos:

```bash
npx create-web3gbit-forge my-project
```

Ou com npm:

```bash
npm init create-web3gbit-forge my-project
```


  <p align="center">
  <img width="461" height="200" alt="image" src="https://github.com/user-attachments/assets/e4ea95b8-f932-4a43-bfd2-d88a530dd251" />
</p>

 
  ``
  ##   COMANDOS PARA INTERAGIR COM O SMART CONTRACT:

  ```bash
     pnpm install -g web3gbit
```
   
```bash
     web3gbit status
```  

 # 🚀 WEB3 GBIT - CLI Admin Tool

![WEB3 GBIT Logo](https://img.shields.io/badge/WEB3-GBIT-00D9FF?style=for-the-badge&logo=ethereum&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

CLI profissional para gerenciamento de tokens GBIT na blockchain Ethereum (Sepolia/Mainnet).

---

## 📋 Tabela de Comandos

| Comando | Descrição | Parâmetros |
|---------|-----------|------------|
| `status` | Exibe preço, liquidez e supply total | - |
| `balance-of` | Consulta saldo ETH de uma carteira | `<endereço>` |
| `balance-eth` | Ver saldo de ETH (Combustível) | `<endereço>` |
| `balance-token` | Ver saldo de tokens GBIT | `<endereço>` |
| `deposito` | Comprar GBIT enviando ETH | `<valor_em_eth>` |
| `sell` | Vender GBIT e receber ETH | `<quantidade_gbit>` |
| `transfer` | Enviar tokens para outra carteira | `<endereço> <quantidade>` |
| `mint` | Criar novos tokens (owner only) | `<endereço> <quantidade>` |
| `burn` | Queimar tokens | `<quantidade>` |
| `pump` / `dump` | Ajustar preço (Rate) do token | `<novo_rate>` |
| `gas` | Ver preço atual do gás na rede | - |
| `withdraw` | Resgatar reserva ETH do contrato | - |
| `price` | Ver cotação atual GBIT/ETH | - |
| `profit` | Ver lucro acumulado do bot | - |
| `market-bot` | Ativa robô trader automático | - |
| `help` | Exibe menu de ajuda completo | - |

---

## 🎯 Exemplos de Uso

### 📊 Consultar Status do Sistema
```bash
web3gbit status
```

### 💰 Ver Saldo ETH
```bash
web3gbit balance-of 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 💎 Ver Saldo de Tokens GBIT
```bash
web3gbit balance-token 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### ⛽ Ver Saldo de ETH (Combustível)
```bash
web3gbit balance-eth 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 💸 Comprar GBIT (Depositar ETH)
```bash
web3gbit deposito 0.1
```

### 🔄 Vender GBIT (Sacar ETH)
```bash
web3gbit sell 100
```

### 📤 Transferir Tokens
```bash
web3gbit transfer 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb 50
```

### 🪙 Criar Novos Tokens (Mint)
```bash
web3gbit mint 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb 1000
```

### 🔥 Queimar Tokens (Burn)
```bash
web3gbit burn 100
```

### 📈 Aumentar Preço (Pump)
```bash
web3gbit pump 1500
```

### 📉 Diminuir Preço (Dump)
```bash
web3gbit dump 800
```

### ⛽ Ver Preço do Gás
```bash
web3gbit gas
```

### 💵 Resgatar ETH do Contrato
```bash
web3gbit withdraw
```

### 💎 Ver Cotação Atual
```bash
web3gbit price
```

### 📊 Ver Lucro do Bot
```bash
web3gbit profit
```

### 🤖 Ativar Market Maker Bot
```bash
web3gbit market-bot
```

### ❓ Menu de Ajuda
```bash
web3gbit help
```

---

## ⚙️ Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/web3gbit-cli.git
cd web3gbit-cli
```

### 2. Instale as Dependências
```bash
pnpm install
```

### 3. Configure o Arquivo `.env`
```env
PRIVATE_KEY=0xSUA_CHAVE_PRIVADA_AQUI
RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID
GBIT_ADDRESS=0xSEU_CONTRATO_GBIT
wallet_address=ox_seu_address_da_private-key
```

### 4. Comando deploy rapido, nao precisa compilir
```bash
  forge create --rpc-url https://sepolia.infura.io/v3/sua-api \
--private-key 0xxxxxx \
src/GbitToken.sol:GbitToken --broadcast
```
### 5. Comando verify contrato no etherscan 
```bash
forge verify-contract 0xF13A043e72eE36471F26f58665B3F833c1B693E1 src/GbitToken.sol:GbitToken \
  --chain-id 11155111 \
  --etherscan-api-key sua-api-key \
  --watch
```

 ### 6. tambem deposito  usando o cast  
 ```bash
  cast send 0x692dFB8d2330E62578F0a58F29F637CD7fD518cA "deposit()" \
  --value 0.002ether \
  --rpc-url https://sepolia.infura.io/v3/sua-api-key \
  --private-key 0x23456986475789999
```
### 7. para  teste Anvil deploy token
```bash
  forge create src/GbitToken.sol:GbitToken \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0x2a871d0798f97d79848a013d4936a73bf4cc9543333 \
  --broadcast
```
## para funcionar deixe rodando o Anvil aberto
                            (_) | |        
      __ _   _ __   __   __  _  | |        
     / _` | | '_ \  \ \ / / | | | |        
    | (_| | | | | |  \ V /  | | | |        
     \__,_| |_| |_|   \_/   |_| |_|        


## 🛡️ Segurança

⚠️ **NUNCA** compartilhe sua `PRIVATE_KEY`  
⚠️ Use carteiras separadas para testes em Sepolia  
⚠️ Adicione `.env` ao `.gitignore`

---

## 📦 Dependências Principais

- **viem** - Cliente Ethereum moderno
- **typescript** - Tipagem estática
- **dotenv** - Gerenciamento de variáveis de ambiente
- **ts-node** - Execução TypeScript direta

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📝 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👩‍💻 Desenvolvido por

**Gislaine** - [GitHub](https://github.com/gislaine-programadora)

---

## 🌐 Links Úteis

- [Documentação Viem](https://viem.sh)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com)
- [Etherscan Sepolia](https://sepolia.etherscan.io)

---

</div>
