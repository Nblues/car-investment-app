// Mock fetch จาก Shopify/Firebase (เปลี่ยนจุดนี้ต่อ API จริงได้)
const cars = [
  {
    brand: "Toyota", model: "ALPHARD 2.5 S C-Package", year: 2020, reg: 2563,
    price: 2290000, priceOld: null, color: "ขาว", status: "ฟรีดาวน์", update: true,
    images: ["img/alphard1.jpg"], handle: "TOYOTA-ALPHARD-2-5-S-C-Package-2020", lastupdate:"29/6/2568"
  },
  // ... รถทุกคัน
];

const perPage = 8;
let currentPage = 1;

function renderCars() {
  const carList = document.getElementById('car-list');
  carList.innerHTML = "";
  const filtered = filterCars();
  const start = (currentPage-1)*perPage, end = start+perPage;
  filtered.slice(start, end).forEach(car => {
    carList.innerHTML += `
      <div class="col">
        <div class="card h-100 shadow-sm position-relative">
          <img src="${car.images[0]}" class="card-img-top" alt="${car.brand} ${car.model} ${car.year} ${car.status} ${car.color}">
          ${car.update ? '<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">update!!</span>' : ''}
          <div class="card-body py-2 px-3">
            <div class="fw-bold" style="font-size:1em;">${car.brand.toUpperCase()} ${car.model} ปี ${car.year} (จดปี ${car.reg}) ${car.color}</div>
            <div class="price-main mb-2">
              ${car.priceOld ? `<span class="price-discount">${car.priceOld.toLocaleString()}</span>` : ""}
              ฿${car.price.toLocaleString()}
            </div>
            <span class="badge bg-success">${car.status}</span>
          </div>
          <div class="card-footer small bg-white border-0 text-end">อัปเดต: ${car.lastupdate}</div>
          <a href="car-detail.html?handle=${car.handle}" class="stretched-link" aria-label="ดูรายละเอียดรถ ${car.brand} ${car.model}"></a>
        </div>
      </div>
    `;
  });
  // pagination
  renderPagination(filtered.length);
  document.getElementById('car-count').innerText = `รวมรถทั้งหมด ${filtered.length} คัน`;
}

function filterCars() {
  const brand = document.getElementById('filter-brand').value;
  const kw = document.getElementById('filter-keyword').value.toLowerCase();
  return cars.filter(car =>
    (!brand || car.brand === brand)
    && (!kw || `${car.brand} ${car.model} ${car.year} ${car.color}`.toLowerCase().includes(kw))
  );
}

function applyFilters() {
  currentPage = 1;
  renderCars();
}

function renderPagination(total) {
  const pageCount = Math.ceil(total/perPage);
  let html = '';
  for(let i=1;i<=pageCount;i++) {
    html += `<button class="btn btn-sm ${i===currentPage?'btn-primary':'btn-outline-secondary'} mx-1" onclick="currentPage=${i};renderCars()">${i}</button>`;
  }
  document.getElementById('pagination').innerHTML = html;
}

window.onload = renderCars;
