import PropTypes from 'prop-types'
import { Checkbox } from '../generic'
import Accordion from '../generic/accordion'
import { FILTER_TYPE } from '@/helper/constant'

function CategoryFilters({
  categories,
  onCheckHandler,
  selectedFilterAtt,
  isMobile,
}) {
  return (
    <Accordion activeKey="category">
      {categories?.map((cat) => {
        return cat?.Child ? (
          <Accordion.Item key={cat.value} itemKey={cat.value}>
            <Accordion.Header className="!px-0">{cat.label}</Accordion.Header>
            <Accordion.Body className="!p-2 max-h-[148px]">
              {cat?.Child?.map((child, cIndex) => {
                return (
                  <Checkbox
                    className={cIndex === cat.Child.length - 1 ? 'mb-0' : ''}
                    title={child.label}
                    value={child.value}
                    key={child.label}
                    mainCat={FILTER_TYPE.category.title}
                    onCheckHandler={onCheckHandler}
                    checked={selectedFilterAtt[
                      FILTER_TYPE.category.title
                    ]?.in?.includes(child.value)}
                    isMobile={isMobile}
                  />
                )
              })}
            </Accordion.Body>
          </Accordion.Item>
        ) : (
          <Checkbox
            key={cat.value}
            title={cat.label}
            value={cat.value}
            mainCat={FILTER_TYPE.category.title}
            onCheckHandler={onCheckHandler}
            checked={selectedFilterAtt[
              FILTER_TYPE.category.title
            ]?.in?.includes(cat.value)}
          />
        )
      })}
    </Accordion>
  )
}

CategoryFilters.propTypes = {
  categories: PropTypes.array.isRequired,
  onCheckHandler: PropTypes.func.isRequired,
  selectedFilterAtt: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
}

CategoryFilters.defaultProps = {
  isMobile: false,
}

export default CategoryFilters
