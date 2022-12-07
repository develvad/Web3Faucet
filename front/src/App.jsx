import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import './App.css'

const { ethereum } = window;

function App() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [ethConnected, setEthConnected] = useState(false);
  useEffect(() => {
    const onInit = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setEthConnected(ethereum.isConnected())
        setAccount(await provider.request({method: 'eth_chainId'}));
        setNetwork(await provider.request({method: 'eth_requestAccounts'}));
        provider.on('accountsChanged', (newAccount) => {
          setAccount(newAccount);
        });
        provider.on('chainChanged', (newNetwork) => {
          setNetwork(newNetwork);
        }); // Continuamos 20:04
      }
    }
    onInit();
  }, []);

  useEffect(() => {
    if(account) {
      console.log('New Account: ', account);
    }
  }, [account]);

  useEffect(() => {
    if(network) {
      console.log('New Account: ', network);
    }
  }, [network]);

  return (
    <div className="App">
      <div className='container'>
        <div className='row mt-3'>            
          <button 
            style={{width: '120px'}}
            className={`btn btn-primary ${ethConnected ? '' : 'disabled' }`}> 
              { ethConnected ? '10 ETH' : 'Not Allowed' }
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
