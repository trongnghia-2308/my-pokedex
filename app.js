const container = document.getElementById('pokedex-container');
const searchInput = document.getElementById('search');
let allPokemon = []; // Lưu danh sách gốc để tìm kiếm

// Gọi API lấy dữ liệu 151 Pokémon thế hệ 1
const fetchPokemon = async () => {
    const promises = [];
    for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co{i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    
    try {
        // Đợi tất cả API phản hồi cùng lúc (tăng tốc độ tải)
        allPokemon = await Promise.all(promises);
        displayPokemon(allPokemon);
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
};

// Hàm hiển thị Pokémon ra màn hình
const displayPokemon = (pokemonList) => {
    const pokemonHTML = pokemonList.map((pokemon) => {
        // Lấy hệ đầu tiên của Pokemon
        const type = pokemon.types[0].type.name; 
        const id = pokemon.id.toString().padStart(3, '0'); // Định dạng 001, 002...
        
        return `
            <div class="card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <div class="id">#${id}</div>
                <div class="name">${pokemon.name}</div>
                <div class="type ${type}">${type}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = pokemonHTML;
};

// Xử lý sự kiện tìm kiếm
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filteredPokemon = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(value) || 
        pokemon.id.toString() === value
    );
    displayPokemon(filteredPokemon);
});

// Chạy hàm gọi dữ liệu khi tải trang
fetchPokemon();
