// 1. قاعدة البيانات الأساسية للمعدات والفرق
const dataStore = {
    "فرق الحفر والتمديد": ["عمر الطيب", "اشرف", "كرم", "ممدوح", "علاء مرسي", "جامشيد", "جمال", "سيد زين", "كنان"],
    "فرق الترمنيشن": ["راجا", "اماندو", "بارديب", "جلين", "جيريكو", "كليان", "محمد احمد", "مانيكندن", "سوريش", "جونس"],
    "فرق الهوائي": ["بالا", "سيلفم", "غلام", "رافي", "افتخار", "الجون", "ارفينال", "جميل", "جينارد"],
    "الجي سي بيهات": ["سكندر", "ارفيند", "ميراج", "بالا ", "منتاج", "افضل", "رقيب", "زاهد", "يوداف", "فاروق", "امتياز"],
    "الكرينات": ["معصوم", "سونيل", "غلام", "محمد علي", "قمر الدين"],
    "البوبكتات": ["عاشق", "نصر الله", "ديل سعد", "اميرول", "فينود"]
};
const siteList = ["ابو عريش", "ضمد", "جيزان", "صامطة", "صبيا", "مستودع الشركة", "الورشة"];
const consultantList = ["سعودي كونسلت", "حسن فقية", "علوم العمران", "محرم باخوم", "الميناء", "بدون"];
const engineers = ["عمرو", "أحمد", "حازم", "صقر", "محمد", "علاء", "ابراهيم"];
// قاعدة بيانات أرقام الهواتف (المهندسين والفرق والمعدات)
const contactLeads = {
    // المهندسين
    "عمرو": "0506103042", "أحمد": "0535551691", "حازم": "0550884353", "صقر": "0570072790",
    "محمد": "0530664192", "علاء": "0563734852", "ابراهيم": "0535812366",
    
    // فرق الحفر
    "عمر الطيب": "0591365051", "اشرف": "0537876488","كرم": "0577805279", "ممدوح": "0530781015",
    "علاء مرسي": "0500252894", "جمال": "0507891256", "سيد زين": "0549938932","كنان": "0555884231",
    "جامشيد": "0558085792",
    
    // فرق الترمنيشن
    "راجا": "0577170684", "اماندو": "0562327780", "بارديب": "0503683969", "جلين": "0553155395",
    "جيريكو": "0555731663", "كليان": "0578578738", "محمد احمد": "0533314859", "مانيكندن": "0552325507",
    "سوريش": "0578622058", "جونس": "0551855778",
    // المعدات (فرق الهوائي)
    "بالا": "0507144791", "سيلفم": "0570327804", "غلام ": "0566574341", "رافي": "0554509165",
    "افتخار": "0552581182", "الجون": "0501358095", "ارفينال": "0581327592", "جميل": "555877538",
    "جينارد": "0564479067"
};
// قاعدة بيانات الأكواد الفريدة لكل عنصر
const assetCodes = {
    // فرق الحفر والتمديد
    "عمر الطيب": "KU1", "اشرف": "KU2", "كرم": "KU3", "ممدوح": "KU4",
    "علاء مرسي": "KU5", "جامشيد": "KU6", "جمال": "KU7", "كنان": "KU8",
    "سيد زين": "KU9",
    
    // فرق الترمنيشن
    "راجا": "KS1", "اماندو": "KS2", "بارديب": "KS3", "جلين": "KS4",
    "جيريكو": "KS5", "كليان": "KS6", "محمد احمد": "KS7", "مانيكندن": "KS8",
    "سوريش": "KS9", "جونس": "KS10",
    
    // فرق الهوائي
    "بالا": "KO1", "سيلفم": "KO2", "فانكتش": "KO3", "رافي": "KO4",
    "افتخار": "KO5", "الجون": "KO6", "ارفينال": "KO7",
    "جميل": "KO8", "جينارد": "KO9"
};
// 2. متغيرات الحالة وتحميل البيانات من الذاكرة المحلية
let allWorkOrders = JSON.parse(localStorage.getItem('all_work_orders')) || {};
let currentEng = "";
let currentOrderNumber = "";
let tempSelection = [];

window.onload = () => {
    populateSelectBoxes(); // تعبئة القوائم أولاً
    initEngineers();
    updateAvailablePool();
    renderOrders();
};

// 3. منطق تسجيل الدخول
function handleLogin() {
    const userInp = document.getElementById('login-user').value;
    const passInp = document.getElementById('login-pass').value;

    if ((userInp === "1" || userInp === "2") && (passInp === "1" || passInp === "2")) {
        goToPage('work-order-page');
    } else {
        const err = document.getElementById('error-txt');
        if(err) err.style.display = "block";
    }
}

// 4. وظائف إدارة أوامر العمل
function prepareNewOrder() {
    currentOrderNumber = "";
    document.getElementById('order-title').innerText = "أمر عمل جديد";
    document.getElementById('order-number').value = "";
    document.getElementById('order-coords').value = "";
    document.getElementById('order-number').disabled = false;
    goToPage('work-order-page');
}

