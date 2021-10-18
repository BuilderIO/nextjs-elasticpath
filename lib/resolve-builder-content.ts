import { builder, Builder } from '@builder.io/react'
import { getAsyncProps } from '@builder.io/utils'
import builderConfig from '@config/builder'
import {
  getProduct,
  searchProducts,
} from './elasticpath/storefront-data-hooks/src/api/operations-builder'
builder.init(builderConfig.apiKey)
Builder.isStatic = true

export async function resolveBuilderContent(
  modelName: string,
  targetingAttributes?: any
) {
  let page = await builder
    .get(modelName, {
      userAttributes: targetingAttributes,
      includeRefs: true,
      preview: modelName,
      cachebust: true,
    } as any)
    .toPromise()

  if (page) {
    return await getAsyncProps(page, {
      async ProductGrid(props) {
        let products: any[] = []
        if (props.productsList) {
          const promises = props.productsList
            .map((entry: any) => entry.product)
            .filter((handle: string | undefined) => typeof handle === 'string')
            .map(
              async (handle: string) =>
                await getProduct(builderConfig, { handle })
            )
          products = await Promise.all(promises)
        }
        return {
          // resolve the query as `products` for ssr
          // used for example in ProductGrid.tsx as initialProducts
          products,
        }
      },
      async ProductBox(props) {
        let product = props.product
        if (product && typeof product === 'string') {
          product = await getProduct(builderConfig, {
            handle: product,
          })
        }
        return {
          product,
        }
      },
    })
  }
  return null
}
