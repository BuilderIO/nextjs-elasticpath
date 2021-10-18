/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useMemo, useState, useEffect } from 'react'
import { Themed, jsx } from 'theme-ui'
import { Grid, Button } from '@theme-ui/components'
import OptionPicker from '@components/common/OptionPicker'
import { NextSeo } from 'next-seo'
import { useUI } from '@components/ui/context'
import { ImageCarousel, LoadingDots } from '@components/ui'
import ProductLoader from './ProductLoader'

interface Props {
  className?: string
  children?: any
  product: any
  renderSeo?: boolean
  description?: string
  title?: string
}

const ProductBox: React.FC<Props> = ({
  product,
  renderSeo = true,
  description = product.description,
  title = product.title,
}) => {
  const [loading, setLoading] = useState(false)
  const { openSidebar } = useUI()

  const [variant, setVariant] = useState({})

  const addToCart = async () => {
    setLoading(true)
    try {
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      {renderSeo && (
        <NextSeo
          title={title}
          description={description}
          openGraph={{
            type: 'website',
            title: title,
            description: description,
            // images: [
            //   {
            //     url: product.images?.[0]?.src!,
            //     width: 800,
            //     height: 600,
            //     alt: title,
            //   },
            // ],
          }}
        />
      )}
      <Grid gap={4} columns={[1, 2]}>
        <div>
          <div
            sx={{
              border: '1px solid gray',
              padding: 2,
              marginBottom: 2,
            }}
          >
            <ImageCarousel
              showZoom
              alt={title}
              width={1050}
              height={1050}
              priority
              images={product.images || [{
                  src: `https://via.placeholder.com/1050x1050`,
                }]}
            ></ImageCarousel>
          </div>
        </div>
        <div sx={{ display: 'flex', flexDirection: 'column' }}>
          <span sx={{ mt: 0, mb: 2 }}>
            <Themed.h1>{title}</Themed.h1>
            <Themed.h4 aria-label="price" sx={{ mt: 0, mb: 2 }}>
              {product.meta.display_price.with_tax.formatted}
            </Themed.h4>
          </span>
          <div dangerouslySetInnerHTML={{ __html: description! }} />
          <div>
            <Grid padding={2} columns={2}>
            </Grid>
          </div>
          <Button
            name="add-to-cart"
            disabled={loading}
            sx={{ margin: 2, display: 'block' }}
            onClick={addToCart}
          >
            Add to Cart {loading && <LoadingDots />}
          </Button>
        </div>
      </Grid>
    </React.Fragment>
  )
}

const ProductView: React.FC<{
  product: string | any
  renderSeo?: boolean
  description?: string
  title?: string
}> = ({ product, ...props }) => {
  return (
    <ProductLoader product={product}>
      {(productObject) => <ProductBox {...props} product={productObject} />}
    </ProductLoader>
  )
}
export default ProductView
