// Global Variables
let prevScrollPos = window.pageYOffset;
const isMobileDevice = window.innerWidth <= 590;

// POPUP
document.addEventListener("DOMContentLoaded", function () {
  // Check if the popup has already been submitted
  const popupSubmitted = localStorage.getItem("popupSubmitted");

  if (!popupSubmitted) {
    // Show popup after 15 seconds
    setTimeout(function () {
      document.getElementById("popup").style.display = "flex";
      document.getElementById("backdrop").style.display = "block";
      toggleScroll();
    }, 15000);
  }

  // Close popup when clicking the "X" button
  document.getElementById("close-popup").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
    document.getElementById("backdrop").style.display = "none";
    toggleScroll();
  });

  const form = document.getElementById("ZenHire-website-booklet-form");
  const popupButtonText = document.getElementById("popup-button-text");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email-input").value;
    // Show loading spinner
    popupButtonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const portalId = "27164158";
    const formId = "8eda57fd-da02-494a-a4ef-ef4aa3f43cd1";
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    const data = {
      fields: [
        {
          name: "email",
          value: email,
        },
      ],
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw err;
        }
        return response.json();
      })
      .then((data) => {
        // Show success message with checkmark
        popupButtonText.innerHTML = 'Success <i class="fas fa-check"></i>';
        document.getElementById("email-input").value = "";
        // Set flag in local storage
        localStorage.setItem("popupSubmitted", "true");
        // Close popup and revert back to original text after 1.5 seconds
        setTimeout(() => {
          document.getElementById("popup").style.display = "none";
          document.getElementById("backdrop").style.display = "none";
          popupButtonText.innerHTML = "Get your booklet";
        }, 1500);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  });
});

const updateHeaderPosition = () => {
  const currentScrollPos = window.pageYOffset;
  const mainHeader = document.getElementById("main-header");
  const floatingImg = document.getElementById("floating-img");
  if (!nav.classList.contains("active")) {
    mainHeader.style.top =
      prevScrollPos > currentScrollPos || currentScrollPos <= 0
        ? "0"
        : "-100px";
  }

  // Check if the element exists
  if (floatingImg) {
    floatingImg.style.display = currentScrollPos > 0 ? "block" : "none";
  }

  prevScrollPos = currentScrollPos;
};

// Smooth Scrolling Functionality
const smoothScroll = (target, duration) => {
  const targetPosition = target.offsetTop;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

function toggleScroll() {
  if (document.body.style.overflow !== "hidden") {
    document.body.style.overflow = "hidden"; // Disable scrolling
  } else {
    document.body.style.overflow = ""; // Enable scrolling
  }
}

// function adjustMenuHeight() {
//   const viewportHeight = window.innerHeight;
//   nav.style.maxHeight = `${viewportHeight}px`;
// }

document.addEventListener("DOMContentLoaded", () => {
  // Menu and Overlay Functionality
  const menuBtn = document.getElementById("menu-btn");
  const lineIcons = document.getElementById("hamburger-menu");
  const imageIcon = document.getElementById("image-icon");
  const nav = document.getElementById("nav");
  const overlay = document.getElementById("overlay");
  // const logo = document.getElementById("main-header-logo");
  const toggleMenu = () => {
    if (nav.classList.contains("active")) {
      removeActiveClass();
      // setTimeout(() => {
      //   logo.classList.add("showLogo");
      //   logo.classList.remove("hideLogo");
      // }, 320);
      toggleScroll();
    } else {
      // adjustMenuHeight();
      nav.classList.add("active");
      overlay.classList.add("active");
      // Add rotation after the element is visible
      // logo.classList.add("hideLogo");
      // logo.classList.remove("showLogo");
      // Hide lines, show image
      lineIcons.classList.add("hidden");
      lineIcons.classList.remove("visible");
      imageIcon.classList.add("visible");
      imageIcon.classList.remove("hidden");
      toggleScroll();
      setTimeout(() => {
        // Add rotation after the element is visible
        imageIcon.classList.add("rotate");
        imageIcon.classList.remove("reverse-rotate"); // Make sure to remove the reverse rotation
      }, 0);
    }
  };

  const removeActiveClass = () => {
    // Add reverse rotation first
    imageIcon.classList.add("reverse-rotate");
    imageIcon.classList.remove("rotate"); // Remove the forward rotation

    setTimeout(() => {
      // Then hide elements after rotation is removed
      nav.classList.remove("active");
      overlay.classList.remove("active");

      // Show lines, hide image
      lineIcons.classList.add("visible");
      lineIcons.classList.remove("hidden");
      imageIcon.classList.add("hidden");
      imageIcon.classList.remove("visible");
      // logo.classList.add("showLogo"); // Ensure logo is always shown when menu is closed
      // logo.classList.remove("hideLogo");
    }, 100); // Adjust timing as per your CSS transition
  };

  menuBtn.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", () => {
    removeActiveClass();
    toggleScroll(); // Ensure scroll is enabled when overlay is clicked
  });

  // Navigation Links Functionality
  const navLinks = document.querySelectorAll("#nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.removeEventListener("scroll", updateHeaderPosition);

      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        smoothScroll(targetElement, 600);
      }
      toggleScroll();
      removeActiveClass();
      setTimeout(() => {
        window.addEventListener("scroll", updateHeaderPosition);
      }, 600);
    });
  });

  // Floating Image Functionality
  const floatingImg = document.getElementById("floating-img");

  if (floatingImg) {
    floatingImg.addEventListener("click", function () {
      const topOfPage = document.documentElement;
      smoothScroll(topOfPage, 300);
    });
  }
});

