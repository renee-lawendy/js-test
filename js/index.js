$(document).ready(function () {
    // ----------------loader js
    function removeLoader() {
        $(".loader").addClass("d-none");
        $("body").css("overFlow", "auto");
    }
    function addLoader() {
        $(".loader").removeClass("d-none");
        $("body").css("overFlow", "hidden");
    }
addLoader()
    // removeLoader();
    // ----------- side bar js
    let navWidth = $(".nav-tab-link").innerWidth();
    $(".side-nav").css("left", -navWidth);
    function openSideNav() {
        $(".open-close-icon").removeClass("fa-align-justify");
        $(".open-close-icon").addClass("fa-x");
        $(".side-nav").animate({ left: "0px" }, 500);
        let time = 500;
        for (let i = 0; i < 5; i++) {
            $(".links li")
                .eq(i)
                .animate({ top: "0px" }, (time += 100));
        }
    }
    function closeNav() {
        $(".open-close-icon").removeClass("fa-x");
        $(".open-close-icon").addClass("fa-align-justify");
        $(".side-nav").animate({ left: -navWidth }, 500, function () {
            for (let i = 0; i < 5; i++) {
                $(".links li").eq(i).animate({ top: "200px" });
            }
        });
    }
    $(".open-close-icon").click(function () {
        if ($(".side-nav").css("left") == "0px") {
          
            closeNav();
        } else {
            openSideNav();
        }
    });
    let displayContainer = $("#allData");
    //    ------------- fetching home api
    async function HomeApi(name) {
        let api = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
        );

        let response = await api.json();
        let result = response.meals;
        displayAllData(result);
        removeLoader();
    }
    //    ---------------general setUp
    HomeApi(" ");
    $(".search").fadeOut(100);
    // -------------------- end general setUp

    function displayAllData(response) {
        let element = "";
        response.forEach((el) => {
            element += ` <div class="col-md-3">
                  <div id-food=${el.idMeal} class="position-relative overflow-hidden rounded-2 cursor-pointer meal-container">
                    <img src=${el.strMealThumb} class="w-100" alt="">
                    <div class="position-absolute  d-flex align-items-center top-0 start-0 end-0 bottom-0 text-black food-layer p-2 ">
                      <h3>${el.strMeal}</h3>
                    </div>
                  </div>
                </div>`;
        });
        displayContainer.html(element);
        getID();
    }

    function getID() {
        $(".meal-container").click(function (e) {
            addLoader();
            let idValue = $(this).attr("id-food");
            getInstruction(idValue);
          
            return idValue;
        });
    }
    // ---------------------detailed meal

    async function getInstruction(id) {
        let api = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        let response = await api.json();
        let result = response.meals[0];
        displayInstruction(result);
        removeLoader();
    }

    function displayInstruction(response) {
        $(".search").html("");
        let list = ``;
        for (let i = 1; i <= 20; i++) {
            let measure = `strMeasure${i}`;
            let ingredient = `strIngredient${i}`;
            if (response[measure] && response[ingredient]) {
                list += `<li class="alert alert-info m-2 p-1">${response[measure]} ${response[ingredient]}</li>`;
            }
        }
        let tags = ``;
        if (response.strTags != null) {
            let tagsArray = response.strTags.split(",");
            for (let i = 0; i < tagsArray.length; i++) {
                tags += `<li class="alert alert-danger m-2 p-1">${tagsArray[i]}</li>`;
            }
        }
        let element = `<div class="col-md-4"><img class="rounded-2 w-100 mb-2" src=${response.strMealThumb} alt="">
        <h2>${response.strMeal}</h2>
      </div>
      <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${response.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${response.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${response.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex flex-wrap ingredient">
        ${list}
          
        </ul>
         <h3>Tags :</h3>
         <ul class="list-unstyled d-flex flex-wrap">${tags}</ul>
         <a href=${response.strSource} target="_blank" class="btn btn-success">Source</a>
         <a href="${response.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
      
      </div>`;

        displayContainer.html(element);
    }
    //   ------------ navigation between links  --------------------
    $(".links li").click(function (e) {
        closeNav();
        
        if ($(e.target).html() == "Search") {
            displayContainer.slideUp(100, function () {
                $(".search").fadeIn(100);

            });
            displaySearch();
        }
        if ($(e.target).html() == "Categories") {
            
            addLoader();
            displayContainer.fadeIn(300);
            $(".search").html(" ");
            
           
            getCategory();
        }
        if ($(e.target).html() == "Area") {
            
            displayContainer.fadeIn(300);
            $(".search").html(" ");
            
           
            addLoader();
            getArea();
        }
        if ($(e.target).html() == "Ingredients") {
            $(".search").html(" ");
            displayContainer.fadeIn(300);
            addLoader();

            getIngredients();
        }
        if ($(e.target).html() == "Contact Us") {

            displayContainer.html(" ");
            $(".search").html(" ");


            contactInfo();
        }
       
    });
    // ---------------------------search section ---------
    function displaySearch() {
        let element = `<div class="container">
          <div class="row py-4 " data-dashlane-rid="48d4a2a12da54a89" data-form-type="other">
            <div class="col-md-6 ">
              <input class="form-control bg-transparent text-white byName" type="text" placeholder="Search By Name"
                data-dashlane-rid="23dd49de754824be" data-form-type="other">
            </div>
            <div class="col-md-6">
              <input maxlength="1" class="form-control bg-transparent text-white byLetter" type="text"
                placeholder="Search By First Letter" data-dashlane-rid="cacab8a1673b359c" data-form-type="other">
            </div>
          </div>
        </div>`;
       
        $(".search").html(element);
        $(".byName").keyup(function (e) {
            displayContainer.fadeIn(300);
            let byNameValue = $(e.target).val();
            if (byNameValue != "") {
                addLoader();
                HomeApi(byNameValue);
            }
        });
        $(".byLetter").keyup(function (e) {
            displayContainer.fadeIn(300);
            let byletterValue = $(e.target).val();
            
            if (byletterValue != "") {
                addLoader();
                firstLetter(byletterValue);
            }
        });
        
    }
    async function firstLetter(letter) {
        let api = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
        );
       
        let response = await api.json();
        let result = response.meals;
        result.length=20
        displayAllData(result);
        removeLoader();
    }
    // ------------------ category section ------
    async function getCategory() {
        let api = await fetch(
            "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        let response = await api.json();
        let result = response.categories;
        displayCategory(result);
        removeLoader();
    }
    
    function displayCategory(response) {
        let element = ``;
        response.forEach((el) => {
            let elementArr = el.strCategoryDescription.split(" ");
            elementArr.length = 20;
            el.strCategoryDescription = elementArr.join(" ");
            element += `<div class="col-md-3">
        <div cat-name=${el.strCategory} class="meal-name position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src=${el.strCategoryThumb} alt="" srcset="">
          <div class="position-absolute  text-center top-0 start-0 end-0 bottom-0 text-black food-layer p-2">
            <h3>${el.strCategory}</h3>
            <p>${el.strCategoryDescription}</p>
          </div>
        </div>
      </div>`;
        });
        displayContainer.html(element);
        getCatName();
    }
    function getCatName() {
        $(".meal-name").click(function () {
            addLoader();
            let idName = $(this).attr("cat-name");

            filterByCatApi(idName);
        });
    }

    async function filterByCatApi(name) {
        let api = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`
        );
        let response = await api.json();
        let result = response.meals;
        result.length = 20;
        displayAllData(result);
        removeLoader();
    }
    // ------------------- area ----------------------
    async function getArea() {
        let api = await fetch(
            "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
        );
        let response = await api.json();
        let result = response.meals;
        displayArea(result);
        removeLoader();
    }
    function displayArea(response) {
        let element = ``;
        response.forEach(function (el) {
            element += `     <div class="col-md-3">
        <div area-name=${el.strArea} class="text-center cursor-pointer meal-area">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3>${el.strArea}</h3>
        </div>
      </div>`;
        });
        displayContainer.html(element);
        getAreaName();
    }
    function getAreaName() {
        $(".meal-area").click(function () {
            addLoader();
            let idName = $(this).attr("area-name");
            filterAreaApi(idName);
        });
    }
    async function filterAreaApi(name) {
        let api = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`
        );
        let response = await api.json();
        let result = response.meals;
        result.length = 20;
        displayAllData(result);
        removeLoader();
    }
    //   ------------------------get ingredients ---------
    async function getIngredients() {
        let api = await fetch(
            `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
        );
        let response = await api.json();
        let result = response.meals;
        result.length = 20;
        displayIngredient(result);
        removeLoader();
    }
    function displayIngredient(response) {
        let element = ``;
        response.forEach(function (el) {
            let ingredientDescArr = el.strDescription.split(" ");
            ingredientDescArr.length = 20;
            el.strDescription = ingredientDescArr.join(" ");
            element += ` <div class="col-md-3">
        <div ing-id=${el.strIngredient} class="text-center cursor-pointer ing-name">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${el.strIngredient}</h3>
          <p>${el.strDescription}</p>
        </div>
      </div>`;
        });
        displayContainer.html(element);
        getIngredName();
    }
    function getIngredName() {
        $(".ing-name").click(function (e) {
            addLoader();
            let idName = $(this).children("h3").html();
           
            filterByIng(idName);
           
        });
    }
    async function filterByIng(name) {
        let api = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`
        );
        let response = await api.json();
        
        let result = response.meals;
        result.length=20
        displayAllData(result);
        removeLoader();
        
    }
    //   ====================contact section =================
    function contactInfo() {
        let element = `<div class="contact ">
        <div class="container w-75 text-center">
          <div class="row g-4">
            <div class="col-md-6">
              <input id="nameInput"  type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                Special characters and numbers not allowed
              </div>
            </div>
            <div class="col-md-6">
              <input id="emailInput"  type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                Email not valid *exemple@yyy.zzz
              </div>
            </div>
            <div class="col-md-6">
              <input id="phoneInput"  type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                Enter valid Phone Number
              </div>
            </div>
            <div class="col-md-6">
              <input id="ageInput"  type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                Enter valid age (from 12-100)
              </div>
            </div>
            <div class="col-md-6">
              <input id="passwordInput"  type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
            </div>
            <div class="col-md-6">
              <input id="repasswordInput"   type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                Enter valid repassword
              </div>
            </div>
          </div>
          <button id="submitBtn" disabled="" class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
      </div>`;
        displayContainer.html(element);
    
      $(".form-control").keyup(function(){
        
        onChange()
      })
    

      function onChange(){
          if (
            inputValidation(nameregex, "#nameInput", "nameAlert") &&
            inputValidation(mailregex, "#emailInput", "emailAlert") &&
            inputValidation(phoneregex, "#phoneInput", "phoneAlert") &&
            inputValidation(/^(1[2-9]|[2-9]\d)$/, "#ageInput", "ageAlert") &&
            inputValidation(passregex, "#passwordInput", "passwordAlert") &&
              repeatPassword()
          ) {
            document.getElementById("submitBtn").removeAttribute("disabled");
            return true;
          } else {
            document.getElementById("submitBtn").setAttribute("disabled", true);
            return false;
          }
      } 

    }
    let nameregex = /^[A-Za-z][a-z]{2,20}(\s[A-Za-z][a-z]{2,20})?$/;
    let mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let phoneregex =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    let passregex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;



 function inputValidation(regExp, input, alert) {
   let inputForm = $(input)
     let formInput = inputForm.val();
     let regExptest = regExp;
   if(formInput!=""){
      if (regExptest.test(formInput)) {
           document.getElementById(alert).classList.replace("d-block", "d-none");

        return true;
      } else {
           document.getElementById(alert).classList.replace("d-none", "d-block");
        return false;
      }
   }
   ;
 }
 function repeatPassword() {
   if($("#repasswordInput").val()!=""){

       if ($("#passwordInput").val() == $("#repasswordInput").val()) {
         document
           .getElementById("repasswordAlert")
           .classList.replace("d-block", "d-none");
        
         return true;
       } else {
         document
           .getElementById("repasswordAlert")
           .classList.replace("d-none", "d-block");
         return false;
       }
   }
   
 }
});
