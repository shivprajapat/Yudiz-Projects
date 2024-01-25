import DataTable from 'admin/shared/components/data-table'
import Drawer from 'admin/shared/components/drawer'
import { CHAIN_ID, NETWORKS, paymentTransfer } from 'modules/blockchainNetwork'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import ConfirmationModal from 'shared/components/confirmation-modal'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import { TOAST_TYPE } from 'shared/constants'
import { getNetworkSymbol, appendParams } from 'shared/utils'
import { getAllAdminGeneralSetting } from '../adminSettings/redux/service'
import DonationFilter from './components/donation-filter'
import DonationRow from './components/donation-row'

import './index.scss'
import { listDonationsData, updateDonationsData } from './redux/service'

const Donations = () => {
  const [donationsData, setDonationsData] = useState([])
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10, currencyType: 'Nuu coin' })
  const [totalRecord, setTotalRecord] = useState(0)
  const [adminWalletAddress, setAdminWalletAddress] = useState([])
  const walletAccountStore = useSelector((state) => state.wallet)
  const adminSettings = useSelector((state) => state.adminSettings?.singleAdminGeneralSettings?.setting)
  const [currencyMultiplier, setCurrencyMultiplier] = useState({})
  const [loading, setLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(false)
  const [account, setAccount] = useState(null)

  const exchangeRateStore = useSelector((state) => state.exchangeRate)

  const columns = [
    { name: 'User', internalName: 'donor', type: 0 },
    { name: 'Donation Amount (GBP)', internalName: 'amount', type: 0 },
    { name: `Donation Amount (${getNetworkSymbol(NETWORKS.POLYGON)})`, internalName: 'amountPolygon', type: 0 },
    { name: `Donation Amount (${getNetworkSymbol(NETWORKS.ETHEREUM)})`, internalName: 'amountEthereum', type: 0 },
    { name: 'Order Amount (GBP)', internalName: 'orderAmount', type: 0 },
    { name: 'Order Status', internalName: 'orderStatus', type: 0 },
    { name: 'Payout Status', internalName: 'payoutStatusName', type: 0 }
  ]

  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllAdminGeneralSetting())
    dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(NETWORKS.ETHEREUM) }))
    dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(NETWORKS.POLYGON) }))
  }, [])

  useEffect(() => {
    getDonationsData()
  }, [requestParams])

  useEffect(() => {
    if (adminSettings && adminSettings.length !== 0) {
      setAdminWalletAddress(adminSettings)
    }
  }, [adminSettings])

  useEffect(() => {
    if (exchangeRateStore?.exchangeRateData?.exchangeRate) {
      const rateObj = exchangeRateStore?.exchangeRateData?.exchangeRate[0]
      if (rateObj) {
        const rate = rateObj.exchangeRate
        const convertSymbol = rateObj.convertSymbol
        setCurrencyMultiplier((prev) => {
          const newCurrencyMultiplier = prev
          newCurrencyMultiplier[convertSymbol] = rate
          return newCurrencyMultiplier
        })
      }
    }
  }, [exchangeRateStore])

  useEffect(() => {
    if (selectedDonation) {
      setIsModalOpen(true)
    }
  }, [selectedDonation])

  useEffect(() => {
    if (walletAccountStore) {
      setAccount(walletAccountStore.account)
    }
  }, [walletAccountStore])

  const closeConfirmationModal = () => {
    setIsModalOpen(false)
    setSelectedDonation(null)
  }

  const getDonationsData = async () => {
    try {
      const response = await listDonationsData(requestParams)
      if (response?.status === 200) {
        const data = response?.data?.result?.donations || []
        setDonationsData(data)
        setTotalRecord(response?.data?.result?.metaData?.totalItems)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, page: page })
  }

  const getNetworkPrice = (price, symbol = 'ETH') => {
    return price * currencyMultiplier[symbol]
  }

  function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'filter':
        setIsFilterOpen(value)
        break
      default:
        break
    }
  }

  const handleFilterChange = (data) => {
    let reqParams = { ...requestParams }
    let searchParams = {}
    Object.keys(data).forEach(key => {
      if (data[key]) {
        const obj = {}
        if (data[key].value) {
          obj[key] = data[key].value
        } else {
          obj[key] = data[key]
        }
        searchParams = { ...searchParams, ...obj }
      } else {
        delete reqParams[key]
      }
    })
    reqParams = { ...reqParams, ...searchParams }
    setSearchParams('')
    appendParams(reqParams)
    setRequestParams(reqParams)
    setIsFilterOpen(!isFilterOpen)
  }

  async function handlePayout() {
    if (!account) {
      setConnectWallet(true)
    } else {
      setLoading(true)
      const donation = selectedDonation
      let networkSymbol
      let blockchainNetwork
      if (parseInt(CHAIN_ID[NETWORKS.POLYGON]) === parseInt(walletAccountStore.networkId)) {
        networkSymbol = getNetworkSymbol(NETWORKS.POLYGON)
        blockchainNetwork = NETWORKS.POLYGON
      } else {
        networkSymbol = getNetworkSymbol(NETWORKS.ETHEREUM)
      }

      const price = donation?.amount
      const networkPrice = getNetworkPrice(price, networkSymbol)
      const assetDetails = {
        price: donation?.amount,
        blockchainNetwork: blockchainNetwork,
        assetGbpPrice: donation?.amount,
        networkPrice: networkPrice,
        networkSymbol: networkSymbol,
        sellerWalletAddress: adminWalletAddress[0]?.donationWalletAddress
      }
      const { account } = walletAccountStore
      document.body.classList.add('global-loader')
      const result = await paymentTransfer({
        walletAccountStore,
        connectedAccount: account,
        sellingPrice: donation.amount,
        setLoading,
        assetDetails,
        dispatch
      })
      document.body.classList.remove('global-loader')
      if (result && result.status) {
        const payload = {
          metaMaskTransaction: result
        }
        const donationUpdated = await updateDonationsData(donation?.id, payload)
        if (donationUpdated?.status === 200) {
          if (donationUpdated?.data?.success) {
            dispatch({
              type: SHOW_TOAST,
              payload: {
                message: donationUpdated?.data?.message,
                type: TOAST_TYPE.Success
              }
            })
          }
        }
        closeConfirmationModal()
        getDonationsData()
        setLoading(false)
      } else {
        closeConfirmationModal()
        setLoading(false)
      }
    }
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }
  return (
    <>
      <div className="content-headers">
        <h2 className="admin-heading">Nuucoin Donations</h2>
        <Button
          className="white-btn"
          onClick={onChangeSelectWallet}
        >
          Connect Wallet
        </Button>
      </div>
      <br />
      <div className="donation-section">
        <DataTable
          className="donation-list"
          columns={columns}
          totalRecord={totalRecord}
          header={{
            left: {
              rows: true
            },
            right: {
              search: false,
              filter: true
            }
          }}
          pageChangeEvent={handlePageEvent}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
          actionColumn={true}
        >
          {!donationsData || donationsData.length === 0 ? (
            <div className="data-not-available-container">Sorry, no donations to show.</div>
          ) : (
            donationsData?.map((donation, index) => {
              return <DonationRow loading={loading} key={donation.id} donation={donation} setSelectedDonation={setSelectedDonation} getNetworkPrice={getNetworkPrice} />
            })
          )}
        </DataTable>
        <Drawer className="drawer" isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title="filter">
          <DonationFilter
            filterChange={handleFilterChange}
            defaultValue={requestParams}
            onReset
            setRequestParams={setRequestParams}
            className="order-filter"
          />
        </Drawer>
        <ConfirmationModal
          show={isModalOpen}
          handleConfirmation={handlePayout}
          handleClose={closeConfirmationModal}
          loading={loading}
          title={'Transfer Confirmation'}
          description={'Are you sure to transfer the amount to donation wallet?'}
        />

      </div>
      {connectWallet && <SelectWalletModal networkGeneric={true} show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} />}
    </>
  )
}

export default Donations