// Scroll Event
window.addEventListener("scroll", updateHeaderPosition);

let slides = document.getElementsByClassName("slider-content");

let slideIndex = 1;
showSlides(slideIndex, "next");

function plusSlides(n) {
  if (Math.sign(n) === 1) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("slide-in-left");
      slides[i].classList.remove("slide-out-right");
      if (i === slideIndex - 1) {
        slides[slideIndex - 1].classList.add("slide-out-left");
      } else {
        slides[i].classList.remove("slide-out-left");
      }
    }
    showSlides((slideIndex += n), "next");
  }

  if (Math.sign(n) === -1) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("slide-in-right");
      slides[i].classList.remove("slide-out-left");
      if (i === slideIndex - 1) {
        slides[slideIndex - 1].classList.add("slide-out-right");
      } else {
        slides[i].classList.remove("slide-out-right");
      }
    }
    showSlides((slideIndex += n), "prev");
  }
}

function currentSlide(n) {
  // Remove the 'active' class from all buttons
  document
    .querySelectorAll(".slide-btn")
    .forEach((btn) => btn.classList.remove("active"));

  // Add 'active' class to the button that corresponds to the current slide
  document.querySelector(`[data-slide="${n}"]`).classList.add("active");

  if (n > slideIndex) {
    showSlides((slideIndex = n), "next");
  } else if (n < slideIndex) {
    showSlides((slideIndex = n), "prev");
  } else {
    showSlides((slideIndex = n));
  }
}

function showSlides(n, direction) {
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  if (direction === "next") {
    setTimeout(() => {
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("slide-in-right");
      }

      slides[slideIndex - 1].style.display = "flex";
      slides[slideIndex - 1].classList.add("slide-in-right");
    }, 150);
  }

  if (direction === "prev") {
    setTimeout(() => {
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("slide-in-left");
      }

      slides[slideIndex - 1].style.display = "flex";
      slides[slideIndex - 1].classList.add("slide-in-left");
    }, 150);
  }

  if (direction === undefined) {
    setTimeout(() => {
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("slide-in-left");
      }

      slides[slideIndex - 1].style.display = "flex";
      slides[slideIndex - 1].classList.add("slide-in-left");
    }, 150);
  }

  document
    .querySelectorAll(".slide-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`[data-slide="${slideIndex}"]`)
    .classList.add("active");
}

//TOUCH SCREEN SLIDE CONTROLS:
let startX = 0;
let endX = 0;

// Add touch event listeners to the slider wrapper
const sliderWrapper = document.querySelector(".slider-wrapper");
sliderWrapper.addEventListener("touchstart", touchStart);
sliderWrapper.addEventListener("touchmove", touchMove);
sliderWrapper.addEventListener("touchend", touchEnd);

function touchStart(event) {
  startX = event.touches[0].clientX;
}

function touchMove(event) {
  endX = event.touches[0].clientX;
}

function touchEnd() {
  // Calculate distance swiped
  let swipeDistance = startX - endX;
  //threshold for the swipe distance
  let threshold = 100;

  if (swipeDistance > threshold) {
    // Swipe to the left, go to the next slide
    plusSlides(1);
  } else if (swipeDistance < -threshold) {
    // Swipe to the right, go to the previous slide
    plusSlides(-1);
  }
}

// DOM
let productBtns = document.querySelectorAll(".product-btn");
let productContent = document.getElementsByClassName("product-content-item");
let productContentMobile = document.getElementsByClassName(
  "product-content-img-wrapper"
);
let myVideo = document.getElementById("deep-fake-video");

