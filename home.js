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

function displayRecipes(recipes, recipeSection) {
    recipeSection.innerHTML = '';  

    const fragment = document.createDocumentFragment();

    recipes.forEach(recipe => {
        const card = RecipeCard.createCard(recipe);
        fragment.appendChild(card);
    });

    recipeSection.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
});




















