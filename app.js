const searchResultId = document.getElementById('search-result');
const allMealShow = document.getElementById('modal');
const ShowCategory = document.getElementById('show-category');
const searchText = document.getElementById('name');
const spinner = `
<div class="container text-center">
    <div class="spinner-border" role="status" id = "spin">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
`;
let inputValue;
const message = document.getElementById('erorr-message');
document.getElementById('not-found').style.display = 'none';
// add category spinner 
document.getElementById('spiner').style.display = "none";
document.getElementById('welcome').style.display = "none";
// category  show function
const loadCategory = async () => {
    document.getElementById('spiner').style.display = "block";
    document.getElementById('welcome').style.display = "block";
    const url = `https://www.themealdb.com/api/json/v1/1/categories.php`;
    const res = await fetch(url);
    const data = await res.json();
    displayCategory(data.categories)
}
// displayCategory 
const displayCategory = (categories) => {
    const categoryContainer = ShowCategory;
    categories.forEach(category => {
    const div = document.createElement('div');
    div.classList.add('col');
    div.innerHTML = `
        <div class="card h-100">
            <img src="${category.strCategoryThumb}" class="card-img-top p-1" alt="${category.strCategory}">
            <div class="card-body">
                <h5 class="card-title">${category.strCategory}</h5>
            </div>
            <div class = "card-footer text-center"><button onclick = "loadCategoryFood('${category.strCategory}')" class = "btn btn-outline-success">See Categories</button></div>
        </div>`; 
        categoryContainer.appendChild(div);
        document.getElementById('spiner').style.display = "none";      
        document.getElementById('welcome').style.display = "none";      
    });
}
// see category food 
const loadCategoryFood = async (strCategory) => {
    document.getElementById('spiner').style.display = "block";
    ShowCategory.textContent = "";
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`;
    const res = await fetch(url);
    const data = await res.json();
    displayReasult(data.meals);
}
loadCategory()
// search food 
const searchFood = async () => {
    const inputField = searchText;
    message.innerHTML = "";
    searchResultId.textContent = "";
    const searchResult = inputField.value;
    inputField.value = "";
    ShowCategory.textContent = "";
    document.getElementById('not-found').style.display = 'none';
    if (searchResult == "") {
       message.innerHTML = `<div class=" w-100 mx-auto alert alert-danger alert-dismissible fade show" role="alert">Please Enter Food Name.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>` 
    }
    else{
        searchResultId.innerHTML = spinner;
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchResult}`;
        inputValue = searchResult;
        // fetch(url)
        try{
            const res = await fetch(url);
            const data = await res.json();
            displayReasult(data.meals)
        }
        // .then(res => res.json())
        // .then(data => displayReasult(data.meals))
        // .catch(error => displayerror(error));
        catch{
            searchResultId.innerHTML = spinner;
            document.getElementById('not-found').style.display = 'block';
            const message = document.getElementById('not-found');
            message.innerHTML = `<div class=" w-100 mx-auto alert alert-danger alert-dismissible fade show" role="alert">
        <strong>${inputValue}!</strong> Search Result Food Not Found.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        document.getElementById('spin').style.display = "none";
        }
    }
}
// const displayerror = error => {
//     document.getElementById('not-found').style.display = 'block';
//     const message = document.getElementById('not-found');
//        message.innerHTML = `<div class=" w-100 mx-auto alert alert-danger alert-dismissible fade show" role="alert">
//   <strong>Hello 3rd Person!</strong> Search Result Product Not Found.
//   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
// </div>`;
// }
const displayReasult = meals => {
    const searchResultId = document.getElementById('search-result');
    searchResultId.textContent = "";
    message.textContent = "";
    meals.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
        <div class="card h-100">
            <img src="${meal.strMealThumb}" class="card-img-top p-1" alt="${meal.strMeal}">
            <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
            </div>
            <div class="card-footer">
                <div class="d-flex flex-column flex-md-row justify-content-between">
                    <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick = "loadFoodDetails(${meal.idMeal})">See details</button>
                    <div onclick="addToCart(${meal.idMeal})" class="btn btn-outline-success">Add to cart</div>
                </div>
            </div>
        </div>
        `;
        searchResultId.appendChild(div);
        document.getElementById('spiner').style.display = "none";
    });
}
const loadFoodDetails = async mealId => {
    allMealShow.innerHTML = spinner;
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayMealDetails(data.meals[0]);
    // .then(res => res.json())
    // .then(data => displayMealDetails(data.meals[0]))
}
const displayMealDetails = (meal) => {
    const allMealShow = document.getElementById('modal');
    allMealShow.textContent = "";
    allMealShow.innerHTML = `<div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${meal.strMeal}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <h2>Name: ${meal.strMeal}</h2> <h4>Area: ${meal.strArea}</h4> <h5>Category: ${meal.strCategory}</h5> <img width = 100% src = "${meal.strMealThumb}"> <p>Instruction: ${meal.strInstructions.slice(0,250)}</p> <a href = "${meal.strSource}">Source: ${meal.strMeal}</a> <br> <a href = "${meal.strYoutube}">Youtube: ${meal.strMeal}</a> <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
                        Close
                    </button>
                    <button onclick="addToCart(${meal.idMeal})" class="btn btn-outline-success">
                        Add to cart
                    </button>

                </div>`
}
// add to cart info 
const addToCart = async (mealId) => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const res = await fetch(url);
    const data = await res.json();
    const { strMealThumb, strMeal } = data.meals[0];
    document.getElementById("cart-add-info").style.display = "block";
        let isFound = false;
    const cart = document.getElementById("cart-items");
    for (let item of cart.querySelectorAll(".cart-item")) {
      const itemId = parseInt(item.querySelector(".meal-id").innerText);

      if (itemId === mealId) {
        let quantity = parseInt(item.querySelector(".meal-quantity").innerText);
        item.querySelector(".meal-quantity").innerText = quantity + 1;
        isFound = true;
      }
    }
    if (!isFound) {
        const cart = document.getElementById("cart-items");
        cart.innerHTML += `
      <div class="cart-item card py-2 px-4 mb-3" style="max-width: 540px">
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    src="${strMealThumb}"
                    class="img-fluid rounded-circle"
                    alt=""
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body ms-4">
                    <h5 class="meal-title card-title">${strMeal}</h5>
                    <h5 class="meal-id visually-hidden">${mealId}</h5>
                    <p class="card-text">
                      <small class="text-success fw-bolder fs-5"
                        >Quantity: <span class="meal-quantity">1</span></small
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
      `;
    }
    setTimeout(() => {
    document.getElementById("cart-add-info").style.display = "none";
  }, 2000);
}