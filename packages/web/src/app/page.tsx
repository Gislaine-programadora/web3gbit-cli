"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseEther, formatEther } from "viem";
import dynamic from "next/dynamic";
import { useWindowSize } from 'react-use';

// Carregamento Dinâmico com SSR desativado para componentes de Browser
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const TONEN_ADDRESS = "0xF13A043e72eE36471F26f58665B3F833c1B693E1";
const ADMIN_ADDRESS = "0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2";

const ABI = [
  { name: "rate", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "deposit", type: "function", stateMutability: "payable", inputs: [] },
  { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

export default function GbitExchangePro() {
  const { address, isConnected } = useAccount();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [series, setSeries] = useState([{ data: [] as any[] }]);

  // Identifica se o usuário logado é o admin
  const isAdmin = useMemo(
    () => !!address && address.toLowerCase() === ADMIN_ADDRESS.toLowerCase(),
    [address]
  );

  // --- LEITURA DE DADOS DO CONTRATO ---
  const { data: currentRate } = useReadContract({
    address: GBIT_ADDRESS,
    abi: ABI,
    functionName: "rate",
    query: { refetchInterval: 5000 },
  });

  const { data: totalSupply } = useReadContract({
    address: GBIT_ADDRESS,
    abi: ABI,
    functionName: "totalSupply",
  });

  const { data: gbitBalanceRaw, refetch: refetchGbit } = useReadContract({
    address: GBIT_ADDRESS,
    abi: ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const { refetch: refetchEthUser } = useBalance({
    address,
    query: { enabled: isConnected },
  });

  const { data: contractEth, refetch: refetchEthContract } = useBalance({
    address: GBIT_ADDRESS,
    query: { enabled: isConnected },
  });

  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Dispara Confete e atualiza saldos ao confirmar transação
  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      refetchEthUser();
      refetchEthContract();
      refetchGbit();
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetchEthUser, refetchEthContract, refetchGbit]);

  // Lógica do Preço e Gráfico
  const displayPrice = useMemo(
    () => (currentRate ? 23500000 / Number(currentRate) : 47000),
    [currentRate]
  );

  useEffect(() => {
    const generateData = () => {
      const data = [];
      let base = displayPrice;
      let now = Date.now();
      for (let i = 0; i < 20; i++) {
        const o = base + (Math.random() - 0.5) * 10;
        const c = o + (Math.random() - 0.5) * 8;
        data.push({ x: now - (20 - i) * 60000, y: [o, o + 5, c - 5, c] });
      }
      setSeries([{ data }]);
    };
    generateData();
  }, [displayPrice]);

  const handleBuy = () => writeContract({ address: GBIT_ADDRESS, abi: ABI, functionName: "deposit", value: parseEther("0.002") });
  const handleSell = () => writeContract({ address: GBIT_ADDRESS, abi: ABI, functionName: "withdraw", args: [parseEther("0.5")] });

  return (
    <main style={{ minHeight: "100vh", background: "#0b0e11", color: "#eaecef", padding: "20px", fontFamily: "sans-serif" }}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      {/* HEADER */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 40, height: 40, background: "#F3BA2F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "bold", fontSize: "20px" }}>G</div>
          <h2 style={{ color: "#F3BA2F", margin: 0, fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>GBIT <span style={{ color: "#fff" }}>PRO</span></h2>
        </div>
        <ConnectButton />
      </nav>

      {/* DASHBOARD CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px", marginBottom: "30px" }}>
        <div style={{ background: "#1e2329", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <p style={{ color: "#848e9c", fontSize: "12px", margin: "0 0 8px 0", fontWeight: "bold" }}>LIVE RATE</p>
          <h3 style={{ margin: 0, color: "#F3BA2F", fontSize: "22px" }}>{currentRate?.toString() || "---"}</h3>
        </div>
        <div style={{ background: "#1e2329", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <p style={{ color: "#848e9c", fontSize: "12px", margin: "0 0 8px 0", fontWeight: "bold" }}>TOTAL SUPPLY</p>
          <h3 style={{ margin: 0, fontSize: "22px" }}>{totalSupply ? Number(formatEther(totalSupply)).toLocaleString() : "---"} <span style={{fontSize: 12, color: "#848e9c"}}>GBIT</span></h3>
        </div>
        <div style={{ background: "#1e2329", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <p style={{ color: "#848e9c", fontSize: "12px", margin: "0 0 8px 0", fontWeight: "bold" }}>YOUR BALANCE</p>
          <h3 style={{ margin: 0, color: "#0ecb81", fontSize: "22px" }}>{gbitBalanceRaw ? Number(formatEther(gbitBalanceRaw)).toFixed(2) : "0.00"} <span style={{fontSize: 12, color: "#848e9c"}}>GBIT</span></h3>
        </div>
        <div style={{ background: "#1e2329", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
          <p style={{ color: "#848e9c", fontSize: "12px", margin: "0 0 8px 0", fontWeight: "bold" }}>LIQUIDITY (ETH)</p>
          <h3 style={{ margin: 0, fontSize: "22px" }}>{contractEth ? Number(contractEth.formatted).toFixed(4) : "0.0000"}</h3>
        </div>
      </div>

      {/* GRÁFICO */}
      <div style={{ background: "#1e2329", padding: "15px", borderRadius: "16px", marginBottom: "30px", minHeight: "380px", border: "1px solid #333" }}>
        {isConnected ? (
          <ApexChart
            options={{ 
              chart: { type: "candlestick", toolbar: { show: false }, background: "transparent" }, 
              theme: { mode: "dark" },
              xaxis: { type: "datetime" },
              plotOptions: { candlestick: { colors: { upward: '#0ecb81', downward: '#f6465d' } } },
              grid: { borderColor: "#333" }
            }}
            series={series}
            type="candlestick"
            height={350}
          />
        ) : (
          <div style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center", color: "#848e9c", fontSize: "18px" }}>
            Conecte sua carteira para visualizar o mercado em tempo real
          </div>
        )}
      </div>
      
      <!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div id="tradingview"></div>
  <script
    type="text/javascript"
    src="https://s3.tradingview.com/tv.js"
  ></script>
  <script type="text/javascript">
    new TradingView.widget({
      autosize: true,
      symbol: "PYTH:BTCUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview",
    });
  </script>
</div>

  <div class="tradingview-widget-container">
  <div id="tradingview"></div>
  <script
    type="text/javascript"
    src="https://s3.tradingview.com/tv.js"
  ></script>
  <script type="text/javascript">
    new TradingView.widget({
      // 1. Mude o autosize para false
      "autosize": false,
      
      // 2. Defina a largura (pode ser em pixels ou porcentagem)
      "width": "75%", 
      "height": 400,
      
      "symbol": "PYTH:BTCUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "tradingview"
    });
  </script>
</div>
      {/* ADMIN PANEL */}
      {isAdmin && (
        <div style={{ marginTop: "20px", padding: "15px", borderRadius: "12px", border: "1px dashed #F3BA2F", textAlign: "center" }}>
          <p style={{ color: "#F3BA2F", fontSize: "12px", marginBottom: "10px" }}>PAINEL DO ADMINISTRADOR</p>
          <button 
            onClick={() => writeContract({ address: GBIT_ADDRESS, abi: ABI, functionName: "withdraw", args: [contractEth?.value || 0n] })} 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "transparent", border: "1px solid #F3BA2F", color: "#F3BA2F", fontWeight: "bold", cursor: "pointer" }}
          >
            RESGATAR TODA LIQUIDEZ DO CONTRATO
          </button>
        </div>
      )}
    </main>
  );
}