function startWorkOrder() {
    const orderNo = document.getElementById('order-number').value.trim();
    if (!orderNo) return alert("يرجى إدخال رقم أمر العمل");
    
    currentOrderNumber = orderNo;
    goToPage('engineers-page');
}

function initEngineers() {
    const container = document.getElementById('engineers-list-container');
    if(!container) return;
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
    // جمع كل المعدات المرتبطة بهذا المهندس من كافة أوامر العمل
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
    
    // إذا كان الأمر موجود مسبقاً (تعديل)، نسحب معداته، وإلا نبدأ بمصفوفة فارغة
    tempSelection = allWorkOrders[currentOrderNumber] ? [...allWorkOrders[currentOrderNumber].assets] : [];
    
    document.getElementById('active-eng').innerText = name;
    const displayOrder = document.getElementById('active-order-display');
    if(displayOrder) displayOrder.innerText = `تخصيص للأمر: ${currentOrderNumber}`;
    
    renderPlaylists();
    updatePreview();
    goToPage('assets-page');
}
// دالة لتعبئة القوائم في واجهة المستخدم
function populateSelectBoxes() {
    const siteSelect = document.getElementById('order-site');
    const consultantSelect = document.getElementById('order-consultant');

    // تعبئة المواقع
    siteSelect.innerHTML = '<option value="" disabled selected>اختر الموقع</option>' + 
        siteList.map(site => `<option value="${site}">${site}</option>`).join('');

    // تعبئة الاستشاريين
    consultantSelect.innerHTML = '<option value="" disabled selected>اختر اسم الاستشاري</option>' + 
        consultantList.map(con => `<option value="${con}">${con}</option>`).join('');
}
// 5. منطق اختيار المعدات (Playlists) مع منع التكرار
function renderPlaylists() {
    const container = document.getElementById('playlists-container');
    container.innerHTML = "";

    // جمع كافة المعدات المحجوزة في الأوامر الأخرى (باستثناء الأمر الحالي ليتسنى تعديله)
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

// 6. الحفظ والتحديث
function confirmSelection() {
    const site = document.getElementById('order-site').value;
    const consultant = document.getElementById('order-consultant').value;
    const coords = document.getElementById('order-coords').value.trim();
    const dateStr = new Date().toLocaleDateString('ar-EG');

    if (!site || !consultant) {
        alert("يرجى اختيار الموقع والاستشاري من القائمة");
        return;
    }

    allWorkOrders[currentOrderNumber] = {
        engineer: currentEng,
        assets: [...tempSelection],
        site: site,
        consultant: consultant,
        coords: coords,
        date: dateStr
    };

    localStorage.setItem('all_work_orders', JSON.stringify(allWorkOrders));
    
    // تصفير الحقول
    document.getElementById('order-number').value = "";
    document.getElementById('order-site').selectedIndex = 0;
    document.getElementById('order-consultant').selectedIndex = 0;
    document.getElementById('order-coords').value = "";
    
    currentOrderNumber = "";
    updateAvailablePool();
    initEngineers();
    renderOrders();
    goToPage('engineers-page');
    alert("تم الحفظ بنجاح");
const webAppUrl = "https://script.google.com/macros/s/AKfycby1FZZ8a4JXdjLcHQKDqTa6EwLHXUKYMfwOsfxEldulO4aZ-lz_qv3Ey-Nli0vyFGzoog/exec";

    // تجهيز البيانات للإرسال
    // سنقوم بإرسال كل "أصل" (Asset) مسجل في مصفوفة tempSelection
    for (let asset of tempSelection) {
        const dataToSend = {
            code: assetCodes[asset] || "N/A",
            orderNo: currentOrderNumber,
            consultant: document.getElementById('order-consultant').value,
            site: document.getElementById('order-site').value,
            coords: document.getElementById('order-coords').value,
            asset: asset,
            contact: contactLeads[asset] || "N/A",
            engineer: currentEng,
            engContact: contactLeads[currentEng] || "N/A"
        };

        // إرسال البيانات إلى Google Sheets
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors', // لتجنب مشاكل الـ CORS
            body: JSON.stringify(dataToSend)
        });
    }

    // بقية كود الحفظ في localStorage والتنبيهات
    alert("تم الحفظ في المتصفح وإرسال البيانات لـ Google Sheets");
}

// عرض سجل أوامر العمل مع زر الحذف
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

// دالة حذف أمر عمل محدد
function deleteOrder(event, orderNo) {
    // منع الحدث من الانتقال للبطاقة (عشان ميفتحش وضع التعديل)
    event.stopPropagation();

    if (confirm(`هل أنت متأكد من حذف أمر العمل رقم (${orderNo}) نهائياً؟`)) {
        // حذف الأمر من الكائن الرئيسي
        delete allWorkOrders[orderNo];
        
        // تحديث التخزين المحلي
        localStorage.setItem('all_work_orders', JSON.stringify(allWorkOrders));
        
        // تحديث الواجهة فوراً
        renderOrders();
        updateAvailablePool();
        initEngineers();
        
        alert(`تم حذف الأمر رقم ${orderNo} وتحرير المعدات بنجاح`);
    }
}

