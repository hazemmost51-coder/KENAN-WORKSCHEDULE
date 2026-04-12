// ==========================================
// 1. الإعدادات والروابط الثابتة (Configuration)
// ==========================================
const webAppUrl = "https://script.google.com/macros/s/AKfycbw1YPL8yH0sa-tAt-HuPVe4SUN25qxOF2J7SGKJQ7NF8Ryhhnolyq_C4CiN2YeLEJEH/exec";

const dataStore = {
    "فرق الحفر والتمديد": ["عمر الطيب", "اشرف", "كرم", "ممدوح", "علاء مرسي", "جامشيد", "جمال", "سيد زين", "كنان"],
    "فرق الترمنيشن": ["راجا", "اماندو", "بارديب", "جلين", "جيريكو", "كليان", "محمد احمد", "مانيكندن", "سوريش", "جونس"],
    "فرق الهوائي": ["بالا", "سيلفم", "غلام هوائي", "رافي", "افتخار", "الجون", "ارفينال", "جميل", "جينارد"],
    "الجي سي بيهات": ["سكندر", "ارفيند", "ميراج", "بالا ", "منتاج", "افضل", "رقيب", "زاهد", "يوداف", "فاروق", "امتياز"],
    "الكرينات": ["معصوم", "سونيل", "غلام كرين", "محمد علي", "قمر الدين"],
    "البوبكتات": ["عاشق", "نصر الله", "ديل سعد", "اميرول", "فينود"]
};

const siteList = ["ابو عريش", "ضمد", "جيزان", "صامطة", "صبيا", "مستودع الشركة", "الورشة"];
const consultantList = ["سعودي كونسلت", "حسن فقية", "علوم العمران", "محرم باخوم", "الميناء", "بدون"];
const typeList = ["فصل", "تشغيلي", "انشائي"];
const descriptionList = ["صيانة","هيكلة محول هوائي","شد شبكة هوائية","رفع رايزر",,"انزال رايزر",
      "نهايات ضغط منخفض", "نهايات ضفط متوسط","وصلة لحام ضغط منخفض", "وصلحة لحام ضفط متوسط", "تركيب عدادات", "تركيب محول ارضي",
     "تركيب وحدة حلقية", "تركيب لوحة توزيع فرعية"];
const engineers = ["عمرو", "أحمد", "حازم", "صقر", "محمد", "علاء", "ابراهيم"];

const contactLeads = {
    "عمرو": "0506103042", "أحمد": "0535551691", "حازم": "0550884353", "صقر": "0570072790",
    "محمد": "0530664192", "علاء": "0563734852", "ابراهيم": "0535812366",
    "عمر الطيب": "0591365051", "اشرف": "0537876488", "كرم": "0577805279", "ممدوح": "0530781015",
    "علاء مرسي": "0500252894", "جمال": "0507891256", "سيد زين": "0549938932", "كنان": "0555884231",
    "جامشيد": "0558085792", "راجا": "0577170684", "اماندو": "0562327780", "بارديب": "0503683969",
    "جلين": "0553155395", "جيريكو": "0555731663", "كليان": "0578578738", "محمد احمد": "0533314859",
    "مانيكندن": "0552325507", "سوريش": "0578622058", "جونس": "0551855778", "بالا": "0507144791",
    "سيلفم": "0570327804", "غلام هوائي": "0566574341", "رافي": "0554509165", "افتخار": "0552581182",
    "الجون": "0501358095", "ارفينال": "0581327592", "جميل": "555877538", "جينارد": "0564479067"
};

const assetCodes = {
    "عمر الطيب": "KU1", "اشرف": "KU2", "كرم": "KU3", "ممدوح": "KU4", "علاء مرسي": "KU5",
    "جامشيد": "KU6", "جمال": "KU7", "كنان": "KU8", "سيد زين": "KU9", "راجا": "KS1",
    "اماندو": "KS2", "بارديب": "KS3", "جلين": "KS4", "جيريكو": "KS5", "كليان": "KS6",
    "محمد احمد": "KS7", "مانيكندن": "KS8", "سوريش": "KS9", "جونس": "KS10", "بالا": "KO1",
    "سيلفم": "KO2", "غلام هوائي": "KO3", "رافي": "KO4", "افتخار": "KO5", "الجون": "KO6",
    "ارفينال": "KO7", "جميل": "KO8", "جينارد": "KO9"
};

