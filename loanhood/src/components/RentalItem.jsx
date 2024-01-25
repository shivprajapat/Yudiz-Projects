import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardContent, CardHeader, FormControlLabel, Grid, MenuItem, Switch, TextField, Typography } from '@material-ui/core'
import { formateDate } from 'utils/helper'
import { useSelector } from 'react-redux'
import LazyLoadingSelect from './LazyLoadingSelect'
import { GetBrands } from 'state/actions/brand'
import { GetSizeGroups } from 'state/actions/sizeGroup'
import { GetSubCategories } from 'state/actions/subCategory'
import { GetSizes } from 'state/actions/size'
import { GetMaterials } from 'state/actions/material'

function RentalItem({ item, index, type, handleChange, errors, deleteItem, allItems }) {
  const allCategories = useSelector((state) => state.filter.allCategories)
  const allColors = useSelector((state) => state.filter.allColors)
  function inputChange(e, type) {
    const event = {
      target: {
        name: type,
        value: e
      }
    }
    type ? handleChange(event, index + 1) : handleChange(e, index + 1)
  }
  const careDuringRental = [
    { label: 'NO, DON’T CLEAN WHILE YOU’RE LOANING', value: 'doNotClean' },
    { label: 'DRY CLEAN ONLY', value: 'dryCleanOnly' },
    { label: 'HAND WASH ONLY', value: 'handWashOnly' },
    { label: 'OTHER', value: 'other' }
  ]
  const condition = ['new', 'good', 'excellent']

  function getCategoryName(category) {
    switch (category) {
      case '1':
        return 'WOMEN'
      case '2':
        return 'MEN'
      case '3':
        return 'UNGENDERED'
    }
  }
  return (
    <Card className="rental-item">
      <CardHeader
        title={`Item ${index + 1}`}
        action={
          allItems && allItems.length > 1 && item.isDelete ? (
            <Button onClick={() => deleteItem(index)} style={{ color: '#ff0000' }}>
              Delete Item
            </Button>
          ) : (
            ''
          )
        }
      ></CardHeader>
      <CardContent>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              {type === 'detail' ? (
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Brand"
                  size="small"
                  variant="outlined"
                  required
                  disabled={true}
                  defaultValue={item.brand.id}
                >
                  <MenuItem value={item.brand.id}>{item.brand.name}</MenuItem>
                </TextField>
              ) : (
                <>
                  <LazyLoadingSelect
                    apiCall={true}
                    api={GetBrands}
                    selectedId={parseInt(item.brandId === 1 ? '' : item.brandId)}
                    placeholder={item.brandId === 1 ? 'Unbranded' : item?.brand?.name ? item?.brand?.name : 'Brands*'}
                    storeName="brand"
                    selectorName="brands"
                    name="brandId"
                    size="small"
                    getSelectedBrand={(e) => inputChange(e, 'brandId')}
                    error={!!errors?.brandId}
                    value={item?.brandId}
                  />
                  {errors?.brandId && <p className="err">{errors?.brandId}</p>}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {type === 'detail' ? (
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Color"
                  size="small"
                  variant="outlined"
                  name="color"
                  required
                  disabled={true}
                  defaultValue={item.color.id}
                >
                  <MenuItem value={item.color.id}>{item.color.name}</MenuItem>
                </TextField>
              ) : (
                allColors && (
                  <TextField
                    fullWidth
                    margin="normal"
                    select
                    label={'Color'}
                    size="small"
                    variant="outlined"
                    name="colorId"
                    required
                    defaultValue={item?.color?.id || ''}
                    onChange={(e) => inputChange(e)}
                    helperText={errors?.colorId}
                    error={!!errors?.colorId}
                  >
                    {allColors.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {type === 'detail' ? (
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Material"
                  size="small"
                  variant="outlined"
                  name="materialId"
                  required
                  disabled={true}
                  defaultValue={item.material.id}
                >
                  <MenuItem value={item.material.id}>{item.material.name}</MenuItem>
                </TextField>
              ) : (
                <>
                  <LazyLoadingSelect
                    apiCall={true}
                    api={GetMaterials}
                    selectedId={parseInt(item.materialId)}
                    placeholder={item?.material?.name || 'Material*'}
                    storeName="material"
                    selectorName="materials"
                    size="small"
                    name="materialId"
                    getSelectedBrand={(e) => inputChange(e, 'materialId')}
                    error={!!errors?.materialId}
                  />
                  {errors?.materialId && <p className="err">{errors?.materialId}</p>}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {type === 'detail' ? (
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Size"
                  size="small"
                  variant="outlined"
                  name="sizeId"
                  required
                  disabled={true}
                  defaultValue={item.size.id}
                >
                  <MenuItem value={item.size.id}>{item.size.name}</MenuItem>
                </TextField>
              ) : (
                <>
                  <LazyLoadingSelect
                    apiCall={true}
                    api={GetSizeGroups}
                    selectedId={parseInt(item.sizeGroupId)}
                    placeholder={item?.size?.sizegroup?.name || 'Size Group*'}
                    storeName="sizeGroup"
                    selectorName="sizeGroups"
                    size="small"
                    name="sizeGroupId"
                    getSelectedBrand={(e) => inputChange(e, 'sizeGroupId')}
                    error={!!errors?.sizeGroupId}
                  />
                  {errors?.sizeGroupId && <p className="err">{errors?.sizeGroupId}</p>}
                </>
              )}
            </Grid>
            {((item.sizeGroupId && !type) || (type === 'edit' && (item?.size?.sizegroup?.id || item?.sizeGroupId))) && (
              <Grid item xs={12} sm={4}>
                <LazyLoadingSelect
                  apiCall={false}
                  api={GetSizes}
                  selectedId={parseInt(item.sizeId)}
                  placeholder={item?.size?.name || 'Size*'}
                  storeName="size"
                  selectorName="sizes"
                  size="small"
                  name="sizeId"
                  getSelectedBrand={(e) => inputChange(e, 'sizeId')}
                  error={!!errors?.sizeId}
                  categoryId={parseInt(item?.sizeGroupId)}
                />
                {errors?.sizeId && <p className="err">{errors.sizeId}</p>}
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              {type === 'detail' ? (
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Category"
                  size="small"
                  variant="outlined"
                  name="categoryId"
                  required
                  disabled={true}
                  defaultValue={item?.categoryId}
                >
                  <MenuItem value={item?.categoryId}>{getCategoryName(item?.categoryId)}</MenuItem>
                </TextField>
              ) : (
                allCategories && (
                  <TextField
                    fullWidth
                    margin="normal"
                    select
                    label={'Category'}
                    size="small"
                    variant="outlined"
                    name="categoryId"
                    required
                    defaultValue={item?.categoryId}
                    onChange={(e) => inputChange(e)}
                    helperText={errors?.categoryId}
                    error={!!errors?.categoryId}
                  >
                    {allCategories.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              )}
            </Grid>
            {type === 'detail' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Subcategory"
                  size="small"
                  variant="outlined"
                  name="subcategoryId"
                  disabled={true}
                  defaultValue={item?.subcategory?.id || 'Other'}
                >
                  <MenuItem value={item?.subcategory?.id || 'Other'}>{item?.subcategory?.name || 'Other'}</MenuItem>
                </TextField>
              </Grid>
            )}
            {((!type && item.categoryId) || (type === 'edit' && (item?.subcategory?.category?.id || item?.categoryId))) && (
              <Grid item xs={12} sm={4}>
                <LazyLoadingSelect
                  apiCall={false}
                  api={GetSubCategories}
                  selectedId={parseInt(item.subcategoryId)}
                  placeholder={item?.subcategory?.name || 'Sub Categories'}
                  storeName="subCategory"
                  selectorName="subCategories"
                  size="small"
                  getSelectedBrand={(e) => inputChange(e, 'subcategoryId')}
                  categoryId={parseInt(item.categoryId)}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Care During Rental"
                size="small"
                variant="outlined"
                name="careDuringRental"
                required
                disabled={type === 'detail'}
                value={item.careDuringRental}
                onChange={(e) => inputChange(e)}
                helperText={errors && errors.careDuringRental}
                error={errors && !!errors.careDuringRental}
              >
                {careDuringRental.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="text"
                label="Care Label"
                size="small"
                disabled={type === 'detail'}
                name="careLabel"
                required
                defaultValue={item.careLabel}
                onChange={(e) => inputChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Condition"
                size="small"
                variant="outlined"
                name="condition"
                required
                disabled={type === 'detail'}
                value={item.condition}
                onChange={(e) => inputChange(e)}
                helperText={errors && errors.condition}
                error={errors && !!errors.condition}
              >
                {condition.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Is Petite"
                size="small"
                disabled={type === 'detail'}
                variant="outlined"
                name="isPetite"
                required
                value={item.isPetite || false}
                onChange={(e) => inputChange(e)}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Is Tall"
                size="small"
                variant="outlined"
                name="isTall"
                disabled={type === 'detail'}
                required
                value={item.isTall || false}
                onChange={(e) => inputChange(e)}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Is Curve"
                size="small"
                variant="outlined"
                name="isCurve"
                disabled={type === 'detail'}
                required
                value={item.isCurve || false}
                onChange={(e) => inputChange(e)}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Is Maternity"
                size="small"
                variant="outlined"
                name="isMaternity"
                disabled={type === 'detail'}
                required
                value={item.isMaternity || false}
                onChange={(e) => inputChange(e)}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Grid>
            {type === 'detail' && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="text"
                    label="Updated At"
                    name="updatedAt"
                    size="small"
                    disabled={true}
                    defaultValue={formateDate(item.updatedAt)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="text"
                    label="Created At"
                    name="createdAt"
                    size="small"
                    disabled={true}
                    defaultValue={formateDate(item.createdAt)}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={6}>
              <FormControlLabel
                className="rental-switch"
                control={
                  <Switch
                    color="primary"
                    value={item.brandId || item?.brand?.id}
                    checked={item.brandId === 1}
                    name="unbranded"
                    onChange={(e) => inputChange(e, 'unbranded')}
                  />
                }
                disabled={type === 'detail'}
                label="Unbranded"
                labelPlacement="start"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">
                {"If your item is upcycled, vintage with no tags, handmade(nice one), or you don't know where it's from then select yes"}
              </Typography>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
RentalItem.propTypes = {
  item: PropTypes.object,
  allItems: PropTypes.array,
  index: PropTypes.number,
  type: PropTypes.string,
  handleChange: PropTypes.func,
  deleteItem: PropTypes.func,
  errors: PropTypes.object
}
export default RentalItem