function editExistingOrder(no) {
    const order = allWorkOrders[no];
    currentOrderNumber = no;
    
    document.getElementById('order-title').innerText = "تعديل بيانات الموقع";
    document.getElementById('order-number').value = no;
    document.getElementById('order-site').value = order.site || "";
    document.getElementById('order-consultant').value = order.consultant || "";
    document.getElementById('order-coords').value = order.coords || "";
    
    goToPage('work-order-page');
}

function updateAvailablePool() {
    const pool = document.getElementById('available-pool');
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

// 7. وظائف عامة (التنقل، الحذف، التصدير)
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function resetAllData() {
    if(confirm("تحذير: سيتم حذف كافة أوامر العمل والبيانات المسجلة نهائياً!")) {
        localStorage.clear();
        location.reload();
    }
}

function exportToExcel() {
    // 1. إعداد الترويسة (Header) بناءً على الملف المرفق
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    
    const templateStructure = [
        [`DATE : ${dateStr}`, "", "NAME : KENAN ARABIC", "", "", "DAILY WORK SCHEDULE", "", "Mobile # : +966500469088", ""],
        [" ", "", "", "", "", "", "", "", ""], // سطر فارغ للجمالية
    // تعريف لون الخلفية (مثلاً لون رمادي فاتح للرؤوس)
    const headerStyle = {
        fill: { fgColor: { rgb: "D3D3D3" } }, // لون الخلفية
        font: { bold: true, color: { rgb: "000000" } }, // خط عريض
        alignment: { horizontal: "center", vertical: "center" }, // تواصل
        border: {
            top: { style: "thin" }, bottom: { style: "thin" },
            left: { style: "thin" }, right: { style: "thin" }
        }
    };

    // الصف الخامس (رؤوس الجدول) مع إضافة التنسيق لكل خلية
    const headers = [
        "GROUP COAD", "WORK ORDER NUMBER.", "CONSULTANT COMPANY NAME", 
        "LOCATION", "LOCATION X,Y", "WORK TYPE", "DESCRIPTION", 
        "FOREMAN NAME", "FOREMAN MOBILE NUMBER", "RESPONSIBLE ENGINEERS"
    ].map(title => ({ v: title, s: headerStyle })); // تحويل كل نص إلى خلية منسقة

    const emptyRows = [[], [], [], []]; // 4 صفوف فارغة
    const finalData = [...emptyRows, headers];

    // تجميع بيانات الصفوف (بدون تلوين أو بتنسيق بسيط)
    const dataStyle = { alignment: { horizontal: "right" } };

    Object.entries(allWorkOrders).forEach(([no, d]) => {
        if (d.assets) {
            d.assets.forEach(asset => {
                const code = assetCodes[asset] || "N/A";
                finalData.push([
                    { v: code, s: dataStyle },
                    { v: no, s: dataStyle },
                    { v: d.consultant || "N/A", s: dataStyle },
                    { v: d.site || "N/A", s: dataStyle },
                    { v: d.coords || "N/A", s: dataStyle },
                    { v: "CONSTRUCTION", s: dataStyle },
                    { v: "MAINTENANCE", s: dataStyle },
                    { v: asset, s: dataStyle },
                    { v: contactLeads[asset] || "N/A", s: dataStyle },
                    { v: `${d.engineer} - ${contactLeads[d.engineer] || ''}`, s: dataStyle }
                ]);
            });
        }
    });

    const ws = XLSX.utils.aoa_to_sheet(finalData);
    
    // ضبط العرض
    ws['!cols'] = [{wch: 12}, {wch: 15}, {wch: 25}, {wch: 15}, {wch: 25}, {wch: 15}, {wch: 20}, {wch: 18}, {wch: 18}, {wch: 35}];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Work Schedule");
    XLSX.writeFile(wb, `Daily_Schedule_${new Date().getTime()}.xlsx`);
}


// دالة المسح الشامل والبدء من الصفر
function resetAllData() {
    const confirmAction = confirm("تنبيه هائل: سيتم حذف كافة أوامر العمل، الإحداثيات، وسجل المهندسين نهائياً. هل أنت متأكد؟");
    
    if (confirmAction) {
        // مسح الذاكرة المحلية للمتصفح بالكامل
        localStorage.clear();
        
        // إعادة تحميل الصفحة ليرجع الموقع لحالته الأصلية
        location.reload();
    }
}

// دالة تفريغ الخانات الحالية فقط (إذا احتجتها للتنظيف السريع)
function clearOrderForm() {
    document.getElementById('order-number').value = "";
    document.getElementById('order-coords').value = "";
    document.getElementById('order-number').disabled = false;
    document.getElementById('order-title').innerText = "أمر عمل جديد";
}
