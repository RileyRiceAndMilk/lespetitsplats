import { recipes } from './recipes.js';

const recipeSection = document.querySelector('.recipe-section');
const ingredientFilter = document.querySelector('#ingredient-selector');
const applianceFilter = document.querySelector('#appliance-selector');
const ustensilFilter = document.querySelector('#utensil-selector');
const selectedTagsContainer = document.querySelector('#selected-tags');
const recipeCountElement = document.querySelector('#total-recipes');

const selectedFilters = {
    ingredients: [],
    appliances: [],
    ustensils: [],
    searchQuery: ''
};

const searchButton = document.querySelector('.button-mobile-version');
const searchInput = document.querySelector('.text-input');

const lightboxOverlay = document.createElement('div');
lightboxOverlay.classList.add('lightbox-overlay');
document.body.appendChild(lightboxOverlay);

const lightboxWrapper = document.createElement('div');
lightboxWrapper.classList.add('lightbox-wrapper');
lightboxOverlay.appendChild(lightboxWrapper);

const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
lightboxWrapper.appendChild(lightbox);

const closeLightbox = document.createElement('button');
closeLightbox.textContent = '×';
closeLightbox.classList.add('close-lightbox');
lightboxOverlay.appendChild(closeLightbox);

const prevButton = document.createElement('button');
prevButton.textContent = '<';
prevButton.classList.add('nav-lightbox', 'prev');
prevButton.disabled = false;

const nextButton = document.createElement('button');
nextButton.textContent = '>';
nextButton.classList.add('nav-lightbox', 'next');
nextButton.disabled = false;

lightboxOverlay.appendChild(prevButton);
lightboxOverlay.appendChild(nextButton);

let currentRecipeIndex = null;
let currentRecipe = null;

function openLightbox(recipe, index) {
    currentRecipe = recipe;
    currentRecipeIndex = index;

    const img = document.createElement('img');
    img.src = `recipes/${recipe.image}`;
    img.alt = `Image de ${recipe.name}`;
    img.id = 'lightbox-image';

    const title = document.createElement('h2');
    title.textContent = recipe.name;
    title.id = 'lightbox-recipe-title';

    const recetteTitle = document.createElement('h3');
    recetteTitle.classList.add('recette-title');
    recetteTitle.textContent = 'RECETTE';

    const description = document.createElement('p');
    description.textContent = recipe.description;
    description.id = 'lightbox-recipe-description';

    const ingredientsTitle = document.createElement('h4');
    ingredientsTitle.classList.add('ingredients-title');
    ingredientsTitle.textContent = 'INGRÉDIENTS';

    const ingredientsList = document.createElement('ul');
    ingredientsList.id = 'lightbox-recipe-ingredients';
    recipe.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        const ingredientName = document.createElement('div');
        ingredientName.classList.add('ingredient-name');
        ingredientName.textContent = ingredient.ingredient;

        const ingredientQuantity = document.createElement('div');
        ingredientQuantity.classList.add('ingredient-quantity');
        ingredientQuantity.textContent = `${ingredient.quantity || ''} ${ingredient.unit || ''}`;

        listItem.appendChild(ingredientName);
        listItem.appendChild(ingredientQuantity);
        ingredientsList.appendChild(listItem);
    });

    lightbox.innerHTML = '';
    lightbox.appendChild(img);
    lightbox.appendChild(title);
    lightbox.appendChild(recetteTitle);
    lightbox.appendChild(description);
    lightbox.appendChild(ingredientsTitle);
    lightbox.appendChild(ingredientsList);

    lightboxOverlay.style.display = 'flex';
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    updateNavigationButtons();
}

function closeLightboxFn() {
    lightboxOverlay.style.display = 'none';
    lightboxOverlay.setAttribute('aria-hidden', 'true');
}

function updateNavigationButtons() {
    prevButton.disabled = currentRecipeIndex === 0;
    nextButton.disabled = currentRecipeIndex === recipes.length - 1;
}

prevButton.addEventListener('click', () => {
    if (currentRecipeIndex > 0) {
        currentRecipeIndex--;
    } else {
        currentRecipeIndex = recipes.length - 1;
    }
    currentRecipe = recipes[currentRecipeIndex];
    openLightbox(currentRecipe, currentRecipeIndex);
});

nextButton.addEventListener('click', () => {
    if (currentRecipeIndex < recipes.length - 1) {
        currentRecipeIndex++;
    } else {
        currentRecipeIndex = 0;
    }
    currentRecipe = recipes[currentRecipeIndex];
    openLightbox(currentRecipe, currentRecipeIndex);
});

closeLightbox.addEventListener('click', closeLightboxFn);