function onBtnClickChangeProductPhoto() {
  productBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      activeProductBtn(e.target);
      if (myVideo) {
        myVideo.pause();
        myVideo.currentTime = 0;
      }
      // Desktop
      if (window.innerWidth > 650) {
        for (let i = 0; i < productContent.length; i++) {
          if (index == i) {
            productContent[i].style.display = "flex";
          } else {
            productContent[i].style.display = "none";
          }
        }
        // Mobile;
      } else {
        for (let i = 0; i < productContentMobile.length; i++) {
          if (index == i) {
            let img = productContentMobile[i].firstElementChild;

            // Check if the class "active" is already present
            if (productContentMobile[i].classList.contains("active")) {
              productContentMobile[i].style.maxHeight = "0px";
              productContentMobile[i].classList.remove("active");
              //timeout has to be the same as css .product-content-img-wrapper transition: max-height 2000ms ease-out;
              setTimeout(() => {
                productContentMobile[i].style.display = "none";
              }, 200);
            } else {
              productContentMobile[i].style.display = "flex";
              productContentMobile[i].style.maxHeight = img.clientHeight + "px";
              productContentMobile[i].classList.add("active");
            }
          } else {
            productContentMobile[i].style.maxHeight = "0px";
            productContentMobile[i].classList.remove("active");

            setTimeout(() => {
              productContentMobile[i].style.display = "none";
            }, 200);
          }
        }
      }
    });
  });
}

// Function to handle the activation of product buttons
function activeProductBtn(element) {
  productBtns.forEach((btn) => {
    if (btn !== element) {
      btn.classList.remove("product-btn-active");
    }
  });

  if (element.classList.contains("product-btn-active")) {
    element.classList.remove("product-btn-active");
  } else {
    element.classList.add("product-btn-active");
  }
}

// Function to check screen width and set the first button as active if wider than 650px
function checkScreenWidth() {
  if (window.innerWidth > 650) {
    productBtns[0].classList.add("product-btn-active");
  } else {
    productBtns[0].classList.remove("product-btn-active");
  }
}

// Initial check
checkScreenWidth();

// Listen for window resize events
window.addEventListener("resize", checkScreenWidth);

onBtnClickChangeProductPhoto();

function initSlideButtons() {
  let slideBtns = document.querySelectorAll(".slide-btn");
  slideBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let slideNumber = e.target.getAttribute("data-slide");
      currentSlide(parseInt(slideNumber, 10));
    });
  });
}

// Call the new function to initialize slide buttons
initSlideButtons();

document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".infinite-slide-track");
  let offset = 0;
  let isPaused = false;

  // Pause the animation on hover
  track.addEventListener("mouseenter", function () {
    isPaused = true;
  });

  // Resume the animation when hover ends
  track.addEventListener("mouseleave", function () {
    isPaused = false;
  });

  // Animation function
  function scroll() {
    if (!isPaused) {
      offset -= 1;
      const slides = Array.from(document.querySelectorAll(".infinite-slide")); // Convert NodeList to Array
      const slideWidth = slides[0].offsetWidth;

      if (-offset >= slideWidth) {
        // Take the first slide and move it to the end
        const firstSlide = slides.shift();
        track.appendChild(firstSlide);

        // Reset the transform to its previous position before removing the slide
        track.style.transform = `translateX(${offset + slideWidth}px)`;

        // Reset the offset back
        offset += slideWidth;
      }
      track.style.transform = `translateX(${offset}px)`;
    }
    requestAnimationFrame(scroll);
  }

  // Start animation
  scroll();
});

// ROI
var roiHeadcountSlider = document.getElementById("roi-headcount");
var roiHeadcountOutput = document.getElementById("roi-headcount-output");

var roiPositionsSlider = document.getElementById("roi-positions");
var roiPositionsOutput = document.getElementById("roi-positions-output");

var roiApplicationsSlider = document.getElementById("roi-applications");
var roiApplicationsOutput = document.getElementById("roi-applications-output");

var roiTimeToHireSlider = document.getElementById("roi-time-to-hire");
var roiTimeToHireOutput = document.getElementById("roi-time-to-hire-output");

var roiMarketingSlider = document.getElementById("roi-marketing");
var roiMarketingOutput = document.getElementById("roi-marketing-output");

if (isMobileDevice) {
  roiMarketingSlider.value = "1000000";
  roiMarketingOutput.innerHTML = formatNumber(roiMarketingSlider.value);
}

var resultOutput = document.getElementById("roi-results");
var resultHoursOutput = document.getElementById("roi-results-hours");

let totalHoursSavedFinal = document.getElementById(
  "roi-results-total-hours-saved"
);
let totalSavingsAnnuallyFinal = document.getElementById(
  "roi-results-total-savings-annually"
);

