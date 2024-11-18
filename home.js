let allRecipes = [];  
let activeTags = []; 

class RecipeCard {
    constructor(recipe) {
        this.recipe = recipe;
    }

    static createCard(recipe) {
        const card = new RecipeCard(recipe);
        return card.createCardContent();
    }

    createCardContent() {
        const card = document.createElement('article');
        card.classList.add('recipe-card');
        card.setAttribute('aria-labelledby', `recipe-${this.recipe.id}`);

        const link = document.createElement('a');
        link.href = `recipe.html?id=${this.recipe.id}`;
        link.setAttribute('aria-label', `Voir la recette de ${this.recipe.name}`);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const img = document.createElement('img');
        img.src = `recipes/${this.recipe.image}`;
        img.alt = `Image de ${this.recipe.name}`;
        img.classList.add('recipe-image');

        const timeTag = document.createElement('span');
        timeTag.classList.add('time-tag');
        timeTag.textContent = `${this.recipe.time} min`;

        imageContainer.appendChild(img);
        imageContainer.appendChild(timeTag);

        const title = document.createElement('h2');
        title.id = `recipe-${this.recipe.id}`;
        title.textContent = this.recipe.name;

        const time = document.createElement('p');
        time.classList.add('recipe-time');
        time.textContent = `⏱️ Temps: ${this.recipe.time} minutes`;

        const description = document.createElement('p');
        description.classList.add('recipe-description');
        description.textContent = this.recipe.description;

        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');
        this.recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            const ingredientText = `${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''} ${ingredient.ingredient}`;
            ingredientItem.textContent = ingredientText.trim();
            ingredientsList.appendChild(ingredientItem);
        });

        link.appendChild(imageContainer);
        link.appendChild(title);
        link.appendChild(time);
        link.appendChild(description);
        link.appendChild(ingredientsList);

        card.appendChild(link);

        return card;
    }
}

function createIngredientFilter(recipes) {
    const ingredientSelect = document.getElementById('ingredient-filter');
    const ingredients = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredients.add(ingredient.ingredient);
        });
    });

    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient;
        option.textContent = ingredient;
        ingredientSelect.appendChild(option);
    });

    ingredientSelect.addEventListener('change', (event) => {
        const selectedIngredient = event.target.value;
        if (selectedIngredient) {
            addTag(selectedIngredient);
        }
    });
}

function filterAndDisplayRecipes(recipes) {
    const recipeSection = document.querySelector('.recipe-section');

    const filteredRecipes = recipes.filter(recipe => {
        return activeTags.every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient === tag)
        );
    });

    displayRecipes(filteredRecipes, recipeSection);
}

function displayRecipes(recipes, recipeSection) {
    recipeSection.innerHTML = '';  

    const fragment = document.createDocumentFragment();

    recipes.forEach(recipe => {
        const card = RecipeCard.createCard(recipe);
        fragment.appendChild(card);
    });

    recipeSection.appendChild(fragment);
}

function addTag(selectedIngredient) {
    if (!activeTags.includes(selectedIngredient)) {
        activeTags.push(selectedIngredient);
        updateTags();
    }
}

function removeTag(tag) {
    activeTags = activeTags.filter(activeTag => activeTag !== tag);
    updateTags();
}

function updateTags() {
    const tagContainer = document.getElementById('selected-tags');
    tagContainer.innerHTML = '';  

    activeTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('ingredient-tag');
        tagElement.textContent = tag;

        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.classList.add('remove-tag');
        removeButton.addEventListener('click', () => {
            removeTag(tag);
            filterAndDisplayRecipes(allRecipes);  
        });

        tagElement.appendChild(removeButton);
        tagContainer.appendChild(tagElement);
    });


    filterAndDisplayRecipes(allRecipes);
}

async function loadRecipes() {
    const recipeSection = document.querySelector('.recipe-section'); 

    if (!recipeSection) {
        console.error("L'élément 'recipe-section' est introuvable.");
        return;
    }

    try {
        const response = await fetch('./recipes.json');

        if (!response.ok) {
            throw new Error(`Erreur de réseau: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.recipes)) {
            allRecipes = data.recipes;  
            createIngredientFilter(data.recipes);
            displayRecipes(data.recipes, recipeSection);
        } else {
            console.error('Données des recettes non trouvées ou format invalide');
            recipeSection.innerHTML = '<p>Pas de recettes disponibles.</p>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        recipeSection.innerHTML = '<p>Erreur de chargement des recettes. Essayez plus tard.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
});




















