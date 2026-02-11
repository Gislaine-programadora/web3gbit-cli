#!/usr/bin/env node
import { createWalletClient, createPublicClient, http, formatEther, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia, mainnet } from 'viem/chains';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();
const PROFIT_FILE = './lucro.txt';
const lerLucro = () => {
    if (fs.existsSync(PROFIT_FILE)) {
        return parseFloat(fs.readFileSync(PROFIT_FILE, 'utf8'));
    }
    return 0;
};
const reset = "\x1b[0m";
const bold = "\x1b[1m";
const lightBlue = "\x1b[94m";
const cyan = "\x1b[36m";
const blue = "\x1b[34m";
const white = "\x1b[37m";
const yellow = "\x1b[33m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const ABI = [
    { name: 'mint', type: 'function', stateMutability: 'nonpayable', inputs: [{ type: 'address', name: 'to' }, { type: 'uint256', name: 'amount' }], outputs: [] },
    { name: 'setRate', type: 'function', stateMutability: 'nonpayable', inputs: [{ type: 'uint256', name: 'newRate' }], outputs: [] },
    { name: 'rate', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
    { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
    { name: 'rescueETH', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
    { name: 'burn', type: 'function', stateMutability: 'nonpayable', inputs: [{ type: 'uint256', name: 'amount' }], outputs: [] },
    { name: 'owner', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
    { name: 'deposit', type: 'function', stateMutability: 'payable', inputs: [], outputs: [] },
    { name: 'withdraw', type: 'function', stateMutability: 'nonpayable', inputs: [{ type: 'uint256', name: 'amount' }], outputs: [] },
    { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ type: 'address', name: 'to' }, { type: 'uint256', name: 'amount' }], outputs: [{ type: 'bool' }] },
    { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'address', name: 'account' }], outputs: [{ type: 'uint256' }] },
    { name: 'transferOwnership', type: 'function', stateMutability: 'nonpayable', inputs: [{ type: 'address', name: 'newOwner' }], outputs: [] }
];
async function main() {
    const textLogo = `
${bold}${lightBlue}┌──────────────────────────────────────────────────────────────────────┐
${bold}${lightBlue}│                                                                      │
${bold}${cyan}│     ██     ██ ███████ ██████  ██████      ██████  ██████  ██ ████████ │
${bold}${cyan}│     ██     ██ ██      ██   ██      ██    ██       ██   ██ ██    ██    │
${bold}${cyan}│     ██  █  ██ █████   ██████   █████     ██   ███ ██████  ██    ██    │
${bold}${blue}│     ██ ███ ██ ██      ██   ██      ██    ██    ██ ██   ██ ██    ██    │
${bold}${blue}│     ███ █ ███ ███████ ██████  ██████      ██████  ██████  ██    ██    │
${bold}${lightBlue}│                                                                      │
${bold}${lightBlue}└──────────────────────────────────────────────────────────────────────┘${reset}
`;
    console.log(textLogo);
    console.log(`${lightBlue}${'═'.repeat(70)}${reset}`);
    console.log(` ${blue}${bold}🚀 WEB3 GBIT${reset} ${white}||${reset} ${cyan}FORGE ENGINE ACTIVE${reset}`);
    console.log(`${lightBlue}${'═'.repeat(70)}${reset}`);
    const pk = process.env.PRIVATE_KEY;
    const rpc = process.env.RPC_URL_SEPOLIA || process.env.RPC_URL || "";
    const contractAddress = process.env.GBIT_ADDRESS;
    if (!pk || !rpc || !contractAddress) {
        console.error(`\n${red}❌ Erro: Verifique seu arquivo .env (PRIVATE_KEY, RPC_URL, GBIT_ADDRESS)${reset}`);
        return;
    }
    const isMainnet = !!process.env.RPC_URL_MAINNET;
    const selectedChain = isMainnet ? mainnet : sepolia;
    const account = privateKeyToAccount(pk);
    const publicClient = createPublicClient({ chain: selectedChain, transport: http(rpc) });
    const client = createWalletClient({ account, chain: selectedChain, transport: http(rpc) });
    const command = process.argv[2];
    const value = process.argv[3];
    const amountArg = process.argv[4];
    switch (command) {
        case 'welcome':
        case 'help':
        case '--help':
        case undefined:
            console.log(`\n  ${bold}${lightBlue}👋 BEM-VINDA AO HUB GBIT${reset}`);
            console.log(`  ${cyan}${'═'.repeat(50)}${reset}`);
            console.log(`\n  ${bold}📋 GUIA DE COMANDOS ADMIN:${reset}`);
            const menu = [
                { cmd: 'status', desc: 'Preço, Liquidez e Supply.' },
                { cmd: 'balance-of <addr>', desc: 'Ver saldo ETH de uma carteira.' },
                { cmd: 'deposito <valor>', desc: 'Comprar GBIT (enviar ETH).' },
                { cmd: 'sell <valor>', desc: 'Vender GBIT (receber ETH).' },
                { cmd: 'mint <addr> <qtd>', desc: 'Criar novos tokens.' },
                { cmd: 'pump/dump <rate>', desc: 'Ajustar preço (Rate).' },
                { cmd: 'burn <valor>', desc: 'Queimar tokens.' },
                { cmd: 'gas', desc: 'Ver preço do Gás.' },
                { cmd: 'withdraw', desc: 'Resgatar reserva ETH.' },
                { cmd: 'transfer-ownership', desc: 'Passar controle.' },
                { cmd: 'market-bot', desc: 'Ativa o Robô Trader.' },
                { cmd: 'history', desc: 'Ver últimas transações.' },
                { cmd: 'price', desc: 'Ver cotação GBIT/ETH.' },
                { cmd: 'profit', desc: 'Ver lucro acumulado.' },
                { cmd: 'transfer <addr> <qtd>', desc: 'Enviar tokens para outra carteira.' },
                { cmd: 'balance-eth <addr>', desc: 'Ver saldo de ETH (Combustível).' },
                { cmd: 'balance-token <addr>', desc: 'Ver saldo de GBIT (Ativos).' }
            ];
            menu.forEach(item => {
                const isSpecial = ['market-bot', 'price', 'profit', 'status'].includes(item.cmd);
                const color = isSpecial ? cyan : white;
                console.log(`  ${color}${item.cmd.padEnd(22)}${reset} ${white}- ${item.desc}${reset}`);
            });
            console.log(`\n  ${cyan}${'═'.repeat(50)}${reset}`);
            console.log(`  ${bold}${yellow}💡 DICA:${reset} O ${cyan}market-bot${reset} roda em background.`);
            console.log(`  ${cyan}${'═'.repeat(50)}${reset}\n`);
            return;
        case 'status':
            try {
                const [rate, supply, balance, ownerAddr, gasPrice] = await Promise.all([
                    publicClient.readContract({ address: contractAddress, abi: ABI, functionName: 'rate' }),
                    publicClient.readContract({ address: contractAddress, abi: ABI, functionName: 'totalSupply' }),
                    publicClient.getBalance({ address: contractAddress }),
                    publicClient.readContract({ address: contractAddress, abi: ABI, functionName: 'owner' }),
                    publicClient.getGasPrice()
                ]);
                console.log(`\n📈 Rate: ${bold}${rate}${reset} | 💰 Supply: ${bold}${formatEther(supply)} GBIT${reset}`);
                console.log(`🌊 Liquidez: ${bold}${formatEther(balance)} ETH${reset} | 👑 Owner: ${cyan}${ownerAddr}${reset}`);
                console.log(`⛽ Gas: ${Number(gasPrice) / 1e9} Gwei\n`);
            }
            catch (e) {
                console.error(`${red}❌ Erro:${reset}`, e.message);
            }
            return;
        case 'balance-of':
            const walletAddress = process.argv[3] || process.env.GBIT_ADDRESS || "";
            if (!walletAddress || walletAddress.trim() === "") {
                console.log(`\n  ${bold}${red}❌ Erro: Nenhum endereço encontrado!${reset}`);
                console.log(`  Informe no terminal ou configure GBIT_ADDRESS no .env${reset}`);
                console.log(`  Exemplo: ${cyan}web3gbit balance-of 0x123...${reset}\n`);
                return;
            }
            try {
                console.log(`\n  ${bold}${lightBlue}🔍 CONSULTANDO SALDO...${reset}`);
                console.log(`  Alvo: ${white}${walletAddress}${reset}`);
                const balance = await publicClient.getBalance({
                    address: walletAddress
                });
                console.log(`  ${cyan}${'═'.repeat(45)}${reset}`);
                console.log(`  ${bold}Carteira :${reset} ${white}${walletAddress}${reset}`);
                console.log(`  ${bold}Saldo ETH:${reset} ${green}${formatEther(balance)} ETH${reset}`);
                console.log(`  ${cyan}${'═'.repeat(45)}${reset}\n`);
            }
            catch (e) {
                console.log(`\n  ${red}❌ Erro: Endereço inválido ou falha na rede.${reset}\n`);
            }
            return;
        case 'balance-token':
            const tokenWallet = process.argv[3] || process.env.GBIT_ADDRESS || "";
            if (!tokenWallet) {
                console.log(`\n  ${red}❌ Informe o endereço ou configure no .env${reset}\n`);
                return;
            }
            try {
                const tokenBalance = await publicClient.readContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'balanceOf',
                    args: [tokenWallet]
                });
                console.log(`\n  ${bold}${yellow}💎 SALDO DE TOKENS GBIT${reset}`);
                console.log(`  ${cyan}${'═'.repeat(45)}${reset}`);
                console.log(`  Carteira: ${white}${tokenWallet}${reset}`);
                console.log(`  Saldo   : ${cyan}${formatEther(tokenBalance)} GBIT${reset}`);
                console.log(`  Contrato: ${white}${contractAddress}${reset}`);
                console.log(`  ${cyan}${'═'.repeat(45)}${reset}\n`);
            }
            catch (e) {
                console.log(`\n  ${red}❌ Erro: Função 'balanceOf' não encontrada no contrato ou endereço inválido.${reset}\n`);
            }
            return;
        case 'balance-eth':
            const ethWallet = process.argv[3] || process.env.GBIT_ADDRESS || "";
            if (!ethWallet) {
                console.log(`\n  ${red}❌ Informe o endereço ou configure no .env${reset}\n`);
                return;
            }
            try {
                const balance = await publicClient.getBalance({ address: ethWallet });
                console.log(`\n  ${bold}${lightBlue}⛽ SALDO NATIVO (ETH)${reset}`);
                console.log(`  ${cyan}${'═'.repeat(45)}${reset}`);
                console.log(`  Carteira: ${white}${ethWallet}${reset}`);
                console.log(`  Saldo   : ${green}${formatEther(balance)} ETH${reset}`);
                console.log(`  ${cyan}${'═'.repeat(45)}${reset}\n`);
            }
            catch (e) {
                console.log(`\n  ${red}❌ Erro ao consultar ETH.${reset}\n`);
            }
            return;
        case 'transfer-ownership':
            if (!value)
                return console.log(yellow + "Uso: web3gbit transfer-ownership <novo_dono>" + reset);
            try {
                const hOwn = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'transferOwnership',
                    args: [value],
                    chain: selectedChain,
                    account
                });
                console.log(green + "👑 Propriedade transferida! Hash: " + hOwn + reset);
            }
            catch (e) {
                console.error(red + "Falha na transferência: " + e.message + reset);
            }
            break;
        case 'market-bot':
            console.log(`\n  ${bold}${cyan}🤖 MARKET MAKER ATIVO!${reset}`);
            console.log('  -----------------------------------------------');
            const rodarBot = async () => {
                try {
                    const r = await publicClient.readContract({ address: contractAddress, abi: ABI, functionName: 'rate' });
                    const variacao = BigInt(Math.floor(Math.random() * 11) - 5);
                    const nv = r + variacao;
                    if (nv > 0n) {
                        const h = await client.writeContract({ address: contractAddress, abi: ABI, functionName: 'setRate', args: [nv] });
                        let lucro = lerLucro() + 0.0001;
                        fs.writeFileSync(PROFIT_FILE, lucro.toString());
                        console.log(`🎲 Trade | Rate: ${nv} | TX: ${cyan}${h.slice(0, 20)}...${reset}`);
                    }
                }
                catch (e) {
                    console.error("⚠️ Ciclo ignorado");
                }
                setTimeout(rodarBot, 60000);
            };
            rodarBot();
            break;
        case 'profit':
            console.log(`\n  ${bold}${lightBlue}💹 PERFORMANCE DO BOT${reset}`);
            console.log(`  💰 Lucro Acumulado: ${green}${lerLucro().toFixed(6)} ETH${reset}\n`);
            return;
        case 'price':
            const currentRate = await publicClient.readContract({ address: contractAddress, abi: ABI, functionName: 'rate' });
            console.log(`\n  💎 1 GBIT: ${cyan}${(1 / Number(currentRate)).toFixed(8)} ETH${reset}\n`);
            return;
        case 'transfer':
            const toAddress = process.argv[3];
            const amountTransfer = process.argv[4];
            if (!toAddress || !amountTransfer) {
                console.log(`\n  ${bold}${red}❌ Erro: Faltam parâmetros!${reset}`);
                console.log(`  ${bold}Uso:${reset} ${cyan}web3gbit transfer <endereço> <quantidade>${reset}`);
                console.log(`  ${bold}Exemplo:${reset} ${white}web3gbit transfer 0xabc... 100${reset}\n`);
                return;
            }
            if (!toAddress.startsWith('0x') || toAddress.length !== 42) {
                console.log(`\n  ${red}❌ Endereço inválido! Use formato: 0x...${reset}\n`);
                return;
            }
            try {
                console.log(`\n  ${bold}${lightBlue}📤 INICIANDO TRANSFERÊNCIA...${reset}`);
                console.log(`  ${cyan}${'═'.repeat(50)}${reset}`);
                console.log(`  ${bold}Destino :${reset} ${white}${toAddress}${reset}`);
                console.log(`  ${bold}Quantia :${reset} ${white}${amountTransfer} GBIT${reset}`);
                console.log(`  ${cyan}${'═'.repeat(50)}${reset}`);
                const hTransfer = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'transfer',
                    args: [toAddress, parseEther(amountTransfer)]
                });
                console.log(`\n  ${green}${bold}✅ TRANSFERÊNCIA CONCLUÍDA!${reset}`);
                console.log(`  ${bold}Hash TX:${reset} ${cyan}${hTransfer}${reset}`);
                console.log(`  ${bold}Explorer:${reset} ${white}https://sepolia.etherscan.io/tx/${hTransfer}${reset}`);
                console.log(`  ${cyan}${'═'.repeat(50)}${reset}\n`);
            }
            catch (e) {
                console.log(`\n  ${red}❌ Falha na transferência:${reset}`);
                console.log(`  ${white}${e.shortMessage || e.message}${reset}\n`);
            }
            return;
        case 'gas':
            const gPrice = await publicClient.getGasPrice();
            console.log(`\n⛽ Gas Atual: ${bold}${Number(gPrice) / 1e9}${reset} Gwei\n`);
            return;
        case 'deposito':
        case 'deposit':
            if (!value) {
                console.log(`${red}❌ Valor?${reset}`);
                return;
            }
            try {
                const hDep = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'deposit',
                    value: parseEther(value)
                });
                console.log(`${green}✅ Depósito Enviado! TX: ${hDep}${reset}`);
            }
            catch (e) {
                console.error(`${red}❌ Erro:${reset}`, e.message);
            }
            return;
        case 'burn':
            if (!value) {
                console.log(`${red}❌ Informe a quantidade!${reset}`);
                return;
            }
            try {
                const hBurn = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'burn',
                    args: [parseEther(value)]
                });
                console.log(`${green}🔥 TX: ${hBurn}${reset}`);
            }
            catch (e) {
                console.error(`${red}❌ Erro:${reset}`, e.message);
            }
            return;
        case 'mint':
            if (!value || !amountArg) {
                console.log(`${red}❌ Use: mint <addr> <qtd>${reset}`);
                return;
            }
            try {
                const hMint = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'mint',
                    args: [value, parseEther(amountArg)]
                });
                console.log(`${green}✅ TX: ${hMint}${reset}`);
            }
            catch (e) {
                console.error(`${red}❌ Erro:${reset}`, e.message);
            }
            return;
        case 'withdraw':
            try {
                const hRes = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'rescueETH'
                });
                console.log(`${green}✅ Resgatado! TX: ${hRes}${reset}`);
            }
            catch (e) {
                console.error(`${red}❌ Erro:${reset}`, e.message);
            }
            return;
        case 'pump':
        case 'dump':
            if (!value) {
                console.log(`${red}❌ Informe o novo Rate!${reset}`);
                return;
            }
            try {
                const hRate = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'setRate',
                    args: [BigInt(value)]
                });
                console.log(`${green}✅ Preço Ajustado! TX: ${hRate}${reset}`);
            }
            catch (e) {
                console.error(`${red}❌ Erro no rate:${reset}`, e.message);
            }
            return;
        case 'sell':
            if (!value) {
                console.log(`${red}❌ Qtd?${reset}`);
                return;
            }
            try {
                const hSell = await client.writeContract({
                    address: contractAddress,
                    abi: ABI,
                    functionName: 'withdraw',
                    args: [parseEther(value)]
                });
                console.log(`${green}✅ Saque Enviado! TX: ${hSell}${reset}`);
            }
            catch (e) {
                console.error(`${red}❌ Erro:${reset}`, e.message);
            }
            return;
        case 'history':
            console.log(`\n${cyan}📜 Buscando histórico de movimentações...${reset}`);
            try {
                const logs = await publicClient.getLogs({
                    address: contractAddress,
                    event: {
                        type: 'event',
                        name: 'Transfer',
                        inputs: [
                            { type: 'address', name: 'from', indexed: true },
                            { type: 'address', name: 'to', indexed: true },
                            { type: 'uint256', name: 'value' }
                        ]
                    },
                    fromBlock: 0n
                });
                console.log(`✅ Total de ${bold}${logs.length}${reset} transações encontradas.`);
                logs.slice(-3).forEach(l => {
                    const val = l.args.value;
                    console.log(`🔹 TX: ${formatEther(val)} GBIT -> ${l.transactionHash?.slice(0, 10)}...`);
                });
            }
            catch (e) {
                console.error(red + "Erro no histórico: " + e.message + reset);
            }
            break;
        default:
            console.log(`\n${red}❌ Comando inválido.${reset} Use: ${bold}web3gbit help${reset}\n`);
            return;
    }
}
main().catch(err => {
    console.error(`${red}❌ Erro Fatal:${reset}`, err.message);
    process.exit(1);
});