let agentProductivityFinal = document.getElementById(
  "roi-results-agent-productivity"
);

let revenueFinal = document.getElementById("roi-results-revenue");

let employerBrandFinal = document.getElementById("roi-results-employer-brand");

let tthFinal = document.getElementById("roi-results-tth");

// CHECKBOXES
var roiCheckbox1 = document.getElementById("roi-checkbox-1");
var roiCheckbox2 = document.getElementById("roi-checkbox-2");
var roiCheckbox3 = document.getElementById("roi-checkbox-3");
var roiCheckbox4 = document.getElementById("roi-checkbox-4");
var roiCheckbox5 = document.getElementById("roi-checkbox-5");
var roiCheckbox6 = document.getElementById("roi-checkbox-6");
var roiCheckboxItem1 = document.getElementById("roi-checkbox-item-1");
var roiCheckboxItem2 = document.getElementById("roi-checkbox-item-2");
var roiCheckboxItem3 = document.getElementById("roi-checkbox-item-3");
var roiCheckboxItem4 = document.getElementById("roi-checkbox-item-4");
var roiCheckboxItem5 = document.getElementById("roi-checkbox-item-5");
var roiCheckboxItem6 = document.getElementById("roi-checkbox-item-6");

var headcount = roiHeadcountSlider.value;
var positions = roiPositionsSlider.value;
var applications = roiApplicationsSlider.value;
var timeToHire = roiTimeToHireSlider.value;
var marketingSpend = roiMarketingSlider.value;

function renderResult() {
  roiPositionsOutput.innerHTML = positions;
  roiApplicationsOutput.innerHTML = applications;
  roiHeadcountOutput.innerHTML = headcount;
  totalHoursSavedFinal.innerHTML = monthlyHoursSaved;
  agentProductivityFinal.innerHTML = agentProductivity;
  revenueFinal.innerHTML = untappedRevenue;
  employerBrandFinal.innerHTML = employerBrand;
  tthFinal.innerHTML = timeToHireFinal;
  totalSavingsAnnuallyFinal.innerHTML = totalAnualSavings;
}

let monthlyHoursSaved = 0;
let totalAnualSavings = 0;
let agentProductivity = 0;
let timeToHireFinal = 0;
let employerBrand = 0;
let untappedRevenue = 0;

var isPositionSetupChecked = document.getElementById("roi-checkbox-1").checked;
var isCVScreenChecked = document.getElementById("roi-checkbox-2").checked;
var isPhoneIntChecked = document.getElementById("roi-checkbox-3").checked;
var isIntSchedChecked = document.getElementById("roi-checkbox-4").checked;
var isPersonalFeedbackChecked =
  document.getElementById("roi-checkbox-5").checked;
var isPersonalityTestChecked =
  document.getElementById("roi-checkbox-6").checked;

function newCalculateVariables() {
  monthlyHoursSaved = Math.round(
    (positions * 300 * (isPositionSetupChecked ? 0 : 1) +
      positions *
        applications *
        (5 * (isCVScreenChecked ? 0 : 1) +
          15 * (isPhoneIntChecked ? 0 : 1) +
          15 * (isIntSchedChecked ? 0 : 1) +
          4 * (isPersonalityTestChecked ? 0 : 1) +
          5 * (isPersonalFeedbackChecked ? 0 : 1))) /
      60
  );

  agentProductivity = Math.round(
    (0.1 * (isPositionSetupChecked ? 0 : 1) +
      0.1 * (isCVScreenChecked ? 0 : 1) +
      0.1 * (isPhoneIntChecked ? 0 : 1) +
      0.1 * (isIntSchedChecked ? 0 : 1) +
      0.6 * (isPersonalityTestChecked ? 0 : 1)) *
      16 +
      5
  );

  employerBrand = Math.round(
    (0.1 * (isPositionSetupChecked ? 0 : 1) +
      0.1 * (isCVScreenChecked ? 0 : 1) +
      0.1 * (isPhoneIntChecked ? 0 : 1) +
      0.1 * (isIntSchedChecked ? 0 : 1) +
      0.1 * (isPersonalityTestChecked ? 0 : 1) +
      0.5 * (isPersonalFeedbackChecked ? 0 : 1)) *
      31
  );
  timeToHireFinal = Math.round(
    (0.125 * (isPositionSetupChecked ? 0 : 1) +
      0.125 * (isCVScreenChecked ? 0 : 1) +
      0.25 * (isPhoneIntChecked ? 0 : 1) +
      0.25 * (isIntSchedChecked ? 0 : 1) +
      0.25 * (isPersonalityTestChecked ? 0 : 1)) *
      5 *
      timeToHire
  );

  totalAnualSavings = Math.round(monthlyHoursSaved * 7 + 0.3 * marketingSpend);
  untappedRevenue = Math.round(
    15 -
      ((68 - 15) / (20000 - 100)) * 100 +
      ((68 - 15) / (20000 - 100)) * headcount
  );
  renderResult();
}
newCalculateVariables();

