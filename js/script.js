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
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close-modal-btn');

async function fetchAndDisplayModal(mealID) { // This display the content to the modal
   try {
      
      const mealsID = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
      const mealUrl = `${mealsID}${mealID}`;
      const response = await fetch(mealUrl);
      console.log(mealUrl);

      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}. Could not fetch the data`);
      }

      const data = await response.json();
      const mealData = data.meals[0];

      /* What's inside the modalContent
      div class modal-left modal-img modal-favorite-btn
         img
         button
      end of div

      div class modal-right modal-recipes
         p for meal-id
         p for meal-name
         h2 for "Ingredients"
         ul for ingredients list
            li for individual measure and ingredient
         end of ul
         h2 for "How to cook?"
         p for steps to cook
      end of div

      append all to modalContent
      */
      

      // Left Div
      const divLeft = document.createElement('div');
      divLeft.classList.add('modal-left');
      const modalImg = document.createElement('img');
      modalImg.classList.add('modal-img')
      const modalAddToFavoriteBtn = document.createElement('button');
      modalAddToFavoriteBtn.classList.add('add-to-favorites-btn')

      modalImg.src = mealData.strMealThumb;
      modalImg.alt = mealData.strMeal;
      modalAddToFavoriteBtn.type = 'submit';
      modalAddToFavoriteBtn.textContent = 'Add to Favorites';

      // Right Div
      const divRight = document.createElement('div');
      divRight.classList.add('modal-right');
      const modalMealID = document.createElement('p');
      modalMealID.classList.add('meal-id');
      modalMealID.innerHTML = `Meal ID: <strong>${mealData.idMeal}</strong>`;
      const mealName = document.createElement('p');
      mealName.classList.add('meal-name');
      mealName.innerHTML = `Meal Name: <strong>${mealData.strMeal}</strong>`;
      const headingIngredients = document.createElement('h2');
      headingIngredients.textContent = 'Ingredients:';

      const IngredientsContainer = document.createElement('ul');
      IngredientsContainer.classList.add('ingredients-container');
      for (let i = 1; i <= 20; i++) {
         const measure = mealData[`strMeasure${i}`];
         const ingredient = mealData[`strIngredient${i}`];
         if (ingredient && ingredient.trim() !== "") {
               const measureAndIngredientsContainer = document.createElement("li");
               measureAndIngredientsContainer.classList.add('measure-and-ingredient')
               measureAndIngredientsContainer.textContent = `${measure} ${ingredient}`;
               IngredientsContainer.appendChild(measureAndIngredientsContainer);
         }
      }

      const headingHowToCook = document.createElement('h2');
      headingHowToCook.textContent = 'How to cook?';
      const steps = document.createElement('p');
      steps.textContent = mealData.strInstructions;
      
      // append
      divLeft.appendChild(modalImg);
      divLeft.appendChild(modalAddToFavoriteBtn);

      divRight.appendChild(modalMealID);
      divRight.appendChild(mealName);
      divRight.appendChild(headingIngredients);
      divRight.appendChild(IngredientsContainer);
      divRight.appendChild(headingHowToCook);
      divRight.appendChild(steps);

      modalContent.appendChild(divLeft);
      modalContent.appendChild(divRight);

      // displaying the modal
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

   sessionStorage.removeItem('modal');
   sessionStorage.removeItem('currentMealID');
})

// this stores the pop up modal to the sessionStorage for it to stay open when page is refreshed
const isModalPopUp = sessionStorage.getItem('modal');
const savedMealID = sessionStorage.getItem('currentMealID');
if (isModalPopUp === 'modalPopUp' && savedMealID) {
   fetchAndDisplayModal(savedMealID);
}