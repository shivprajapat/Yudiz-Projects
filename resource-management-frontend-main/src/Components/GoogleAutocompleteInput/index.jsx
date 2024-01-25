import React, { useRef, useEffect } from "react"
import PropTypes from 'prop-types'
import Input from "Components/Input"

const GoogleAutocompleteInput = ({ 
  setLatLng = () => {},
  modalSetValue = () => {},
   ...props
 }) => {
 const autoCompleteRef = useRef()
 const inputRef = useRef()

 const options = {
  componentRestrictions: { country: "in" },
  fields: ["address_components", "geometry", "icon", "name", "formatted_address"],
  types: ["establishment"]
 }

 useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
     inputRef.current,
     options
    )

    autoCompleteRef.current.addListener("place_changed", async function () {
     const place = await autoCompleteRef.current.getPlace()
     const lat = place?.geometry?.location?.lat()
     const lng = place?.geometry?.location?.lng()
     modalSetValue('sAddress',place?.name + ', ' + place?.formatted_address)
     if(lat && lng) {
      setLatLng({ lat, lng })
     } else {
      setLatLng({ lat: null, lng: null })
     }
    })
   }, [])

   return (<Input
      ref={inputRef}
      {...props}
    />)
  }

  GoogleAutocompleteInput.propTypes = {
    setLatLng: PropTypes.func,
    modalSetValue: PropTypes.func,
    ref: PropTypes.any,
  }

  export default GoogleAutocompleteInput