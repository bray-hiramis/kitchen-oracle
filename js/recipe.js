const mainAPI = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const mealList = document.querySelector('.meal-list');

function displayMealList(meals) {
   mealList.innerHTML = '';

   if (meals && meals.length > 0) {
      meals.forEach(meal => {
         // parent li
         const li = document.createElement('li');
         li.classList.add('meal-card');

         // child items of li
         const img = document.createElement('img');
         img.src = meal.strMealThumb;
         img.alt = `Meal name: ${meal.strMeal}`;
         
         const div = document.createElement('div');
         div.classList.add('meal-info')
         const h2 = document.createElement('h2');
         h2.textContent = meal.strMeal;
         const h3 = document.createElement('h3');
         h3.textContent = 'Ingredients:';

         const ul = document.createElement('ul');
         for (let i = 1; i <= 20; i++) {
            if (h2.textContent === meal.strMeal) {
               const ingredient = meal[`strIngredient${i}`];
               const measure = meal[`strMeasure${i}`];
               const measureAndIngredient = `${measure} ${ingredient} `;
   
               if (ingredient && ingredient.trim() !== '') {
                  const ingredients = document.createElement('li');
                  ingredients.textContent = measureAndIngredient;
                  ul.appendChild(ingredients);
               }
            }
         }

         // append
         li.appendChild(img);
         li.appendChild(div);
         div.appendChild(h2);
         div.appendChild(h3);
         div.appendChild(ul);
         if (h2.textContent === meal.strMeal) {
            const howToCook = document.createElement('h3');
            howToCook.textContent = 'How to cook?';
            const p = document.createElement('p');
            p.textContent = meal.strInstructions;
            div.appendChild(howToCook);
            div.appendChild(p);
         }
         mealList.appendChild(li);
      });
   }
}

async function displayMealInContainer(api) {
   try {
      
      const response = await fetch(api);

      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}. Could not fetch data.`)
      }

      const data = await response.json();
      const mealData = data.meals;
      displayMealList(mealData);

   } catch (error) {
      mealList.textContent = `An error occurred: ${error}`
      console.error(error)
   }
}

this.document.addEventListener('DOMContentLoaded', displayMealInContainer(mainAPI));