const recipeContainer = document.querySelector(".recipe-container");
const searchBtn = document.getElementById("search-btn");
const homePage = document.getElementById('home-content-container');
const recipeListHomePage = document.querySelector('.recipe-list');
const logo = document.getElementById('logo');
const mainAPI = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Displaying Meal
function displayMeals(mealsArray) { // function to display the API content to the DOM

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

         homePage.style.display = 'none';
         recipeListHomePage.style.display = 'block';
      });
   } else {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'No recipes found for the search term.'
      recipeContainer.appendChild(errorMessage);
   }
}

async function fetchAndDisplay(api) { // async function to display the meals
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

logo.addEventListener('click', function() {
   homePage.style.display = 'flex';
   recipeListHomePage.style.display = 'none';
   sessionStorage.setItem('meal', 'mealResultClosed');
   sessionStorage.removeItem('currentSearchedMeal');
   const searchBox = document.getElementById('search-box').value = '';

})

async function searchRecipe(e) { // async function when searching a meal
   e.preventDefault();

   const searchBox = document.getElementById('search-box').value.trim().toLowerCase();

   if (searchBox === '') {
      recipeContainer.textContent = 'Please enter a meal name to search.';
      return;
   }

   const recipeAPI = `${mainAPI}${searchBox}`; // This line of code combines the api string and the searchbox value (e.g. https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBox})
   fetchAndDisplay(recipeAPI);

   sessionStorage.setItem('meal', 'mealResult');
   sessionStorage.setItem('currentSearchedMeal', recipeAPI);
}

searchBtn.addEventListener("click", searchRecipe); // calling the searchRecipe async function when searching a meal

const hasMealSearched = sessionStorage.getItem('meal');
const savedSearchedMeal = sessionStorage.getItem('currentSearchedMeal')
if (hasMealSearched === 'mealResult' && savedSearchedMeal) {
   fetchAndDisplay(savedSearchedMeal);
}

// Modals
const modalOverlay = document.querySelector('.modal-container');
const closeModal = document.querySelector('.close-modal-btn');
const idMeal = document.querySelector('.id-meal');
const mealIMG = document.querySelector('.modal-img');
const mealName = document.querySelector('.modal-meal-name');
const ingredientListContainer = document.querySelector('.modal-ingredient-container');


async function fetchAndDisplayModal(mealID) { // This display the content to the modal
   try {
      
      const mealsID = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
      const mealUrl = `${mealsID}${mealID}`;
      const response = await fetch(mealUrl);

      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}. Could not fetch the data`);
      }

      ingredientListContainer.innerHTML = '';

      const data = await response.json();
      const mealData = data.meals[0];

      idMeal.textContent = `Meal ID: ${mealData.idMeal}`;
      mealName.innerHTML = `Meal Name: <strong>${mealData.strMeal}</strong>`
      mealIMG.src = mealData.strMealThumb;

      

      for (let i = 1; i <= 20; i++) {
         const ingredient = mealData[`strIngredient${i}`];
         const measure = mealData[`strMeasure${i}`];

         if (ingredient && ingredient.trim() !== '') {
            const li = document.createElement('li');
            li.textContent = `${measure} ${ingredient}`;

            ingredientListContainer.appendChild(li);
         }
      }

      const h2 = document.createElement('h2');
      h2.textContent = "How to cook?";
      const p = document.createElement('p');
      p.textContent = mealData.strInstructions;
      ingredientListContainer.appendChild(h2);
      ingredientListContainer.appendChild(p);

      modalOverlay.style.display = 'flex';


   } catch (error) {
      console.error(error)
   }
}

recipeContainer.addEventListener('click', function(e) {
   if (e.target.tagName === 'A' && e.target.classList.contains('recipe-name')) {
      e.preventDefault();
      const listItem = e.target.closest('li');
      const mealID = listItem.querySelector('.recipe-id').textContent;

      sessionStorage.setItem('modal', 'modalPopUp');
      sessionStorage.setItem('currentMealID', mealID);

      fetchAndDisplayModal(mealID);
   }
})

closeModal.addEventListener('click', function() {
   modalOverlay.style.display = 'none';


   sessionStorage.setItem('modal', 'modalClosed');
   sessionStorage.removeItem('currentMealID');
})

// this stores the pop up modal to the sessionStorage for it to stay open when page is refreshed
const isModalPopUp = sessionStorage.getItem('modal');
const savedMealID = sessionStorage.getItem('currentMealID');
if (isModalPopUp === 'modalPopUp' && savedMealID) {
   fetchAndDisplayModal(savedMealID);
}