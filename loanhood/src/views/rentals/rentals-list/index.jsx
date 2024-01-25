import React from 'react'
import { useSelector } from 'react-redux'
import PageTitle from 'components/PageTitle'
import { GetAllRentals } from 'state/actions/rental'
import RentalListing from 'components/RentalListing'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function Rentals() {
  const resStatus = useSelector((state) => state.rental.resStatus)
  const resMessage = useSelector((state) => state.rental.resMessage)

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title="Rentals" />
      <RentalListing api={GetAllRentals} storeName="rental" selectorName="allRentals" extraFilter={true} addButton changeUrl={true} />
    </>
  )
}

export default Rentals