function addLightboxToImages() {
    const recipeImages = document.querySelectorAll('.recipe-image');
    recipeImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            const recipeId = img.closest('.recipe-card').getAttribute('aria-labelledby').split('-')[1];
            const selectedRecipe = recipes.find(recipe => recipe.id == recipeId);
            openLightbox(selectedRecipe, index);
        });
    });
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
        img.onerror = () => img.src = 'recipes/default.jpg';

        const timeTag = document.createElement('span');
        timeTag.classList.add('time-tag');
        timeTag.textContent = `${this.recipe.time} min`;

        imageContainer.appendChild(img);
        imageContainer.appendChild(timeTag);

        const cardContentContainer = document.createElement('div');
        cardContentContainer.classList.add('card-content-container');

        const title = document.createElement('h2');
        title.id = `recipe-${this.recipe.id}`;
        title.textContent = this.recipe.name;

        const recetteTitle = document.createElement('h3');
        recetteTitle.classList.add('recette-title');
        recetteTitle.textContent = 'RECETTE';

        const description = document.createElement('p');
        description.classList.add('recipe-description');
        description.textContent = this.recipe.description;

        const ingredientsTitle = document.createElement('h4');
        ingredientsTitle.classList.add('ingredients-title');
        ingredientsTitle.textContent = 'Ingrédients';

        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');
        this.recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            const ingredientName = document.createElement('div');
            ingredientName.classList.add('ingredient-name');
            ingredientName.textContent = ingredient.ingredient;

            const ingredientQuantity = document.createElement('div');
            ingredientQuantity.classList.add('ingredient-quantity');
            ingredientQuantity.textContent = `${ingredient.quantity || ''} ${ingredient.unit || ''}`;

            ingredientItem.appendChild(ingredientName);
            ingredientItem.appendChild(ingredientQuantity);
            ingredientsList.appendChild(ingredientItem);
        });

        cardContentContainer.appendChild(title);
        cardContentContainer.appendChild(recetteTitle);
        cardContentContainer.appendChild(description);
        cardContentContainer.appendChild(ingredientsTitle);
        cardContentContainer.appendChild(ingredientsList);

        card.appendChild(imageContainer);
        card.appendChild(cardContentContainer);

        return card;
    }
}

function updateRecipeCount(recipes) {
    const recipeCount = recipes.length;
    recipeCountElement.textContent = `${recipeCount} recette${recipeCount > 1 ? 's' : ''}`;
}

function displayRecipes(recipes) {
    recipeSection.innerHTML = '';
    recipes.forEach(recipe => {
        const card = RecipeCard.createCard(recipe);
        recipeSection.appendChild(card);
    });
    updateRecipeCount(recipes);
    addLightboxToImages();
}

function initializeFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => ingredients.add(ingredient.ingredient.toLowerCase()));
        appliances.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ustensil => ustensils.add(ustensil.toLowerCase()));
    });

    populateFilterOptions(ingredientFilter, Array.from(ingredients));
    populateFilterOptions(applianceFilter, Array.from(appliances));
    populateFilterOptions(ustensilFilter, Array.from(ustensils));
}

function populateFilterOptions(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        selectElement.appendChild(optionElement);
    });
}

ingredientFilter.addEventListener('change', (event) => {
    const value = event.target.value.trim().toLowerCase();
    if (value && !selectedFilters.ingredients.includes(value)) {
        selectedFilters.ingredients.push(value);
        applyFilters();
    }
});

applianceFilter.addEventListener('change', (event) => {
    const value = event.target.value.trim().toLowerCase();
    if (value && !selectedFilters.appliances.includes(value)) {
        selectedFilters.appliances.push(value);
        applyFilters();
    }
});

ustensilFilter.addEventListener('change', (event) => {
    const value = event.target.value.trim().toLowerCase();
    if (value && !selectedFilters.ustensils.includes(value)) {
        selectedFilters.ustensils.push(value);
        applyFilters();
    }
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    selectedFilters.searchQuery = query;
    searchInput.value = '';  
    applyFilters();
});

function applyFilters() {
    let filteredRecipes = recipes;

    filteredRecipes = filteredRecipes.filter(recipe => {
        return selectedFilters.ingredients.every(ingredient =>
            recipe.ingredients.some(i => i.ingredient.toLowerCase() === ingredient)
        );
    });

    filteredRecipes = filteredRecipes.filter(recipe => {
        return selectedFilters.appliances.every(appliance =>
            recipe.appliance.toLowerCase() === appliance
        );
    });

    filteredRecipes = filteredRecipes.filter(recipe => {
        return selectedFilters.ustensils.every(ustensil =>
            recipe.ustensils.some(u => u.toLowerCase() === ustensil)
        );
    });

    if (selectedFilters.searchQuery) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.name.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()))
        );
    }

    displayRecipes(filteredRecipes);
    updateTagsDisplay();
}

function updateTagsDisplay() {
    selectedTagsContainer.innerHTML = ''; 

    Object.keys(selectedFilters).forEach(filterKey => {
        const filterValues = selectedFilters[filterKey];
        if (Array.isArray(filterValues) && filterValues.length > 0) {
            filterValues.forEach(value => {
                const tag = document.createElement('span');
                tag.classList.add('filter-tag'); 
                tag.textContent = value;

                const removeButton = document.createElement('button');
                removeButton.textContent = '×';
                removeButton.classList.add('remove-tag');
                removeButton.setAttribute('aria-label', 'Remove this filter');
                removeButton.addEventListener('click', () => {
                    const index = selectedFilters[filterKey].indexOf(value);
                    if (index > -1) {
                        selectedFilters[filterKey].splice(index, 1);
                        applyFilters();
                    }
                });

                tag.appendChild(removeButton);
                selectedTagsContainer.appendChild(tag);
            });
        }
    });

    if (selectedFilters.searchQuery) {
        const searchTag = document.createElement('span');
        searchTag.classList.add('filter-tag'); 
        searchTag.textContent = selectedFilters.searchQuery;

        const removeButton = document.createElement('button');
        removeButton.textContent = '×';
        removeButton.classList.add('remove-tag');
        removeButton.setAttribute('aria-label', 'Clear search');
        removeButton.addEventListener('click', () => {
            selectedFilters.searchQuery = '';
            searchInput.value = '';
            applyFilters();
        });

        searchTag.appendChild(removeButton);
        selectedTagsContainer.appendChild(searchTag);
    }
}

initializeFilters(recipes);
displayRecipes(recipes);

