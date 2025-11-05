const recipeContainer = document.querySelector(".recipe-container");
const searchBtn = document.getElementById("search-btn");
const mainAPI = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// function to display the API content to the DOM
function displayMeals(mealsArray) {

   recipeContainer.innerHTML = '';

   if (mealsArray && mealsArray.length > 0) {
      mealsArray.forEach(meal => {
         const li = document.createElement("li");
         li.classList.add("recipe-card");

         const imgRecipe = document.createElement("img");
         imgRecipe.classList.add("recipe-img");
         imgRecipe.src = meal.strMealThumb;
         imgRecipe.alt = `Image of ${meal.strMealThumb}`;
         imgRecipe.onerror = () => (imgRecipe.src = "https://placehold.co/100x100/A3A3A3/FFFFFF?text=No+Image"); // Fallback

         const recipeID = document.createElement('p');
         recipeID.classList.add('recipe-id');
         recipeID.textContent = meal.idMeal;
         recipeID.style.display = 'none';

         const recipeName = document.createElement("a");
         recipeName.classList.add("recipe-name");
         recipeName.textContent = meal.strMeal;

         li.appendChild(imgRecipe);
         li.appendChild(recipeID);
         li.appendChild(recipeName);
         recipeContainer.appendChild(li);
      });
   } else {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'No recipes found for the search term.'
      recipeContainer.appendChild(errorMessage);
   }

}

// async function to display the meals
async function fetchAndDisplay(api) {
   try {
      const response = await fetch(api);

      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}. Could not fetch data.`);
      }
      const data = await response.json();
      
      displayMeals(data.meals);

   } catch(error) {
      recipeContainer.textContent = `An error occurred: ${error.message}`;
      console.error(error);
   }
}

// calling the fetchAndDisplay function to display meals upon DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
   fetchAndDisplay(mainAPI);
});

// async function when searching a meal
async function searchRecipe(e) {
   e.preventDefault();

   const searchBox = document.getElementById('search-box').value.trim().toLowerCase();

   if (searchBox === '') {
      recipeContainer.textContent = 'Please enter a meal name to search.';
      return;
   }

   // This line of code combines the api string and the searchbox value (e.g. https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBox})
   const recipeAPI = `${mainAPI}${searchBox}`;
   fetchAndDisplay(recipeAPI);
}

// calling the searchRecipe async function when searching a meal
searchBtn.addEventListener("click", searchRecipe);

// Modals
const modalOverlay = document.querySelector('.modal-container');
const closeModal = document.querySelector('.close-modal-btn');
const idMeal = document.querySelector('.id-meal');
const mealIMG = document.querySelector('.modal-img');
const mealName = document.querySelector('.modal-meal-name');

async function ingredients(listItem) {
   try {
      const mealElementID = listItem.querySelector('.recipe-id').textContent;
      const mealsID = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

      const mealURL = `${mealsID}${mealElementID}`;
      const response = await fetch(mealURL);
      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}. Could not fetch data.`);
      }
      const data = await response.json();
      const mealData = data.meals[0];
      const ingredientListContainer = document.querySelector('.modal-ingredient-container');

      ingredientListContainer.innerHTML = '';

      for (let i = 1; i <= 20; i++) {
         const ingredient = mealData[`strIngredient${i}`];
         const measure = mealData[`strMeasure${i}`];

         if (ingredient && ingredient.trim() !== '') {
            const li = document.createElement('li');
            li.textContent = `${measure} ${ingredient}`;

            ingredientListContainer.appendChild(li);
         }
      }

      const instructions = mealData['strInstructions'];
      const h2 = document.createElement('h2');
      h2.textContent = 'How to cook?';
      const p = document.createElement('p')
      p.textContent = instructions;
      ingredientListContainer.appendChild(h2);
      ingredientListContainer.appendChild(p);

   } catch (error) {
      console.error(error);
   }
}

// display meal in modal
function displayMealInModal(mealID) {
   if (mealID) {
      const recipeIDElement = mealID.querySelector('.recipe-id');
      const recipeIMGElement = mealID.querySelector('.recipe-img');
      const recipeNameElement = mealID.querySelector('.recipe-name');
   
      if (recipeIDElement && recipeIMGElement) {
         idMeal.textContent = `Meal ID: ${recipeIDElement.textContent}`;
         mealIMG.src = recipeIMGElement.src;
         mealName.innerHTML = `Meal name: <strong>${recipeNameElement.textContent}</strong`;
      }
   }
}

recipeContainer.addEventListener('click', function(e) {
   if (e.target.tagName === 'A' && e.target.classList.contains('recipe-name')) {
      e.preventDefault();
      modalOverlay.style.display = 'flex';
      
      const listItem = e.target.closest('li');
      displayMealInModal(listItem);
      ingredients(listItem);
   }
})

closeModal.addEventListener('click', function() {
   modalOverlay.style.display = 'none';
   idMeal.textContent = '';
   mealIMG.src = '';
   mealName.innerHTML = ``;
})