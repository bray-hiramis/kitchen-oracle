// fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata')
//    .then(response => console.log(response))
//    .catch(error => console.error(error));

/* fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=egg')
   .then(response => response.json())
   .then(data => console.log(data.meals[1].idMeal))
   // .then(data => console.log(data))
   // .then(data => console.log(data.meals[1].strInstructions))
   // .then(data => console.log(data.meals[1].strMeasure1))
   .catch(error => console.error(error)); */

// To check if the response is OK
/* fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=asdfawe')
   .then(response => console.log(response))
   .catch(error => console.error(error)); */

fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=53065')
   .then(response => {
      if (!response.ok) {
         throw new Error('Could not fetch resource.');
      }
      return response.json();
   })
   .then(data => console.log(data.meals))
   .catch(error => console.error(error));

const obj = [
   {
      obj1: {
         child1: 'This is one',
         child2: 'This is two',
         child3: 'This is three'
      }
   },
   {
      obj2: {
         child1: 'This is obj2 one',
         child2: 'This is obj2 two',
         child3: 'This is obj2 three'
      }
   }
   
]

const childOfObj = obj[1];
console.log(childOfObj);

// Old Code:
/* document.addEventListener('DOMContentLoaded', function() {
   fetch(mainAPI)
      .then(response => {
         if (!response.ok) {
            throw new error(`Could not fetch data. Status: ${response.status}`);
         }
         return response.json();
      })
      .then(data => {
         data.meals.forEach(meal => {
            const li = document.createElement("li");
            li.classList.add("recipe-card");

            const imgRecipe = document.createElement("img");
            imgRecipe.classList.add("recipe-img");
            imgRecipe.src = meal.strMealThumb;
            imgRecipe.alt = `Image of ${meal.strMealThumb}`;
            imgRecipe.onerror = () => (imgRecipe.src = "https://placehold.co/100x100/A3A3A3/FFFFFF?text=No+Image"); // Fallback

            const recipeID = document.createElement('p');
            recipeID.classList.add('recipe-id');
            recipeID.style.display = 'none';

            const recipeName = document.createElement("a");
            recipeName.classList.add("recipe-name");
            recipeName.textContent = meal.strMeal;

            li.appendChild(imgRecipe);
            li.appendChild(recipeID);
            li.appendChild(recipeName);
            recipeContainer.appendChild(li);
         })
      })
      .catch(error => {
         recipeContainer.textContent = `An error occured: ${error.message}`;
         console.error(error);
      })
})

// Fetching API
async function fetchRecipe(e) {
   e.preventDefault();
   try {
      const searchBox = document.getElementById("search-box").value.trim().toLowerCase();

      recipeContainer.innerHTML = '';

      if (searchBox === '') {
         recipeContainer.textContent = 'Please enter a meal name to search.';
         return;
      }

      const recipeAPI = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBox}`;
      const response = await fetch(recipeAPI);

      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}. Can't fetch the API.`);
      }

      const data = await response.json();
      const mealsArray = data.meals;

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
   } catch (error) {
      recipeContainer.textContent = `An error occurred: ${error.message}`;
      console.error(error);
   }
} */

/* async function ingredients(listItem) {
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
      console.log(instructions);
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
      sessionStorage.setItem('modal', 'modalPopUp');
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
   sessionStorage.setItem('modal', 'modalClosed');
})

const isModalPopUp = sessionStorage.getItem('modal');
if (isModalPopUp === 'modalPopUp') {
   modalOverlay.style.display = 'flex';
} */