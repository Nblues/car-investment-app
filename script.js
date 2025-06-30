const SHOPIFY_STORE = "kn-goodcar.com";
const SHOPIFY_TOKEN = "bb70cb008199a94b83c98df0e45ada67";

async function fetchCars() {
  const q = `{
    products(first:100, sortKey:CREATED_AT, reverse:true) {
      edges {
        node {
          id
          handle
          title
          vendor
          images(first:1) { edges { node { url } } }
          tags
          description
          createdAt
          updatedAt
          availableForSale
          variants(first:1){edges{node{price}}}
        }
      }
    }
  }`;

  const res = await fetch(
    `https://${SHOPIFY_STORE}/api/2023-01/graphql.json`,
    {
      method: "POST",
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({query:q})
    }
  );

  if (!res.ok) {
    throw new Error('API error: ' + res.status);
  }

  const data = await res.json();
  if (!data.data || !data.data.products) throw new Error('No product data');
  return data.data.products.edges.map(e=>e.node);
}

// Test call:
fetchCars().then(list => {
  alert('ได้ ' + list.length + ' คัน');
}).catch(e => {
  alert('ERROR: ' + e.message);
});