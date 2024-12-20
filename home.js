import { recipes } from './recipes.js';

const recipeSection = document.querySelector('.recipe-section');
const ingredientFilter = document.querySelector('#ingredient-selector');
const applianceFilter = document.querySelector('#appliance-selector');
const ustensilFilter = document.querySelector('#utensil-selector');
const recipeCountElement = document.querySelector('#total-recipes');

const selectedFilters = {
    ingredients: [],
    appliances: [],
    ustensils: [],
    searchQuery: ''
};

const searchButton = document.querySelector('.button');
const searchInput = document.querySelector('.text-input');

const ingredientButton = document.querySelector('#ingredient-button');
const applianceButton = document.querySelector('#appliance-button');
const utensilButton = document.querySelector('#utensil-button');

const ingredientInput = document.querySelector('#ingredient-selector');
const applianceInput = document.querySelector('#appliance-selector');
const utensilInput = document.querySelector('#utensil-selector');

let debounceTimer;

searchInput.addEventListener('input', () => {
    if (searchInput.value.trim()) {
        searchClearButton.style.display = 'inline';
    } else {
        searchClearButton.style.display = 'none';
    }
});

searchButton.addEventListener('click', () => {
    selectedFilters.searchQuery = searchInput.value.trim();
    filterRecipes();
});

const createClearButton = (inputElement) => {
    const clearButton = document.createElement('span');
    clearButton.classList.add('clear-input');
    clearButton.textContent = '×';
    inputElement.parentElement.appendChild(clearButton);
    clearButton.style.display = 'none';

    return clearButton;
};

const ingredientClearButton = createClearButton(ingredientInput);
const applianceClearButton = createClearButton(applianceInput);
const utensilClearButton = createClearButton(utensilInput);

const toggleClearButtonVisibility = (inputElement, clearButton) => {
    if (inputElement.value.trim()) {
        clearButton.style.display = 'inline';
    } else {
        clearButton.style.display = 'none';
    }
};

ingredientInput.addEventListener('input', () => toggleClearButtonVisibility(ingredientInput, ingredientClearButton));
applianceInput.addEventListener('input', () => toggleClearButtonVisibility(applianceInput, applianceClearButton));
utensilInput.addEventListener('input', () => toggleClearButtonVisibility(utensilInput, utensilClearButton));

const handleClearButtonClick = (filterType, clearButton, inputElement) => {
    inputElement.value = '';
    clearButton.style.display = 'none';
    selectedFilters[filterType] = [];
    updateSelectedTags();
    filterRecipes();
};

ingredientClearButton.addEventListener('click', () => handleClearButtonClick('ingredients', ingredientClearButton, ingredientInput));
applianceClearButton.addEventListener('click', () => handleClearButtonClick('appliances', applianceClearButton, applianceInput));
utensilClearButton.addEventListener('click', () => handleClearButtonClick('ustensils', utensilClearButton, utensilInput));

const toggleSuggestions = (buttonId, containerId, inputElement) => {
    const container = document.querySelector(`#${containerId}`);
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
    inputElement.focus();
};

ingredientButton.addEventListener('click', () => toggleSuggestions('ingredient-button', 'containeur-input-and-suggestions-ingredient', ingredientInput));
applianceButton.addEventListener('click', () => toggleSuggestions('appliance-button', 'containeur-input-and-suggestions-appliance', applianceInput));
utensilButton.addEventListener('click', () => toggleSuggestions('utensil-button', 'containeur-input-and-suggestions-utensil', utensilInput));

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
        card.setAttribute('data-recipe-id', this.recipe.id);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const img = document.createElement('img');
        img.src = `recipes/${this.recipe.image}`;
        img.alt = `Image de ${this.recipe.name}`;
        img.classList.add('recipe-image');
        img.onerror = () => {
            img.style.display = 'none';
            message.textContent = "Désolé, l'image est indisponible.";
        };

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

    ingredientFilter.setAttribute('placeholder', '');
    applianceFilter.setAttribute('placeholder', '');
    ustensilFilter.setAttribute('placeholder', '');

    ingredientFilter.addEventListener('input', (event) => debounceInput(event, ingredients, 'ingredient-suggestions'));
    applianceFilter.addEventListener('input', (event) => debounceInput(event, appliances, 'appliance-suggestions'));
    ustensilFilter.addEventListener('input', (event) => debounceInput(event, ustensils, 'utensil-suggestions'));
}

