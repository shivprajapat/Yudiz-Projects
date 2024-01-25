import { useRef } from 'react'
import PropTypes from 'prop-types'

function PaymentMethodAccordionItem({
  handleToggle,
  activePaymentMethod,
  item,
}) {
  const contentEl = useRef()
  const { title, id, htmlFor } = item
  return (
    <div onClick={() => handleToggle(id)}>
      <label
        className="radio address-label upi-label relative flex-col"
        htmlFor={htmlFor}
      >
        <div className="overflow-hidden">
          <input
            type="radio"
            name="radio"
            id={htmlFor}
            className="w-full h-full"
          />
          <span className="checkmark w-4 h-4 rounded-full absolute top-0 left-0" />
          <div className="flex items-start cursor-pointer justify-between transition duration-300">
            <p className="text-grey-900 text-sm sm:text-base font-semibold">
              {title}
            </p>
          </div>
        </div>
        <div
          ref={contentEl}
          className={` relative h-0 overflow-hidden transition-all duration-200 ease-in-out ${
            activePaymentMethod === id ? 'h-auto' : ''
          }`}
          style={
            activePaymentMethod === id
              ? { height: contentEl.current?.scrollHeight }
              : { height: '0px' }
          }
        >
          {/* <div className="flex-auto min-h-[1px] pt-2">
                  <div className="flex gap-2">
                    {icon.map((item, i) => (
                      <div className="w-9 h-9 grid place-items-center" key={i}>
                        <Image src={item} alt="google pay" />
                      </div>
                    ))}
                  </div>
                </div> */}
        </div>
      </label>
    </div>
  )
}

PaymentMethodAccordionItem.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  activePaymentMethod: PropTypes.string.isRequired,
}

export default PaymentMethodAccordionItem
