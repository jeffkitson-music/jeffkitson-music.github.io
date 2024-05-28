const roller = document.getElementById("roller");
const random_P = document.getElementById("random_P");
const randomNsection = document.getElementById("randomNsection");
const header = document.getElementById("header");
const Numbers = ["d6", "d10", "d20"];
const dynamic1 = document.getElementById("dynamic1");
const dynamic2 = document.getElementById("dynamic2");

roller.addEventListener("click", () => {
  // Disable pointer events
  roller.style.pointerEvents = "none";
  randomNsection.style.display = "none";
  // Add class for faster spinning
  roller.classList.add("spin-fast");
  let randomNumber = Math.floor(Math.random() * 6) + 1; // plus one ensures no zero...this will need its own function for larger dice, etc. 
  var sides = document.getElementsByClassName("face")
  for (let i = 0; i < sides.length; i++) {
    if(randomNumber == 6 || randomNumber == 9){
      sides[i].innerHTML = `<u>${randomNumber.toString()}</u>`; // to distinguish between 6 and 9, underline it! 
    }
    else {
      sides[i].innerHTML = randomNumber.toString();  
    }
    
  }
  setTimeout(() => {
    // Remove class and re-enable pointer events after 2 seconds
    roller.classList.remove("spin-fast");
    roller.style.pointerEvents = "auto";
    randomNsection.style.display = "block";
    random_P.innerHTML = randomNumber.toString(); //Numbers[randomNumber];
  }, 2000);
});
window.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    header.classList.add("shadow-sm", "shadow-[#C0C0C0]");
  } else {
    header.classList.remove("shadow-sm", "shadow-[#C0C0C0]");
  }
});
document.getElementById("button1").addEventListener("click", function () {
  dynamic2.classList.add("hidden");
  dynamic1.classList.remove("hidden");
  document.getElementById("dynamic-image").src =
    "../public/images/rowing-boat-6617758_1920.png";
});

document.getElementById("button2").addEventListener("click", function () {
  dynamic2.classList.add("hidden");
  dynamic1.classList.remove("hidden");
  document.getElementById("dynamic-image").src =
    "../public/images/boat-5889919_1920.png";
});
document.getElementById("button3").addEventListener("click", function () {
  dynamic1.classList.add("hidden");
  dynamic2.classList.remove("hidden");
});