function debounceInput(event, data, suggestionContainerId) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const value = event.target.value.trim().toLowerCase();
        showSuggestions(value, Array.from(data), suggestionContainerId);
    }, 300);
}

function showSuggestions(value, data, suggestionContainerId) {
    const suggestionsContainer = document.querySelector(`#${suggestionContainerId}`);
    suggestionsContainer.innerHTML = '';

    if (value === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const filteredSuggestions = data.filter(item => item.toLowerCase().includes(value.toLowerCase()));

    if (filteredSuggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';
    }

    filteredSuggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', () => handleSuggestionClick(suggestion, suggestionContainerId));
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function handleSuggestionClick(suggestion, suggestionContainerId) {
    if (suggestionContainerId === 'ingredient-suggestions') {
        if (!selectedFilters.ingredients.includes(suggestion)) {
            selectedFilters.ingredients.push(suggestion);
            updateSelectedTags();
        }
    } else if (suggestionContainerId === 'appliance-suggestions') {
        if (!selectedFilters.appliances.includes(suggestion)) {
            selectedFilters.appliances.push(suggestion);
            updateSelectedTags();
        }
    } else if (suggestionContainerId === 'utensil-suggestions') {
        if (!selectedFilters.ustensils.includes(suggestion)) {
            selectedFilters.ustensils.push(suggestion);
            updateSelectedTags();
        }
    }
    filterRecipes();
}

function updateSelectedTags() {
    const ingredientTagsContainer = document.getElementById('ingredient-tags');
    const applianceTagsContainer = document.getElementById('appliance-tags');
    const utensilTagsContainer = document.getElementById('utensil-tags');

    ingredientTagsContainer.innerHTML = '';
    selectedFilters.ingredients.forEach(ingredient => {
        const tag = createTag(ingredient, 'ingredients');
        ingredientTagsContainer.appendChild(tag);
    });

    applianceTagsContainer.innerHTML = '';
    selectedFilters.appliances.forEach(appliance => {
        const tag = createTag(appliance, 'appliances');
        applianceTagsContainer.appendChild(tag);
    });

    utensilTagsContainer.innerHTML = '';
    selectedFilters.ustensils.forEach(ustensil => {
        const tag = createTag(ustensil, 'ustensils');
        utensilTagsContainer.appendChild(tag);
    });
}

function createTag(value, filterType) {
    const tag = document.createElement('span');
    tag.classList.add('selected-tag');
    tag.textContent = value;

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '<i class="fa-solid fa-x"></i>';
    closeButton.addEventListener('click', () => removeTag(value, filterType));

    tag.appendChild(closeButton);
    return tag;
}

function removeTag(value, filterType) {
    const index = selectedFilters[filterType].indexOf(value);
    if (index !== -1) {
        selectedFilters[filterType].splice(index, 1);
    }
    updateSelectedTags();
    filterRecipes();
}

function filterRecipes() {
    let filteredRecipes = recipes;

    if (selectedFilters.searchQuery) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.name.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()));
    }

    if (selectedFilters.ingredients.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedFilters.ingredients.every(ingredient =>
                recipe.ingredients.some(ingredientObj => ingredientObj.ingredient.toLowerCase().includes(ingredient.toLowerCase()))
            )
        );
    }

    if (selectedFilters.appliances.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedFilters.appliances.some(appliance => recipe.appliance.toLowerCase().includes(appliance.toLowerCase()))
        );
    }

    if (selectedFilters.ustensils.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedFilters.ustensils.every(ustensil =>
                recipe.ustensils.some(item => item.toLowerCase().includes(ustensil.toLowerCase()))
            )
        );
    }

    displayRecipes(filteredRecipes);
}

initializeFilters(recipes);
displayRecipes(recipes);







































