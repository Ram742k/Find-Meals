document.addEventListener('DOMContentLoaded', async function() {
    populateIngredients();
    await loadAllRecipes();
});

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const searchInput = document.getElementById('search-input');
const searchIngredients = document.getElementById('search-ingredients');

searchBtn.addEventListener('click', async function() {
    await getMealList();
});


async function populateIngredients() {
    const ingredients = ['Chicken', 'Beef', 'Pork', 'Fish', 'Vegetables', 'Pasta', 'Rice', 'Potatoes', 'Beans', 'Cheese', 'Lamb', 'Shrimp', 'Tofu', 'Eggs', 'Salmon', 'Turkey', 'Spinach', 'Quinoa', 'Mushrooms', 'Broccoli'];

    ingredients.forEach(function(ingredient) {
        const label = document.createElement('label');
        label.textContent = ingredient;
        label.classList.add('ingredient-label');
        label.addEventListener('click', async function() {
            searchInput.value = ingredient;
            await getMealList();
        });
        searchIngredients.appendChild(label);
    });
}




async function loadAllRecipes() {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        const data = await response.json();
        displayMeals(data.meals);
    } catch (error) {
        console.error('Error fetching all recipes:', error);
    }
}


async function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    if (searchInputTxt === '') {
        await loadAllRecipes();
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
        const data = await response.json();
        displayMeals(data.meals);
    } catch (error) {
        console.error('Error fetching meal list:', error);
    }
}


function displayMeals(meals) {
    let html = "";
    if (meals) {
        meals.forEach(function(meal) {
            html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
            `;
        });
        mealList.classList.remove('notFound');
    } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add('notFound');
    }

    mealList.innerHTML = html;
}


mealList.addEventListener('click', function(e) {
    getMealRecipe(e);
});


async function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`);
            const data = await response.json();
            mealRecipeModal(data.meals);
        } catch (error) {
            console.error('Error fetching meal recipe:', error);
        }
    }
}

recipeCloseBtn.addEventListener('click', function() {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
