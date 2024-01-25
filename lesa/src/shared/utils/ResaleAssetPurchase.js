/* eslint-disable node/handle-callback-err */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
import Web3 from 'web3'
import { checkNetwork, contract_auction_abi, PopUpAlert } from '../controller/utils'
import { axiosInstance } from './API'

export const handlePurchaseProduct = async (priceamt, assetId, purchaseType, setActive, orderId) => {
  // purchaseType = 1 for fixed price
  // purchaseType = 2 for auction and

  let web3 = new Web3(Web3.givenProvider)

  const chainId = await web3.eth.getChainId()
  const networkVerify = checkNetwork(chainId)
  console.log('networkVerify', networkVerify)
  if (!networkVerify) return setActive(false)
  setActive(true)
  console.log('networkVerify after')

  // get auction smartcontract address from env file
  const contract_auction_address = process.env.REACT_APP_AUCTION_CONTRACT_ADDRESS

  // creating smartcontract instance
  const auction_contract = await new web3.eth.Contract(contract_auction_abi, contract_auction_address)

  // account is an array of available accounts in connected wallet
  const account = await web3.eth.getAccounts()

  // wallet balance will return in wei (base unit of ETH)
  let walletBalance = await web3.eth.getBalance(account[0])
  console.log('walletBalance>>>', walletBalance)

  // bid amount is converting to wei
  const price_amount = web3.utils.toWei(priceamt.toString(), 'ether')

  if (Number(walletBalance) < Number(price_amount)) {
    PopUpAlert('Oops!', "You don't have sufficient balance to bid. Please topup your wallet with VLX. Thank you.", 'info')
    setActive(false)
    return
  }
  try {
    // calculate gasprice
    async function getGasPrice() {
      const gasPrice = await web3.eth.getGasPrice()
      return web3.utils.toBN(gasPrice).add(web3.utils.toBN('20000000000'))
    }
    // receiver, collectableId, nounce, purchaseType
    // creating bid function object
    const buyMethod = auction_contract.methods.buy(account[0], assetId, purchaseType)

    let gasEstimated = null
    let txObject = null

    try {
      const gasPrice = await getGasPrice()

      // creating transaction object
      txObject = {
        from: account[0],
        value: price_amount,
        gasPrice
      }
      // estimating transaction fee for this function call
      gasEstimated = await web3.eth.estimateGas({
        to: contract_auction_address,
        data: buyMethod.encodeABI(),
        ...txObject
      })
    } catch (err) {
      // alert("Transaction has been failed please try again!!");
      setActive(false)
      PopUpAlert('Oops!', 'Transaction has been failed please try again!!', 'error')
    }

    // sending bid transaction through metamask
    buyMethod
      .send({ ...txObject, gas: gasEstimated })
      .then((result) => {
        let config = {
          headers: {
            Authorization: localStorage.getItem('userToken')
          }
        }
        if (result.status === true) {
          // blockchain transaction is successful and updating latest bid information in backend db

          console.log('result>>', result)
          if (purchaseType === 1) {
            const orderStatus = {
              item_number: orderId,
              status: 100,
              txhash: result?.transactionHash
            }
            axiosInstance
              .post('/asset/order/status', orderStatus, config)
              .then((res) => {
                setActive(false)
                PopUpAlert('Great!', res.data?.message, 'success').then((res) => window.location.reload())
              })
              .catch((err) => {
                setActive(false)
                PopUpAlert('Oops!', err.response?.data?.message, 'error')
              })
          } else {
            // purchase is successful, can proceed the order confirmation flow
            axiosInstance
              .post(`asset/auction/buy/${assetId}`, { txhash: result?.transactionHash }, config)
              .then((res) => {
                setActive(false)
                PopUpAlert('Great!', res.data?.message, 'success').then((res) => window.location.reload())
              })
              .catch((err) => {
                setActive(false)
                PopUpAlert('Oops!', err.response?.data?.message, 'error')
              })
          }

          console.log('Bid success!' + result.transactionHash)
        } else if (result.status === false) {
          // blockchain transaction status is failed.
          if (purchaseType === 1) {
            const orderStatus = {
              item_number: orderId,
              status: -1
            }
            axiosInstance
              .post('/asset/order/status', orderStatus, config)
              .then((res) => {
                setActive(false)
                // PopUpAlert("Great!", res.data?.message, "success").then((res) =>
                //     window.location.reload()
                // );
                window.location.reload()
              })
              .catch((err) => {
                setActive(false)
                PopUpAlert('Oops!', err.response?.data?.message, 'error')
              })
          }
          setActive(false)
          PopUpAlert('Oops!', 'Transaction has been failed please try again!!', 'error')
        }
      })
      .catch((error) => {
        if (purchaseType === 1) {
          let config = {
            headers: {
              Authorization: localStorage.getItem('userToken')
            }
          }
          const orderStatus = {
            item_number: orderId,
            status: -1
          }
          axiosInstance
            .post('/asset/order/status', orderStatus, config)
            .then((res) => {
              setActive(false)
              // PopUpAlert("Great!", res.data?.message, "success").then((res) =>
              //     window.location.reload()
              // );
              window.location.reload()
            })
            .catch((err) => {
              setActive(false)
              PopUpAlert('Oops!', err.response?.data?.message, 'error')
            })
        }
        setActive(false)
        PopUpAlert('Oops!', 'Transaction has been failed please try again!!', 'error')
      })

    // const bidcontract = await web3.eth.sendTransaction({
    //     from: account[0],
    //     to: contract_auction_address,
    //     value: bid_amount,
    //     data: auction_contract.methods.bid(assetId).encodeABI(),
    // });

    // console.log("bidcontract", bidcontract)
  } catch (err) {
    setActive(false)
    console.log(err)
    if (err.code === 4001) {
      PopUpAlert('Oops!', 'Please confirm from your wallet', 'error').then((err) => window.location.reload())
    } else {
      PopUpAlert('Oops!', 'There is a change in Bid price. Please Bid again', 'error').then((err) => window.location.reload())
    }
  }
}
