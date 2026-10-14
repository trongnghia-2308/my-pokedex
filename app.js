const container = document.getElementById('pokedex-container');
const searchInput = document.getElementById('search');
let allPokemon = [];

// Gọi API lấy dữ liệu 151 Pokémon
const fetchPokemon = async () => {
    const promises = [];
    for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co{i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    try {
        allPokemon = await Promise.all(promises);
        displayPokemonTable(allPokemon);
    } catch (error) {
        console.error("Lỗi tải API:", error);
    }
};

// Hàm tạo bảng hiển thị dữ liệu giống Smogon
const displayPokemonTable = (pokemonList) => {
    // Tạo cấu trúc khung bảng (Table)
    let tableHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%;">Pokemon</th>
                        <th style="width: 15%;">Types</th>
                        <th style="width: 20%;">Abilities</th>
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

    // Duyệt qua từng Pokemon để tạo các hàng (Tr) dữ liệu
    tableHTML += pokemonList.map((pokemon) => {
        // Lấy danh sách các hệ (tối đa 2 hệ)
        const typesHTML = pokemon.types.map(t => 
            `<span class="type-badge ${t.type.name}">${t.type.name}</span>`
        ).join('');

        // Lấy danh sách kỹ năng
        const abilitiesHTML = pokemon.abilities.map(a => 
            `<div>${a.ability.name.replace('-', ' ')}</div>`
        ).join('');

        // Lấy chính xác các chỉ số cơ bản (Base Stats) từ mảng stats của API
        const hp = pokemon.stats[0].base_stat;
        const atk = pokemon.stats[1].base_stat;
        const def = pokemon.stats[2].base_stat;
        const spa = pokemon.stats[3].base_stat;
        const spd = pokemon.stats[4].base_stat;
        const spe = pokemon.stats[5].base_stat;

        // Dùng ảnh dạng pixel (versions.generation-v.black-white.animated) hoặc front_default nhỏ
        const pixelImg = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default || pokemon.sprites.front_default;

        return `
            <tr>
                <td>
                    <div class="poke-info">
                        <img src="${pixelImg}" alt="${pokemon.name}">
                        <span>${pokemon.name}</span>
                    </div>
                </td>
                <td>
                    <div class="types-container">${typesHTML}</div>
                </td>
                <td class="abilities-cell">
                    ${abilitiesHTML}
                </td>
                <td class="stat-cell">${hp}</td>
                <td class="stat-cell">${atk}</td>
                <td class="stat-cell">${def}</td>
                <td class="stat-cell">${spa}</td>
                <td class="stat-cell">${spd}</td>
                <td class="stat-cell">${spe}</td>
            </tr>
        `;
    }).join('');

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
};

// Tìm kiếm thời gian thực theo Tên hoặc Hệ
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filteredPokemon = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(value) ||
        pokemon.types.some(t => t.type.name.toLowerCase().includes(value))
    );
    displayPokemonTable(filteredPokemon);
});

fetchPokemon();
