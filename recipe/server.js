const express = require('express');
const app = express();
app.use(express.json());

let initialRecipes = [
  {
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish.',
    preparationTime: '15 minutes',
    cookingTime: '15',
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/carbonara-index-6476367f40c39.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*',
    country: "India",
    veg: true,
    id: 1
  }
];

app.get('/', (req, res) => {
  res.send('Welcome to the Recipe API');
});

app.get('/recipe/all', (req, res) => {
  res.json(initialRecipes);
});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/add', (req, res) => {
  res.sendFile(__dirname + '/recipe.html');
});

app.post('/recipe/add', (req, res) => {
  const { name, description, preparationTime, cookingTime, imageUrl, country, veg } = req.body;
  const newRecipe = {
    name,
    description,
    preparationTime,
    cookingTime,
    imageUrl,
    country,
    veg,
    id: initialRecipes.length + 1
  };
  initialRecipes.push(newRecipe);
  res.json(initialRecipes);
});

const validateRecipeData = (req, res, next) => {
  const { name, description, preparationTime, cookingTime, imageUrl, country, veg } = req.body;
  if (!name || !description || !preparationTime || !cookingTime || !imageUrl || !country || veg === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  next();
};

app.use('/recipe/add', validateRecipeData);

app.patch('/recipe/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, preparationTime, cookingTime, imageUrl, country, veg } = req.body;
  const recipeToUpdate = initialRecipes.find(recipe => recipe.id === Number(id));
  if (!recipeToUpdate) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  recipeToUpdate.name = name || recipeToUpdate.name;
  recipeToUpdate.description = description || recipeToUpdate.description;
  recipeToUpdate.preparationTime = preparationTime || recipeToUpdate.preparationTime;
  recipeToUpdate.cookingTime = cookingTime || recipeToUpdate.cookingTime;
  recipeToUpdate.imageUrl = imageUrl || recipeToUpdate.imageUrl;
  recipeToUpdate.country = country || recipeToUpdate.country;
  recipeToUpdate.veg = veg === undefined ? recipeToUpdate.veg : veg;
  res.json(initialRecipes);
});

app.delete('/recipe/delete/:id', (req, res) => {
  const { id } = req.params;
  const recipeIndex = initialRecipes.findIndex(recipe => recipe.id === Number(id));
  if (recipeIndex === -1) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  initialRecipes.splice(recipeIndex, 1);
  res.json(initialRecipes);
});

app.get('/recipe/filter', (req, res) => {
  let filteredRecipes = [...initialRecipes];

  const { veg, sort, country } = req.query;

  if (veg !== undefined) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.veg === (veg === 'true'));
  }

  if (country) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.country.toLowerCase() === country.toLowerCase());
  }

  if (sort === 'lth') {
    filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'htl') {
    filteredRecipes.sort((a, b) => b.name.localeCompare(a.name));
  }

  res.json(filteredRecipes);
});

app.listen(8090, () => {
  console.log('Server started on port 8090');
});