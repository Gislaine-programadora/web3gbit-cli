"use client";
import { useState, useEffect, useMemo } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther, formatEther } from 'viem';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const GBIT_ADDRESS = "0x692dFB8d2330E62578F0a58F29F637CD7fD518cA";

// ABI completa para evitar erros de tipo
const ABI = [
  { name: "rate", type: "function", stateMutability: "view", inputs: [], outputs: [{type:"uint256"}] },
  { name: "deposit", type: "function", stateMutability: "payable", inputs: [] },
  { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: [{name: "amount", type: "uint256"}] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{type:"uint256"}] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{name: "account", type: "address"}], outputs: [{type:"uint256"}] }
] as const;

export default function GbitExchangePro() {
  const { address, isConnected } = useAccount();
  const [series, setSeries] = useState([{ data: [] as any[] }]);
  const [logs, setLogs] = useState<{msg: string, time: string, type: string}[]>([]);
  
  // 1. Saldo de ETH do Usuário
  const { data: ethBalance, refetch: refetchEthUser } = useBalance({ address });

  // 2. BUSCA O SALDO DE GBIT VIA useReadContract (Substituindo o useBalance que dava erro)
  const { data: gbitBalanceRaw, refetch: refetchGbit } = useReadContract({
    address: GBIT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // 3. Saldo de ETH dentro do Contrato (Liquidez)
  const { data: contractEth, refetch: refetchEthContract } = useBalance({ 
    address: GBIT_ADDRESS as `0x${string}` 
  });

  const { data: currentRate } = useReadContract({ 
    address: GBIT_ADDRESS as `0x${string}`, 
    abi: ABI, 
    functionName: 'rate' 
  });

  const { data: totalSupply } = useReadContract({ 
    address: GBIT_ADDRESS as `0x${string}`, 
    abi: ABI, 
    functionName: 'totalSupply' 
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const stats = useMemo(() => ({
    total: totalSupply ? parseFloat(formatEther(totalSupply as bigint)).toLocaleString() : "0",
    liquidity: contractEth?.value ? parseFloat(formatEther(contractEth.value)).toFixed(4) : "0.0000",
    holders: "1"
  }), [totalSupply, contractEth]);

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ecb81', '#F3BA2F', '#ffffff']
      });
      refetchEthUser();
      refetchEthContract();
      refetchGbit();
      addLog("Transação confirmada! 🚀", "success");
    }
  }, [isSuccess, refetchEthUser, refetchEthContract, refetchGbit]);

  const safeGbit = useMemo(() => gbitBalanceRaw ? parseFloat(formatEther(gbitBalanceRaw as bigint)).toFixed(2) : "0.00", [gbitBalanceRaw]);
  const userEth = useMemo(() => ethBalance?.value ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0.0000", [ethBalance]);
  const displayPrice = useMemo(() => currentRate ? (23500000 / Number(currentRate)) : 47000, [currentRate]);

  const addLog = (msg: string, type: string) => {
    setLogs(prev => [{msg, time: new Date().toLocaleTimeString(), type}, ...prev.slice(0, 3)]);
  };

  const handleBuy = () => writeContract({ address: GBIT_ADDRESS as `0x${string}`, abi: ABI, functionName: 'deposit', value: parseEther('0.002') });
  const handleSell = () => writeContract({ address: GBIT_ADDRESS as `0x${string}`, abi: ABI, functionName: 'withdraw', args: [parseEther('0.5')] });

  useEffect(() => {
    const generateData = () => {
      const data = [];
      let base = displayPrice;
      let now = Date.now();
      for(let i=0; i<30; i++) {
        const o = base + (Math.random()-0.5)*10;
        const c = o + (Math.random()-0.5)*8;
        data.push({ x: now - (30-i)*60000, y: [o, o+5, c-5, c] });
      }
      return data;
    };
    setSeries([{ data: generateData() }]);
  }, [displayPrice]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0b0e11', color: '#eaecef', padding: '15px', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', alignItems: 'center', borderBottom: '1px solid #2b3139' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="GBIT Logo" style={{ width: '60px', height: '60px', borderRadius: '8px' }} />
          <div>
            <h2 style={{ color: '#F3BA2F', margin: 0, letterSpacing: '1px', fontSize: '1.2rem' }}>GBIT <span style={{color:'white'}}>PRO</span></h2>
            <span style={{ backgroundColor: '#0ecb8122', color: '#0ecb81', padding: '1px 6px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 'bold', border: '1px solid #0ecb81' }}>LISTADO NA UNISWAP</span>
          </div>
        </div>
        <ConnectButton accountStatus="address" showBalance={false} />
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', marginTop: '20px' }}>
        <div>
          <div style={{ backgroundColor: '#161a1e', padding: '20px', borderRadius: '12px', border: '1px solid #2b3139' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{color:'#848e9c', fontSize: '0.8rem'}}>PAR ATUAL</div>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>GBIT / ETH <span style={{color:'#0ecb81', marginLeft: '10px'}}>+4.25%</span></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{color:'#848e9c', fontSize: '0.8rem'}}>PREÇO DE MERCADO</div>
                <div style={{color:'#0ecb81', fontSize: '1.5rem', fontWeight: 'bold'}}>${displayPrice.toLocaleString()}</div>
              </div>
            </div>
            <Chart options={{ chart: { type: 'candlestick', toolbar: {show:false}, background: 'transparent' }, theme: { mode: 'dark' }, xaxis: { type: 'datetime' }, grid: { borderColor: '#2b3139' } }} series={series} type="candlestick" height="350px" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
            <div style={{ backgroundColor: '#1e2329', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #F3BA2F' }}>
              <div style={{ color: '#848e9c', fontSize: '0.7rem' }}>SUPRIMENTO TOTAL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '5px' }}>{stats.total} GBIT</div>
            </div>
            <div style={{ backgroundColor: '#1e2329', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #0ecb81' }}>
              <div style={{ color: '#848e9c', fontSize: '0.7rem' }}>LIQUIDEZ EM POOL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '5px' }}>{stats.liquidity} ETH</div>
            </div>
            <div style={{ backgroundColor: '#1e2329', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4a90e2' }}>
              <div style={{ color: '#848e9c', fontSize: '0.7rem' }}>STATUS DA REDE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '5px', color: '#0ecb81' }}>ATIVO (SEPOLIA)</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', backgroundColor: '#161a1e', padding: '15px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#848e9c', marginBottom: '10px' }}>ATIVIDADE RECENTE</div>
            {logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2b3139', fontSize: '0.8rem' }}>
                <span style={{ color: log.type === 'success' ? '#0ecb81' : '#eaecef' }}>● {log.msg}</span>
                <span style={{ color: '#5e6673' }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e2329', padding: '25px', borderRadius: '12px', border: '1px solid #F3BA2F' }}>
            <div style={{ color: '#848e9c', fontSize: '0.75rem', fontWeight: 'bold' }}>WALLET BALANCE</div>
            <h2 style={{ margin: '10px 0', fontSize: '2rem' }}>{safeGbit} <span style={{fontSize: '1rem', color: '#848e9c'}}>GBIT</span></h2>
            <div style={{ color: '#0ecb81', fontSize: '0.9rem' }}>{userEth} ETH</div>
          </div>

          <div style={{ backgroundColor: '#161a1e', padding: '20px', borderRadius: '12px', border: '1px solid #2b3139' }}>
            <button onClick={handleBuy} disabled={isPending || !isConnected} style={{ width: '100%', padding: '15px', backgroundColor: '#0ecb81', color: '#0b0e11', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
              {isPending ? "PROCESSANDO..." : "COMPRAR GBIT (0.002 ETH)"}
            </button>
            <button onClick={handleSell} disabled={isPending || !isConnected} style={{ width: '100%', padding: '15px', backgroundColor: '#f6465d', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isPending ? "PROCESSANDO..." : "VENDER GBIT (0.5 GBIT)"}
            </button>
          </div>

          <a 
            href={`https://app.uniswap.org/#/swap?outputCurrency=${GBIT_ADDRESS}&chain=sepolia`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textAlign: 'center', color: '#F3BA2F', fontSize: '0.8rem', textDecoration: 'none', padding: '10px', border: '1px dashed #F3BA2F', borderRadius: '8px' }}
          >
            🔎 VER NO EXPLORADOR DA UNISWAP
          </a>
        </aside>
      </div>

      <footer style={{ marginTop: '40px', padding: '20px 0', borderTop: '1px solid #2b3139', textAlign: 'center', color: '#848e9c', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
          <a href={`https://sepolia.etherscan.io/address/${GBIT_ADDRESS}`} target="_blank" rel="noreferrer" style={{ color: '#F3BA2F', textDecoration: 'none' }}>📜 Contrato Verificado</a>
          <a href="https://github.com/gislaine-programadora" target="_blank" rel="noreferrer" style={{ color: '#F3BA2F', textDecoration: 'none' }}>💻 GitHub do Projeto</a>
        </div>
        <p>© 2026 GBIT PRO - Desenvolvido por Gislaine. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}