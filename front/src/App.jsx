import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import './App.css'
import axios  from 'axios';
const { ethereum } = window;

const localAPI = "http://localhost:3000"; // change for your NODE.JS

function App() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [ethConnected, setEthConnected] = useState(false);
  const [balance, setBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const onInit = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setEthConnected(ethereum.isConnected())
        const initAccount = await provider.request({method: 'eth_requestAccounts'});
        setAccount(initAccount[0]);
        setNetwork(await provider.request({method: 'eth_chainId'}));
        // Observe Accounts
        provider.on('accountsChanged', (newAccount) => {
          setAccount(newAccount[0]);
        });
        // Observe Network
        provider.on('chainChanged', (newNetwork) => {
          setNetwork(newNetwork);
        });
      }
    }
    onInit();
  }, []);

  useEffect( () => {
    if(account) {
      const fxBalance = async () => {
        setBalance(await getBalance());
      }
      fxBalance();
    }
  }, [account]);

  useEffect(() => {
    if(network) {
      console.log('New NetWork: ', network);
    }
  }, [network]);

  const getBalance = async () => {
    const response = await axios.get(`http://localhost:3000/balance/${account}`);
    if(response && response.data && response.data.finalBalance) {
      return response.data.finalBalance;
    } 
  }

  const enviarEth = async () => {
    setIsLoading(true);
    const response = await axios.get(`http://localhost:3000/send/${account}`);
    setBalance(response.data.ammount)
    setIsLoading(false);
  };

  return (
    <div className="App">
      <div className='container'>
        <div className='row mt-3'>     
        <p> Saldo: { balance } </p>       
          { !isLoading && <button 
            style={{width: '120px'}}
            className={`btn btn-primary ${ethConnected ? '' : 'disabled' }`}
            onClick={() => enviarEth()}>
              { ethConnected ? '10 ETH' : 'Not Allowed' }
          </button>
          }
          {
            isLoading && <div> Cargando saldo... </div>
          }
        </div>
      </div>
    </div>
  )
}

export default App
