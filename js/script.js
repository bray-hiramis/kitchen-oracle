const recipeContainer = document.querySelector(".recipe-container");
const searchBtn = document.getElementById("search-btn");

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

            const recipeName = document.createElement("p");
            recipeName.classList.add("recipe-name");
            recipeName.textContent = meal.strMeal;

            li.appendChild(imgRecipe);
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
}

searchBtn.addEventListener("click", fetchRecipe);
