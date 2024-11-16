const express = require('express');
const axios = require('axios');
//honestamente, acho node muito complicadokk
const app = express();
const PORT = 8080;


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

//endpoint para obter informações de um Pokémon
app.get('/pokemon/:name', async (req, res) => {
  const pokemonName = req.params.name.toLowerCase();

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = response.data;

    res.render('pokemon', {
      name: data.name,
      id: data.id,
      height: data.height,
      weight: data.weight,
      types: data.types.map(type => type.type.name),
      sprite: data.sprites.front_default,
    });
  } catch (error) {
    res.status(404).send('Pokémon não encontrado!');
  }
});


app.get('/search', async (req, res) => {
  const query = req.query.q.toLowerCase();

  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = response.data.results;

    //filtra nomes que começam com a consulta do usuário
    const suggestions = data
      .filter(pokemon => pokemon.name.startsWith(query))
      .slice(0, 10) // Limite de 10 sugestões
      .map((pokemon, index) => {
        //extrai o ID do Pokémon do URL (ex: "https://pokeapi.co/api/v2/pokemon/1/")
        const id = pokemon.url.split('/').filter(Boolean).pop();
        return {
          name: pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sugestões.' });
  }
});


//iniciando o servidor
app.listen(PORT, () => {
  console.log(`Pokédex está rodando em http://localhost:${PORT}`);
});
