const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const mealContainer = document.getElementById("mealContainer");

// Fetch recipes from the MealDB API
async function fetchMeals(query) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.meals;
}

// Display meals in the container
function displayMeals(meals) {
  mealContainer.innerHTML = "";

  if (!meals) {
    mealContainer.innerHTML = "<p>No recipes found. Try again!</p>";
    return;
  }

  meals.forEach(meal => {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("meal");

    mealDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <button onclick="viewRecipe('${meal.idMeal}')">View Recipe</button>
    `;

    mealContainer.appendChild(mealDiv);
  });
}

// View Recipe details in popup
async function viewRecipe(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const res = await fetch(url);
  const data = await res.json();
  const meal = data.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
  }

  const recipeDetails = `
    <div class="recipe-popup">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>Ingredients:</h3>
      <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
      <a href="${meal.strYoutube}" target="_blank">Watch Video 🎥</a><br><br>
      <button onclick="closePopup()">Close</button>
    </div>
  `;

  const popup = document.createElement("div");
  popup.classList.add("popup-overlay");
  popup.innerHTML = recipeDetails;
  document.body.appendChild(popup);
}

function closePopup() {
  document.querySelector(".popup-overlay").remove();
}

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (query) {
    const meals = await fetchMeals(query);
    displayMeals(meals);
  }
});
