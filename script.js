// config
const SHOPIFY_STORE = "kn-goodcar.com";
const SHOPIFY_TOKEN = "bb70cb008199a94b83c98df0e45ada67";

// ดึงข้อมูลจาก Shopify Storefront API
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
        'X-Shopify-Storefront-Access-Token':SHOPIFY_TOKEN,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({query:q})
    }
  );
  const data = await res.json();
  return data.data.products.edges.map(e=>e.node);
}

// ดึงข้อมูลและแสดงผล
let allCars = [];
let brandSet = new Set();
async function renderCars() {
  let cars = await fetchCars();
  allCars = cars;
  // เก็บแบรนด์
  cars.forEach(c=>{
    let brand = (c.vendor||'').trim();
    if(brand) brandSet.add(brand);
  });
  // เติมฟิลเตอร์ยี่ห้อ
  let sel = document.getElementById('filter-brand');
  sel.innerHTML = '<option value="">ทุกยี่ห้อ</option>';
  Array.from(brandSet).sort().forEach(b=>{
    sel.innerHTML += `<option value="${b}">${b}</option>`;
  });
  showCars(cars);
}

// แสดงรถทั้งหมด
function showCars(cars){
  let el = document.getElementById('product-list');
  let statusBadge = c=>{
    let status = c.tags.includes('ขายแล้ว') ? 'sold' :
                 c.tags.includes('จองแล้ว') ? 'booked' :
                 c.tags.includes('พร้อมขาย') ? 'wang' : '';
    let txt = status === 'sold' ? 'ขายแล้ว' :
              status === 'booked' ? 'จองแล้ว' :
              status === 'wang' ? 'ว่าง' : '';
    return status ? `<span class="car-status ${status}">${txt}</span>` : '';
  };
  el.innerHTML = cars.map(c=>`
    <div class="car-card">
      <a href="car-detail.html?handle=${encodeURIComponent(c.handle)}">
        <img class="car-img" src="${c.images.edges[0]?.node.url||'https://via.placeholder.com/320x200?text=No+Image'}" alt="${c.title} รถมือสองเชียงใหม่" loading="lazy">
        ${statusBadge(c)}
        <div class="car-info">
          <div class="car-title">${c.title}</div>
          <div class="car-price">฿${(c.variants.edges[0]?.node.price||'0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          <div class="car-meta">${c.vendor||''} ${c.tags.length?("| "+c.tags.join(', ')):""}</div>
          <div class="car-date">อัปเดต: ${c.updatedAt.slice(0,10).split('-').reverse().join('/')}</div>
        </div>
      </a>
    </div>
  `).join('');
  document.getElementById('cars-summary').innerHTML = `รวมรถทั้งหมด ${cars.length} คัน`;
}

// ฟิลเตอร์ค้นหา
function applyFilters() {
  let brand = document.getElementById('filter-brand').value;
  let kw = document.getElementById('filter-keyword').value.trim();
  let cars = allCars.filter(c => 
    (!brand || (c.vendor||'').includes(brand)) &&
    (!kw || [c.title,c.vendor,c.tags.join(' '),c.description].join(' ').toLowerCase().includes(kw.toLowerCase()))
  );
  showCars(cars);
}

renderCars();