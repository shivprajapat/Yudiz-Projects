export const extractChildData = ({ productChild }) => {
  const data =
    productChild &&
    productChild?.length > 0 &&
    productChild?.reduce(
      (accumulator, productItem) => {
        const cloneAcc = accumulator
        const variantAttr = []
        productItem.configurable_options.forEach((option) => {
          const firstAttr = option.attribute_options[0]

          const valueItem = {
            value_index: firstAttr.value,
            swatch_data: {
              value: firstAttr.code,
            },
          }

          let variantType = 'colors'
          if (option.Attribute_code === 'size') {
            variantType = 'size'
          }

          if (!cloneAcc[variantType]) {
            cloneAcc[variantType] = {
              attribute_code: option.Attribute_code,
              attribute_id: option.Attribute_id,
              label: firstAttr.label,
              values: [valueItem],
            }
          } else if (
            !cloneAcc[variantType].values.find(
              (val) => val.value_index === firstAttr.value
            )
          ) {
            cloneAcc[variantType].values.push(valueItem)
          }
          variantAttr.push({
            ...option,
            code: option.Attribute_code,
            value_index: option.attribute_options[0].value,
          })
        })
        const variant = {
          attributes: variantAttr,
          product: {
            id: productItem.childId,
            stock_status_data: {
              stock_status: productItem.childstockstatus,
            },
            sku: productItem.childSku,
            stock_status: productItem.childstockstatus,
            media_gallery: [
              {
                url: productItem.childImage,
              },
            ],
          },
        }
        cloneAcc.variant.push(variant)
        return cloneAcc
      },

      { variant: [], colors: null, size: null }
    )
  if (data) {
    data.configurable_options = []
    if (data.colors) {
      data.configurable_options.push(data.colors)
    }
    if (data.size) {
      data.configurable_options.push(data.size)
    }
  }
  return {
    data,
  }
}
