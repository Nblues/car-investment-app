// ใช้ handle ดึงจาก cars[] (หรือ fetch จาก backend)
const url = new URL(window.location.href);
const handle = url.searchParams.get('handle');
const car = cars.find(c=>c.handle===handle);

if(!car) {
  document.getElementById('car-detail-root').innerHTML = `<div class="alert alert-danger">ไม่พบข้อมูลรถ</div>`;
} else {
  // SEO Meta
  document.title = `${car.brand} ${car.model} ${car.year} | รถมือสองเชียงใหม่ ครูหนึ่งรถสวย`;
  document.getElementById('seo-title').content = document.title;
  document.getElementById('seo-desc').content = `${car.brand} ${car.model} ${car.year} ${car.status} สี${car.color} อัปเดตรถใหม่ทุกวัน ฟรีดาวน์ ผ่อนถูก รับประกัน 1 ปี`;
  document.getElementById('og-title').content = document.title;
  document.getElementById('og-desc').content = document.getElementById('seo-desc').content;
  document.getElementById('og-image').content = car.images[0];
  document.getElementById('og-url').content = window.location.href;
  document.getElementById('twitter-title').content = document.title;
  document.getElementById('twitter-desc').content = document.getElementById('seo-desc').content;
  document.getElementById('twitter-image').content = car.images[0];
  document.getElementById('seo-canonical').href = window.location.href;
  // Render HTML
  document.getElementById('car-detail-root').innerHTML = `
    <div class="card shadow p-3">
      <div class="row g-3">
        <div class="col-md-6">
          <img src="${car.images[0]}" class="w-100 mb-2" style="border-radius:16px;max-height:260px;object-fit:cover;">
          <div class="d-flex gap-2 flex-nowrap overflow-auto">
            ${car.images.map(img=>`<img src="${img}" style="width:68px;height:48px;object-fit:cover;border-radius:7px;cursor:pointer;border:2px solid #eee;" onclick="document.querySelector('.card .w-100').src='${img}'">`).join('')}
          </div>
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold" style="color:#e8700a;font-size:1.25em;">${car.brand.toUpperCase()} ${car.model} ปี ${car.year} (จดปี ${car.reg})</h2>
          <div class="price-main mb-2">฿${car.price.toLocaleString()}</div>
          <span class="badge bg-success fs-6">${car.status}</span>
          <div class="my-2">${car.desc||'ไม่มีรายละเอียดเพิ่มเติม'}</div>
          <div class="mt-3 d-flex flex-column gap-2">
            <a href="https://lin.ee/cJuakxZ" target="_blank" class="btn btn-line btn-lg">สอบถามผ่าน LINE</a>
            <a href="https://www.facebook.com/krunueangusedcar" target="_blank" class="btn btn-facebook btn-lg">ดูรถบน Facebook</a>
            <a href="index.html" class="btn btn-back btn-lg">← กลับหน้ารวมรถ</a>
          </div>
          <div class="text-secondary small mt-2">อัปเดตล่าสุด: ${car.lastupdate}</div>
        </div>
      </div>
    </div>
  `;
}
