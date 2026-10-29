var searchinput = document.getElementById("searchinput");
var searchBtn = document.getElementById("searchBtn");
var rowData = document.getElementById("rowData");
var loading = document.getElementById("loader");
var alertMsg = document.getElementById("alertMsg");
var modalBody = document.querySelector(".modal-body");


function showLoading() {
  loading.classList.remove("d-none");
}



function hideLoading() {
  loading.classList.add("d-none");
}


function showError(message) {
  alertMsg.textContent = message;
  alertMsg.classList.remove("d-none");
}



function hideError() {
  alertMsg.textContent = "";
  alertMsg.classList.add("d-none");
}



async function getrecipe(meal) {

  hideError();
  showLoading();

  try {

    var response = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${meal}`)

    if (!response.ok) {

      throw new Error("Request Failed");
    }

    var data = await response.json()

    displaydata(data.recipes)

  } catch (error) {

    showError("حدث خطأ أثناء تحميل الوصفات");

  } finally {

    hideLoading()
  }

}

function displaydata(recipes) {
  var cartona = "";

  for (var i = 0; i < recipes.length; i++) {
    cartona += `
          <div class="col-md-4">
              <div class="card h-100">

                  <img
                      src="${recipes[i].image_url}"
                      class="card-img-top recipe-image myimage"
                      alt="${recipes[i].title}"
                  >

                  <div class="card-body">
                      <h5 class="card-title">
                          ${recipes[i].title}
                      </h5>

                      <p class="card-text">
                          Publisher: ${recipes[i].publisher}
                      </p>

                      <button
                          class="btn btn-info text-white"
                          onclick="showDetails('${recipes[i].recipe_id}')"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                      >
                          Show Details
                      </button>
                  </div>

              </div>
          </div>
      `;
  }

  document.getElementById("rowdata").innerHTML = cartona
}



async function showDetails(recipeId) {
  showLoading();

  try {
    var response = await fetch(
      `https://forkify-api.herokuapp.com/api/get?rId=${recipeId}`
    );

    if (!response.ok) {
      throw new Error("Details Request Failed");
    }

    var data = await response.json();
    var recipe = data.recipe;

    modalBody.innerHTML = `
          <img
              src="${recipe.image_url}"
              class="w-100 mb-3"
              alt="${recipe.title}"
          >

          <h3>${recipe.title}</h3>

          <p>
              <strong>Publisher:</strong>
              ${recipe.publisher}
          </p>

          <a
              href="${recipe.source_url}"
              target="_blank"
              class="btn btn-primary"
          >
              View Recipe
          </a>
      `;

  } catch (error) {

    modalBody.innerHTML = `
          <p class="text-danger">
              حدث خطأ أثناء تحميل تفاصيل الوصفة
          </p>
      `;
  } finally {
    hideLoading();
  }
}

searchBtn.addEventListener("click", function () {
  var meal = searchinput.value.trim();

  if (meal === "") {
    showError("اكتب اسم الوصفة أولًا");
    return;
  }

  getrecipe(meal);
});


// البحث عند الضغط على Enter
searchinput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

getrecipe("pizza")