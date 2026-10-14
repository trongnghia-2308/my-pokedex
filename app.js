const container = document.getElementById('pokedex-container');
const searchInput = document.getElementById('search');
let allPokemon = [];

// 🔴 THAY THẾ CHUỖI DƯỚI ĐÂY BẰNG MÃ ID BẢNG TÍNH CỦA BẠN
const SHEET_ID = '1Plf6Zruakg58eFVhDGXtIaVc8m7ExxKtIVBp2TViZCA'; 
const SHEET_TITLE = 'Trang tính1'; // Tên tab sheet ở góc dưới bên trái của bạn
const SHEET_RANGE = 'A2:M200';   // Lấy dữ liệu từ dòng 2 (bỏ dòng tiêu đề) đến dòng 200

// Đường dẫn API xuất dữ liệu từ Google Sheet sang định dạng JSON gọn nhẹ
const FULL_URL = `https://google.com{SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

const fetchPokemonFromSheet = async () => {
    try {
        const res = await fetch(FULL_URL);
        const text = await res.text();
        
        // Cắt bỏ phần dữ liệu thừa mà Google trả về để lấy chuỗi JSON sạch
        const jsonData = JSON.parse(text.substring(47, text.length - 2));
        const rows = jsonData.table.rows;

        // Xử lý dữ liệu thô từ các cột trong bảng tính
        allPokemon = rows.map(row => {
            const cells = row.c;
            return {
                imgUrl: cells[0] ? cells[0].v : '', // Cột A: Link ảnh đại diện
                name: cells[1] ? cells[1].v : '',   // Cột B: Tên Pokemon
                type1: cells[2] ? cells[2].v : '',  // Cột C: Hệ 1
                type2: cells[3] ? cells[3].v : '',  // Cột D: Hệ 2
                ability1: cells[4] ? cells[4].v : '', // Cột E: Kỹ năng chính
                ability2: cells[5] ? cells[5].v : '', // Cột F: Kỹ năng ẩn
                tier: cells[6] ? cells[6].v : '',   // Cột G: Phân hạng Tier
                hp: cells[7] ? cells[7].v : 0,      // Cột H: Chỉ số HP
                atk: cells[8] ? cells[8].v : 0,     // Cột I: Chỉ số Atk
                def: cells[9] ? cells[9].v : 0,     // Cột J: Chỉ số Def
                spa: cells[10] ? cells[10].v : 0,   // Cột K: Chỉ số SpA
                spd: cells[11] ? cells[11].v : 0,   // Cột L: Chỉ số SpD
                spe: cells[12] ? cells[12].v : 0    // Cột M: Chỉ số Spe
            };
        }).filter(p => p.name !== ''); // Lọc bỏ hàng trống nếu có

        displayPokemonTable(allPokemon);
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu từ Google Sheet:", error);
    }
};

// Hàm hiển thị bảng dữ liệu chuẩn Smogon
const displayPokemonTable = (pokemonList) => {
    let tableHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 20%;">Pokemon</th>
                        <th style="width: 12%;">Types</th>
                        <th style="width: 18%;">Abilities</th>
                        <th style="width: 8%; text-align:center;">Tier</th>
                        <th class="stat-cell">HP</th>
                        <th class="stat-cell">Atk</th>
                        <th class="stat-cell">Def</th>
                        <th class="stat-cell">SpA</th>
                        <th class="stat-cell">SpD</th>
                        <th class="stat-cell">Spe</th>
                    </tr>
                </thead>
                <tbody>
    `;

    tableHTML += pokemonList.map((pokemon) => {
        // Xử lý hiển thị hệ (tạo badge màu cho cả hệ 1 và hệ 2 nếu có)
        let typesHTML = `<span class="type-badge ${pokemon.type1.toLowerCase()}">${pokemon.type1}</span>`;
        if (pokemon.type2) {
            typesHTML += ` <span class="type-badge ${pokemon.type2.toLowerCase()}">${pokemon.type2}</span>`;
        }

        // Xử lý hiển thị kỹ năng hàng dọc
        let abilitiesHTML = `<div>${pokemon.ability1}</div>`;
        if (pokemon.ability2) {
            abilitiesHTML += `<div style="color: #777; font-size: 0.8rem;">${pokemon.ability2} (H)</div>`;
        }

        return `
            <tr>
                <td>
                    <div class="poke-info">
                        <img src="${pokemon.imgUrl}" alt="${pokemon.name}">
                        <span>${pokemon.name}</span>
                    </div>
                </td>
                <td><div class="types-container">${typesHTML}</div></td>
                <td class="abilities-cell">${abilitiesHTML}</td>
                <td style="text-align: center; font-weight: bold; color: #555;">${pokemon.tier}</td>
                <td class="stat-cell">${pokemon.hp}</td>
                <td class="stat-cell">${pokemon.atk}</td>
                <td class="stat-cell">${pokemon.def}</td>
                <td class="stat-cell">${pokemon.spa}</td>
                <td class="stat-cell">${pokemon.spd}</td>
                <td class="stat-cell">${pokemon.spe}</td>
            </tr>
        `;
    }).join('');

    tableHTML += `</tbody></table></div>`;
    container.innerHTML = tableHTML;
};

// Ô tìm kiếm lọc theo Tên, Hệ hoặc Phân hạng Tier
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filteredPokemon = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(value) ||
        pokemon.type1.toLowerCase().includes(value) ||
        (pokemon.type2 && pokemon.type2.toLowerCase().includes(value)) ||
        pokemon.tier.toLowerCase().includes(value)
    );
    displayPokemonTable(filteredPokemon);
});

fetchPokemonFromSheet();