roiCheckbox1.addEventListener("change", (e) => {
  automation1 = e.currentTarget.checked;
  isPositionSetupChecked = e.currentTarget.checked;

  newCalculateVariables();
  if (e.currentTarget.checked) {
    roiCheckboxItem1.classList.add("selected");
  } else {
    roiCheckboxItem1.classList.remove("selected");
  }
});
roiCheckbox2.addEventListener("change", (e) => {
  automation2 = e.currentTarget.checked;
  isCVScreenChecked = e.currentTarget.checked;

  newCalculateVariables();
  if (e.currentTarget.checked) {
    roiCheckboxItem2.classList.add("selected");
  } else {
    roiCheckboxItem2.classList.remove("selected");
  }
});
roiCheckbox3.addEventListener("change", (e) => {
  automation3 = e.currentTarget.checked;
  isPhoneIntChecked = e.currentTarget.checked;

  newCalculateVariables();
  if (e.currentTarget.checked) {
    roiCheckboxItem3.classList.add("selected");
  } else {
    roiCheckboxItem3.classList.remove("selected");
  }
});
roiCheckbox4.addEventListener("change", (e) => {
  automation4 = e.currentTarget.checked;
  isIntSchedChecked = e.currentTarget.checked;

  newCalculateVariables();
  if (e.currentTarget.checked) {
    roiCheckboxItem4.classList.add("selected");
  } else {
    roiCheckboxItem4.classList.remove("selected");
  }
});
roiCheckbox5.addEventListener("change", (e) => {
  automation5 = e.currentTarget.checked;
  isPersonalFeedbackChecked = e.currentTarget.checked;

  newCalculateVariables();
  if (e.currentTarget.checked) {
    roiCheckboxItem5.classList.add("selected");
  } else {
    roiCheckboxItem5.classList.remove("selected");
  }
});
roiCheckbox6.addEventListener("change", (e) => {
  automation6 = e.currentTarget.checked;
  isPersonalityTestChecked = e.currentTarget.checked;

  newCalculateVariables();
  if (e.currentTarget.checked) {
    roiCheckboxItem6.classList.add("selected");
  } else {
    roiCheckboxItem6.classList.remove("selected");
  }
});

roiPositionsSlider.oninput = function () {
  positions = this.value;

  newCalculateVariables();
  roiPositionsOutput.innerHTML = this.value;
};

roiApplicationsSlider.oninput = function () {
  applications = this.value;

  newCalculateVariables();
  roiApplicationsOutput.innerHTML = this.value;
};

roiHeadcountSlider.oninput = function () {
  headcount = this.value;
  newCalculateVariables();
  roiHeadcountOutput.innerHTML = this.value;
};

roiTimeToHireSlider.oninput = function () {
  timeToHire = this.value;
  newCalculateVariables();
  roiTimeToHireOutput.innerHTML = this.value;
};

roiMarketingSlider.oninput = function () {
  marketingSpend = this.value;
  newCalculateVariables();
  roiMarketingOutput.innerHTML = formatNumber(this.value);
};

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    let valueInK = Math.round(number / 1000);
    return valueInK + "k";
  }
  return number.toString();
}

// FORM
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.querySelector(".btn");
  const buttonText = document.getElementById("button-text");
  const form = document.getElementById("ZenHire-website-contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Show spinner
    buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    let formData = new FormData(form);
    let user = {};

    formData.forEach((value, key) => {
      user[key] = value;
    });

    const data = {
      fields: [
        {
          name: "firstname",
          value: user.name,
        },
        {
          name: "lastname",
          value: user.surname,
        },
        {
          name: "email",
          value: user.email,
        },
        {
          name: "company",
          value: user.company,
        },
        {
          name: "message",
          value: user.message,
        },
      ],
    };

    const portalId = "27164158";
    const formId = "dde02a59-e871-45dc-9707-a6bb6164f2fb";
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    // Make API call to HubSpot
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error("HubSpot API Error:", error);
    });

    form.reset();
    // Show success message with checkmark
    buttonText.innerHTML =
      'Application successful <i class="fas fa-check"></i>';

    // Revert back to original text after 3 seconds
    setTimeout(() => {
      buttonText.innerHTML = "Apply";
    }, 3000);
  });
});
