document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('page-select').addEventListener('change', function() {
    if (this.value) {
      window.location.href = this.value;
    }
});
});

document.addEventListener("DOMContentLoaded", function() {
  const text = document.getElementById("hero-text");
  text.innerHTML = text.textContent.split("").map(char => 
    char === " " ? " " : `<span style="display:inline-block">${char}</span>`
  ).join("");

  gsap.from("#hero-text span", {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.03,
    ease: "power2.out"
  });
});
