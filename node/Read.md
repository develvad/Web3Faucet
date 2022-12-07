# Docker Comands for generate GETH nodes
### Documentation: https://hub.docker.com/r/ethereum/client-go/
## Genesis (Init)
### docker run -d --name ethereum-node -v ${PWD}/data:/data -v ${PWD}/genesis.json:/genesis.json ethereum/client-go init --datadir data /genesis.json
## Node 01
### docker run -d -p 8545:8545 -p 30303:30303 \
### -v ${PWD}/data:/data \
### --name ethereum-node-01 ethereum/client-go \
### --datadir data \
### --http.api personal,eth,net,web3 \
### --http.addr 0.0.0.0 \ 
### --http.port 8545 \
### --mine --miner.etherbase  0x0000000000000000000000000000000000000000 
### --miner.threads=1
###
### Note: change 0x0000000000000000000000000000000000000000 to the Miner Address

# By: VAD
