const container = document.getElementById('pokedex-container');
const searchInput = document.getElementById('search');
let allPokemon = [];

// 🔴 DÁN ĐƯỜNG LINK CSV BẠN VỪA COPY Ở BƯỚC 1 VÀO ĐÂY
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTFijEIMMrUKZ8t2RYM4SLQu123xG_y7xC6X9V_Hjucf8yfc3zwpM_3B7oAMCOOqZO_rZ5c5YsPjQU/pub?gid=0&single=true&output=csv';

// Hàm đọc dữ liệu CSV từ Google Sheet
const fetchPokemonFromCSV = async () => {
    try {
        const res = await fetch(CSV_URL);
        const data = await res.text();
        
        // Cắt dữ liệu theo từng dòng
        const lines = data.split('\n');
        
        // Bỏ dòng tiêu đề đầu tiên, duyệt qua các dòng dữ liệu tiếp theo
        allPokemon = lines.slice(1).map(line => {
            // Tách các cột dựa trên dấu phẩy (xử lý trường hợp có dấu ngoặc kép)
            const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*\()/).map(c => c.replace(/^"\vert{}"\)/g, '').trim());
            
            if (cells.length < 2 || !cells[1]) return null; // Bỏ hàng trống

            return {
                imgUrl: cells[0] || '',   // Cột A: Link ảnh
                name: cells[1] || '',     // Cột B: Tên Pokemon
                type1: cells[2] || '',    // Cột C: Hệ 1
                type2: cells[3] || '',    // Cột D: Hệ 2
                ability1: cells[4] || '', // Cột E: Kỹ năng chính
                ability2: cells[5] || '', // Cột F: Kỹ năng ẩn
                tier: cells[6] || '',     // Cột G: Tier
                hp: cells[7] || 0,        // Cột H: HP
                atk: cells[8] || 0,       // Cột I: Atk
                def: cells[9] || 0,       // Cột J: Def
                spa: cells[10] || 0,      // Cột K: SpA
                spd: cells[11] || 0,      // Cột L: SpD
                spe: cells[12] || 0       // Cột M: Spe
            };
        }).filter(p => p !== null);

        displayPokemonTable(allPokemon);
    } catch (error) {
        console.error("Lỗi hệ thống tải CSV:", error);
        container.innerHTML = `<p style="text-align:center; color:red; padding:20px;">Lỗi kết nối dữ liệu. Vui lòng kiểm tra lại cấu hình Xuất bản web.</p>`;
    }
};

// Hàm hiển thị giao diện bảng chuẩn Smogon
const displayPokemonTable = (pokemonList) => {
    if (pokemonList.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Không tìm thấy Pokémon phù hợp.</p>';
        return;
    }

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
        let typesHTML = `<span class="type-badge ${pokemon.type1.toLowerCase()}">${pokemon.type1}</span>`;
        if (pokemon.type2) {
            typesHTML += ` <span class="type-badge ${pokemon.type2.toLowerCase()}">${pokemon.type2}</span>`;
        }

        let abilitiesHTML = `<div>${pokemon.ability1}</div>`;
        if (pokemon.ability2) {
            abilitiesHTML += `<div style="color: #777; font-size: 0.8rem;">${pokemon.ability2} (H)</div>`;
        }

        return `
            <tr>
                <td>
                    <div class="poke-info">
                        <img src="${pokemon.imgUrl}" alt="${pokemon.name}" onerror="this.src='https://placeholder.com'">
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

// Bộ lọc tìm kiếm
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

fetchPokemonFromCSV();
