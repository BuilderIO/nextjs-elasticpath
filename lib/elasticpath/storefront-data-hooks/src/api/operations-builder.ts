import * as qs from 'qs'
import { gateway } from '@moltin/sdk';

export interface BuillderConfig {
  apiKey: string
  productsModel: string
  collectionsModel: string
  isDemo?: boolean
}

export interface CollectionProductsQuery {
  handle: string
  limit?: number
  cursor?: string
  apiKey: string
}

export async function getAllProducts(
  config: BuillderConfig,
  limit = 100,
  offset = 0
) {
  const elasticpathApi = gateway({
    client_id: process.env.ELASTICPATH_CLIENT_ID,
  });
  const response = await elasticpathApi.Products.With(['main_images']).Filter({
    eq: {
      status: 'live',
    }
  }).All();
  return response.data;
}

export async function searchProducts(
  config: BuillderConfig,
  search: string,
  limit = 100,
  offset = 0
) {
  const elasticpathApi = gateway({
    client_id: process.env.ELASTICPATH_CLIENT_ID,
  });
  const response = await elasticpathApi.Products.With(['main_images', 'variations']).Filter({
    ...(search && {
      eq: {
        status: 'live',
      },
      like: {
        name: search,
      },
    }),
  }).All();


return response.data;

}

export async function getAllProductPaths(
  config: BuillderConfig,
  limit?: number
): Promise<string[]> {
  const products: any[] = await getAllProducts(config, limit)
  return products?.map((entry) => entry.slug) || []
}

export async function getProduct(
  config: BuillderConfig,
  options: { id?: string; handle?: string; withContent?: boolean }
) {
  if (Boolean(options.id) === Boolean(options.handle)) {
    throw new Error('Either a handle or id is required')
  }
  const elasticpathApi = gateway({
    client_id: process.env.ELASTICPATH_CLIENT_ID,
  });
  let product:any = {};

  if (options.id) {
    product = (await elasticpathApi.Products.With(['main_images', 'variations']).Get(options.id)).data;
  } else {
    product =  (await elasticpathApi.Products.With(['main_images', 'variations']).Filter({
      eq: {
        slug: options.handle,
        status: 'live',
      },
      // TODO: pagination if needed
    }).All()).data[0];  
  }
  // const { access_token } = await elasticpathApi.Authenticate();
  // const image = await fetch(`https://api.moltin.com/v2/products/${product.id}/relationships/main-image`, {
  //   headers: {
  //     'Authorization': `Bearer ${access_token}`
  //   }
  // }).then(res => res.json())

  return {...product }
}
