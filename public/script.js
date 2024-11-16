document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search');
  const suggestionsBox = document.getElementById('suggestions');

  // Função para buscar sugestões
  async function fetchSuggestions(query) {
    const response = await fetch(`/search?q=${query}`);
    return response.json();
  }

  // Mostrar sugestões abaixo do campo de busca
  searchInput.addEventListener('input', async function() {
    const query = searchInput.value.trim();

    if (query.length > 0) {
      const suggestions = await fetchSuggestions(query);

      // Limpar sugestões anteriores
      suggestionsBox.innerHTML = '';

      // Adicionar novas sugestões com imagens
      suggestions.forEach((suggestion, index) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';

        // Adiciona uma classe especial ao último item para remover a borda inferior
        if (index === suggestions.length - 1) {
          div.classList.add('no-border');
        }

        div.innerHTML = `
          <img src="${suggestion.image}" alt="${suggestion.name}">
          <span>${suggestion.name}</span>
        `;
        suggestionsBox.appendChild(div);

        // Ao clicar em uma sugestão, buscar o Pokémon
        div.addEventListener('click', function() {
          window.location.href = `/pokemon/${suggestion.name}`;
        });
      });
    } else {
      suggestionsBox.innerHTML = '';
    }
  });

  // Limpar sugestões ao clicar fora do campo de busca
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target)) {
      suggestionsBox.innerHTML = '';
    }
  });
});
