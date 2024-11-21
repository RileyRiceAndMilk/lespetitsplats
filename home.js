let currentRecipeIndex = 0; 
let allRecipes = []; 
let activeTags = []; 
let searchQuery = ""; 

function updateRecipeCount(recipes) {
    const recipeCountElement = document.getElementById('recipe-count');
    if (recipeCountElement) {
        const recipeCount = recipes.length;
        const recipeText = recipeCount === 1 ? 'recette' : 'recettes';
        recipeCountElement.textContent = `${recipeCount} ${recipeText}`;
    }
}

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

        const descriptionTitle = document.createElement('h3');
        descriptionTitle.classList.add('description-title');
        descriptionTitle.textContent = 'Recette';

        const description = document.createElement('p');
        description.classList.add('recipe-description');
        description.textContent = this.recipe.description;

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.classList.add('ingredients-title');
        ingredientsTitle.textContent = 'Ingrédients';

        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');
        this.recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            const ingredientText = `${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''} ${ingredient.ingredient}`;
            ingredientItem.textContent = ingredientText.trim();
            ingredientsList.appendChild(ingredientItem);
        });

        card.appendChild(imageContainer);
        card.appendChild(title);
        card.appendChild(descriptionTitle);
        card.appendChild(description);
        card.appendChild(ingredientsTitle);
        card.appendChild(ingredientsList);

        card.addEventListener('click', (event) => {
            event.preventDefault();
            openRecipeLightbox(this.recipe, allRecipes.indexOf(this.recipe));
        });

        return card;
    }
}

function openRecipeLightbox(recipe, index) {
    currentRecipeIndex = index;

    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.classList.add('lightbox-overlay');

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Recette en détail');

    const img = document.createElement('img');
    img.src = `recipes/${recipe.image}`;
    img.alt = `Image de ${recipe.name}`;
    img.classList.add('lightbox-image');

    const title = document.createElement('h2');
    title.textContent = recipe.name;

    const descriptionTitle = document.createElement('h3');
    descriptionTitle.textContent = 'Recette';
    descriptionTitle.classList.add('description-title');

    const description = document.createElement('p');
    description.textContent = recipe.description;
    description.classList.add('recipe-description');

    
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.classList.add('ingredients-title');
    ingredientsTitle.textContent = 'Ingrédients';

    
    const ingredientsList = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        const ingredientText = `${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''} ${ingredient.ingredient}`;
        ingredientItem.textContent = ingredientText.trim();
        ingredientsList.appendChild(ingredientItem);
    });

   
    const createArrowButton = (direction) => {
        const arrowButton = document.createElement('button');
        arrowButton.classList.add(`lightbox-${direction}`);
        
        const arrow = document.createElement('span');
        arrow.innerHTML = direction === 'prev' ? '&#10094;' : '&#10095;';
        
        arrowButton.appendChild(arrow);
        arrowButton.addEventListener('click', direction === 'prev' ? showPrevRecipe : showNextRecipe);
        return arrowButton;
    }

    const prevButton = createArrowButton('prev');
    const nextButton = createArrowButton('next');

   
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.classList.add('close-lightbox');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(lightboxOverlay); 
    });

    
    lightbox.appendChild(img);
    lightbox.appendChild(title);
    lightbox.appendChild(descriptionTitle);
    lightbox.appendChild(description);

  
    lightbox.appendChild(ingredientsTitle);
    lightbox.appendChild(ingredientsList);

   
    lightboxOverlay.appendChild(closeButton); 
    lightboxOverlay.appendChild(prevButton);
    lightboxOverlay.appendChild(nextButton);
    lightboxOverlay.appendChild(lightbox);

    document.body.appendChild(lightboxOverlay);
}



function showPrevRecipe() {
    if (currentRecipeIndex > 0) {
        currentRecipeIndex--;
        updateLightboxRecipe(allRecipes[currentRecipeIndex]);
    }
}


function showNextRecipe() {
    if (currentRecipeIndex < allRecipes.length - 1) {
        currentRecipeIndex++;
        updateLightboxRecipe(allRecipes[currentRecipeIndex]);
    }
}


function updateLightboxRecipe(recipe) {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        const img = lightbox.querySelector('img');
        const title = lightbox.querySelector('h2');
        const description = lightbox.querySelector('p');
        const ingredientsList = lightbox.querySelector('ul');

        img.src = `recipes/${recipe.image}`;
        img.alt = `Image de ${recipe.name}`;
        title.textContent = recipe.name;
        description.textContent = recipe.description;

        
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            const ingredientText = `${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''} ${ingredient.ingredient}`;
            ingredientItem.textContent = ingredientText.trim();
            ingredientsList.appendChild(ingredientItem);
        });
    }
}


function filterAndDisplayRecipes(recipes) {
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearchQuery = recipe.name.toLowerCase().includes(searchQuery);
        const matchesTags = activeTags.every(tagObject => {
            if (tagObject.type === 'ingredient') {
                return recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().trim() === tagObject.tag);
            }
            if (tagObject.type === 'ustensil') {
                return recipe.ustensils && recipe.ustensils.some(ustensil => ustensil.toLowerCase().trim() === tagObject.tag);
            }
            if (tagObject.type === 'appliance') {
                return recipe.appliance.toLowerCase().trim() === tagObject.tag;
            }
            return false;
        });
        return matchesSearchQuery && matchesTags;
    });

    displayRecipes(filteredRecipes, document.querySelector('.recipe-section'));
    updateRecipeCount(filteredRecipes);
}

function displayRecipes(recipes, container) {
    container.innerHTML = ''; 
    recipes.forEach(recipe => {
        const recipeCard = RecipeCard.createCard(recipe);
        container.appendChild(recipeCard);
    });
}

async function loadRecipes() {
    try {
        const response = await fetch('./recipes.json');
        const data = await response.json();
        if (data && Array.isArray(data.recipes)) {
            allRecipes = data.recipes;
            updateRecipeCount(allRecipes);
            displayRecipes(allRecipes, document.querySelector('.recipe-section'));
        } else {
            console.error("Le fichier JSON ne contient pas un tableau de recettes.");
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
});