// ==========================================
// 2. إدارة الحالة (State Management)
// ==========================================
let allWorkOrders = JSON.parse(localStorage.getItem('all_work_orders')) || {};
let currentEng = "";
let currentOrderNumber = "";
let tempSelection = [];

// ==========================================
// 3. المزامنة والتشغيل الابتدائي
// ==========================================
window.onload = async () => {
    populateSelectBoxes();
    await syncFromCloud(); // محاولة جلب البيانات من السحاب فوراً
    initEngineers();
    updateAvailablePool();
    renderOrders();
};

async function syncFromCloud() {
    try {
        const response = await fetch(webAppUrl);
        const cloudData = await response.json();
        if (Object.keys(cloudData).length > 0) {
            allWorkOrders = cloudData;
            localStorage.setItem('all_work_orders', JSON.stringify(allWorkOrders));
            renderOrders();
            initEngineers();
            updateAvailablePool();
            console.log("تمت المزامنة من السحاب بنجاح");
        }
    } catch (e) {
        console.log("فشلت المزامنة، تم استخدام البيانات المحلية");
    }
}

// ==========================================
// 4. إدارة المهندسين والفرق
// ==========================================
function initEngineers() {
    const container = document.getElementById('engineers-list-container');
    if (!container) return;
    container.innerHTML = engineers.map(eng => `
        <div class="eng-item" onclick="selectEngineer('${eng}')">
            <div class="eng-info">
                <span class="avatar">${eng[0]}</span>
                <div>
                    <h3>المهندس ${eng}</h3>
                    <div class="tag-container">${getEngineerAssets(eng)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function getEngineerAssets(name) {
    const assets = Object.values(allWorkOrders)
        .filter(order => order.engineer === name)
        .flatMap(order => order.assets);
    
    return assets.length > 0 
        ? [...new Set(assets)].map(i => `<span class="tag-mini">${i}</span>`).join('') 
        : "لا يوجد فرق او معدات";
}

function selectEngineer(name) {
    if (!currentOrderNumber) {
        alert("يجب تحديد رقم أمر العمل أولاً");
        goToPage('work-order-page');
        return;
    }
    currentEng = name;
    tempSelection = allWorkOrders[currentOrderNumber] ? [...allWorkOrders[currentOrderNumber].assets] : [];
    
    document.getElementById('active-eng').innerText = name;
    const displayOrder = document.getElementById('active-order-display');
    if(displayOrder) displayOrder.innerText = `تخصيص للأمر: ${currentOrderNumber}`;
    
    renderPlaylists();
    updatePreview();
    goToPage('assets-page');
}

// ==========================================
// 5. تعبئة القوائم واختيار المعدات
// ==========================================
function populateSelectBoxes() {
    const siteSelect = document.getElementById('order-site');
    const consultantSelect = document.getElementById('order-consultant');
    const typeSelect = document.getElementById('order-type');
    const descriptionSelect = document.getElementById('order-description');

    siteSelect.innerHTML = '<option value="" disabled selected>اختر الموقع</option>' + 
        siteList.map(site => `<option value="${site}">${site}</option>`).join('');
    consultantSelect.innerHTML = '<option value="" disabled selected>اختر اسم الاستشاري</option>' + 
        consultantList.map(con => `<option value="${con}">${con}</option>`).join('');
    typeSelect.innerHTML = '<option value="" disabled selected>اختر نوع العمل </option>' +
        typeList.map(typ => `<option value="${typ}">${typ}</option>`).join('');
    descriptionSelect.innerHTML = '<option value="" disabled selected>اختر وصف العمل </option>' +
        descriptionList.map(des => `<option value="${des}">${des}</option>`).join('');
}

function renderPlaylists() {
    const container = document.getElementById('playlists-container');
    container.innerHTML = "";
    const reservedInOthers = Object.entries(allWorkOrders)
        .filter(([no]) => no !== currentOrderNumber)
        .flatMap(([, data]) => data.assets);

    for (const [cat, items] of Object.entries(dataStore)) {
        const div = document.createElement('div');
        div.innerHTML = `<h4 style="color:var(--secondary); margin-top:15px;">${cat}</h4>`;
        
        items.forEach(item => {
            const isReserved = reservedInOthers.includes(item);
            const isSelected = tempSelection.includes(item);
            const chip = document.createElement('span');
            chip.className = `item-chip ${isReserved ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`;
            chip.innerText = item;
            
            if (!isReserved) {
                chip.onclick = () => {
                    if(tempSelection.includes(item)) {
                        tempSelection = tempSelection.filter(i => i !== item);
                    } else {
                        tempSelection.push(item);
                    }
                    renderPlaylists();
                    updatePreview();
                };
            }
            div.appendChild(chip);
        });
        container.appendChild(div);
    }
}

function updatePreview() {
    const div = document.getElementById('selected-items-list');
    div.innerHTML = tempSelection.length > 0 
        ? tempSelection.map(i => `<span class="pool-item">${i}</span>`).join('') 
        : "<p style='color:#666'>لم يتم اختيار شيء بعد</p>";
}

// ==========================================
// 6. عمليات الحفظ والحذف (CRUD)
// ==========================================
async function confirmSelection() {
    const site = document.getElementById('order-site').value;
    const consultant = document.getElementById('order-consultant').value;
    const type = document.getElementById('order-type').value;
    const description = document.getElementById('order-description').value;
    const coords = document.getElementById('order-coords').value.trim();
    const dateStr = new Date().toLocaleDateString('ar-EG');

    if (!site || !consultant) {
        alert("⚠️ يرجى اختيار الموقع والاستشاري");
        return;
    }
    if (tempSelection.length === 0) {
        alert("⚠️ يرجى اختيار فريق أو معدة واحدة على الأقل");
        return;
    }

    allWorkOrders[currentOrderNumber] = {
        engineer: currentEng,
        assets: [...tempSelection],
        site: site,
        consultant: consultant,
        coords: coords,
        type: type,
        description: description,
        date: dateStr
    };

    localStorage.setItem('all_work_orders', JSON.stringify(allWorkOrders));

    try {
        await fetch(webAppUrl, {
            method: 'POST',
            body: JSON.stringify(allWorkOrders),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
        alert("✅ تم الحفظ والمزامنة بنجاح");
    } catch (error) {
        alert("📡 تم الحفظ محلياً (لا يوجد اتصال بالسحاب)");
    }

    clearOrderForm();
    updateAvailablePool();
    initEngineers();
    renderOrders();
    goToPage('engineers-page');
}

function renderOrders() {
    const display = document.getElementById('orders-list-display');
    const sorted = Object.entries(allWorkOrders).reverse();
    display.innerHTML = sorted.map(([no, data]) => `
        <div class="order-card-container">
            <div class="order-card" onclick="editExistingOrder('${no}')">
                <div style="color:var(--secondary); font-weight:bold;">📍 موقع: ${data.site || 'غير محدد'}</div>
                <strong>أمر عمل: ${no}</strong> | الاستشاري: ${data.consultant || 'N/A'}
                <br><small>المهندس: ${data.engineer} | الإحداثي: ${data.coords || 'N/A'}</small>
            </div>
            <button class="btn-delete-item" onclick="deleteOrder(event, '${no}')">🗑️</button>
        </div>
    `).join('');
}

function deleteOrder(event, orderNo) {
    event.stopPropagation();
    if (confirm(`هل أنت متأكد من حذف أمر العمل رقم (${orderNo})؟`)) {
        delete allWorkOrders[orderNo];
        localStorage.setItem('all_work_orders', JSON.stringify(allWorkOrders));
        renderOrders();
        updateAvailablePool();
        initEngineers();
    }
}

function editExistingOrder(no) {
    const order = allWorkOrders[no];
    currentOrderNumber = no;
    document.getElementById('order-title').innerText = "تعديل بيانات الموقع";
    document.getElementById('order-number').value = no;
    document.getElementById('order-site').value = order.site || "";
    document.getElementById('order-consultant').value = order.consultant || "";
    document.getElementById('order-type').value = order.type || "";
    document.getElementById('order-description').value = order.description || "";
    document.getElementById('order-coords').value = order.coords || "";
    goToPage('work-order-page');
}

function updateAvailablePool() {
    const pool = document.getElementById('available-pool');
    if(!pool) return;
    pool.innerHTML = "";
    const allReserved = Object.values(allWorkOrders).flatMap(o => o.assets);
    for (const [cat, items] of Object.entries(dataStore)) {
        const avail = items.filter(i => !allReserved.includes(i));
        if (avail.length > 0) {
            const d = document.createElement('div');
            d.className = 'pool-category';
            d.innerHTML = `<h4>${cat}</h4><div class="pool-items-group">${avail.map(i => `<span class="pool-item">${i}</span>`).join('')}</div>`;
            pool.appendChild(d);
        }
    }
}

// ==========================================
// 7. تصدير البيانات (Excel) والتنقل
// ==========================================
function exportToExcel() {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    
    // --- 1. تعريف الستايلات المشتركة ---
    const commonBorder = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    const commonAlignment = { horizontal: "center", vertical: "center" };
    const titleStyle = { fill: { fgColor: { rgb: "D3D3D3" } }, font: { bold: true, sz: 16 }, alignment: commonAlignment, border: commonBorder };
    const headerStyle = { fill: { fgColor: { rgb: "EFEFEF" } }, font: { bold: true }, alignment: commonAlignment, border: commonBorder };
    const cellStyle = { alignment: commonAlignment, border: commonBorder };

    const headerLabels = ["كود الفرقة", "امر العمل", "الاستشاري", "الموقع", "الاحداثي", "نوع العمل", "وصف العمل", "اسم الفرقة", "رقم هاتف مسؤول الفرقة", "المهندس المسؤول"];
    const headers = headerLabels.map(h => ({ v: h, s: headerStyle }));

    // مصفوفات لتخزين بيانات الشيت الأول والثاني
    let dataWithConsultant = [[{ v: `${dateStr} - جدول الاعمال (بإستشاري) - كنان العربية`, s: titleStyle }], headers];
    let dataNoConsultant = [[{ v: `${dateStr} - جدول الاعمال (بدون إستشاري) - كنان العربية`, s: titleStyle }], headers];

    // --- 2. توزيع البيانات بناءً على الاستشاري ---
    Object.entries(allWorkOrders).forEach(([no, d]) => {
        d.assets.forEach(asset => {
            const row = [
                assetCodes[asset] || "N/A", 
                no, 
                d.consultant || "بدون", 
                d.site, 
                d.coords, 
                d.type, 
                d.description, 
                asset, 
                contactLeads[asset] || "N/A", 
                `${d.engineer} - ${contactLeads[d.engineer] || ''}`
            ].map(cellValue => ({ v: cellValue, s: cellStyle }));

            // شرط الفلترة: إذا كان الاستشاري "بدون" أو فارغ
            if (!d.consultant || d.consultant.trim() === "بدون") {
                dataNoConsultant.push(row);
            } else {
                dataWithConsultant.push(row);
            }
        });
    });

    // --- 3. وظيفة مساعدة لإنشاء الشيت وتنسيقه ---
    const createSheet = (data) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        // دمج العنوان
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];
        // حساب العرض التلقائي
        ws['!cols'] = headerLabels.map((_, colIndex) => {
            const maxLength = data.reduce((max, row) => {
                const cell = row[colIndex];
                const cellValue = cell && cell.v ? cell.v.toString() : "";
                return Math.max(max, cellValue.length);
            }, 12);
            return { wch: maxLength + 2 };
        });
        return ws;
    };

    // --- 4. إنشاء ملف العمل وإضافة الشيتات ---
    const wb = XLSX.utils.book_new();
    
    const wsWith = createSheet(dataWithConsultant);
    const wsWithout = createSheet(dataNoConsultant);

    XLSX.utils.book_append_sheet(wb, wsWith, "بإستشاري");
    XLSX.utils.book_append_sheet(wb, wsWithout, "بدون إستشاري");

    // تصدير الملف
    XLSX.writeFile(wb, `Kenan_Schedule${dateStr}.xlsx`);
}

function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function clearOrderForm() {
    document.getElementById('order-number').value = "";
    document.getElementById('order-coords').value = "";
    document.getElementById('order-site').selectedIndex = 0;
    document.getElementById('order-consultant').selectedIndex = 0;
    document.getElementById('order-type').selectedIndex = 0;
    document.getElementById('order-description').selectedIndex = 0;
    currentOrderNumber = "";
    tempSelection = [];
}

function resetAllData() {
    if(confirm("تحذير: سيتم حذف كافة البيانات نهائياً!")) {
        localStorage.clear();
        location.reload();
    }
}

function startWorkOrder() {
    const orderNo = document.getElementById('order-number').value.trim();
    if (!orderNo) return alert("يرجى إدخال رقم أمر العمل");
    currentOrderNumber = orderNo;
    goToPage('engineers-page');
}

function prepareNewOrder() {
    clearOrderForm();
    document.getElementById('order-title').innerText = "أمر عمل جديد";
    goToPage('work-order-page');
}

function Login() {
    const userInp = document.getElementById('login-user').value;
    const passInp = document.getElementById('login-pass').value;
    if ((userInp === "1" || userInp === "2") && (passInp === "1" || passInp === "2")) {
        goToPage('work-order-page');
    } else {
        alert("خطأ في بيانات الدخول");
    }
}
